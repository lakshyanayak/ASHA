
from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from backend.data.data_loader import load_wellness_data
from backend.data.baseline import (
    calculate_baseline,
    detect_deviations
)

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
# PERSONALIZED RECOMMENDATION ENGINE
# ==========================================

def generate_recommendations(latest, baseline):

    recommendations = []

    if latest.sleep < baseline["sleep"] * 0.8:
        recommendations.append({
            "metric": "sleep",
            "title": "Give yourself some rest",
            "message": (
                "I noticed your sleep was lower than your usual "
                "pattern. Try winding down a little earlier tonight. "
                "You deserve some good rest!"
            )
        })

    if latest.water < baseline["water"] * 0.8:
        recommendations.append({
            "metric": "water",
            "title": "Remember to hydrate",
            "message": (
                "Your water intake was lower than your usual level. "
                "Keep some water nearby and drink regularly "
                "throughout the day."
            )
        })

    if latest.screen_time > baseline["screen_time"] * 1.2:
        recommendations.append({
            "metric": "screen_time",
            "title": "Take a screen break",
            "message": (
                "Your screen time was higher than your usual pattern. "
                "Consider taking a few short breaks today."
            )
        })

    if latest.steps < baseline["steps"] * 0.8:
        recommendations.append({
            "metric": "activity",
            "title": "Move at your own pace",
            "message": (
                "Your activity was lower than usual. If you feel "
                "comfortable, try a gentle walk today."
            )
        })

    if latest.energy < baseline["energy"] * 0.8:
        recommendations.append({
            "metric": "energy",
            "title": "Be gentle with yourself",
            "message": (
                "Your energy was lower than usual. Take things "
                "at a comfortable pace and allow yourself time to rest."
            )
        })

    if latest.mood < baseline["mood"] * 0.8:
        recommendations.append({
            "metric": "mood",
            "title": "Take a moment for yourself",
            "message": (
                "Your reported mood was lower than your usual pattern. "
                "Consider taking a little time for something comforting "
                "or talking with someone you trust."
            )
        })

    if not recommendations:
        recommendations.append({
            "metric": "general",
            "title": "Keep caring for yourself",
            "message": (
                "Your latest wellness records are relatively close "
                "to your usual pattern. Keep taking small steps "
                "to care for yourself!"
            )
        })

    return recommendations


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
# WELLNESS DASHBOARD
# ==========================================

@router.get("/wellness/dashboard")
def get_wellness_dashboard():

    try:

        records = load_wellness_data(CSV_FILE)

        if not records:
            raise HTTPException(
                status_code=404,
                detail="No valid wellness records found."
            )

        baseline = calculate_baseline(records)

        latest = max(
            records,
            key=lambda record: record.date
        )

        deviations = detect_deviations(
            latest,
            baseline
        )

        recommendations = generate_recommendations(
            latest,
            baseline
        )

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
            "status": "success",
            "records": records_json,
            "baseline": baseline,
            "latest": latest_json,
            "deviations": deviations,
            "recommendations": recommendations
        }

    except HTTPException:
        raise

    except Exception as error:
        print("Dashboard error:", error)

        raise HTTPException(
            status_code=500,
            detail="Unable to load wellness dashboard."
        )


# ==========================================
# ASK ASHA
# ==========================================

@router.post("/ask")
def ask_asha(request: AskRequest):

    try:

        result = speak_from_csv(
            user_question=request.question,
            include_voice=request.include_voice
        )

        audio_url = None

        if result.get("audio_path"):

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

        print("Ask Asha error:", error)

        raise HTTPException(
            status_code=500,
            detail="Unable to generate Asha's response. Please try again."
        )


# ==========================================
# AUDIO PLAYBACK
# ==========================================

@router.get("/audio/{filename}")
def get_asha_audio(filename: str):

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
