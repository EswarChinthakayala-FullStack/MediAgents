import eventlet
eventlet.monkey_patch()
import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
from dotenv import load_dotenv
from event_listener import start_redis_listener

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # SocketIO Initialization
    socketio = SocketIO(app, cors_allowed_origins="*")

    # Configuration
    db_user = os.getenv('DB_USER', 'root')
    db_pass = os.getenv('DB_PASSWORD', '')
    db_host = os.getenv('DB_HOST', 'localhost')
    db_port = os.getenv('DB_PORT', '3306')
    db_name = os.getenv('DB_NAME', 'mediagents_db')

    app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

    # Initialize Database
    from database import db
    db.init_app(app)
    with app.app_context():
        db.create_all()

    # Register Blueprints
    from routes.auth_routes import auth_bp
    from routes.triage_routes import triage_bp
    from routes.patient_routes import patient_bp
    from routes.clinical_routes import clinical_bp
    from routes.admin_routes import admin_bp
    from routes.portal_routes import portal_bp
    from routes.appointment_routes import appointment_bp
    from routes.medication_routes import medication_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(triage_bp, url_prefix='/api/triage')
    app.register_blueprint(patient_bp, url_prefix='/api/patients')
    app.register_blueprint(clinical_bp, url_prefix='/api/clinical')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(portal_bp, url_prefix='/api/portal')
    app.register_blueprint(appointment_bp, url_prefix='/api/appointments')
    app.register_blueprint(medication_bp, url_prefix='/api/medications')

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            "status": "healthy", 
            "service": "MediAgents Backend",
            "database": "connected" if db.engine else "disconnected"
        }), 200

    # Start Redis Listener
    start_redis_listener(socketio, 
                         redis_host=os.getenv('REDIS_HOST', 'localhost'),
                         redis_port=os.getenv('REDIS_PORT', 6379))

    return app, socketio

if __name__ == '__main__':
    app, socketio = create_app()
    socketio.run(app, debug=True, port=5000)
