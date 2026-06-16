def analyze_agent_score(transcript, prompt=None):

    transcript_lower = transcript.lower()

    score = 50

    positive_keywords = [
        "thank you",
        "explained",
        "help",
        "site visit",
        "details"
    ]

    for keyword in positive_keywords:
        if keyword in transcript_lower:
            score += 10

    if score > 100:
        score = 100

    return f"{score}/100"