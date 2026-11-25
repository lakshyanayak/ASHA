from backend.data.data_loader import load_wellness_data

records = load_wellness_data("data/sample_data.csv")

for record in records:
    print(record)