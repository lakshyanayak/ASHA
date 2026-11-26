
def detect_patterns(data, screen_limit=2, sleep_baseline=7.2):

    patterns = []

    high_screen_days = 0
    low_sleep_days = 0

    for day in data:

        screen = day.get("screen_time")
        sleep = day.get("sleep")

        if screen is None or sleep is None:
            continue

        if screen > screen_limit:
            high_screen_days += 1

            if sleep < sleep_baseline:
                low_sleep_days += 1

    if high_screen_days > 0:

        percentage = round(
            (low_sleep_days / high_screen_days) * 100, 2
        )

        patterns.append({
            "pattern": "high_screen_time_and_low_sleep",
            "high_screen_days": high_screen_days,
            "low_sleep_days": low_sleep_days,
            "percentage": percentage,
            "description": (
                f"On {low_sleep_days} of {high_screen_days} "
                "high screen-time days, sleep was below baseline."
            )
        })

    return patterns
