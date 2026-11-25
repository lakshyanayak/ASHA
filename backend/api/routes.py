
from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from voice.asha_voice_engine import speak_from_csv


# ==========================================
# API ROUTER
# ==========================================

router = APIRouter(prefix="/api", tags=["Asha"])


# ==========================================
# PROJECT PATHS
# ==========================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]
OUTPUT_DIR = PROJECT_ROOT / "voice" / "output"


# ==========================================
# REQUEST MODEL
# ==========================================

class AskRequest(BaseModel):
    question: str = Field(
        ...,
        min_length=1,
        max_length=1000
    )

    include_voice: bool = True


# ==========================================
# HEALTH CHECK
# ==========================================

@router.get("/health")
def api_health():
    return {
        "status": "success",
        "message": "Asha API is running"
    }


# ==========================================
# ASK ASHA ENDPOINT
# ==========================================

@router.post("/ask")
def ask_asha(request: AskRequest):
    """
    Receives a user question,
    generates Asha's response,
    and optionally generates voice audio.
    """

    try:

        result = speak_from_csv(
            user_question=request.question,
            include_voice=request.include_voice
        )

        audio_url = None

        if result["audio_path"]:

            audio_filename = Path(
                result["audio_path"]
            ).name

            audio_url = f"/api/audio/{audio_filename}"

        return {
            "status": "success",
            "question": request.question,
            "answer": result["text"],
            "audio_url": audio_url
        }

    except (ValueError, FileNotFoundError) as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail="Unable to generate Asha's response. Please try again."
        )


# ==========================================
# AUDIO PLAYBACK ENDPOINT
# ==========================================

@router.get("/audio/{filename}")
def get_asha_audio(filename: str):
    """
    Serves the generated MP3 file to the frontend.
    """

    if (
        Path(filename).name != filename
        or not filename.endswith(".mp3")
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid audio filename"
        )

    audio_path = OUTPUT_DIR / filename

    if not audio_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Audio file not found"
        )

    return FileResponse(
        path=audio_path,
        media_type="audio/mpeg",
        filename=filename
    )
