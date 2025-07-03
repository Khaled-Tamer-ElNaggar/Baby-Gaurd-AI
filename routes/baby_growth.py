from flask import Blueprint, request, jsonify
from utils.db import create_db_connection
from utils.auth_utils import token_required
from mysql.connector import Error
import datetime
from functools import wraps

baby_growth_bp = Blueprint('baby_growth', __name__)

def ensure_today_record(f):
    @wraps(f)
    def decorated(current_user_id, *args, **kwargs):
        today = datetime.date.today().isoformat()
        try:
            with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
                cur.execute("""
                    SELECT current_child_id
                    FROM users
                    WHERE id = %s
                """, (current_user_id,))
                user = cur.fetchone()
                if not user or not user['current_child_id']:
                    return f(current_user_id, *args, **kwargs)  # Skip if no child
                cur.execute("""
                    SELECT id FROM baby_growth_records
                    WHERE child_id = %s AND record_date = %s
                """, (user['current_child_id'], today))
                if not cur.fetchone():
                    cur.execute("""
                        INSERT INTO baby_growth_records (child_id, record_date, weight, height, head_circumference)
                        VALUES (%s, %s, 0.00, 0.00, 0.00)
                    """, (user['current_child_id'], today))
                    conn.commit()
        except Error:
            pass
        return f(current_user_id, *args, **kwargs)
    return decorated

@baby_growth_bp.route('/api/baby-growth', methods=['PATCH'])
@token_required
@ensure_today_record
def update_baby_growth(current_user_id):
    data = request.get_json() or {}
    if not any(k in data for k in ['weight', 'height', 'head_circumference', 'notes']):
        return jsonify(error='At least one field (weight, height, head_circumference, notes) is required'), 400
    
    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            cur.execute("""
                SELECT current_child_id
                FROM users
                WHERE id = %s
            """, (current_user_id,))
            user = cur.fetchone()
            
            if not user or not user['current_child_id']:
                return jsonify(error='No child selected. Please select a child first.'), 400
                
            today = datetime.date.today().isoformat()
            update_fields = []
            update_values = []
            for field in ['weight', 'height', 'head_circumference', 'notes']:
                if field in data:
                    update_fields.append(f"{field} = %s")
                    update_values.append(data[field])
            
            if update_fields:
                update_values.extend([datetime.datetime.now(), user['current_child_id'], today])
                query = f"""
                    UPDATE baby_growth_records
                    SET {', '.join(update_fields)}, created_at = %s
                    WHERE child_id = %s AND record_date = %s
                """
                cur.execute(query, update_values)
                conn.commit()
                
        return jsonify(message='Baby growth record updated successfully'), 200
    except Error as e:
        return jsonify(error=f'Failed to update baby growth record: {str(e)}'), 500

@baby_growth_bp.route('/api/baby-growth', methods=['GET'])
@token_required
def get_baby_growth(current_user_id):
    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            cur.execute("""
                SELECT current_child_id
                FROM users
                WHERE id = %s
            """, (current_user_id,))
            user = cur.fetchone()
            
            if not user or not user['current_child_id']:
                return jsonify(growth_records=[]), 200
                
            cur.execute("""
                SELECT 
                    id,
                    child_id,
                    record_date,
                    weight,
                    height,
                    head_circumference,
                    notes,
                    created_at
                FROM baby_growth_records 
                WHERE child_id = %s
                ORDER BY record_date DESC
            """, (user['current_child_id'],))
            records = cur.fetchall()
            
            for record in records:
                if record['record_date']:
                    record['record_date'] = record['record_date'].isoformat()
                if record['created_at']:
                    record['created_at'] = record['created_at'].isoformat()
                
            return jsonify(growth_records=records), 200
    except Error as e:
        return jsonify(error=f'Failed to fetch baby growth records: {str(e)}'), 500

@baby_growth_bp.route('/api/baby-growth/<int:growth_id>', methods=['DELETE'])
@token_required
def delete_baby_growth(current_user_id, growth_id):
    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            cur.execute("SELECT current_child_id FROM users WHERE id = %s", (current_user_id,))
            user = cur.fetchone()
            if not user or not user['current_child_id']:
                return jsonify(error='No child selected.'), 400
            
            cur.execute("DELETE FROM baby_growth_records WHERE id = %s AND child_id = %s", 
                       (growth_id, user['current_child_id']))
            if cur.rowcount == 0:
                return jsonify(error='Growth record not found or not authorized'), 404
            conn.commit()
        return jsonify(message='Baby growth record deleted successfully'), 200
    except Error as e:
        return jsonify(error=f'Failed to delete baby growth record: {str(e)}'), 500