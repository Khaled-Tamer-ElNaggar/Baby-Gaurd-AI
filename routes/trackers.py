from flask import Blueprint, request, jsonify
from utils.db import create_db_connection
from utils.auth_utils import token_required
from mysql.connector import Error
import datetime
from functools import wraps

trackers_bp = Blueprint('trackers', __name__)

def ensure_today_record(f):
    @wraps(f)
    def decorated(current_user_id, *args, **kwargs):
        today = datetime.date.today().isoformat()
        try:
            with create_db_connection() as conn, conn.cursor() as cur:
                cur.execute("""
                    SELECT id FROM health_tracking
                    WHERE user_id = %s AND track_date = %s
                """, (current_user_id, today))
                if not cur.fetchone():
                    cur.execute("""
                        INSERT INTO health_tracking (user_id, track_date, sleep_hours, water_intake, steps)
                        VALUES (%s, %s, 0.0, 0.0, 0)
                    """, (current_user_id, today))
                    conn.commit()
        except Error:
            pass
        return f(current_user_id, *args, **kwargs)
    return decorated

@trackers_bp.route('/api/trackers/water', methods=['PATCH'])
@token_required
@ensure_today_record
def update_water(current_user_id):
    data = request.get_json() or {}
    water = data.get('water_intake')
    if water is None:
        return jsonify(error="water_intake is required"), 400
    today = datetime.date.today().isoformat()
    try:
        with create_db_connection() as conn, conn.cursor() as cur:
            cur.execute("""
                UPDATE health_tracking
                SET water_intake = %s
                WHERE user_id = %s AND track_date = %s
            """, (water, current_user_id, today))
            conn.commit()
        return jsonify(message="Water intake updated"), 200
    except Error:
        return jsonify(error="Failed to update water intake"), 500

@trackers_bp.route('/api/trackers/sleep', methods=['PATCH'])
@token_required
@ensure_today_record
def update_sleep(current_user_id):
    data = request.get_json() or {}
    sleep = data.get('sleep_hours')
    if sleep is None:
        return jsonify(error="sleep_hours is required"), 400
    today = datetime.date.today().isoformat()
    try:
        with create_db_connection() as conn, conn.cursor() as cur:
            cur.execute("""
                UPDATE health_tracking
                SET sleep_hours = %s
                WHERE user_id = %s AND track_date = %s
            """, (sleep, current_user_id, today))
            conn.commit()
        return jsonify(message="Sleep hours updated"), 200
    except Error:
        return jsonify(error="Failed to update sleep hours"), 500

@trackers_bp.route('/api/trackers/steps', methods=['PATCH'])
@token_required
@ensure_today_record
def update_steps(current_user_id):
    data = request.get_json() or {}
    steps = data.get('steps')
    if steps is None:
        return jsonify(error="steps is required"), 400
    today = datetime.date.today().isoformat()
    try:
        with create_db_connection() as conn, conn.cursor() as cur:
            cur.execute("""
                UPDATE health_tracking
                SET steps = %s
                WHERE user_id = %s AND track_date = %s
            """, (steps, current_user_id, today))
            conn.commit()
        return jsonify(message="Steps updated"), 200
    except Error:
        return jsonify(error="Failed to update steps"), 500

@trackers_bp.route('/api/trackers/today', methods=['GET'])
@token_required
def get_today_tracker(current_user_id):
    today = datetime.date.today().isoformat()
    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            cur.execute("""
                SELECT sleep_hours, water_intake, steps
                FROM health_tracking
                WHERE user_id = %s AND track_date = %s
            """, (current_user_id, today))
            row = cur.fetchone()
            if not row:
                return jsonify(sleep_hours=0.0, water_intake=0.0, steps=0), 200
            return jsonify(row), 200
    except Error:
        return jsonify(error="Failed to fetch today's tracker"), 500

@trackers_bp.route('/api/trackers/all', methods=['PATCH'])
@token_required
@ensure_today_record
def update_all_trackers(current_user_id):
    data = request.get_json() or {}
    water = data.get('water_intake', 0.0)
    sleep = data.get('sleep_hours', 0.0)
    steps = data.get('steps', 0)
    today = datetime.date.today().isoformat()
    try:
        with create_db_connection() as conn, conn.cursor() as cur:
            cur.execute("""
                UPDATE health_tracking
                SET water_intake = %s, sleep_hours = %s, steps = %s
                WHERE user_id = %s AND track_date = %s
            """, (water, sleep, steps, current_user_id, today))
            conn.commit()
        return jsonify(message="All trackers updated"), 200
    except Error:
        return jsonify(error="Failed to update all trackers"), 500
