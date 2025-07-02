# McCarthy.ai

McCarthy.ai is a full-stack chatbot application built with modern web technologies. It features a FastAPI backend integrated with Groq’s LLaMA-based LLMs, providing intelligent responses with session-aware context retention. The frontend is developed using React, Vite, and Tailwind CSS, delivering a performant and responsive UI optimized for both desktop and mobile. The application supports JWT-based user authentication, persistent chat history, and markdown rendering for rich message formatting, offering a seamless and secure conversational experience.

---

## Tools and Technologies

### Frontend

- React (with Vite)
- Tailwind CSS
- React Router
- DOMPurify + Marked (for secure markdown rendering)

### Backend

- FastAPI
- JWT (Authentication)
- Groq SDK (LLM backend)
- MySQL

---

## Project Structure

- **frontend/**: Contains the React + Tailwind CSS application code.
- **backend/**: Contains the FastAPI backend server and database interactions.
- **backend/tests/**: Includes test cases for the backend using pytest.
- **backend/services/**: Contains the main chatbot logic using Groq's LLaMA model.
- **backend/requirements.txt**: Lists the required Python packages for the backend.
- **database/**: Contains the MySQL database for user authentication, chat sessions, and messages.
- **README.md**: Provides an overview and setup instructions for the project.

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/hussain-jawaid/chatbot.git
cd mccarthy-ai

cd backend
python -m venv venv
venv\Scripts\activate # On Mac use: source venv/bin/activate
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload

cd ../frontend
npm install
npm run dev

Note: Make sure you have your own groq_api.py and secret_key.py files inside the backend/services/ directory.
```
