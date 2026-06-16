def analyze_objections(transcript, prompt=None):

    transcript_lower = transcript.lower()

    objections = []

    keywords = [
        "expensive",
        "high price",
        "not sure",
        "need time",
        "loan",
        "location issue",
        "small rooms"
    ]

    for keyword in keywords:
        if keyword in transcript_lower:
            objections.append(f"Customer objection: {keyword}")

    if len(objections) == 0:
        objections.append("No objections found")

    return objections