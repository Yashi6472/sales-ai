from fastapi import APIRouter
from pydantic import BaseModel

from app.data.sample_transcripts import sample_transcripts

from app.graphs.post_meeting_graph import app_graph

router = APIRouter()


class CallRequest(BaseModel):
    id: int
    leadName: str
    leadType: str
    leadStage: str
    leadQuality: str
    callSummary: str
    analysisStatus: str

    selectedModules: dict
    prompts: dict


@router.post("/api/analyze-call")
def analyze_call(call: CallRequest):

    transcript = sample_transcripts.get(call.id, "")

    initial_state = {
        "transcript": transcript,

        "selected_modules": call.selectedModules,

        "prompts": call.prompts,
    }

    result = app_graph.invoke(initial_state)

    return {
        "message": f"Analysis completed for {call.leadName}",

        "summary": result["summary"],

        "transcript": transcript
        if call.selectedModules["transcript"]
        else "",

        "call_stage_analysis":
            result["call_stage_analysis"],

        "lead_quality":
            result["lead_quality"],

        "objections": result["objections"],

        "risk_flags": result["risks"],

        "buyer_signals": result["buyer_signals"],

        "agent_score": result["agent_score"],

        "deal_probability": result["deal_probability"],

        "bant_analysis": result["bant_analysis"]
    }