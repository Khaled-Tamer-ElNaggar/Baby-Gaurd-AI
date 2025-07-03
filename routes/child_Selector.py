from flask import Blueprint, jsonify, request, current_app
from functools import wraps
import jwt
from typing import List, Dict
import uuid
from mysql.connector import Error  # Add this import
from utils.db import create_db_connection  # Ensure this is imported for MySQL

children_selector_bp = Blueprint('children_selector', __name__)

# Token required decorator (unchanged from previous fix)
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.replace('Bearer ', '')
            else:
                return jsonify({'message': 'Invalid Authorization header format'}), 401
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user_id = data['sub']  # Use 'sub' for user ID
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 401
        except Exception as e:
            return jsonify({'message': f'Token validation error: {str(e)}'}), 401
            
        return f(current_user_id, *args, **kwargs)
    return decorated

# GET /api/children (updated for MySQL)
@children_selector_bp.route('/api/children', methods=['GET'])
@token_required
def get_children(current_user_id: str):
    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            cur.execute("""
                SELECT id, full_name, birth_date, birth_weight, birth_height, gender, blood_type, genetic_conditions
                FROM children WHERE user_id = %s
            """, (current_user_id,))
            children = cur.fetchall()
            cur.execute("SELECT current_child_id FROM users WHERE id = %s", (current_user_id,))
            user = cur.fetchone()
            current_child_id = user['current_child_id'] if user and user['current_child_id'] else None
        return jsonify({
            'children': children,
            'currentChildId': current_child_id
        })
    except Error as e:
        return jsonify({'message': f'Error fetching children: {str(e)}'}), 500

# POST /api/children (updated for MySQL)
@children_selector_bp.route('/api/children', methods=['POST'])
@token_required
def add_child(current_user_id: str):
    data = request.get_json()
    if not data or not data.get('full_name'):
        return jsonify({'message': 'Child full name is required'}), 400
    child_id = str(uuid.uuid4())
    try:
        with create_db_connection() as conn, conn.cursor() as cur:
            cur.execute("""
                INSERT INTO children (id, user_id, full_name, birth_date, birth_weight, birth_height, gender, blood_type, genetic_conditions)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                child_id,
                current_user_id,
                data['full_name'],
                data.get('birth_date'),
                data.get('birth_weight'),
                data.get('birth_height'),
                data.get('gender'),
                data.get('blood_type'),
                data.get('genetic_conditions')
            ))
            conn.commit()
            if not current_child_db.get(current_user_id):
                cur.execute("UPDATE users SET current_child_id = %s WHERE id = %s", (child_id, current_user_id))
                conn.commit()
        return jsonify({'message': 'Child added successfully', 'child': { 'id': child_id, **data }}), 201
    except Error as e:
        return jsonify({'message': f'Error adding child: {str(e)}'}), 500

# PUT /api/children/current (fixed with Error import)
@children_selector_bp.route('/api/children/current', methods=['PUT'])
@token_required
def set_current_child_id(current_user_id: str):
    data = request.get_json()
    if not data or not data.get('currentChildId'):
        return jsonify({'message': 'Current child ID is required'}), 400
    try:
        with create_db_connection() as conn, conn.cursor() as cur:
            cur.execute("SELECT id FROM children WHERE id = %s AND user_id = %s", (data['currentChildId'], current_user_id))
            if not cur.fetchone():
                return jsonify({'message': 'Invalid child ID'}), 400
            cur.execute("UPDATE users SET current_child_id = %s WHERE id = %s", (data['currentChildId'], current_user_id))
            conn.commit()
        return jsonify({'message': 'Current child updated successfully', 'currentChildId': data['currentChildId']}), 200
    except Error as e:
        return jsonify({'message': f'Error updating current child: {str(e)}'}), 500