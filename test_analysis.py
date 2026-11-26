
from backend.analysis.change_detector import detect_changes
from backend.analysis.pattern_detector import detect_patterns
from backend.analysis.confidence import calculate_confidence
from backend.analysis.insight_generator import generate_insights
from backend.analysis.nudge_generator import generate_nudges


# Personal baseline
baseline = {
    "sleep": 7.2
}

# Recent average
recent = {
    "sleep": 6.4
}

# Sample daily wellness data
data = [
    {"screen_time": 3, "sleep": 6},
    {"screen_time": 4, "sleep": 6.5},
    {"screen_time": 1, "sleep": 8},
    {"screen_time": 3, "sleep": 6.2},
    {"screen_time": 4, "sleep": 7},
]


# 1. Detect changes
changes = detect_changes(baseline, recent)


# 2. Detect patterns
patterns = detect_patterns(data, 2, 7.2)


# 3. Calculate confidence using actual pattern results
if patterns:
    confidence = calculate_confidence(
        patterns[0]["high_screen_days"],
        patterns[0]["low_sleep_days"]
    )
else:
    confidence = calculate_confidence(0, 0)


# 4. Generate insights
insights = generate_insights(
    changes, patterns, confidence
)


# 5. Generate nudges
nudges = generate_nudges(
    changes, patterns
)


# Display final results
print("\n----- ASHA ANALYSIS RESULTS -----")

print("\nCHANGES:")
print(changes)

print("\nPATTERNS:")
print(patterns)

print("\nCONFIDENCE:")
print(confidence)

print("\nINSIGHTS:")
print(insights)

print("\nNUDGES:")
print(nudges)
