from flask import Flask, jsonify, session
from supabase import create_client, Client
import logging
from datetime import timedelta
from flask_session import Session  # Add this import

app = Flask(__name__, static_folder='static', template_folder='templates')
app.config.from_object('app.config')
app.config['SESSION_TYPE'] = 'filesystem'  # Add this line
Session(app)  # Add this line
app.permanent_session_lifetime = timedelta(days=5)

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
