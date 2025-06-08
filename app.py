from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS
import mysql.connector
from mysql.connector import Error
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secure-secret-key'  # Change this in production
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})  # Allow requests from localhost:5173

# Database configuration
db_config = {
    'host': 'localhost',
    'port': 3306,
    'database': 'babyguardai',
    'user': 'root',
    'password': '1234'
}

def create_db_connection():
    try:
        return mysql.connector.connect(**db_config)
    except Error as e:
        print(f"Database connection error: {e}")
        return None

def generate_token(user_id):
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
            'iat': datetime.datetime.utcnow(),
            'sub': user_id
        }
        return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    except Exception as e:
        print(f"Token generation error: {e}")
        return None

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    required = ['user_name', 'user_email', 'user_pass', 'user_birthday', 'blood_type']
    
    if not all(field in data for field in required):
        return jsonify({'error': 'Missing required fields'}), 400

    connection, cursor = None, None
    try:
        connection = create_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = connection.cursor(dictionary=True)
        # Check if email already exists
        cursor.execute("SELECT id FROM users WHERE user_email = %s", (data['user_email'],))
        if cursor.fetchone():
            return jsonify({'error': 'Email already exists'}), 409

        # Hash the password
        hashed_pw = generate_password_hash(data['user_pass'])  # Default is pbkdf2:sha256
        
        # Insert new user
        cursor.execute("""
            INSERT INTO users (user_name, user_email, user_pass, user_birthday, blood_type)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            data['user_name'],
            data['user_email'],
            hashed_pw,
            data['user_birthday'],
            data['blood_type']
        ))
        connection.commit()
        user_id = cursor.lastrowid
        token = generate_token(user_id)
        
        return jsonify({
            'message': 'Registration successful',
            'user_id': user_id,
            'token': token
        }), 201
    except Error as e:
        print(f"Registration error: {e}")
        return jsonify({'error': 'Registration failed'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'user_email' not in data or 'user_pass' not in data:
        return jsonify({'error': 'Missing credentials'}), 400

    connection, cursor = None, None
    try:
        connection = create_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT id, user_name, user_email, user_pass, user_birthday, blood_type
            FROM users
            WHERE user_email = %s
        """, (data['user_email'],))
        user = cursor.fetchone()

        if not user or not check_password_hash(user['user_pass'], data['user_pass']):
            return jsonify({'error': 'Invalid credentials'}), 401

        token = generate_token(user['id'])
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': user['id'],
                'name': user['user_name'],
                'email': user['user_email'],
                'birthday': user['user_birthday'],
                'blood_type': user['blood_type']
            }
        }), 200
    except Error as e:
        print(f"Login error: {e}")
        return jsonify({'error': 'Login failed'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

if __name__ == '__main__':
    app.run(debug=True)