from flask import Blueprint, jsonify, request
from functools import wraps
import jwt
from typing import List, Dict
import uuid

# Use a unique name for the blueprint
children_selector_bp = Blueprint('children_selector', __name__)
# Mock database (replace with actual database implementation)

children_db: Dict[str, List[Dict]] = {}
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].replace('Bearer ', '')
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, 'your-secure-secret-key', algorithms=["HS256"])
            current_user_id = data['user_id']
        except:
            return jsonify({'message': 'Token is invalid'}), 401
            
        return f(current_user_id, *args, **kwargs)
    return decorated

@children_selector_bp.route('/api/children', methods=['GET'])
@token_required
def get_children(current_user_id: str):
    children = children_db.get(current_user_id, [])
    return jsonify({
        'children': children,
        'currentChildId': children[0]['id'] if children else None
    })

@children_selector_bp.route('/api/children', methods=['POST'])
@token_required
def add_child(current_user_id: str):
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify({'message': 'Child name is required'}), 400
    
    child = {
        'id': str(uuid.uuid4()),
        'name': data['name']
    }
    
    if current_user_id not in children_db:
        children_db[current_user_id] = []
    children_db[current_user_id].append(child)
    
    return jsonify({'message': 'Child added successfully', 'child': child}), 201