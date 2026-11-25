
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routes import router

app = FastAPI(title="Asha API")

# Allow the React frontend to communicate with FastAPI.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register the wellness API routes.
app.include_router(router)


@app.get("/")
def home():
    return {
        "message": "Asha backend is running"
    }
