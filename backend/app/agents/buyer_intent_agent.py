def analyze_buyer_intent(transcript, prompt=None):

    transcript_lower = transcript.lower()

    signals = []

    keywords = [
        "price",
        "budget",
        "loan",
        "emi",
        "site visit",
        "booking",
        "interested",
        "purchase"
    ]

    for keyword in keywords:
        if keyword in transcript_lower:
            signals.append(f"Customer mentioned {keyword}")

    if len(signals) == 0:
        signals.append("No strong buyer intent detected")

    return signals