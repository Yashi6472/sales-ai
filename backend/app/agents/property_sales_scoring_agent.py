def analyze_property_sales_score(transcript, prompt=None):

    transcript_lower = transcript.lower()

    score = 0

    # Positive buying indicators
    positive_keywords = [
        "interested",
        "site visit",
        "budget",
        "booking",
        "purchase",
        "loan approved",
        "investment",
        "ready"
    ]

    # Negative indicators
    negative_keywords = [
        "expensive",
        "not interested",
        "later",
        "need time",
        "other project",
        "loan issue"
    ]

    # Add score
    for keyword in positive_keywords:
        if keyword in transcript_lower:
            score += 10

    # Reduce score
    for keyword in negative_keywords:
        if keyword in transcript_lower:
            score -= 5

    # Clamp score
    if score < 0:
        score = 0

    if score > 100:
        score = 100

    # Rating logic
    if score >= 80:
        rating = "Excellent"

    elif score >= 60:
        rating = "Good"

    elif score >= 40:
        rating = "Average"

    else:
        rating = "Poor"

    return {
        "score": score,
        "rating": rating
    }