from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from functools import wraps
from mysql.connector import Error
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secure-secret-key'  # Change this in production
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

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
            'sub': str(user_id)  # Convert user_id to string here
        }
        return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    except Exception as e:
        print(f"Token generation error: {e}")
        return None

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization', None)
        if auth_header:
            parts = auth_header.split()
            if len(parts) == 2 and parts[0].lower() == 'bearer':
                token = parts[1]

        if not token:
            return jsonify({'error': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user_id_str = data['sub']
            if not isinstance(current_user_id_str, str):
                raise jwt.InvalidTokenError("Subject claim is not a string")
            current_user_id = int(current_user_id_str)  # Convert back to int for use
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired!'}), 401
        except (jwt.InvalidTokenError, ValueError) as e:
            print(f"Token decode failed: {str(e)}")
            return jsonify({'error': 'Invalid token!'}), 401

        return f(current_user_id, *args, **kwargs)
    return decorated

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
        cursor.execute("SELECT id FROM users WHERE user_email = %s", (data['user_email'],))
        if cursor.fetchone():
            return jsonify({'error': 'Email already exists'}), 409

        hashed_pw = generate_password_hash(data['user_pass'])
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
            SELECT id, user_name, user_email, user_pass, user_birthday, blood_type, join_date
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
                'blood_type': user['blood_type'],
                'join_date': user['join_date']
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

@app.route('/api/calendar-events', methods=['POST'])
@token_required
def create_calendar_event(current_user_id):
    data = request.get_json()
    required = ['event_type', 'event_date', 'event_time', 'title']
    if not all(k in data for k in required):
        return jsonify({'error': 'Missing fields'}), 400

    description = data.get('description', '')
    reminder_offset = data.get('reminder_offset', 0)
    is_recurring = data.get('is_recurring', False)

    connection, cursor = None, None
    try:
        connection = create_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = connection.cursor()
        cursor.execute("""
            INSERT INTO calendar_events (
                user_id, event_type, event_date, event_time, title,
                description, reminder_offset, is_recurring
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            current_user_id,
            data['event_type'],
            data['event_date'],
            data['event_time'],
            data['title'],
            description,
            reminder_offset,
            int(is_recurring)
        ))
        connection.commit()
        event_id = cursor.lastrowid

        return jsonify({'message': 'Calendar event created successfully', 'id': event_id}), 201
    except Error as e:
        print(f"Calendar event error: {e}")
        return jsonify({'error': 'Failed to create calendar event'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route('/api/calendar-events/<int:event_id>', methods=['DELETE'])
@token_required
def delete_calendar_event(current_user_id, event_id):
    connection, cursor = None, None
    try:
        connection = create_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = connection.cursor()
        cursor.execute("""
            DELETE FROM calendar_events
            WHERE id = %s AND user_id = %s
        """, (event_id, current_user_id))
        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({'error': 'Event not found or not authorized'}), 404

        return jsonify({'message': 'Event deleted successfully'}), 200
    except Error as e:
        print(f"Error deleting event: {e}")
        return jsonify({'error': 'Failed to delete event'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

if __name__ == '__main__':
    app.run(debug=True)
