export type LeadQuality = "Hot" | "Warm" | "Cold";
export type LeadStage = "Discovery" | "Qualification" | "Site Visit" | "Negotiation" | "Closing";
export type AnalysisStatus = "Pending" | "In Progress" | "Completed";

export interface Lead {
  id: string;
  name: string;
  type: string;
  stage: LeadStage;
  quality: LeadQuality;
  summary: string;
  status: AnalysisStatus;
  property: string;
  budget: string;
  callDuration: string;
  agent: string;
}

export const leads: Lead[] = [
  {
    id: "L-1042",
    name: "Aarav Mehta",
    type: "Luxury Villa Buyer",
    stage: "Negotiation",
    quality: "Hot",
    summary: "High intent buyer evaluating 4BHK villa in Whitefield. Comparing two options, ready to close within 2 weeks.",
    status: "Completed",
    property: "Prestige Lakeside Habitat",
    budget: "₹4.2 Cr",
    callDuration: "18:42",
    agent: "Priya S.",
  },
  {
    id: "L-1043",
    name: "Sophia Laurent",
    type: "International Investor",
    stage: "Site Visit",
    quality: "Hot",
    summary: "NRI investor scheduled premium tour. Interested in oceanfront penthouse with rental yield projections.",
    status: "Pending",
    property: "Oberoi Sky Residences",
    budget: "$2.1M",
    callDuration: "24:15",
    agent: "Rohan K.",
  },
  {
    id: "L-1044",
    name: "Vikram Singh",
    type: "First-Time Buyer",
    stage: "Qualification",
    quality: "Warm",
    summary: "Young executive exploring 2BHK options. Needs financing guidance and home loan pre-approval.",
    status: "Pending",
    property: "Lodha Park",
    budget: "₹1.8 Cr",
    callDuration: "12:08",
    agent: "Priya S.",
  },
  {
    id: "L-1045",
    name: "Elena Rodriguez",
    type: "Luxury Apartment Buyer",
    stage: "Discovery",
    quality: "Warm",
    summary: "Exploring premium downtown apartments. Strong interest but budget concerns. Wants amenity walkthrough.",
    status: "In Progress",
    property: "DLF Camellias",
    budget: "₹6.5 Cr",
    callDuration: "21:33",
    agent: "Arjun M.",
  },
  {
    id: "L-1046",
    name: "Rajesh Iyer",
    type: "Portfolio Investor",
    stage: "Closing",
    quality: "Hot",
    summary: "Repeat client purchasing 3rd property. Final paperwork pending, asking about tax implications.",
    status: "Completed",
    property: "Embassy One",
    budget: "₹8.9 Cr",
    callDuration: "32:21",
    agent: "Rohan K.",
  },
  {
    id: "L-1047",
    name: "Hannah Chen",
    type: "Relocation Buyer",
    stage: "Discovery",
    quality: "Cold",
    summary: "Initial inquiry about gated community. Timeline 6+ months, currently in early research phase.",
    status: "Pending",
    property: "Brigade Cornerstone",
    budget: "₹2.4 Cr",
    callDuration: "08:50",
    agent: "Priya S.",
  },
];

export const moduleCatalog = [
  { id: "summary", name: "Summary", icon: "FileText", description: "Concise AI summary of the entire call with key takeaways." },
  { id: "stage", name: "Call Stage Analysis", icon: "GitBranch", description: "Identify where the conversation sits in the sales funnel." },
  { id: "quality", name: "Lead Quality", icon: "Gem", description: "Score lead quality based on engagement and signals." },
  { id: "intent", name: "Buyer Intent", icon: "Target", description: "Detect buying signals and urgency from speech patterns." },
  { id: "objection", name: "Objection Intelligence", icon: "ShieldAlert", description: "Surface objections raised and how they were handled." },
  { id: "risk", name: "Risk Intelligence", icon: "AlertTriangle", description: "Flag deal risks, red flags and churn indicators." },
  { id: "probability", name: "Deal Probability", icon: "TrendingUp", description: "Predictive deal-close probability with reasoning." },
  { id: "bant", name: "BANT Analysis", icon: "ClipboardCheck", description: "Budget, Authority, Need, Timeline framework breakdown." },
  { id: "agent", name: "Agent Performance Score", icon: "Award", description: "Score agent on tone, listening, pitching and closing." },
  { id: "transcript", name: "Transcript Viewer", icon: "MessageSquare", description: "Searchable, speaker-tagged full call transcript." },
] as const;

export type ModuleId = (typeof moduleCatalog)[number]["id"];

export const defaultPrompts: Record<ModuleId, string> = {
  summary: "Generate a concise 4-6 sentence executive summary of the call, highlighting the buyer's intent, property of interest, key concerns, and next steps.",
  stage: "Analyze the conversation and determine the current sales stage (Discovery, Qualification, Site Visit, Negotiation, Closing). Justify with quotes.",
  quality: "Rate the lead quality (Hot/Warm/Cold) based on engagement signals, financial readiness, and timeline. Provide a 0-100 score.",
  intent: "Identify buyer intent signals: urgency phrases, decision-maker indicators, comparison shopping behavior, and emotional commitment.",
  objection: "List every objection raised during the call. For each: classify type (price, location, amenity, timing, trust) and rate handling 1-5.",
  risk: "Surface deal risks including financing uncertainty, competitor mentions, family hesitation, and post-call ghosting indicators.",
  probability: "Predict close probability (0-100%) with three weighted factors and one risk caveat. Suggest the next best action.",
  bant: "Break down Budget, Authority, Need and Timeline. For each: extract evidence quotes and assign a 1-5 confidence score.",
  agent: "Score the agent across tone, active listening, pitch clarity, objection handling and closing. Provide one strength and one coaching tip.",
  transcript: "Produce a clean, speaker-tagged transcript with timestamps every 30 seconds.",
};
