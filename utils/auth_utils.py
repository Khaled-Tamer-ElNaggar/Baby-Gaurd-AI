import jwt, datetime
from flask import current_app, request, jsonify
from functools import wraps

def generate_token(user_id: int, name: str = '', email: str = ''):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
        'iat': datetime.datetime.utcnow(),
        'sub': str(user_id),
        'name': name,
        'email': email,
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get('Authorization', '')
        token = auth.split()[1] if auth.lower().startswith('bearer ') else None
        if not token:
            return jsonify(error='Token is missing!'), 401
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user_id = int(data['sub'])
        except jwt.ExpiredSignatureError:
            return jsonify(error='Token has expired!'), 401
        except (jwt.InvalidTokenError, ValueError) as e:
            return jsonify(error='Invalid token!'), 401
        return f(current_user_id, *args, **kwargs)
    return decorated
