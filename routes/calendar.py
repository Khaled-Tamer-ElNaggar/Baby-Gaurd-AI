from flask import Blueprint, request, jsonify
from utils.db import create_db_connection
from utils.auth_utils import token_required
from mysql.connector import Error

calendar_bp = Blueprint('calendar', __name__)

@calendar_bp.route('/api/calendar-events', methods=['POST'])
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
        return jsonify(error='Failed to create calendar event'), 500

@calendar_bp.route('/api/get-calendar-events', methods=['GET'])
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
        return jsonify(error='Failed to retrieve calendar events'), 500

@calendar_bp.route('/api/calendar-events/<int:event_id>', methods=['DELETE'])
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
        return jsonify(error='Failed to delete calendar event'), 500
