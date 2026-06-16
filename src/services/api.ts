import type { Lead, ModuleId } from "@/lib/leads-data";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

type BackendCall = {
  id: number;
  leadName: string;
  leadType: string;
  leadStage: string;
  leadQuality: string;
  callSummary: string;
  analysisStatus: string;
};

export type AnalysisResult = {
  message: string;
  summary: string;
  transcript: string;
  call_stage_analysis: string;
  lead_quality: string;
  objections: string[];
  risk_flags: string[];
  buyer_signals: string[];
  agent_score: string;
  deal_probability: number;
  bant_analysis: string;
};

const moduleMap: Record<ModuleId, string> = {
  summary: "summary",
  stage: "callStage",
  quality: "leadQuality",
  intent: "buyerSignals",
  objection: "objections",
  risk: "risks",
  probability: "dealProbability",
  bant: "bant",
  agent: "agentScore",
  transcript: "transcript",
};

const promptMap: Record<ModuleId, string> = {
  summary: "summary",
  stage: "callStage",
  quality: "leadQuality",
  intent: "buyerIntent",
  objection: "objections",
  risk: "risks",
  probability: "dealProbability",
  bant: "bant",
  agent: "agentScore",
  transcript: "transcript",
};

function normalizeQuality(value: string): Lead["quality"] {
  if (value === "Hot" || value === "Warm" || value === "Cold") return value;
  if (value === "High") return "Hot";
  if (value === "Medium") return "Warm";
  return "Cold";
}

function normalizeStage(value: string): Lead["stage"] {
  const stage = value.toLowerCase();
  if (stage.includes("application") || stage.includes("closing")) return "Closing";
  if (stage.includes("counselling") || stage.includes("qualification")) return "Qualification";
  if (stage.includes("visit")) return "Site Visit";
  if (stage.includes("negotiation")) return "Negotiation";
  return "Discovery";
}

function normalizeStatus(value: string): Lead["status"] {
  if (value === "Completed") return "Completed";
  if (value === "In Progress") return "In Progress";
  return "Pending";
}

export function backendCallToLead(call: BackendCall): Lead {
  return {
    id: String(call.id),
    name: call.leadName,
    type: call.leadType,
    stage: normalizeStage(call.leadStage),
    quality: normalizeQuality(call.leadQuality || call.leadType),
    summary: call.callSummary,
    status: normalizeStatus(call.analysisStatus),
    property: "Premium Property",
    budget: "To be qualified",
    callDuration: "Call transcript",
    agent: "Sales Agent",
  };
}

export async function getHealth() {
  const response = await fetch(`${API_URL}/api/health`);

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
}

export async function getPostCalls(): Promise<Lead[]> {
  const response = await fetch(`${API_URL}/api/post-calls`);

  if (!response.ok) {
    throw new Error("Could not load post-call leads");
  }

  const calls = (await response.json()) as BackendCall[];
  return calls.map(backendCallToLead);
}

export async function analyzeCall({
  lead,
  selected,
  prompts,
}: {
  lead: Lead;
  selected: Set<ModuleId>;
  prompts: Record<string, string>;
}): Promise<AnalysisResult> {
  const selectedModules = Object.fromEntries(
    Object.entries(moduleMap).map(([frontendId, backendId]) => [backendId, selected.has(frontendId as ModuleId)])
  );
  const backendPrompts = Object.fromEntries(
    Object.entries(promptMap).map(([frontendId, backendId]) => [backendId, prompts[frontendId] ?? ""])
  );

  const response = await fetch(`${API_URL}/api/analyze-call`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: Number(lead.id),
      leadName: lead.name,
      leadType: lead.type,
      leadStage: lead.stage,
      leadQuality: lead.quality,
      callSummary: lead.summary,
      analysisStatus: lead.status,
      selectedModules,
      prompts: backendPrompts,
    }),
  });

  if (!response.ok) {
    throw new Error("Analysis request failed");
  }

  return response.json();
}
