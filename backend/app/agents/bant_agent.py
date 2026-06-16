def analyze_bant(transcript, prompt=None):

    transcript_lower = transcript.lower()

    budget = "Mentioned" if "budget" in transcript_lower else "Not Mentioned"

    authority = "Present" if "family" in transcript_lower else "Unknown"

    need = "Strong" if "interested" in transcript_lower else "Weak"

    timeline = "Immediate" if "next week" in transcript_lower else "Flexible"

    return f"""
BANT Analysis

Budget: {budget}

Authority: {authority}

Need: {need}

Timeline: {timeline}
"""