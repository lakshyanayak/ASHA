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

def generate_wellness_recommendations(current_data, baseline):
    """
    Generates gentle, personalized wellness suggestions
    by comparing current data with personal averages.
    """

    recommendations = []

    # Sleep recommendation
    if current_data.sleep < baseline["sleep"] * 0.8:
        recommendations.append({
            "metric": "sleep",
            "title": "Give yourself some rest",
            "message": (
                "I noticed you slept less than your usual pattern. "
                "Try winding down a little earlier tonight and "
                "maintaining a consistent sleep routine. "
                "You deserve some good rest!"
            )
        })

    # Water recommendation
    if current_data.water < baseline["water"] * 0.8:
        recommendations.append({
            "metric": "water",
            "title": "Remember to stay hydrated",
            "message": (
                "Your water intake is lower than your usual level. "
                "Try keeping water nearby and drinking regularly "
                "throughout the day. Take care of yourself!"
            )
        })

    # Screen time recommendation
    if current_data.screen_time > baseline["screen_time"] * 1.2:
        recommendations.append({
            "metric": "screen_time",
            "title": "Take a little screen break",
            "message": (
                "Your screen time is higher than your usual pattern. "
                "Consider taking a few short breaks and giving "
                "your eyes some rest."
            )
        })

    # Activity recommendation
    if current_data.steps < baseline["steps"] * 0.8:
        recommendations.append({
            "metric": "activity",
            "title": "A little movement can help",
            "message": (
                "Your activity is lower than your usual pattern. "
                "If you feel comfortable, try a gentle walk "
                "or some light movement today."
            )
        })

    # Energy recommendation
    if current_data.energy < baseline["energy"] * 0.8:
        recommendations.append({
            "metric": "energy",
            "title": "Be gentle with yourself",
            "message": (
                "Your energy is lower than your usual level. "
                "Take things at a comfortable pace and make "
                "some time for rest."
            )
        })

    return recommendations
