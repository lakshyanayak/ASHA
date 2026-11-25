
from pathlib import Path

from fastapi import APIRouter, HTTPException

from backend.data.data_loader import load_wellness_data
from backend.data.baseline import calculate_baseline, detect_deviations

router = APIRouter()

# Locate the CSV file in the project's root data folder.
PROJECT_ROOT = Path(__file__).resolve().parents[2]
CSV_FILE = PROJECT_ROOT / "data" / "sample_data.csv"


@router.get("/api/wellness/dashboard")
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
