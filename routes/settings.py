from flask import Blueprint, request, jsonify
from utils.db import create_db_connection
from utils.auth_utils import token_required
from mysql.connector import Error

settings_bp = Blueprint('settings', __name__)

# Mapping for font_size: frontend strings to database integers
FONT_SIZE_MAP = {
    'small': 0,
    'normal': 1,
    'large': 2
}
# Reverse mapping for database to frontend
FONT_SIZE_REVERSE_MAP = {v: k for k, v in FONT_SIZE_MAP.items()}

@settings_bp.route('/api/settings', methods=['GET'])
@token_required
def get_settings(current_user_id):
    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            cur.execute("""
                SELECT dark_mode, font_size
                FROM users
                WHERE id = %s
            """, (current_user_id,))
            user = cur.fetchone()
            if not user:
                return jsonify(error="User not found"), 404
            return jsonify({
                'dark_mode': bool(user['dark_mode']),  # Ensure boolean conversion
                'font_size': FONT_SIZE_REVERSE_MAP.get(user['font_size'], 'normal')  # Convert int to string
            }), 200
    except Error as e:
        print(f"Database error: {e}")
        return jsonify(error="Failed to fetch settings"), 500

@settings_bp.route('/api/settings', methods=['PATCH'])
@token_required
def update_settings(current_user_id):
    data = request.get_json() or {}
    dark_mode = data.get('dark_mode')
    font_size = data.get('font_size')

    if dark_mode is None and font_size is None:
        return jsonify(error="At least one of dark_mode or font_size is required"), 400

    if font_size and font_size not in FONT_SIZE_MAP:
        return jsonify(error="Invalid font size"), 400

    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            updates = []
            params = []
            if dark_mode is not None:
                updates.append("dark_mode = %s")
                params.append(int(dark_mode))  # Convert boolean to int for MySQL
            if font_size is not None:
                updates.append("font_size = %s")
                params.append(FONT_SIZE_MAP[font_size])  # Convert string to int for MySQL
            
            params.append(current_user_id)
            query = f"UPDATE users SET {', '.join(updates)} WHERE id = %s"
            
            cur.execute(query, tuple(params))
            conn.commit()
            
            cur.execute("SELECT dark_mode, font_size FROM users WHERE id = %s", (current_user_id,))
            user = cur.fetchone()
            if not user:
                return jsonify(error="User not found"), 404
                
            return jsonify({
                'message': 'Settings updated successfully',
                'dark_mode': bool(user['dark_mode']),
                'font_size': FONT_SIZE_REVERSE_MAP.get(user['font_size'], 'normal')
            }), 200
    except Error as e:
        print(f"Database error: {e}")
        return jsonify(error="Failed to update settings"), 500