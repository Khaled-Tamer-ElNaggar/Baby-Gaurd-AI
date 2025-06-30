from flask import Blueprint, request, jsonify
from utils.db import create_db_connection
from utils.auth_utils import token_required
from mysql.connector import Error

children_bp = Blueprint('children', __name__)

@children_bp.route('/api/children', methods=['POST'])
@token_required
def add_child(current_user_id):
    data = request.get_json() or {}
    required = ['full_name', 'birth_date', 'gender']
    if not all(k in data for k in required):
        return jsonify(error='Missing required fields: full_name, birth_date, gender'), 400
    try:
        with create_db_connection() as conn, conn.cursor() as cur:
            cur.execute("""
                INSERT INTO children (
                    user_id, full_name, birth_date, birth_weight, birth_height,
                    gender, blood_type, genetic_conditions
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                current_user_id,
                data['full_name'],
                data['birth_date'],
                data.get('birth_weight', None),
                data.get('birth_height', None),
                data['gender'],
                data.get('blood_type', None),
                data.get('genetic_conditions', None)
            ))
            conn.commit()
            child_id = cur.lastrowid
        return jsonify(message='Child added successfully', child_id=child_id), 201
    except Error as e:
        return jsonify(error=f'Failed to add child: {str(e)}'), 500

@children_bp.route('/api/children', methods=['GET'])
@token_required
def get_children(current_user_id):
    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            cur.execute("""
                SELECT id, full_name, birth_date, birth_weight, birth_height,
                       gender, blood_type, genetic_conditions
                FROM children WHERE user_id = %s
                ORDER BY birth_date DESC
            """, (current_user_id,))
            children = cur.fetchall()
        return jsonify(children=children), 200
    except Error:
        return jsonify(error='Failed to retrieve children'), 500

@children_bp.route('/api/children/<int:child_id>', methods=['DELETE'])
@token_required
def delete_child(current_user_id, child_id):
    try:
        with create_db_connection() as conn, conn.cursor() as cur:
            cur.execute("""
                SELECT id FROM children WHERE id = %s AND user_id = %s
            """, (child_id, current_user_id))
            if not cur.fetchone():
                return jsonify(error='Child not found or unauthorized'), 404
            cur.execute("DELETE FROM children WHERE id = %s", (child_id,))
            conn.commit()
        return jsonify(message='Child deleted successfully'), 200
    except Error:
        return jsonify(error='Failed to delete child'), 500
