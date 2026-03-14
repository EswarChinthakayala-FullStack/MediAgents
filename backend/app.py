import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

    # Initialize Database
    from database import db
    db.init_app(app)

    # Register Blueprints
    from routes.auth_routes import auth_bp
    from routes.triage_routes import triage_bp
    from routes.patient_routes import patient_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(triage_bp, url_prefix='/api/triage')
    app.register_blueprint(patient_bp, url_prefix='/api/patients')

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            "status": "healthy", 
            "service": "MediAgents Backend",
            "database": "connected" if db.engine else "disconnected"
        }), 200

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
