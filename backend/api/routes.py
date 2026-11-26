from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from backend.data.data_loader import load_wellness_data
from backend.data.baseline import calculate_baseline, detect_deviations
from voice.asha_voice_engine import speak_from_csv


# ==========================================
# API ROUTER
# ==========================================

router = APIRouter(prefix="/api", tags=["Asha"])


# ==========================================
# PROJECT PATHS
# ==========================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

CSV_FILE = PROJECT_ROOT / "data" / "sample_data.csv"
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
# WELLNESS DASHBOARD ENDPOINT
# ==========================================

@router.get("/wellness/dashboard")
def get_wellness_dashboard():

    # Load and validate wellness records.
    records = load_wellness_data(CSV_FILE)

    if not records:
        raise HTTPException(
            status_code=404,
            detail="No valid wellness records found."
        )

    # Calculate the user's average wellness values.
    baseline = calculate_baseline(records)

    # Get the most recent record.
    latest = max(records, key=lambda record: record.date)

    # Compare the latest record against the baseline.
    deviations = detect_deviations(latest, baseline)

    # Convert WellnessData objects into JSON-friendly dictionaries.
    records_json = [
        {
            "date": record.date.isoformat(),
            "sleep": record.sleep,
            "steps": record.steps,
            "screen_time": record.screen_time,
            "mood": record.mood,
            "energy": record.energy,
            "water": record.water,
            "exercise": record.exercise
        }
        for record in records
    ]

    latest_json = {
        "date": latest.date.isoformat(),
        "sleep": latest.sleep,
        "steps": latest.steps,
        "screen_time": latest.screen_time,
        "mood": latest.mood,
        "energy": latest.energy,
        "water": latest.water,
        "exercise": latest.exercise
    }

    return {
        "records": records_json,
        "baseline": baseline,
        "latest": latest_json,
        "deviations": deviations
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
