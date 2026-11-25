
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routes import router as asha_router


# ==========================================
# ASHA FASTAPI APPLICATION
# ==========================================

app = FastAPI(
    title="Asha API",
    description="Asha Personalised Wellness Assistant API",
    version="1.0.0"
)


# ==========================================
# CORS CONFIGURATION
# Allows React frontend to communicate
# with the FastAPI backend
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# REGISTER ASHA API ROUTES
# ==========================================

app.include_router(asha_router)


# ==========================================
# ROOT ENDPOINT
# ==========================================

@app.get("/")
def home():
    return {
        "message": "Asha backend is running",
        "status": "success"
    }


# ==========================================
# APPLICATION HEALTH CHECK
# ==========================================

@app.get("/health")
def health_check():
    return {
        "status": "success",
        "message": "Asha application is healthy"
    }
