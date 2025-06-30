from flask import Blueprint, request, jsonify
from utils.db import create_db_connection
from utils.auth_utils import token_required
from chat import llm, process_query, naive_topic
from langchain.schema import SystemMessage, HumanMessage
from mysql.connector import Error
import uuid

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/api/chat-sessions', methods=['POST'])
@token_required
def create_chat_session(current_user_id):
    try:
        session_uuid = str(uuid.uuid4())
        with create_db_connection() as conn, conn.cursor() as cur:
            cur.execute("""
                INSERT INTO chat_sessions (user_id, session_uuid, session_topic)
                VALUES (%s, %s, %s)
            """, (current_user_id, session_uuid, "New chat"))
            conn.commit()
        return jsonify(message='Chat session created', session_uuid=session_uuid), 201
    except Error:
        return jsonify(error='Failed to create chat session'), 500

@chat_bp.route('/api/chat-sessions', methods=['GET'])
@token_required
def get_chat_sessions(current_user_id):
    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            cur.execute("""
                SELECT id, session_uuid, start_time, end_time, session_topic, summary
                FROM chat_sessions WHERE user_id = %s
                ORDER BY start_time DESC
            """, (current_user_id,))
            return jsonify(sessions=cur.fetchall()), 200
    except Error:
        return jsonify(error='Failed to retrieve chat sessions'), 500

@chat_bp.route('/api/chat-sessions/<session_uuid>', methods=['DELETE'])
@token_required
def delete_chat_session(current_user_id, session_uuid):
    try:
        with create_db_connection() as conn, conn.cursor() as cur:
            cur.execute("""
                SELECT id FROM chat_sessions
                WHERE user_id = %s AND session_uuid = %s
            """, (current_user_id, session_uuid))
            if not cur.fetchone():
                return jsonify(error='Session not found or unauthorized'), 404
            cur.execute("DELETE FROM messages WHERE session_uuid = %s", (session_uuid,))
            cur.execute("DELETE FROM chat_sessions WHERE session_uuid = %s", (session_uuid,))
            conn.commit()
        return jsonify(message='Chat session deleted successfully'), 200
    except Error:
        return jsonify(error='Failed to delete chat session'), 500

@chat_bp.route('/api/chat-sessions/<session_uuid>/messages', methods=['GET'])
@token_required
def get_chat_messages(current_user_id, session_uuid):
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 50, type=int)
    offset = (page - 1) * per_page
    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            cur.execute("SELECT 1 FROM chat_sessions WHERE user_id = %s AND session_uuid = %s",
                        (current_user_id, session_uuid))
            if not cur.fetchone():
                return jsonify(error='Session not found'), 404
            cur.execute("SELECT COUNT(*) as total FROM messages WHERE session_uuid = %s", (session_uuid,))
            total = cur.fetchone()['total']
            cur.execute("""
                SELECT id, sender, content, created_at FROM messages
                WHERE session_uuid = %s ORDER BY created_at ASC
                LIMIT %s OFFSET %s
            """, (session_uuid, per_page, offset))
            return jsonify(messages=cur.fetchall(), pagination={
                'page': page, 'per_page': per_page, 'total': total,
                'pages': (total + per_page - 1) // per_page
            }), 200
    except Error:
        return jsonify(error='Failed to retrieve chat messages'), 500

@chat_bp.route('/api/chat-sessions/<session_uuid>/send', methods=['POST'])
@token_required
def send_chat_message(current_user_id, session_uuid):
    data = request.get_json() or {}
    if 'message' not in data:
        return jsonify(error='Message content required'), 400
    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            cur.execute("SELECT end_time FROM chat_sessions WHERE user_id = %s AND session_uuid = %s",
                        (current_user_id, session_uuid))
            row = cur.fetchone()
            if not row:
                return jsonify(error='Session not found'), 404
            if row['end_time']:
                cur.execute("UPDATE chat_sessions SET end_time = NULL WHERE session_uuid = %s", (session_uuid,))
            cur.execute("INSERT INTO messages (session_uuid, sender, content) VALUES (%s, 'user', %s)",
                        (session_uuid, data['message']))
            ai_response = process_query(data['message'], session_uuid)
            cur.execute("INSERT INTO messages (session_uuid, sender, content) VALUES (%s, 'assistant', %s)",
                        (session_uuid, ai_response))
            conn.commit()
        return jsonify(message='Message sent', response=ai_response), 200
    except Error:
        return jsonify(error='Failed to send message'), 500

@chat_bp.route('/api/chat-sessions/<session_uuid>/end', methods=['POST'])
@token_required
def end_chat_session(current_user_id, session_uuid):
    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            cur.execute("""
                SELECT session_topic FROM chat_sessions
                WHERE user_id = %s AND session_uuid = %s
            """, (current_user_id, session_uuid))
            sess = cur.fetchone()
            if not sess:
                return jsonify(error='Session not found'), 404
            cur.execute("""
                SELECT sender, content FROM messages
                WHERE session_uuid = %s ORDER BY created_at ASC
            """, (session_uuid,))
            conversation = "\n".join(f"{m['sender']}: {m['content']}" for m in cur.fetchall())
            prompt = f"""
            Please summarize the following conversation between a user and an AI assistant 
            about pregnancy, postpartum, or childcare. Focus on key topics discussed and 
            any important advice given. Keep it concise (2-3 sentences max).

            Conversation:
            {conversation}
            """
            try:
                summary = llm.invoke([
                    SystemMessage(content="You are a helpful summarizer for healthcare conversations."),
                    HumanMessage(content=prompt)
                ]).content.strip()
            except Exception:
                summary = "Conversation summary unavailable"
            topic = sess['session_topic']
            if topic == "New chat":
                generated = naive_topic(conversation)
                if generated.lower() != "new chat":
                    topic = generated
            cur.execute("""
                UPDATE chat_sessions
                SET end_time = CURRENT_TIMESTAMP, summary = %s, session_topic = %s
                WHERE session_uuid = %s
            """, (summary, topic[:100], session_uuid))
            conn.commit()
        return jsonify(message='Session ended', summary=summary, topic=topic), 200
    except Error:
        return jsonify(error='Failed to end chat session'), 500

@chat_bp.route('/api/chat-sessions/<session_uuid>/update-topic', methods=['POST'])
@token_required
def update_session_topic(current_user_id, session_uuid):
    data = request.get_json() or {}
    topic = data.get('topic', '').strip()
    if not topic:
        return jsonify(error='Topic required'), 400
    if len(topic) > 100:
        return jsonify(error='Topic too long (max 100)'), 400
    try:
        with create_db_connection() as conn, conn.cursor() as cur:
            cur.execute("""
                UPDATE chat_sessions SET session_topic = %s
                WHERE user_id = %s AND session_uuid = %s
            """, (topic, current_user_id, session_uuid))
            conn.commit()
        return jsonify(message='Topic updated', topic=topic), 200
    except Error:
        return jsonify(error='Failed to update topic'), 500
