
import csv
from pathlib import Path

from voice.elevenlabs_service import generate_asha_voice


# ==========================================
# 1. PROJECT CONFIGURATION
# ==========================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent

DEFAULT_CSV_PATH = PROJECT_ROOT / "data" / "sample_data.csv"

OUTPUT_DIR = PROJECT_ROOT / "voice" / "output"


# ==========================================
# 2. LOAD CSV DATA
# ==========================================

def load_analysis_data(csv_path=DEFAULT_CSV_PATH):
    """
    Load wellness records from the CSV dataset.
    """

    csv_path = Path(csv_path)

    if not csv_path.exists():
        raise FileNotFoundError(
            f"CSV file not found: {csv_path}"
        )

    with open(
        csv_path,
        "r",
        newline="",
        encoding="utf-8"
    ) as file:

        reader = csv.DictReader(file)

        required_columns = {
            "date",
            "sleep",
            "steps",
            "screen_time",
            "mood",
            "energy",
            "water",
            "exercise"
        }

        available_columns = set(reader.fieldnames or [])

        missing_columns = required_columns - available_columns

        if missing_columns:
            raise ValueError(
                f"Missing CSV columns: {missing_columns}"
            )

        rows = list(reader)

    if not rows:
        raise ValueError(
            "The CSV dataset contains no records."
        )

    return rows


# ==========================================
# 3. CALCULATE AVERAGES
# ==========================================

def get_average(rows, column):
    """
    Calculate the average of a numeric column.
    """

    values = []

    for row in rows:

        try:
            value = float(row[column])

            values.append(value)

        except (ValueError, TypeError, KeyError):
            continue

    if not values:
        return None

    return sum(values) / len(values)


# ==========================================
# 4. ANALYSE USER DATA
# ==========================================

def analyse_user_data(csv_path=DEFAULT_CSV_PATH):
    """
    Generate summary statistics from the dataset.
    """

    rows = load_analysis_data(csv_path)

    metrics = {}

    columns = [
        "sleep",
        "steps",
        "screen_time",
        "mood",
        "energy",
        "water",
        "exercise"
    ]

    for column in columns:

        metrics[column] = get_average(
            rows,
            column
        )

    dates = [
        row["date"]
        for row in rows
        if row.get("date")
    ]

    return {
        "total_days": len(rows),
        "start_date": min(dates) if dates else None,
        "end_date": max(dates) if dates else None,
        "averages": metrics
    }


# ==========================================
# 5. GENERATE ASHA'S TEXT RESPONSE
# ==========================================

def generate_asha_response(
    user_question,
    csv_path=DEFAULT_CSV_PATH
):
    """
    Generate a context-aware response using CSV data.
    """

    if not user_question or not user_question.strip():

        raise ValueError(
            "Please enter a question for Asha."
        )

    analysis = analyse_user_data(csv_path)

    averages = analysis["averages"]

    question = user_question.lower()

    metric_keywords = {

        "sleep": [
            "sleep",
            "slept",
            "rest"
        ],

        "steps": [
            "steps",
            "walking",
            "walk"
        ],

        "screen_time": [
            "screen time",
            "screen",
            "phone",
            "mobile"
        ],

        "mood": [
            "mood",
            "feeling",
            "feelings"
        ],

        "energy": [
            "energy",
            "tired",
            "fatigue"
        ],

        "water": [
            "water",
            "hydration",
            "drink"
        ],

        "exercise": [
            "exercise",
            "workout",
            "fitness"
        ]
    }

    selected_metric = None

    for metric, keywords in metric_keywords.items():

        if any(
            keyword in question
            for keyword in keywords
        ):

            selected_metric = metric
            break

    # --------------------------------------
    # RESPOND TO A SPECIFIC METRIC QUESTION
    # --------------------------------------

    if selected_metric:

        average = averages[selected_metric]

        if average is None:

            response = (
                f"I couldn't find enough recorded "
                f"{selected_metric.replace('_', ' ')} "
                f"data to answer your question."
            )

        else:

            metric_name = selected_metric.replace(
                "_", " "
            )

            response = (
                f"Based on your {analysis['total_days']} "
                f"recorded days, your average "
                f"{metric_name} value is {average:.2f}. "
                f"This is a summary of your recorded "
                f"data. You can ask me about another "
                f"wellness metric too."
            )

    # --------------------------------------
    # RESPOND WITH A GENERAL SUMMARY
    # --------------------------------------

    else:

        summary_parts = []

        for metric, value in averages.items():

            if value is not None:

                summary_parts.append(
                    f"{metric.replace('_', ' ')} "
                    f"averaged {value:.2f}"
                )

        response = (
            f"Here's your wellness summary based on "
            f"{analysis['total_days']} recorded days. "
            + ". ".join(summary_parts)
            + ". You can ask me about sleep, steps, "
              "screen time, mood, energy, water "
              "or exercise."
        )

    return response


# ==========================================
# 6. CONNECT ELEVENLABS VOICE SERVICE
# ==========================================

def speak_from_csv(
    user_question,
    csv_path=DEFAULT_CSV_PATH,
    output_filename="asha_live_insight.mp3",
    include_voice=True
):
    """
    Generate Asha's text response and optional audio.
    """

    # Generate contextual text response

    response_text = generate_asha_response(
        user_question=user_question,
        csv_path=csv_path
    )

    audio_path = None

    # Generate ElevenLabs speech

    if include_voice:

        OUTPUT_DIR.mkdir(
            parents=True,
            exist_ok=True
        )

        audio_path = generate_asha_voice(
            text=response_text,
            output_filename=output_filename
        )

    return {
        "text": response_text,
        "audio_path": audio_path
    }


# ==========================================
# 7. TEST ASHA VOICE ENGINE
# ==========================================

if __name__ == "__main__":

    print("\n================================")
    print("       ASHA VOICE ENGINE")
    print("================================\n")

    question = input(
        "Ask Asha a question: "
    )

    try:

        result = speak_from_csv(
            user_question=question,
            include_voice=True
        )

        print("\nASHA'S RESPONSE:")
        print(result["text"])

        if result["audio_path"]:

            print("\nAUDIO GENERATED SUCCESSFULLY:")
            print(result["audio_path"])

        print("\n================================")
        print("       TEST COMPLETED")
        print("================================")

    except Exception as error:

        print("\nERROR:")
        print(error)
