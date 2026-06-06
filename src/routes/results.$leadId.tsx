import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft, Sparkles, Target, ShieldAlert, AlertTriangle, Award,
  TrendingUp, ClipboardCheck, MessageSquare, ChevronDown, Download
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { leads } from "@/lib/leads-data";

export const Route = createFileRoute("/results/$leadId")({
  head: () => ({ meta: [{ title: "Analysis Results — MaisonAI" }] }),
  component: ResultsPage,
});

function CircularScore({ value, label, color = "var(--gold)" }: { value: number; label: string; color?: string }) {
  const circ = 2 * Math.PI * 42;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-32 w-32">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" stroke="oklch(1 0 0 / 0.06)" strokeWidth="6" fill="none" />
          <circle
            cx="50" cy="50" r="42" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl">{value}</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">/ 100</span>
        </div>
      </div>
      <p className="mt-2 text-xs uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
    </div>
  );
}

function ProgressBar({ value, label, sub }: { value: number; label: string; sub?: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm">{label}</span>
        <span className="text-xs text-gold font-mono">{value}%</span>
      </div>
      <div className="h-1.5 bg-foreground/5 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-gold-soft to-gold rounded-full" style={{ width: `${value}%` }} />
      </div>
      {sub && <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

function Panel({ icon: Icon, title, children, defaultOpen = true }: any) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="glass rounded-2xl overflow-hidden animate-fade-up">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 hover:bg-foreground/[0.02] transition">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10 border border-gold/20 text-gold">
            <Icon className="h-4.5 w-4.5" />
          </div>
          <h3 className="font-display text-lg">{title}</h3>
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 pt-0">{children}</div>}
    </section>
  );
}

const objections = [
  { type: "Price", text: "Comparable property in same complex is 8% lower.", handled: 4 },
  { type: "Timing", text: "Wants to wait for Q2 rate cuts before finalizing.", handled: 3 },
  { type: "Location", text: "Concerned about traffic during peak hours.", handled: 5 },
];

const risks = [
  { level: "Medium", text: "Spouse not present on call — secondary decision-maker." },
  { level: "Low", text: "Mentioned competitor property twice, both unprompted." },
];

const bant = [
  { k: "Budget", v: 90, note: "Pre-approved loan confirmed, 25% down ready." },
  { k: "Authority", v: 65, note: "Primary decision-maker, spouse veto possible." },
  { k: "Need", v: 85, note: "Relocating in 6 weeks, urgency strong." },
  { k: "Timeline", v: 78, note: "Targeting close within 14 days." },
];

const transcript = [
  { t: "00:00", s: "Agent", text: "Good afternoon, this is Priya from Maison Residences. Thanks for taking the time today." },
  { t: "00:14", s: "Lead", text: "Sure, I've been looking at the Whitefield listing online — the lakeside one." },
  { t: "00:32", s: "Agent", text: "Excellent choice. That unit has a private terrace and direct lake views. May I ask what's drawing you to this area?" },
  { t: "01:05", s: "Lead", text: "Schools mostly, and proximity to the tech park. Though I'm comparing it to the Embassy listing too." },
  { t: "02:18", s: "Agent", text: "Understood — Embassy is a strong project. Where Prestige Lakeside differs is the ratio of green space and the resale velocity in the last 18 months." },
  { t: "03:40", s: "Lead", text: "What's the actual price after negotiation? The online figure seems on the higher end." },
];

function ResultsPage() {
  const { leadId } = Route.useParams();
  const lead = leads.find((l) => l.id === leadId) ?? leads[0];

  return (
    <PageShell>
      <Link to="/analyze/$leadId" params={{ leadId: lead.id }} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition">
        <ArrowLeft className="h-4 w-4" /> Reconfigure
      </Link>

      <header className="mt-4 flex flex-wrap justify-between items-end gap-4 animate-fade-up">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold/80">Analysis Complete</p>
          <h1 className="font-display text-4xl md:text-5xl mt-2">{lead.name}</h1>
          <p className="mt-1 text-muted-foreground">{lead.property} · {lead.type} · {lead.callDuration}</p>
        </div>
        <button className="glass flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm hover:border-gold/30 transition">
          <Download className="h-4 w-4 text-gold" /> Export Report
        </button>
      </header>

      {/* Top score grid */}
      <section className="mt-8 glass-strong rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-up">
        <CircularScore value={82} label="Lead Quality" />
        <CircularScore value={74} label="Deal Probability" color="oklch(0.72 0.16 155)" />
        <CircularScore value={88} label="Agent Score" color="oklch(0.85 0.01 250)" />
        <CircularScore value={67} label="Buyer Intent" color="oklch(0.78 0.14 70)" />
      </section>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Panel icon={Sparkles} title="AI Generated Summary">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {lead.name} is a {lead.quality.toLowerCase()} prospect actively evaluating {lead.property} against one competing listing.
              The call indicates strong financial readiness and clear urgency tied to a relocation timeline. Primary concerns center on
              pricing parity with comparable inventory and minor location logistics. Recommended next action: schedule an on-site walkthrough
              within 72 hours and prepare a comparative pricing sheet emphasizing 18-month resale velocity and amenity ratio.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["High intent", "Pre-approved", "Comparison shopping", "Time-sensitive"].map((tag) => (
                <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full bg-gold/10 text-gold border border-gold/20">{tag}</span>
              ))}
            </div>
          </Panel>

          <Panel icon={Target} title="Buyer Signals & Intent">
            <div className="space-y-4">
              <ProgressBar value={88} label="Urgency Indicators" sub="‘need to decide this month’ × 3" />
              <ProgressBar value={72} label="Financial Readiness" sub="Pre-approval mentioned, down payment ready" />
              <ProgressBar value={64} label="Emotional Commitment" sub="Asked unprompted about neighbors and HOA culture" />
              <ProgressBar value={55} label="Decision Autonomy" sub="Spouse approval still needed" />
            </div>
          </Panel>

          <Panel icon={ShieldAlert} title="Objections Detected">
            <div className="space-y-3">
              {objections.map((o, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-foreground/[0.02] border border-foreground/5">
                  <span className="text-[10px] uppercase tracking-wider text-gold mt-0.5">{o.type}</span>
                  <div className="flex-1">
                    <p className="text-sm">{o.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">Handling score: {o.handled}/5</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel icon={MessageSquare} title="Full Transcript" defaultOpen={false}>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {transcript.map((line, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="text-xs font-mono text-muted-foreground w-12 shrink-0 pt-0.5">{line.t}</span>
                  <span className={`text-xs font-medium w-14 shrink-0 pt-0.5 ${line.s === "Agent" ? "text-gold" : "text-silver"}`}>
                    {line.s}
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{line.text}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel icon={ClipboardCheck} title="BANT Analysis">
            <div className="space-y-4">
              {bant.map((b) => (
                <ProgressBar key={b.k} value={b.v} label={b.k} sub={b.note} />
              ))}
            </div>
          </Panel>

          <Panel icon={AlertTriangle} title="Risk Intelligence">
            <div className="space-y-3">
              {risks.map((r, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-[color:var(--warning)]/5 border border-[color:var(--warning)]/15">
                  <span className="text-[10px] uppercase tracking-wider text-[color:var(--warning)] mt-0.5 shrink-0">{r.level}</span>
                  <p className="text-xs text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel icon={Award} title="Agent Performance">
            <div className="space-y-4">
              <ProgressBar value={92} label="Tone & Warmth" />
              <ProgressBar value={85} label="Active Listening" />
              <ProgressBar value={80} label="Pitch Clarity" />
              <ProgressBar value={88} label="Objection Handling" />
              <ProgressBar value={75} label="Closing Strength" />
              <p className="text-xs text-muted-foreground border-t border-foreground/5 pt-3">
                <span className="text-[color:var(--success)]">Strength:</span> Empathetic reframing of price objection.<br />
                <span className="text-gold">Coaching:</span> Push for soft commitment before ending call.
              </p>
            </div>
          </Panel>

          <Panel icon={TrendingUp} title="Deal Probability">
            <div className="text-center py-3">
              <div className="font-display text-6xl text-gold-gradient">74%</div>
              <p className="text-xs text-muted-foreground mt-2">Close within 21 days</p>
            </div>
          </Panel>
        </div>
      </div>
    </PageShell>
  );
}
