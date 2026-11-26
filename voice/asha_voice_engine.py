
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

    valid_rows = [
        row for row in rows
        if row.get("date")
    ]

    latest_row = (
        max(valid_rows, key=lambda row: row["date"])
        if valid_rows else rows[-1]
    )

    dates = [
        row["date"]
        for row in valid_rows
    ]

    latest = {}

    for column in columns:

        try:
            latest[column] = float(latest_row[column])

        except (ValueError, TypeError, KeyError):
            latest[column] = None

    return {
        "total_days": len(rows),
        "start_date": min(dates) if dates else None,
        "end_date": max(dates) if dates else None,
        "averages": metrics,
        "latest": latest
    }


# ==========================================
# 5. GENERATE PERSONAL WELLNESS INTERPRETATIONS
# ==========================================

def get_interpretation(metric, value):
    """
    Generate caring and relevant wellness suggestions.
    These are general wellness suggestions, not diagnoses.
    """

    if metric == "sleep":

        if value < 8:
            return (
                "Your average sleep is a little below the "
                "usual recommended 8 to 10 hours for teenagers. "
                "Try maintaining a consistent bedtime and "
                "winding down a little earlier tonight. "
                "Getting enough rest can support your mood "
                "and energy. Take care of yourself!"
            )

        elif value <= 10:
            return (
                "Your sleeping hours are within the usual "
                "recommended range for teenagers. Your sleep "
                "routine looks good based on these records. "
                "Keep giving yourself enough time to rest. "
                "You're doing well!"
            )

        else:
            return (
                "Your recorded sleep average is above the "
                "usual recommended range. Pay attention to "
                "how rested and energetic you feel, and "
                "maintain a consistent sleep routine."
            )

    elif metric == "steps":

        return (
            "Your activity has been recorded. Remember that "
            "regular movement can support your well-being. "
            "Choose activities you enjoy, such as walking "
            "or stretching, and give yourself enough time "
            "to relax and recover too."
        )

    elif metric == "screen_time":

        if value > 6:
            return (
                "Your recorded screen time is on the higher "
                "side. Try taking short breaks between screen "
                "sessions and spending some relaxing time "
                "away from your devices. Remember to rest "
                "your eyes too!"
            )

        return (
            "Your recorded screen time looks relatively "
            "moderate. Keep taking regular breaks and "
            "balancing screen activities with other "
            "things you enjoy."
        )

    elif metric == "water":

        if value < 2:
            return (
                "Your recorded average water intake is "
                "relatively low compared with your other "
                "recorded days. Try keeping a water bottle "
                "nearby and drinking regularly throughout "
                "the day. Your hydration needs vary with "
                "your activity, weather and individual needs. "
                "Remember to listen to your body!"
            )

        return (
            "Your recorded water intake shows that you have "
            "been drinking water regularly. Keep water "
            "accessible throughout the day and drink "
            "according to your thirst and activity."
        )

    elif metric == "mood":

        if value >= 7:
            return (
                "Your recorded mood average looks positive. "
                "That's lovely to see! Keep making time for "
                "activities, hobbies and people that help "
                "you feel supported and comfortable."
            )

        elif value >= 4:
            return (
                "Your mood average suggests you may have "
                "experienced some mixed days. Be gentle "
                "with yourself. Take breaks, enjoy activities "
                "you like and consider talking to someone "
                "you trust if you need support."
            )

        return (
            "It looks like some of your recorded days may "
            "have been difficult. Your feelings matter, "
            "and you don't have to manage everything alone. "
            "Take things one step at a time and consider "
            "talking to someone you trust."
        )

    elif metric == "energy":

        if value >= 7:
            return (
                "Your recorded energy average looks positive. "
                "Keep balancing your daily activities with "
                "enough rest, regular meals and enjoyable "
                "breaks."
            )

        return (
            "Your recorded energy average is on the lower "
            "side. Try maintaining regular meals, a "
            "consistent sleep routine and gentle activities. "
            "If low energy continues or concerns you, "
            "consider speaking with a healthcare professional."
        )

    elif metric == "exercise":

        return (
            "Keep choosing enjoyable ways to move your body. "
            "You don't need to push yourself every day. "
            "Rest and recovery are important parts of "
            "looking after yourself too."
        )

    return (
        "Keep paying attention to your daily habits "
        "and take small, manageable steps towards "
        "your well-being."
    )


# ==========================================
# 6. GENERATE ASHA'S TEXT RESPONSE
# ==========================================

def generate_asha_response(
    user_question,
    csv_path=DEFAULT_CSV_PATH
):
    """
    Generate a personalised and caring response
    using the user's recorded wellness data.
    """

    if not user_question or not user_question.strip():

        raise ValueError(
            "Please enter a question for Asha."
        )

    analysis = analyse_user_data(csv_path)

    averages = analysis["averages"]
    latest = analysis["latest"]

    question = user_question.lower()

    metric_keywords = {

        "sleep": [
            "sleep",
            "slept",
            "sleeping",
            "rest"
        ],

        "steps": [
            "steps",
            "walking",
            "walk",
            "activity"
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

    # ======================================
    # SPECIFIC METRIC RESPONSE
    # ======================================

    if selected_metric:

        average = averages[selected_metric]
        latest_value = latest[selected_metric]

        if average is None:

            response = (
                f"I couldn't find enough recorded "
                f"{selected_metric.replace('_', ' ')} "
                f"data to answer your question. "
                "That's okay! You can ask me about "
                "another wellness topic."
            )

        else:

            metric_name = selected_metric.replace(
                "_", " "
            )

            interpretation = get_interpretation(
                selected_metric,
                average
            )

            # Add appropriate measurement units.

            unit = ""

            if selected_metric == "sleep":
                unit = " hours"

            elif selected_metric == "steps":
                unit = " steps"

            elif selected_metric == "water":
                unit = " litres"

            elif selected_metric == "screen_time":
                unit = " hours"

            elif selected_metric == "exercise":
                unit = " minutes"

            # Show the latest value when available.

            latest_message = ""

            if latest_value is not None:

                latest_message = (
                    f" Your latest recorded {metric_name} "
                    f"value is {latest_value:.2f}{unit}."
                )

            response = (
                f"Based on your {analysis['total_days']} "
                f"recorded days, your average {metric_name} "
                f"is {average:.2f}{unit}."
                f"{latest_message} "
                f"{interpretation}"
            )

    # ======================================
    # GENERAL WELLNESS SUMMARY
    # ======================================

    else:

        summary_parts = []

        for metric, value in averages.items():

            if value is not None:

                metric_name = metric.replace("_", " ")

                unit = ""

                if metric == "sleep":
                    unit = " hours"

                elif metric == "steps":
                    unit = " steps"

                elif metric == "water":
                    unit = " litres"

                elif metric == "screen_time":
                    unit = " hours"

                elif metric == "exercise":
                    unit = " minutes"

                summary_parts.append(
                    f"{metric_name} averaged "
                    f"{value:.2f}{unit}"
                )

        response = (
            f"Hello! Here's your wellness summary based "
            f"on {analysis['total_days']} recorded days. "
            + ". ".join(summary_parts)
            + ". "
            "Remember, your well-being is about more "
            "than numbers. Keep a balanced routine, "
            "stay hydrated, make time for rest and "
            "be kind to yourself. "
            "I'm here to help you understand your habits "
            "one step at a time!"
        )

    return response


# ==========================================
# 7. CONNECT ELEVENLABS VOICE SERVICE
# ==========================================

def speak_from_csv(
    user_question,
    csv_path=DEFAULT_CSV_PATH,
    output_filename="asha_live_insight.mp3",
    include_voice=True
):
    """
    Generate Asha's text response first.

    Voice generation is optional.
    If ElevenLabs fails or has insufficient credits,
    the text response will still be returned.
    """

    # --------------------------------------
    # STEP 1: GENERATE TEXT RESPONSE
    # --------------------------------------

    response_text = generate_asha_response(
        user_question=user_question,
        csv_path=csv_path
    )

    audio_path = None
    voice_error = None

    # --------------------------------------
    # STEP 2: GENERATE VOICE SEPARATELY
    # --------------------------------------

    if include_voice:

        try:

            OUTPUT_DIR.mkdir(
                parents=True,
                exist_ok=True
            )

            audio_path = generate_asha_voice(
                text=response_text,
                output_filename=output_filename
            )

        except Exception as error:

            print(
                "Asha voice generation unavailable:",
                str(error)
            )

            voice_error = str(error)

            # Do not interrupt the text response.
            audio_path = None

    # --------------------------------------
    # STEP 3: RETURN TEXT AND AUDIO STATUS
    # --------------------------------------

    return {
        "text": response_text,
        "audio_path": audio_path,
        "voice_error": voice_error
    }


# ==========================================
# 8. TEST ASHA VOICE ENGINE
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

        elif result["voice_error"]:

            print("\nVOICE GENERATION UNAVAILABLE:")
            print(result["voice_error"])

            print(
                "\nAsha's text response is still available."
            )

        print("\n================================")
        print("       TEST COMPLETED")
        print("================================")

    except Exception as error:

        print("\nERROR:")
        print(error)
