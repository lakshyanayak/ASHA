import csv
from datetime import datetime
from pathlib import Path

from backend.models.wellness_data import WellnessData


def validate_wellness_data(data):
    """
    Checks whether a WellnessData object contains valid values.
    """

    if data.sleep < 0:
        return False

    if data.steps < 0:
        return False

    if data.screen_time < 0:
        return False

    if not 1 <= data.mood <= 10:
        return False

    if not 1 <= data.energy <= 10:
        return False

    if data.water < 0:
        return False

    if data.exercise < 0:
        return False

    return True


def load_wellness_data(file_path):
    """
    Loads wellness records from a CSV file
    and converts them into WellnessData objects.
    """

    records = []

    with open(file_path, mode="r", newline="") as file:
        reader = csv.DictReader(file)

        for row in reader:

            wellness = WellnessData(
                date=datetime.strptime(
                    row["date"], "%Y-%m-%d"
                ).date(),

                sleep=float(row["sleep"]),
                steps=int(row["steps"]),
                screen_time=float(row["screen_time"]),
                mood=float(row["mood"]),
                energy=float(row["energy"]),
                water=float(row["water"]),
                exercise=float(row["exercise"])
            )

            if validate_wellness_data(wellness):
                records.append(wellness)

    return records