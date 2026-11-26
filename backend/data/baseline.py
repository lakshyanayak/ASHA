from statistics import mean

from backend.models.wellness_data import WellnessData


def calculate_baseline(records):
    """
    Calculates the user's average wellness values.
    """

    if not records:
        return None

    baseline = {
        "sleep": mean(record.sleep for record in records),
        "steps": mean(record.steps for record in records),
        "screen_time": mean(record.screen_time for record in records),
        "mood": mean(record.mood for record in records),
        "energy": mean(record.energy for record in records),
        "water": mean(record.water for record in records),
        "exercise": mean(record.exercise for record in records)
    }

    return baseline


def detect_deviations(current_data, baseline):
    """
    Compares today's wellness data with the user's baseline.

    A deviation is reported when the current value
    differs from the baseline by 20% or more.
    """

    deviations = {}

    current_values = {
        "sleep": current_data.sleep,
        "steps": current_data.steps,
        "screen_time": current_data.screen_time,
        "mood": current_data.mood,
        "energy": current_data.energy,
        "water": current_data.water,
        "exercise": current_data.exercise
    }

    for metric, current_value in current_values.items():

        baseline_value = baseline[metric]

        if baseline_value == 0:
            continue

        percentage_change = (
            (current_value - baseline_value)
            / baseline_value
        ) * 100

        if abs(percentage_change) >= 20:
            deviations[metric] = {
                "current": current_value,
                "baseline": baseline_value,
                "percentage_change": percentage_change
            }

    return deviations