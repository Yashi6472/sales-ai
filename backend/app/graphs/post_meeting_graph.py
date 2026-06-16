from typing import TypedDict

from langgraph.graph import StateGraph, END

from app.agents.summary_agent import generate_summary
from app.agents.stage_agent import analyze_stage
from app.agents.lead_quality_agent import analyze_lead_quality
from app.agents.objection_agent import analyze_objections
from app.agents.risk_agent import analyze_risks
from app.agents.buyer_intent_agent import analyze_buyer_intent
from app.agents.agent_scoring_agent import analyze_agent_score
from app.agents.bant_agent import analyze_bant
from app.agents.deal_probability_agent import analyze_deal_probability
from app.agents.property_sales_scoring_agent import analyze_property_sales_score

# STATE

class GraphState(TypedDict):

    transcript: str

    selected_modules: dict

    prompts: dict

    summary: str

    call_stage_analysis: str

    lead_quality: str

    objections: list

    risks: list

    buyer_signals: list

    bant_analysis: str

    deal_probability: int

    agent_score: str


# NODES

def summary_node(state):

    if not state["selected_modules"]["summary"]:

        return {
            "summary": "Summary module skipped"
        }

    summary = generate_summary(
        state["transcript"],
        state["prompts"]["summary"]
    )

    return {
        "summary": summary
    }


def stage_node(state):

    if not state["selected_modules"]["callStage"]:

        return {
            "call_stage_analysis": "Stage module skipped"
        }

    stage = analyze_stage(
        state["transcript"]
    )

    return {
        "call_stage_analysis": stage
    }


def lead_quality_node(state):

    if not state["selected_modules"]["leadQuality"]:

        return {
            "lead_quality": "Lead quality module skipped"
        }

    quality = analyze_lead_quality(
        state["transcript"]
    )

    return {
        "lead_quality": quality
    }


def objection_node(state):

    if not state["selected_modules"]["objections"]:

        return {
            "objections": ["Objection module skipped"]
        }

    objections = analyze_objections(
        state["transcript"],
        state["prompts"]["objections"]
    )

    return {
        "objections": objections
    }


def risk_node(state):

    if not state["selected_modules"]["risks"]:

        return {
            "risks": ["Risk module skipped"]
        }

    risks = analyze_risks(
        state["transcript"],
        state["prompts"]["risks"]
    )

    return {
        "risks": risks
    }


def buyer_intent_node(state):

    if not state["selected_modules"]["buyerSignals"]:

        return {
            "buyer_signals": ["Buyer intent skipped"]
        }

    signals = analyze_buyer_intent(
        state["transcript"],
        state["prompts"]["buyerIntent"]
    )

    return {
        "buyer_signals": signals
    }


def bant_node(state):

    if not state["selected_modules"]["bant"]:

        return {
            "bant_analysis": "BANT analysis skipped"
        }

    bant_result = analyze_bant(
        state["transcript"]
    )

    return {
        "bant_analysis": bant_result
    }


def deal_probability_node(state):

    if not state["selected_modules"]["dealProbability"]:

        return {
            "deal_probability": 0
        }

    probability = analyze_deal_probability(
        state["bant_analysis"]
    )

    return {
        "deal_probability": probability
    }


def agent_score_node(state):

    if not state["selected_modules"]["agentScore"]:

        return {
            "agent_score": "Agent scoring skipped"
        }

    score = analyze_property_sales_score(
        state["transcript"],
        state["prompts"]["agentScore"]
    )

    return {
        "agent_score": score
    }


# GRAPH

graph = StateGraph(GraphState)


# ADD NODES

graph.add_node("summary", summary_node)

graph.add_node("stage", stage_node)

graph.add_node("lead_quality", lead_quality_node)

graph.add_node("objection", objection_node)

graph.add_node("risk", risk_node)

graph.add_node("buyer_intent", buyer_intent_node)

graph.add_node("bant", bant_node)

graph.add_node("deal_probability", deal_probability_node)

graph.add_node("agent_score", agent_score_node)


# ENTRY

graph.set_entry_point("summary")


# EDGES

graph.add_edge("summary", "stage")

graph.add_edge("stage", "lead_quality")

graph.add_edge("lead_quality", "objection")

graph.add_edge("objection", "risk")

graph.add_edge("risk", "buyer_intent")

graph.add_edge("buyer_intent", "bant")

graph.add_edge("bant", "deal_probability")

graph.add_edge("deal_probability", "agent_score")

graph.add_edge("agent_score", END)


# COMPILE

app_graph = graph.compile()