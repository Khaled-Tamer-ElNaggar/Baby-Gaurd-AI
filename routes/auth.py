from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from utils.db import create_db_connection
from utils.auth_utils import generate_token
from mysql.connector import Error

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    required = ['user_name', 'user_email', 'user_pass', 'user_birthday', 'blood_type']
    if not all(field in data for field in required):
        return jsonify(error='Missing required fields'), 400

    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            cur.execute("SELECT id FROM users WHERE user_email = %s", (data['user_email'],))
            if cur.fetchone():
                return jsonify(error='Email already exists', code="email_exists"), 409

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

        token = generate_token(user_id, data['user_name'], data['user_email'])
        return jsonify(message='Registration successful', user_id=user_id, token=token), 201

    except Error:
        return jsonify(error='Registration failed'), 500

@auth_bp.route('/api/login', methods=['POST'])
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

        token = generate_token(user['id'], user['user_name'], user['user_email'])
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
        return jsonify(error='Login failed'), 500
