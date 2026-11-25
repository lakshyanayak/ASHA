from backend.data.data_loader import load_wellness_data
from backend.data.baseline import calculate_baseline


records = load_wellness_data("data/sample_data.csv")

baseline = calculate_baseline(records)

print("USER BASELINE")
print("----------------")

for metric, value in baseline.items():
    print(f"{metric}: {value:.2f}")