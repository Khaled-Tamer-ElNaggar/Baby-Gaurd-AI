from flask import Blueprint, request, jsonify
from utils.db import create_db_connection
from utils.auth_utils import token_required
from mysql.connector import Error
import datetime

baby_growth_bp = Blueprint('baby_growth', __name__)

@baby_growth_bp.route('/api/baby-growth', methods=['POST'])
@token_required
def add_baby_growth(current_user_id):
    data = request.get_json() or {}
    required = ['weight', 'height', 'head_circumference']
    if not all(k in data for k in required):
        return jsonify(error='Missing required fields: weight, height, head_circumference'), 400
    
    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            # Get the current_child_id from users table
            cur.execute("""
                SELECT current_child_id
                FROM users
                WHERE id = %s
            """, (current_user_id,))
            user = cur.fetchone()
            
            if not user or not user['current_child_id']:
                return jsonify(error='No child selected. Please select a child first.'), 400
                
            # Insert the baby growth record
            cur.execute("""
                INSERT INTO baby_growth_records (
                    child_id, record_date, weight, height, head_circumference, notes,
                    created_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                user['current_child_id'],
                datetime.date.today().isoformat(),
                data['weight'],
                data['height'],
                data['head_circumference'],
                data.get('notes', None),
                datetime.datetime.now()
            ))
            conn.commit()
            growth_id = cur.lastrowid
        return jsonify(message='Baby growth record added successfully', growth_id=growth_id), 201
    except Error as e:
        return jsonify(error=f'Failed to add baby growth record: {str(e)}'), 500

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

@baby_growth_bp.route('/api/baby-growth/<int:growth_id>', methods=['PATCH'])
@token_required
def update_baby_growth(current_user_id, growth_id):
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
                return jsonify(error='No child selected.'), 400
                
            update_fields = []
            update_values = []
            for field in ['weight', 'height', 'head_circumference', 'notes']:
                if field in data:
                    update_fields.append(f"{field} = %s")
                    update_values.append(data[field])
            
            if update_fields:
                update_values.extend([user['current_child_id'], growth_id])
                query = f"""
                    UPDATE baby_growth_records
                    SET {', '.join(update_fields)}, created_at = %s
                    WHERE child_id = %s AND id = %s
                """
                update_values.append(datetime.datetime.now())
                cur.execute(query, update_values)
                if cur.rowcount == 0:
                    return jsonify(error='Growth record not found or not authorized'), 404
                conn.commit()
        return jsonify(message='Baby growth record updated successfully'), 200
    except Error as e:
        return jsonify(error=f'Failed to update baby growth record: {str(e)}'), 500

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