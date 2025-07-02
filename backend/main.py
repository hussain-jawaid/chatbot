from fastapi import FastAPI
from routes import auth_routes, chat_routes
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


# Allow requests from frontend (localhost:5173 for React)
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Include route modules
app.include_router(auth_routes.router, prefix="/auth", tags=["Auth"])
app.include_router(chat_routes.router, prefix="/chat", tags=["Chat"])


@app.get("/")
def root():
    return {"message": "Chatbot backend is running!"}