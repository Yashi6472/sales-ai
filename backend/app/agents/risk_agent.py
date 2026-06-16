def analyze_risks(transcript, prompt=None):

    transcript_lower = transcript.lower()

    risks = []

    keywords = [
        "too expensive",
        "not interested",
        "later",
        "need time",
        "other project",
        "high price",
        "loan issue"
    ]

    for keyword in keywords:
        if keyword in transcript_lower:
            risks.append(f"Risk detected: {keyword}")

    if len(risks) == 0:
        risks.append("No major risks detected")

    return risks