
def calculate_confidence(observations, consistent_observations):

    if observations <= 0:
        return {
            "score": 0,
            "level": "Low"
        }

    consistency = consistent_observations / observations

    score = round(
        min(observations / 10, 1) * 50
        + consistency * 50,
        2
    )

    if observations < 3:
        level = "Low"
    elif score >= 75:
        level = "High"
    elif score >= 45:
        level = "Moderate"
    else:
        level = "Low"

    return {
        "score": score,
        "level": level
    }
