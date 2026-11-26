from backend.data.data_loader import load_wellness_data
from backend.data.baseline import calculate_baseline, detect_deviations


# Load historical wellness data
records = load_wellness_data("data/sample_data.csv")

# Calculate user's normal baseline
baseline = calculate_baseline(records)

# Use the latest record as today's data
current_data = records[-1]

# Compare today's data with the baseline
deviations = detect_deviations(current_data, baseline)

print("TODAY'S DATA")
print("----------------")

print(current_data)

print("\nDEVIATIONS")
print("----------------")

if deviations:
    for metric, details in deviations.items():
        print(
            f"{metric}: "
            f"{details['current']} "
            f"vs baseline {details['baseline']:.2f} "
            f"({details['percentage_change']:.2f}%)"
        )
else:
    print("No significant deviations detected.")