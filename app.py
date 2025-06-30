from flask import Flask
from flask_cors import CORS
from utils.json_provider import CustomJSON
import logging
import os

# Import Blueprints
from routes.auth import auth_bp
from routes.calendar import calendar_bp
from routes.chat import chat_bp
from routes.children import children_bp
from routes.trackers import trackers_bp
from routes.gallery import gallery_bp

# ── 1. App setup ─────────────────────────────────────────────────────────
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secure-secret-key'
app.config['ENV'] = 'development'
app.config['UPLOAD_FOLDER'] = 'uploads'
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
app.json = CustomJSON(app)
app.logger.setLevel(logging.INFO)
os.environ['UPLOAD_FOLDER'] = app.config['UPLOAD_FOLDER']

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(calendar_bp)
app.register_blueprint(chat_bp)
app.register_blueprint(children_bp)
app.register_blueprint(trackers_bp)
app.register_blueprint(gallery_bp)

# ── 13. Dev entrypoint ───────────────────────────────────────────────────
if __name__ == '__main__':
    app.run(debug=True, port=5000)