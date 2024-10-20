from flask import Flask, jsonify, session
from flask_cors import CORS
from supabase import create_client, Client
import logging
from datetime import timedelta
from flask_session import Session  # Add this import

app = Flask(__name__, static_folder='static', template_folder='templates')
# CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "http://localhost:3000/"}},
    #  allow_headers=["Content-Type", "Authorization"])
CORS(app)
app.config.from_object('app.config')
app.config['SESSION_TYPE'] = 'filesystem'  # Add this line
Session(app)  # Add this line
app.permanent_session_lifetime = timedelta(days=5)
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

supabase: Client = create_client(app.config['SUPABASE_URL'], app.config['SUPABASE_KEY'])

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.errorhandler(Exception)
def handle_exception(e):
    # Log the exception
    logger.exception("An unhandled exception occurred:")
    # Return JSON instead of HTML for HTTP errors
    return jsonify(error=str(e)), 500

# Import routes after creating the app instance
from app import routes

