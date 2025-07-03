from flask import Blueprint, request, jsonify
from utils.db import create_db_connection
from utils.auth_utils import token_required
from mysql.connector import Error
import datetime

vaccinations_bp = Blueprint('vaccinations', __name__)

@vaccinations_bp.route('/api/vaccinations', methods=['POST'])
@token_required
def add_vaccination(current_user_id):
    data = request.get_json() or {}
    required = ['name', 'date']
    if not all(k in data for k in required):
        return jsonify(error='Missing required fields: name, date'), 400
    
    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            # First get the current_child_id from users table
            cur.execute("""
                SELECT current_child_id
                FROM users
                WHERE id = %s
            """, (current_user_id,))
            user = cur.fetchone()
            
            if not user or not user['current_child_id']:
                return jsonify(error='No child selected. Please select a child first.'), 400
                
            # Then insert the vaccination record
            cur.execute("""
                INSERT INTO child_vaccinations (
                    child_id, vaccination_name, date_received, next_due_date, notes,
                    created_at, updated_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                user['current_child_id'],
                data['name'],
                data['date'],
                data.get('nextDue', None),
                data.get('notes', None),
                datetime.datetime.now(),
                datetime.datetime.now()
            ))
            conn.commit()
            vaccination_id = cur.lastrowid
        return jsonify(message='Vaccination added successfully', vaccination_id=vaccination_id), 201
    except Error as e:
        return jsonify(error=f'Failed to add vaccination: {str(e)}'), 500

@vaccinations_bp.route('/api/vaccinations', methods=['GET'])
@token_required
def get_vaccinations(current_user_id):
    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            # First get the current_child_id from users table
            cur.execute("""
                SELECT current_child_id
                FROM users
                WHERE id = %s
            """, (current_user_id,))
            user = cur.fetchone()
            
            if not user or not user['current_child_id']:
                return jsonify(error='No child selected. Please select a child first.'), 404
                
            # Then get the vaccination records
            cur.execute("""
                SELECT id, child_id, vaccination_name as name, date_received as date, 
                       next_due_date as nextDue, notes
                FROM child_vaccinations 
                WHERE child_id = %s
                ORDER BY date_received DESC
            """, (user['current_child_id'],))
            vaccinations = cur.fetchall()
        return jsonify(vaccinations=vaccinations), 200
    except Error as e:
        return jsonify(error=f'Failed to fetch vaccinations: {str(e)}'), 500