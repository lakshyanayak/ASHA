from dataclasses import dataclass
from datetime import date


@dataclass
class WellnessData:
    date: date
    sleep: float
    steps: int
    screen_time: float
    mood: float
    energy: float
    water: float
    exercise: float