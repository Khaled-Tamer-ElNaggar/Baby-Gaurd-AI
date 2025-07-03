from flask import Blueprint, request, jsonify
from utils.db import create_db_connection
from utils.auth_utils import token_required
from mysql.connector import Error
import datetime

health_records_bp = Blueprint('health_records', __name__)

@health_records_bp.route('/api/children-id', methods=['GET'])
@token_required
def get_current_child(current_user_id):
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
                
            # Then get the child details
            cur.execute("""
                SELECT id, full_name
                FROM children
                WHERE id = %s AND user_id = %s
            """, (user['current_child_id'], current_user_id))
            child = cur.fetchone()
            
            if not child:
                return jsonify(error='Selected child not found or not associated with this account'), 404
                
            return jsonify(child=child), 200
    except Error as e:
        return jsonify(error=f'Failed to fetch current child: {str(e)}'), 500

@health_records_bp.route('/api/health_records', methods=['POST'])
@token_required
def add_health_record(current_user_id):
    data = request.get_json() or {}
    required = ['record_type', 'title']  # Removed child_id from required
    if not all(k in data for k in required):
        return jsonify(error='Missing required fields: record_type, title'), 400
    
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
                
            # Then insert the health record
            cur.execute("""
                INSERT INTO child_health_records (
                    child_id, record_date, record_type, title, dosage, priority, parent_notes,
                    created_at, updated_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                user['current_child_id'],  # Use current_child_id from users table
                data.get('date', datetime.date.today().isoformat()),
                data['record_type'],
                data['title'],
                data.get('dosage', None),
                data.get('priority', 'medium'),
                data.get('notes', None),
                datetime.datetime.now(),
                datetime.datetime.now()
            ))
            conn.commit()
            record_id = cur.lastrowid
        return jsonify(message='Health record added successfully', record_id=record_id), 201
    except Error as e:
        return jsonify(error=f'Failed to add health record: {str(e)}'), 500

@health_records_bp.route('/api/health_records', methods=['GET'])
@token_required
def get_health_records(current_user_id):
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
                
            # Then get the health records
            cur.execute("""
                SELECT id, child_id, record_date as date, record_type as type, title, 
                       dosage, priority, parent_notes as notes
                FROM child_health_records 
                WHERE child_id = %s
                ORDER BY record_date DESC
            """, (user['current_child_id'],))
            records = cur.fetchall()
        return jsonify(records=records), 200
    except Error as e:
        return jsonify(error=f'Failed to fetch health records: {str(e)}'), 500


@health_records_bp.route('/api/health_records/<int:record_id>', methods=['DELETE'])
@token_required
def delete_health_record(current_user_id, record_id):
    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            # First, verify that the record belongs to the current user's selected child
            cur.execute("""
                SELECT chr.id, chr.child_id, u.current_child_id
                FROM child_health_records chr
                JOIN users u ON chr.child_id = u.current_child_id
                WHERE chr.id = %s AND u.id = %s
            """, (record_id, current_user_id))
            record = cur.fetchone()

            if not record:
                return jsonify(error='Record not found or not associated with this user'), 404

            # Delete the health record
            cur.execute("""
                DELETE FROM child_health_records
                WHERE id = %s
            """, (record_id,))
            conn.commit()

            return jsonify(message='Health record deleted successfully'), 200
    except Error as e:
        return jsonify(error=f'Failed to delete health record: {str(e)}'), 500