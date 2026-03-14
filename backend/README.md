# MediAgents Flask Backend

This is the central Flask API for the MediAgents platform, designed to connect the Frontend, the MySQL Database (XAMPP), and the AI Services.

## Setup Instructions

### 1. Database Setup (XAMPP)
- Start the **Apache** and **MySQL** modules in your XAMPP Control Panel.
- Open **phpMyAdmin** (`http://localhost/phpmyadmin`).
- Create a new database named `mediagents_db`.
- Import the schema from `database/schema.sql` into this database.
- **Note**: Ensure the `users` table has columns for `email` and `password_hash` if you plan to use the built-in authentication.

### 2. Environment Configuration
- Create or check the `.env` file in the `backend/` directory:
  ```env
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=
  DB_NAME=mediagents_db
  SECRET_KEY=your_secret_key_here
  AI_SERVICE_URL=http://localhost:8001
  ```

### 3. Install Dependencies
Run the following commands in your terminal:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Run the API
```bash
python3 app.py
```
The server will start on `http://localhost:5000`.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register a new user |
| `/api/auth/login` | POST | Login and receive JWT token |
| `/api/triage/analyze` | POST | Analyze symptoms using AI Engine |
| `/api/patients/` | GET | List all patients |
| `/api/health` | GET | Health check |

## Project Structure

```text
backend/
├── app.py              # Application factory and entry point
├── database.py         # SQLAlchemy instance initialization
├── models/             # Database Models
│   ├── __init__.py     # Model exports
│   ├── patient.py      # Patient model
│   ├── staff.py        # Staff/Doctor model
│   ├── user.py         # User Authentication model
│   └── triage.py       # Triage record model
├── routes/             # API Route Blueprints
│   ├── auth_routes.py  # Authentication logic
│   ├── triage_routes.py # AI-powered triage logic
│   └── patient_routes.py # Patient management
├── services/           # Business Logic & AI Services
│   ├── __init__.py
│   └── ai_service.py   # Wrapper for local LLM inference
├── .env                # Configuration variables
└── requirements.txt    # Python dependencies
```

## Integration with AI Services
The backend is designed to integrate with the 12-agent ecosystem in the `ai-service` directory. It uses a dedicated `AIService` to handle local inference using the TinyLlama model.
