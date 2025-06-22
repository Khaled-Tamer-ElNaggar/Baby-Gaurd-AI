# ── app.py ────────────────────────────────────────────────────────────────
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask.json.provider import DefaultJSONProvider
import mysql.connector
from mysql.connector import Error
from functools import wraps
import jwt
import datetime, decimal, uuid, base64, logging
from werkzeug.security import generate_password_hash, check_password_hash

# ── 1.  App & CORS --------------------------------------------------------
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secure-secret-key'      # ← change in prod
app.config['ENV'] = 'development'                        # show tracebacks
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# ── 2.  Custom JSON provider ---------------------------------------------
class CustomJSON(DefaultJSONProvider):
    """Make jsonify work with SQL/ORM datatypes automatically."""
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            return float(obj)  # or str(obj) if precision matters
        if isinstance(obj, (bytes, bytearray)):
            return base64.b64encode(obj).decode()
        if isinstance(obj, (datetime.date, datetime.datetime, datetime.time)):
            return obj.isoformat()
        if isinstance(obj, datetime.timedelta):
            return obj.total_seconds()                   # or str(obj)
        if isinstance(obj, uuid.UUID):
            return str(obj)
        return super().default(obj)

app.json = CustomJSON(app)
app.logger.setLevel(logging.INFO)

# ── 3.  DB helpers --------------------------------------------------------
db_config = dict(
    host='localhost',
    port=3306,
    database='babyguardai',
    user='root',
    password='1234'
)

def create_db_connection():
    """Returns a connection that can be used as a context‑manager."""
    return mysql.connector.connect(**db_config)

# ── 4.  JWT helpers -------------------------------------------------------
def generate_token(user_id: int):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
        'iat': datetime.datetime.utcnow(),
        'sub': str(user_id)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get('Authorization', '')
        token = auth.split()[1] if auth.lower().startswith('bearer ') else None
        if not token:
            return jsonify(error='Token is missing!'), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user_id = int(data['sub'])
        except jwt.ExpiredSignatureError:
            return jsonify(error='Token has expired!'), 401
        except (jwt.InvalidTokenError, ValueError) as e:
            app.logger.info(f"Token decode failed: {e}")
            return jsonify(error='Invalid token!'), 401

        return f(current_user_id, *args, **kwargs)
    return decorated

# ── 5.  Auth routes -------------------------------------------------------
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    required = ['user_name', 'user_email', 'user_pass', 'user_birthday', 'blood_type']
    if not all(field in data for field in required):
        return jsonify(error='Missing required fields'), 400

    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            cur.execute("SELECT id FROM users WHERE user_email = %s", (data['user_email'],))
            if cur.fetchone():
                return jsonify(error='Email already exists'), 409

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

        token = generate_token(user_id)
        return jsonify(message='Registration successful', user_id=user_id, token=token), 201

    except Error:
        app.logger.exception("[DB] Registration failed")
        return jsonify(error='Registration failed'), 500

@app.route('/api/login', methods=['POST'])
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

        token = generate_token(user['id'])
        # CustomJSON will serialize join_date automatically
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
        app.logger.exception("[DB] Login failed")
        return jsonify(error='Login failed'), 500

# ── 6.  Calendar routes ---------------------------------------------------
@app.route('/api/calendar-events', methods=['POST'])
@token_required
def create_calendar_event(current_user_id):
    data = request.get_json() or {}
    required = ['event_type', 'event_date', 'event_time', 'title']
    if not all(k in data for k in required):
        return jsonify(error='Missing fields'), 400

    desc   = data.get('description', '')
    offset = data.get('reminder_offset', 0)
    recur  = int(data.get('is_recurring', False))

    try:
        with create_db_connection() as conn, conn.cursor() as cur:
            cur.execute("""
                INSERT INTO calendar_events (
                    user_id, event_type, event_date, event_time, title,
                    description, reminder_offset, is_recurring
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                current_user_id, data['event_type'], data['event_date'],
                data['event_time'], data['title'], desc, offset, recur
            ))
            conn.commit()
        return jsonify(message='Calendar event created successfully'), 201

    except Error:
        app.logger.exception("[DB] Create calendar event failed")
        return jsonify(error='Failed to create calendar event'), 500

@app.route('/api/get-calendar-events', methods=['GET'])
@token_required
def get_calendar_events(current_user_id):
    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            cur.execute("""
                SELECT *
                FROM calendar_events
                WHERE user_id = %s
                ORDER BY event_date, event_time
            """, (current_user_id,))
            events = cur.fetchall()

        # No manual date/time conversions needed!
        return jsonify(calendar_events=events), 200

    except Error:
        app.logger.exception("[DB] Fetch calendar events failed")
        return jsonify(error='Failed to retrieve calendar events'), 500
    
# Add this to app.py under section 6 (Calendar routes)

@app.route('/api/calendar-events/<int:event_id>', methods=['DELETE'])
@token_required
def delete_calendar_event(current_user_id, event_id):
    try:
        with create_db_connection() as conn, conn.cursor() as cur:
            # Check if the event exists and belongs to the user
            cur.execute("""
                SELECT id FROM calendar_events
                WHERE id = %s AND user_id = %s
            """, (event_id, current_user_id))
            event = cur.fetchone()

            if not event:
                return jsonify(error='Event not found or unauthorized'), 404

            # Delete the event
            cur.execute("DELETE FROM calendar_events WHERE id = %s", (event_id,))
            conn.commit()

        return jsonify(message='Calendar event deleted successfully'), 200

    except Error:
        app.logger.exception("[DB] Delete calendar event failed")
        return jsonify(error='Failed to delete calendar event'), 500

# ── 7.  Dev entry‑point ---------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True, port=5000)