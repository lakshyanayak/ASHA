
def generate_insights(changes, patterns, confidence):

    insights = []

    for metric, change in changes.items():

        if change["direction"] != "unchanged":
            insights.append(
                f"Your {metric} has {change['direction']} "
                f"by {abs(change['difference'])} "
                f"compared to your personal baseline."
            )

    for pattern in patterns:

        insights.append(pattern["description"])

    if not insights:
        insights.append(
            "No meaningful changes or patterns were detected."
        )

    return {
        "main_insight": insights[0],
        "all_insights": insights,
        "confidence": confidence
    }
