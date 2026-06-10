import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft, Download, Search, Phone, MessageCircle, Bell, FileText,
  MapPin, Home, Wallet, Calendar, Clock, Flame, Target, ChevronDown,
  Check, X, AlertTriangle, ShieldAlert, Sparkles, TrendingUp, Award,
  ClipboardCheck, GitBranch, Heart, CheckCircle2, Circle,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { leads } from "@/lib/leads-data";

export const Route = createFileRoute("/results/$leadId")({
  head: () => ({ meta: [{ title: "Call Intelligence Report — MaisonAI" }] }),
  component: ResultsPage,
});

/* ---------- Dummy data tied to the new spec ---------- */

type ParamStatus = "met" | "missed" | "opportunity";

interface StageParam {
  label: string;
  status: ParamStatus;
  timestamp?: string;
  quote?: string;
}

interface Stage {
  id: string;
  name: string;
  icon: typeof Sparkles;
  max: number;
  params: StageParam[];
  explanation: string;
  missed: string[];
}

const stages: Stage[] = [
  {
    id: "intro", name: "Introduction", icon: Sparkles, max: 4,
    params: [
      { label: "Greeting", status: "missed" },
      { label: "Agent Identity", status: "met", timestamp: "0:08", quote: "This is Avi calling from ABC Real Estate." },
      { label: "Context", status: "met", timestamp: "0:15", quote: "You had enquired about our Hinjewadi Phase 2 project." },
      { label: "Permission", status: "met", timestamp: "0:22", quote: "Is this a good time to talk?" },
    ],
    explanation: "Strong structured opening. Agent introduced themselves, established context and asked for permission before proceeding.",
    missed: ["Open with a warm greeting (Hello / Good Morning)"],
  },
  {
    id: "rapport", name: "Rapport Building", icon: Heart, max: 4,
    params: [
      { label: "Asked how customer is doing", status: "met", timestamp: "0:35", quote: "How have you been?" },
      { label: "Family Discussion", status: "missed" },
      { label: "Profession Discussion", status: "missed" },
      { label: "Warm Personalization", status: "met", timestamp: "0:52", quote: "Hope the family is keeping well." },
    ],
    explanation: "Agent attempted rapport building but missed opportunities to understand family and profession.",
    missed: ["Ask about family structure", "Ask about profession", "Understand lifestyle requirements"],
  },
  {
    id: "needs", name: "Needs Discovery", icon: Target, max: 7,
    params: [
      { label: "Location Preference", status: "met", timestamp: "1:12", quote: "My office is in Hinjewadi." },
      { label: "Configuration", status: "met", timestamp: "1:45", quote: "I am looking for a 3 BHK." },
      { label: "Budget", status: "met", timestamp: "2:30", quote: "I can go up to 1 Cr." },
      { label: "Timeline", status: "met", timestamp: "2:58", quote: "By 2027 is when I am looking." },
      { label: "Property Preference (New / Resale)", status: "opportunity" },
      { label: "Decision Maker", status: "missed" },
      { label: "Pain Point / Motivation", status: "met", timestamp: "3:20", quote: "I need a bigger place for the kids." },
    ],
    explanation: "Excellent qualification — captured location, budget, configuration and timeline. Did not identify decision-makers involved in the purchase.",
    missed: ["Confirm decision-maker (spouse / parents)", "Clarify new vs resale preference"],
  },
  {
    id: "pitch", name: "Product Pitch", icon: Home, max: 5,
    params: [
      { label: "Project Information", status: "met", timestamp: "4:32", quote: "Gold Coast launched in March 2026." },
      { label: "Location Benefits", status: "met", timestamp: "5:10", quote: "10 minutes to Airport, 5 minutes to Metro." },
      { label: "Amenities", status: "opportunity", timestamp: "5:48", quote: "We have a clubhouse and pool." },
      { label: "Configuration Details", status: "met", timestamp: "6:05", quote: "1880 to 2000 sq.ft 3 BHK options." },
      { label: "Pricing Clarity", status: "met", timestamp: "6:15", quote: "Around ₹9,500 per sq.ft." },
    ],
    explanation: "Solid pitch covering project, pricing and location benefits. Amenities mentioned briefly — could expand on kids/sports areas given customer's family context.",
    missed: ["Deep-dive amenities relevant to children", "Highlight investment / resale velocity"],
  },
  {
    id: "commercial", name: "Commercial Discussion", icon: Wallet, max: 4,
    params: [
      { label: "Price Discussion", status: "met", timestamp: "6:15", quote: "₹9,500 per sq.ft." },
      { label: "Payment Plan", status: "met", timestamp: "7:02", quote: "Construction-linked 20:80 plan available." },
      { label: "EMI Discussion", status: "missed" },
      { label: "Loan Assistance", status: "opportunity", timestamp: "7:30", quote: "We have partner banks." },
    ],
    explanation: "Pricing and plan covered well. Did not personalize EMI or proactively offer loan assistance walkthrough.",
    missed: ["Walk through indicative EMI on 1 Cr", "Offer banker connect call"],
  },
  {
    id: "closing", name: "Closing & Next Step", icon: CheckCircle2, max: 4,
    params: [
      { label: "Site Visit Scheduled", status: "met", timestamp: "10:25", quote: "Can we meet Saturday at 6 PM?" },
      { label: "Follow-Up Date Confirmed", status: "met", timestamp: "10:48", quote: "I'll call you Friday evening to confirm." },
      { label: "WhatsApp Sharing Commitment", status: "met", timestamp: "11:10", quote: "I'll WhatsApp the brochure tonight." },
      { label: "Next Action Confirmed", status: "opportunity" },
    ],
    explanation: "Strong closing with site visit and follow-up locked in. Next action stack could be tighter.",
    missed: ["Confirm exact attendees for site visit"],
  },
];

const qualification = [
  { label: "Location Fit", value: "Strong Match", note: "Customer works in Hinjewadi · Project in Hinjewadi", status: "met" as ParamStatus },
  { label: "Budget Fit", value: "Strong Match", note: "Customer ₹1 Cr · Project ₹95L – ₹98L", status: "met" as ParamStatus },
  { label: "Configuration Fit", value: "Exact Match", note: "Customer 3 BHK · Project 3 BHK", status: "met" as ParamStatus },
  { label: "Timeline Fit", value: "Long Horizon", note: "Target purchase 2027 — reduced urgency", status: "opportunity" as ParamStatus },
  { label: "Family Fit", value: "Aligned", note: "School-going child · Working spouse — proximity matches", status: "met" as ParamStatus },
];

const objections = [
  { type: "Connectivity Concern", t: "4:55", q: "Is the location connected to the rest of Pune?", status: "handled" },
  { type: "Hidden Cost Concern", t: "8:30", q: "Does parking come in the quoted price?", status: "partial" },
  { type: "Trust / Cancellation", t: "9:15", q: "What happens if I cancel later?", status: "handled" },
  { type: "Information Seeking", t: "7:50", q: "What floor options are available?", status: "handled" },
];

const risks = [
  { title: "Decision Maker Not Identified", severity: "Low", note: "Spouse not on call — secondary approver unconfirmed." },
  { title: "Builder Credibility Not Discussed", severity: "Low", note: "No RERA / track record signals shared." },
];

const compliance = [
  { label: "Pricing Transparency", status: "met" as ParamStatus, t: "6:15", q: "₹9,500 per sq.ft" },
  { label: "Cancellation Terms", status: "met" as ParamStatus, t: "9:40", q: "Cancellation before agreement has ₹50,000 deduction." },
  { label: "RERA Mention", status: "missed" as ParamStatus },
];

const behavioral = [
  { k: "Talk vs Listen Balance", v: "Medium" },
  { k: "Confidence & Clarity", v: "High" },
  { k: "Product Knowledge", v: "High" },
  { k: "Personalization", v: "Medium" },
  { k: "Trust Building", v: "Medium" },
  { k: "Closing Effectiveness", v: "High" },
];

const timeline = [
  { t: "00:05", label: "Introduction" },
  { t: "00:20", label: "Rapport Building" },
  { t: "01:15", label: "Needs Discovery" },
  { t: "03:45", label: "Budget Qualification" },
  { t: "04:32", label: "Product Pitch" },
  { t: "08:15", label: "Commercial Discussion" },
  { t: "10:25", label: "Closing" },
];

const commitments = [
  "Customer agreed for site visit",
  "Customer requested brochure",
  "Customer shared budget",
  "Customer confirmed timeline",
];

const transcript = [
  { t: "0:05", s: "Agent", text: "Hello Sir, I am Ravi from ABC Real Estate." },
  { t: "0:09", s: "Customer", text: "Hi Ravi." },
  { t: "0:15", s: "Agent", text: "You had enquired about our Gold Coast project." },
  { t: "0:22", s: "Agent", text: "Is this a good time to talk?" },
  { t: "0:35", s: "Customer", text: "Yes, please go ahead." },
  { t: "1:12", s: "Customer", text: "My office is in Hinjewadi, so I want something nearby." },
  { t: "1:45", s: "Customer", text: "I am looking for a 3 BHK." },
  { t: "2:30", s: "Customer", text: "I can go up to 1 Cr, slightly stretchable." },
  { t: "2:58", s: "Customer", text: "By 2027 is when I am looking to move in." },
  { t: "4:32", s: "Agent", text: "Gold Coast launched in March 2026. 10 minutes to airport, 5 minutes to metro." },
  { t: "6:15", s: "Agent", text: "Pricing is around ₹9,500 per sq.ft, 1880 – 2000 sq.ft options." },
  { t: "8:30", s: "Customer", text: "Does parking come in the quoted price?" },
  { t: "9:15", s: "Customer", text: "What happens if I cancel later?" },
  { t: "10:25", s: "Agent", text: "Can we meet Saturday at 6 PM for a site visit?" },
  { t: "10:30", s: "Customer", text: "Yes, Saturday works." },
];

/* ---------- Small UI primitives ---------- */

function StatusPill({ status }: { status: ParamStatus | "handled" | "partial" | "not-handled" }) {
  const map = {
    met: { cls: "bg-[color:var(--success)]/15 text-[color:var(--success)] border-[color:var(--success)]/30", icon: Check, label: "MET" },
    handled: { cls: "bg-[color:var(--success)]/15 text-[color:var(--success)] border-[color:var(--success)]/30", icon: Check, label: "HANDLED" },
    missed: { cls: "bg-destructive/15 text-destructive border-destructive/30", icon: X, label: "MISSED" },
    "not-handled": { cls: "bg-destructive/15 text-destructive border-destructive/30", icon: X, label: "NOT HANDLED" },
    opportunity: { cls: "bg-[color:var(--warning)]/15 text-[color:var(--warning)] border-[color:var(--warning)]/30", icon: AlertTriangle, label: "MISSED OPP." },
    partial: { cls: "bg-[color:var(--warning)]/15 text-[color:var(--warning)] border-[color:var(--warning)]/30", icon: AlertTriangle, label: "PARTIAL" },
  } as const;
  const m = map[status];
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${m.cls}`}>
      <Icon className="h-3 w-3" strokeWidth={3} /> {m.label}
    </span>
  );
}

function SectionHeader({ n, title, sub }: { n: number; title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <p className="text-[10px] uppercase tracking-[0.3em] text-gold/80">Section {n.toString().padStart(2, "0")}</p>
      <h2 className="font-display text-2xl md:text-3xl mt-1">{title}</h2>
      {sub && <p className="text-sm text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`glass rounded-2xl p-5 md:p-6 animate-fade-up ${className}`}>{children}</section>;
}

function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct = (score / max) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Stage Score</span>
        <span className="font-display text-lg">
          {score} <span className="text-muted-foreground text-sm">/ {max}</span>
        </span>
      </div>
      <div className="h-1.5 bg-foreground/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${pct >= 75 ? "bg-[color:var(--success)]" : pct >= 50 ? "bg-gold" : "bg-destructive"}`}
          style={{ width: `${pct}%`, transition: "width 1s ease-out" }}
        />
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

function ResultsPage() {
  const { leadId } = Route.useParams();
  const lead = leads.find((l) => l.id === leadId) ?? leads[0];

  const stageScores = useMemo(
    () => stages.map((s) => ({ id: s.id, score: s.params.filter((p) => p.status === "met").length, max: s.max })),
    []
  );
  const totalScore = stageScores.reduce((a, b) => a + b.score, 0);
  const totalMax = stageScores.reduce((a, b) => a + b.max, 0);
  const complianceScore = compliance.filter((c) => c.status === "met").length;

  const [search, setSearch] = useState("");
  const filteredTranscript = transcript.filter((l) => l.text.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageShell>
      <Link to="/analyze/$leadId" params={{ leadId: lead.id }} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition">
        <ArrowLeft className="h-4 w-4" /> Reconfigure
      </Link>

      {/* ===== SECTION 1: Lead Profile Overview ===== */}
      <header className="mt-4 animate-fade-up">
        <p className="text-xs uppercase tracking-[0.3em] text-gold/80">Call Intelligence Report</p>
        <div className="flex flex-wrap items-end justify-between gap-4 mt-2">
          <h1 className="font-display text-4xl md:text-5xl">{lead.name}</h1>
          <button className="glass flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm hover:border-gold/30 transition">
            <Download className="h-4 w-4 text-gold" /> Export Report
          </button>
        </div>
      </header>

      <Panel className="mt-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5">
        {[
          { icon: MapPin, label: "Preferred Project", value: "Gold Coast" },
          { icon: Home, label: "Configuration", value: "3 BHK", sub: "1880 – 2000 sq.ft" },
          { icon: Wallet, label: "Budget", value: "₹1 Cr – ₹1.25 Cr" },
          { icon: Calendar, label: "Last Call", value: "23 May 2026" },
          { icon: Clock, label: "Call Duration", value: "14 min" },
          { icon: Flame, label: "Lead Type", value: lead.quality },
          { icon: Target, label: "Current Stage", value: lead.stage },
        ].map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.label} className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                <Icon className="h-3.5 w-3.5 text-gold" /> {f.label}
              </div>
              <div className="font-display text-lg mt-1 truncate">{f.value}</div>
              {f.sub && <div className="text-xs text-muted-foreground">{f.sub}</div>}
            </div>
          );
        })}
      </Panel>

      {/* ===== SECTION 2: Call Stage Analysis ===== */}
      <div className="mt-10">
        <SectionHeader n={2} title="Call Stage Analysis" sub={`Overall conversation score ${totalScore} / ${totalMax}`} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {stages.map((stage, idx) => {
            const score = stageScores[idx].score;
            const Icon = stage.icon;
            return (
              <Panel key={stage.id}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10 border border-gold/20 text-gold">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Stage {idx + 1}</p>
                      <h3 className="font-display text-lg">{stage.name}</h3>
                    </div>
                  </div>
                  <span className="font-display text-2xl text-gold">
                    {score}<span className="text-muted-foreground text-sm">/{stage.max}</span>
                  </span>
                </div>

                <ScoreBar score={score} max={stage.max} />

                <ul className="mt-4 space-y-2.5">
                  {stage.params.map((p, i) => (
                    <li key={i} className="flex flex-wrap items-start gap-2 text-sm border-b border-foreground/5 pb-2 last:border-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{p.label}</span>
                          <StatusPill status={p.status} />
                        </div>
                        {p.quote && (
                          <p className="text-xs text-muted-foreground mt-1">
                            <span className="font-mono text-gold mr-2">{p.timestamp}</span>
                            “{p.quote}”
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 p-3 rounded-xl bg-gold/[0.05] border border-gold/15">
                  <p className="text-[10px] uppercase tracking-wider text-gold/80 mb-1">AI Explanation</p>
                  <p className="text-sm text-foreground/85 leading-relaxed">{stage.explanation}</p>
                </div>

                {stage.missed.length > 0 && (
                  <div className="mt-3">
                    <p className="text-[10px] uppercase tracking-wider text-[color:var(--warning)] mb-1.5">Missed Opportunities</p>
                    <ul className="space-y-1">
                      {stage.missed.map((m) => (
                        <li key={m} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <AlertTriangle className="h-3 w-3 text-[color:var(--warning)] mt-0.5 shrink-0" /> {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Panel>
            );
          })}
        </div>
      </div>

      {/* ===== SECTION 3: Lead Analysis (BANT-aligned qualification) ===== */}
      <div className="mt-10">
        <SectionHeader n={3} title="Lead Analysis" sub="Real Estate Qualification Framework · BANT integrated" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Panel className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {qualification.map((q) => (
                <div key={q.label} className="p-3 rounded-xl bg-foreground/[0.02] border border-foreground/5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{q.label}</span>
                    <StatusPill status={q.status} />
                  </div>
                  <div className="text-gold font-display text-lg mt-1">{q.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{q.note}</p>
                </div>
              ))}
            </div>
          </Panel>
          <Panel className="flex flex-col justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Lead Quality</p>
              <div className="font-display text-5xl text-gold mt-1">HIGH</div>
              <div className="mt-3 flex gap-1">
                {["LOW", "MEDIUM", "HIGH"].map((l, i) => (
                  <div key={l} className={`h-1.5 flex-1 rounded-full ${i <= 2 ? "bg-gradient-to-r from-gold-soft to-gold" : "bg-foreground/10"}`} />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed border-t border-foreground/5 pt-3">
              Strong budget fit, strong location fit, active buying signals and a confirmed site visit on Saturday.
            </p>
          </Panel>
        </div>
      </div>

      {/* ===== SECTION 4: Objection Intelligence ===== */}
      <div className="mt-10">
        <SectionHeader n={4} title="Objection Intelligence" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {objections.map((o, i) => (
            <Panel key={i}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gold/80">{o.type}</p>
                  <p className="text-sm mt-1">“{o.q}”</p>
                  <p className="text-xs font-mono text-muted-foreground mt-2">{o.t}</p>
                </div>
                <StatusPill status={o.status as any} />
              </div>
            </Panel>
          ))}
        </div>
      </div>

      {/* ===== SECTION 5: Risk Detection ===== */}
      <div className="mt-10">
        <SectionHeader n={5} title="Risk Detection" sub={`${risks.length} risks identified`} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Panel>
            <div className="space-y-3">
              {risks.map((r, i) => (
                <div key={i} className="p-3 rounded-xl bg-[color:var(--warning)]/5 border border-[color:var(--warning)]/15">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{r.title}</span>
                    <span className="text-[10px] uppercase tracking-wider text-[color:var(--warning)] border border-[color:var(--warning)]/30 px-2 py-0.5 rounded-full">
                      {r.severity}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{r.note}</p>
                </div>
              ))}
            </div>
          </Panel>
          <Panel>
            <p className="text-[10px] uppercase tracking-wider text-gold/80 mb-2">Suggested Actions</p>
            <ul className="space-y-2 text-sm">
              {["Mention RERA Registration", "Discuss Builder Track Record", "Share Completed Projects", "Build More Trust Signals"].map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-[color:var(--success)] mt-0.5 shrink-0" /> {s}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      {/* ===== SECTION 6: Compliance Check ===== */}
      <div className="mt-10">
        <SectionHeader n={6} title="Compliance Check" sub={`${complianceScore} / 3 mandatory disclosures captured`} />
        <Panel>
          <ScoreBar score={complianceScore} max={3} />
          <ul className="mt-4 space-y-2.5">
            {compliance.map((c) => (
              <li key={c.label} className="flex flex-wrap items-start gap-2 text-sm border-b border-foreground/5 pb-2 last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{c.label}</span>
                    <StatusPill status={c.status} />
                  </div>
                  {c.q && <p className="text-xs text-muted-foreground mt-1"><span className="font-mono text-gold mr-2">{c.t}</span>“{c.q}”</p>}
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* ===== SECTION 7: Behavioral Call Score ===== */}
      <div className="mt-10">
        <SectionHeader n={7} title="Behavioral Call Score" />
        <Panel>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {behavioral.map((b) => {
              const tone = b.v === "High" ? "text-[color:var(--success)] border-[color:var(--success)]/30 bg-[color:var(--success)]/10"
                : b.v === "Medium" ? "text-[color:var(--warning)] border-[color:var(--warning)]/30 bg-[color:var(--warning)]/10"
                : "text-destructive border-destructive/30 bg-destructive/10";
              return (
                <div key={b.k} className="p-3 rounded-xl border border-foreground/10 bg-foreground/[0.02]">
                  <p className="text-xs text-muted-foreground">{b.k}</p>
                  <span className={`mt-2 inline-block text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${tone}`}>
                    {b.v}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-foreground/5 pt-4">
            <span className="text-sm text-muted-foreground">Overall Behavioral Score</span>
            <span className="font-display text-2xl text-gold">82 / 100</span>
          </div>
        </Panel>
      </div>

      {/* ===== SECTION 8: Next Best Action ===== */}
      <div className="mt-10">
        <SectionHeader n={8} title="Next Best Action" />
        <Panel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gold/80 mb-2">Immediate Action</p>
              <ul className="space-y-1.5 text-sm">
                {["Reconfirm Saturday 6 PM Site Visit", "Share WhatsApp Confirmation", "Share Digital Brochure", "Share School Information"].map((a) => (
                  <li key={a} className="flex gap-2"><Check className="h-4 w-4 text-[color:var(--success)] mt-0.5 shrink-0" />{a}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gold/80 mb-2">Follow-Up Timing</p>
              <p className="text-sm">Friday Evening Reminder</p>
              <p className="text-xs text-muted-foreground mt-1">24 hours before scheduled visit.</p>
              <p className="text-[10px] uppercase tracking-wider text-gold/80 mt-4 mb-2">Personal Hook</p>
              <p className="text-sm">Mention Child-Friendly Amenities</p>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { icon: Phone, label: "Call Lead" },
                { icon: MessageCircle, label: "Send WhatsApp" },
                { icon: Bell, label: "Set Reminder" },
                { icon: FileText, label: "Share Brochure" },
              ].map((b) => {
                const Icon = b.icon;
                return (
                  <button key={b.label} className="glass flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm hover:border-gold/40 hover:bg-gold/5 transition">
                    <Icon className="h-4 w-4 text-gold" /> {b.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Panel>
      </div>

      {/* ===== SECTION 9: Deal Intelligence ===== */}
      <div className="mt-10">
        <SectionHeader n={9} title="Deal Intelligence" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <Panel>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Conversion Probability</p>
            <div className="font-display text-4xl text-gold-gradient mt-1">HIGH</div>
            <p className="text-xs text-muted-foreground mt-2">74% predicted close</p>
          </Panel>
          <Panel>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Deal Value Band</p>
            <div className="font-display text-4xl mt-1">₹95L – 1 Cr</div>
            <p className="text-xs text-muted-foreground mt-2">Configuration: 3 BHK</p>
          </Panel>
          <Panel>
            <p className="text-[10px] uppercase tracking-wider text-[color:var(--success)] mb-2">Key Drivers</p>
            <ul className="space-y-1 text-sm">
              {["Location Match", "Budget Match", "School Requirement", "Confirmed Site Visit"].map((d) => (
                <li key={d} className="flex gap-2"><Check className="h-4 w-4 text-[color:var(--success)] mt-0.5 shrink-0" />{d}</li>
              ))}
            </ul>
          </Panel>
          <Panel>
            <p className="text-[10px] uppercase tracking-wider text-destructive mb-2">Risk Factors</p>
            <ul className="space-y-1 text-sm">
              {["2027 Timeline", "Reduced Urgency", "Delayed Purchase Decision"].map((d) => (
                <li key={d} className="flex gap-2"><AlertTriangle className="h-4 w-4 text-[color:var(--warning)] mt-0.5 shrink-0" />{d}</li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      {/* ===== SECTION 11: Conversation Timeline ===== */}
      <div className="mt-10">
        <SectionHeader n={11} title="Conversation Timeline" sub="Visual flow of the entire call" />
        <Panel>
          <div className="relative">
            <div className="absolute left-0 right-0 top-5 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {timeline.map((s, i) => (
                <div key={i} className="relative flex flex-col items-center text-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-gold ring-4 ring-gold/20 relative z-10" />
                  <p className="text-[10px] font-mono text-gold mt-3">{s.t}</p>
                  <p className="text-xs font-medium mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* ===== SECTION 12 + 13: Commitments & Sentiment ===== */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Panel className="lg:col-span-2">
          <SectionHeader n={12} title="Key Commitment Moments" />
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {commitments.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm p-3 rounded-xl bg-[color:var(--success)]/5 border border-[color:var(--success)]/15">
                <Check className="h-4 w-4 text-[color:var(--success)] mt-0.5 shrink-0" /> {c}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <SectionHeader n={13} title="Overall Sentiment" />
          <div className="text-center py-2">
            <div className="font-display text-4xl text-[color:var(--success)]">Positive</div>
            <p className="text-xs text-muted-foreground mt-2">Confidence Score</p>
            <div className="mt-2 h-2 bg-foreground/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[color:var(--success)]/70 to-[color:var(--success)]" style={{ width: "82%" }} />
            </div>
            <p className="font-display text-2xl mt-2">82%</p>
          </div>
        </Panel>
      </div>

      {/* ===== SECTION 14: AI Conclusion ===== */}
      <div className="mt-10">
        <SectionHeader n={14} title="AI Conclusion" />
        <section className="glass-strong rounded-3xl p-8 border-gold-gradient relative overflow-hidden animate-fade-up">
          <div className="absolute inset-0 bg-[var(--gradient-glow)] pointer-events-none" />
          <div className="relative flex gap-4 items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 text-gold shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold/80">Executive Summary</p>
              <p className="mt-2 text-foreground/90 leading-relaxed">
                The customer is a strong prospect with excellent location and budget fit. A site visit has been confirmed for Saturday at 6 PM.
                The main risk is the long purchase timeline of 2027, which may reduce urgency over time. Follow-up should focus on maintaining
                engagement through school-area content, child-friendly amenity walkthroughs, and reinforcing builder credibility via RERA and
                completed project references.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ===== SECTION 10: Detailed Call Transcript ===== */}
      <div className="mt-10">
        <SectionHeader n={10} title="Detailed Call Transcript" />
        <Panel>
          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-foreground/5 border border-foreground/10 focus-within:border-gold/40 transition">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transcript by keyword…"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
            {search && <button onClick={() => setSearch("")} className="text-xs text-muted-foreground hover:text-gold">Clear</button>}
          </div>

          <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-2">
            {filteredTranscript.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No matches for “{search}”</p>
            )}
            {filteredTranscript.map((line, i) => (
              <div key={i} className="flex gap-3 text-sm group hover:bg-foreground/[0.02] rounded-lg p-2 -mx-2 transition">
                <span className="text-xs font-mono text-gold w-12 shrink-0 pt-0.5">{line.t}</span>
                <span className={`text-xs font-semibold w-20 shrink-0 pt-0.5 ${line.s === "Agent" ? "text-gold" : "text-[color:var(--silver)]"}`}>
                  {line.s}
                </span>
                <p className="text-foreground/85 leading-relaxed">{line.text}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
