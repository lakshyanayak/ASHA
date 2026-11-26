
def detect_changes(baseline, recent_data):

    changes = {}

    for metric, normal in baseline.items():

        if metric not in recent_data:
            continue

        recent = recent_data[metric]

        if normal is None or recent is None:
            continue

        difference = round(recent - normal, 2)

        percentage = None
        if normal != 0:
            percentage = round((difference / normal) * 100, 2)

        if difference > 0:
            direction = "increased"
        elif difference < 0:
            direction = "decreased"
        else:
            direction = "unchanged"

        changes[metric] = {
            "baseline": normal,
            "recent": recent,
            "difference": difference,
            "percentage_change": percentage,
            "direction": direction
        }

    return changes
