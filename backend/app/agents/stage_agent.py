def analyze_stage(transcript):

    transcript_lower = transcript.lower()

    if "site visit" in transcript_lower:
        return "Site Visit Stage"

    elif "application" in transcript_lower:
        return "Application Stage"

    elif "interested" in transcript_lower:
        return "Interested Stage"

    elif "negotiation" in transcript_lower:
        return "Negotiation Stage"

    else:
        return "Initial Discussion Stage"