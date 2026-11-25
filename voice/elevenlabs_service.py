import os
from pathlib import Path
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs

load_dotenv()

# Sarah - built-in free premade voice on ElevenLabs (warm, natural tone for Asha)
DEFAULT_VOICE_ID = "EXAVITQu4vr4xnSDxMaL"
DEFAULT_MODEL_ID = "eleven_multilingual_v2"


def generate_asha_voice(
    text: str,
    output_filename: str = "asha_response.mp3",
    voice_id: str = DEFAULT_VOICE_ID,
) -> str:
    """
    Converts Asha's text response into a spoken MP3 file using ElevenLabs.
    Returns the path to the generated audio file.
    """
    api_key = os.getenv("ELEVENLABS_API_KEY")
    if not api_key or api_key.startswith("sk_your"):
        raise ValueError("Missing valid ELEVENLABS_API_KEY in .env file.")

    client = ElevenLabs(api_key=api_key)

    output_dir = Path(__file__).parent / "output"
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / output_filename

    audio_stream = client.text_to_speech.convert(
        text=text,
        voice_id=voice_id,
        model_id=DEFAULT_MODEL_ID,
        output_format="mp3_44100_128",
    )

    with open(output_path, "wb") as f:
        for chunk in audio_stream:
            if chunk:
                f.write(chunk)

    return str(output_path)


if __name__ == "__main__":
    sample_insight = (
        "Good morning! You've slept 45 minutes less than your usual baseline "
        "for the last three nights, and your late-night screen time was higher. "
        "Consider winding down a little earlier tonight."
    )
    saved_file = generate_asha_voice(sample_insight, "demo_insight.mp3")
    print(f"Success! Asha's voice saved to: {saved_file}")
