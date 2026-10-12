# CodeFix AI

CodeFix AI is an AI-powered programming assistant that helps users write, understand, debug, and improve code.

## Features

- **AI Code Assistant:** Answers programming questions.
- **Code Debugger:** Analyzes code and suggests corrections.
- **Code Explainer:** Explains code in beginner-friendly language.
- **Code Optimizer:** Suggests ways to improve code.
- **Code Generator:** Generates code from user prompts.

## Technologies Used

- **Frontend:** React, Vite, CSS
- **Backend:** Python, FastAPI
- **AI Integration:** Groq API

## Project Structure

```text
codefixAI/
├── backend/
├── frontend/
├── .venv/
├── calculator.py
└── README.md
```

## Requirements

- Python
- Node.js and npm
- A configured Groq API key

## How to Run

### 1. Start the Backend

Open a terminal in the project folder and run:

```powershell
.\.venv\Scripts\Activate.ps1
cd backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Backend API documentation:

http://127.0.0.1:8000/docs

### 2. Start the Frontend

Open a second terminal and run:

```powershell
cd frontend
npm run dev
```

Open the website:

http://localhost:5173/

## API Endpoints

- `GET /api/health` — Checks backend status.
- `POST /api/chat` — AI chat assistant.
- `POST /api/debug` — Code debugging.
- `POST /api/explain` — Code explanation.
- `POST /api/optimize` — Code optimization.
- `POST /api/generate` — Code generation.

## Security

- Store the Groq API key in the backend `.env` file.
- Never commit API keys or secrets to GitHub.
- Do not expose the API key in frontend code.

## Project Status

The frontend and backend have been started successfully, and the AI chat response has been tested. Test the remaining features before final submission.