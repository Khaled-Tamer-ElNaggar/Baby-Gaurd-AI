from flask import Flask, jsonify, request
from flask_cors import CORS
from flask.json.provider import DefaultJSONProvider
import mysql.connector
from mysql.connector import Error
from functools import wraps
import jwt
import datetime, decimal, uuid, base64, logging

from werkzeug.security import generate_password_hash, check_password_hash
from chat import llm, process_query, naive_topic
from langchain.schema import SystemMessage, HumanMessage

# ── 1. App setup ─────────────────────────────────────────────────────────
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secure-secret-key'
app.config['ENV'] = 'development'
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# ── 2. Custom JSON provider ─────────────────────────────────────────────
class CustomJSON(DefaultJSONProvider):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal): return float(obj)
        if isinstance(obj, (bytes, bytearray)): return base64.b64encode(obj).decode()
        if isinstance(obj, (datetime.date, datetime.datetime, datetime.time)): return obj.isoformat()
        if isinstance(obj, datetime.timedelta): return obj.total_seconds()
        if isinstance(obj, uuid.UUID): return str(obj)
        return super().default(obj)

app.json = CustomJSON(app)
app.logger.setLevel(logging.INFO)

# ── 3. DB Config ─────────────────────────────────────────────────────────
db_config = dict(
    host='localhost',
    port=3306,
    database='babyguardai',
    user='root',
    password='1234'
)

def create_db_connection():
    return mysql.connector.connect(**db_config)

# ── 4. JWT Auth ──────────────────────────────────────────────────────────
def generate_token(user_id: int):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
        'iat': datetime.datetime.utcnow(),
        'sub': str(user_id)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get('Authorization', '')
        token = auth.split()[1] if auth.lower().startswith('bearer ') else None
        if not token:
            return jsonify(error='Token is missing!'), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user_id = int(data['sub'])
        except jwt.ExpiredSignatureError:
            return jsonify(error='Token has expired!'), 401
        except (jwt.InvalidTokenError, ValueError) as e:
            app.logger.info(f"Token decode failed: {e}")
            return jsonify(error='Invalid token!'), 401
        return f(current_user_id, *args, **kwargs)
    return decorated

# ── 5. Auth Routes ───────────────────────────────────────────────────────
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    required = ['user_name', 'user_email', 'user_pass', 'user_birthday', 'blood_type']
    if not all(field in data for field in required):
        return jsonify(error='Missing required fields'), 400

    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            cur.execute("SELECT id FROM users WHERE user_email = %s", (data['user_email'],))
            if cur.fetchone():
                return jsonify(error='Email already exists'), 409

            hashed_pw = generate_password_hash(data['user_pass'])
            cur.execute("""
                INSERT INTO users (user_name, user_email, user_pass, user_birthday, blood_type)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                data['user_name'], data['user_email'], hashed_pw,
                data['user_birthday'], data['blood_type']
            ))
            conn.commit()
            user_id = cur.lastrowid

        token = generate_token(user_id)
        return jsonify(message='Registration successful', user_id=user_id, token=token), 201

    except Error:
        app.logger.exception("[DB] Registration failed")
        return jsonify(error='Registration failed'), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    if not {'user_email', 'user_pass'} <= data.keys():
        return jsonify(error='Missing credentials'), 400

    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            cur.execute("""
                SELECT id, user_name, user_email, user_pass,
                       user_birthday, blood_type, join_date
                FROM users WHERE user_email = %s
            """, (data['user_email'],))
            user = cur.fetchone()

        if not user or not check_password_hash(user['user_pass'], data['user_pass']):
            return jsonify(error='Invalid credentials'), 401

        token = generate_token(user['id'])
        return jsonify(
            message='Login successful',
            token=token,
            user=dict(
                id=user['id'],
                name=user['user_name'],
                email=user['user_email'],
                birthday=user['user_birthday'],
                blood_type=user['blood_type'],
                join_date=user['join_date']
            )
        ), 200

    except Error:
        app.logger.exception("[DB] Login failed")
        return jsonify(error='Login failed'), 500

# ── 6. Calendar Routes ──────────────────────────────────────────────────
@app.route('/api/calendar-events', methods=['POST'])
@token_required
def create_calendar_event(current_user_id):
    data = request.get_json() or {}
    required = ['event_type', 'event_date', 'event_time', 'title']
    if not all(k in data for k in required):
        return jsonify(error='Missing fields'), 400

    try:
        with create_db_connection() as conn, conn.cursor() as cur:
            cur.execute("""
                INSERT INTO calendar_events (
                    user_id, event_type, event_date, event_time, title,
                    description, reminder_offset, is_recurring
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                current_user_id, data['event_type'], data['event_date'],
                data['event_time'], data['title'],
                data.get('description', ''), data.get('reminder_offset', 0),
                int(data.get('is_recurring', False))
            ))
            conn.commit()
        return jsonify(message='Calendar event created successfully'), 201

    except Error:
        app.logger.exception("[DB] Create calendar event failed")
        return jsonify(error='Failed to create calendar event'), 500

@app.route('/api/get-calendar-events', methods=['GET'])
@token_required
def get_calendar_events(current_user_id):
    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            cur.execute("""
                SELECT * FROM calendar_events
                WHERE user_id = %s
                ORDER BY event_date, event_time
            """, (current_user_id,))
            events = cur.fetchall()
        return jsonify(calendar_events=events), 200
    except Error:
        app.logger.exception("[DB] Fetch calendar events failed")
        return jsonify(error='Failed to retrieve calendar events'), 500

@app.route('/api/calendar-events/<int:event_id>', methods=['DELETE'])
@token_required
def delete_calendar_event(current_user_id, event_id):
    try:
        with create_db_connection() as conn, conn.cursor() as cur:
            cur.execute("""
                SELECT id FROM calendar_events WHERE id = %s AND user_id = %s
            """, (event_id, current_user_id))
            if not cur.fetchone():
                return jsonify(error='Event not found or unauthorized'), 404
            cur.execute("DELETE FROM calendar_events WHERE id = %s", (event_id,))
            conn.commit()
        return jsonify(message='Calendar event deleted successfully'), 200
    except Error:
        app.logger.exception("[DB] Delete calendar event failed")
        return jsonify(error='Failed to delete calendar event'), 500

# ── 7. Chat Routes ───────────────────────────────────────────────────────
@app.route('/api/chat-sessions', methods=['POST'])
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
        app.logger.exception("[DB] Create chat session failed")
        return jsonify(error='Failed to create chat session'), 500

@app.route('/api/chat-sessions', methods=['GET'])
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
        app.logger.exception("[DB] Fetch chat sessions failed")
        return jsonify(error='Failed to retrieve chat sessions'), 500

@app.route('/api/chat-sessions/<session_uuid>/messages', methods=['GET'])
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
        app.logger.exception("[DB] Fetch chat messages failed")
        return jsonify(error='Failed to retrieve chat messages'), 500

@app.route('/api/chat-sessions/<session_uuid>/send', methods=['POST'])
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
        app.logger.exception("[DB] Send message failed")
        return jsonify(error='Failed to send message'), 500

@app.route('/api/chat-sessions/<session_uuid>/end', methods=['POST'])
@token_required
def end_chat_session(current_user_id, session_uuid):
    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            cur.execute("""
                SELECT session_topic FROM chat_sessions
                WHERE user_id = %s AND session_uuid = %s AND end_time IS NULL
            """, (current_user_id, session_uuid))
            sess = cur.fetchone()
            if not sess:
                return jsonify(error='Session not found or already ended'), 404

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
        app.logger.exception("[DB] End chat session failed")
        return jsonify(error='Failed to end chat session'), 500

@app.route('/api/chat-sessions/<session_uuid>/update-topic', methods=['POST'])
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
        app.logger.exception("[DB] Update topic failed")
        return jsonify(error='Failed to update topic'), 500

# ── 8. Dev entrypoint ───────────────────────────────────────────────────
if __name__ == '__main__':
    app.run(debug=True, port=5000)
