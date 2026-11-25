
def generate_nudges(changes, patterns):

    nudges = []

    sleep_change = changes.get("sleep")

    if sleep_change and sleep_change["direction"] == "decreased":
        nudges.append(
            "Consider starting your wind-down routine a little earlier."
        )

    for pattern in patterns:

        if pattern["pattern"] == "high_screen_time_and_low_sleep":
            if pattern["low_sleep_days"] >= 3:
                nudges.append(
                    "Try reducing late-night screen time and notice "
                    "whether your sleep improves."
                )

    if not nudges:
        nudges.append(
            "Keep observing your daily habits and wellness patterns."
        )

    return nudges
