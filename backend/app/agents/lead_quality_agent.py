def analyze_lead_quality(transcript):

    transcript_lower = transcript.lower()

    positive_signals = [
        "budget",
        "site visit",
        "interested",
        "booking",
        "purchase",
        "investment"
    ]

    score = 0

    for signal in positive_signals:
        if signal in transcript_lower:
            score += 1

    if score >= 4:
        return "Hot Lead"

    elif score >= 2:
        return "Warm Lead"

    else:
        return "Cold Lead"