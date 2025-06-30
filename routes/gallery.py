from flask import Blueprint, request, jsonify, send_from_directory
from utils.db import create_db_connection
from utils.auth_utils import token_required
from utils.helpers import allowed_image
from werkzeug.utils import secure_filename
from mysql.connector import Error
import os
import uuid

gallery_bp = Blueprint('gallery', __name__)

@gallery_bp.route('/api/user-media', methods=['POST'])
@token_required
def upload_image(current_user_id):
    if 'file' not in request.files:
        return jsonify(error="No file part in the request"), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify(error="No selected file"), 400
    if not allowed_image(file.filename):
        return jsonify(error="Only image files are allowed"), 400
    description = request.form.get('description', '')
    filename = secure_filename(file.filename)
    unique_suffix = str(uuid.uuid4())[:8]
    filename_with_uuid = f"{unique_suffix}_{filename}"
    upload_folder = os.environ.get('UPLOAD_FOLDER', 'uploads')
    os.makedirs(upload_folder, exist_ok=True)
    filepath = os.path.join(upload_folder, filename_with_uuid)
    file.save(filepath)
    image_url = filepath
    try:
        with create_db_connection() as conn, conn.cursor() as cur:
            cur.execute("""
                INSERT INTO user_media (user_id, image_url, description, uploaded_at)
                VALUES (%s, %s, %s, NOW())
            """, (current_user_id, image_url, description))
            conn.commit()
            media_id = cur.lastrowid
        return jsonify(message="Image uploaded successfully", media_id=media_id), 201
    except Error as e:
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify(error=f"Database error: {str(e)}"), 500

@gallery_bp.route('/api/user-media', methods=['GET'])
@token_required
def get_user_images(current_user_id):
    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            cur.execute("""
                SELECT id, image_url, description, uploaded_at
                FROM user_media
                WHERE user_id = %s
                ORDER BY uploaded_at DESC
            """, (current_user_id,))
            images = cur.fetchall()
        return jsonify(images=images), 200
    except Error as e:
        return jsonify(error='Failed to retrieve images'), 500

@gallery_bp.route('/api/user-media/<int:media_id>', methods=['DELETE'])
@token_required
def delete_user_image(current_user_id, media_id):
    try:
        with create_db_connection() as conn, conn.cursor() as cur:
            cur.execute("""
                SELECT image_url FROM user_media
                WHERE id = %s AND user_id = %s
            """, (media_id, current_user_id))
            row = cur.fetchone()
            if not row:
                return jsonify(error="Image not found or unauthorized"), 404
            image_url = row[0]
            cur.execute("DELETE FROM user_media WHERE id = %s", (media_id,))
            conn.commit()
        if os.path.exists(image_url):
            os.remove(image_url)
        return jsonify(message="Image deleted successfully"), 200
    except Error as e:
        return jsonify(error='Failed to delete image'), 500

@gallery_bp.route('/uploads/<filename>')
def serve_image(filename):
    upload_folder = os.environ.get('UPLOAD_FOLDER', 'uploads')
    return send_from_directory(upload_folder, filename)
