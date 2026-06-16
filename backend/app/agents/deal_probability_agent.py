def analyze_deal_probability(transcript):

    transcript_lower = transcript.lower()

    score = 0

    positive_words = [
        "interested",
        "site visit",
        "booking",
        "purchase",
        "budget",
        "loan approved"
    ]

    for word in positive_words:
        if word in transcript_lower:
            score += 15

    probability = min(score, 100)

    return probability