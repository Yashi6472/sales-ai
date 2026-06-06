import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { ArrowLeft, Sparkles, Save, RotateCcw, Loader2 } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { leads, moduleCatalog, defaultPrompts, type ModuleId } from "@/lib/leads-data";

export const Route = createFileRoute("/analyze/$leadId")({
  head: () => ({ meta: [{ title: "AI Call Analysis Configuration — MaisonAI" }] }),
  component: AnalyzePage,
  notFoundComponent: () => <PageShell><p>Lead not found.</p></PageShell>,
});

function AnalyzePage() {
  const { leadId } = Route.useParams();
  const navigate = useNavigate();
  const lead = leads.find((l) => l.id === leadId) ?? leads[0];

  const [selected, setSelected] = useState<Set<ModuleId>>(
    new Set(["summary", "quality", "intent", "objection", "bant"] as ModuleId[])
  );
  const [prompts, setPrompts] = useState<Record<string, string>>({ ...defaultPrompts });
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggle = (id: ModuleId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const runAnalysis = () => {
    setRunning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate({ to: "/results/$leadId", params: { leadId: lead.id } }), 300);
          return 100;
        }
        return p + 4;
      });
    }, 80);
  };

  return (
    <PageShell>
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <header className="mt-4 animate-fade-up">
        <p className="text-xs uppercase tracking-[0.3em] text-gold/80">Configure</p>
        <h1 className="font-display text-4xl md:text-5xl mt-2">AI Call Analysis Configuration</h1>
        <p className="mt-2 text-muted-foreground">
          {lead.name} · {lead.property} · <span className="text-foreground">{lead.callDuration}</span> call
        </p>
      </header>

      {/* Modules */}
      <section className="mt-10">
        <h2 className="font-display text-2xl mb-1">1. Select Modules</h2>
        <p className="text-sm text-muted-foreground mb-5">Choose which AI modules to run on this conversation.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {moduleCatalog.map((m, i) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[m.icon] ?? Icons.Sparkles;
            const active = selected.has(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggle(m.id)}
                style={{ animationDelay: `${i * 40}ms` }}
                className={`group glass relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 animate-fade-up hover:-translate-y-0.5 ${
                  active ? "border-gold/50 shadow-[var(--shadow-gold)] bg-gold/[0.04]" : "hover:border-white/20"
                }`}
              >
                {active && <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent pointer-events-none" />}
                <div className="relative flex items-start justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${active ? "bg-gold/10 border-gold/30 text-gold" : "bg-white/5 border-white/10 text-muted-foreground"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition ${active ? "bg-gold border-gold" : "border-white/20"}`}>
                    {active && <Icons.Check className="h-3.5 w-3.5 text-background" strokeWidth={3} />}
                  </div>
                </div>
                <h3 className="relative font-display text-lg mt-4">{m.name}</h3>
                <p className="relative text-xs text-muted-foreground mt-1 leading-relaxed">{m.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Prompts */}
      <section className="mt-12">
        <h2 className="font-display text-2xl mb-1">2. Prompt Customization</h2>
        <p className="text-sm text-muted-foreground mb-5">Fine-tune the instructions for each selected module.</p>

        {selected.size === 0 ? (
          <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
            <Sparkles className="h-8 w-8 mx-auto text-gold/40 mb-2" />
            Select at least one module to customize its prompt.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {moduleCatalog.filter((m) => selected.has(m.id)).map((m) => (
              <div key={m.id} className="glass rounded-2xl p-5 animate-fade-up">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-lg">{m.name} Prompt</h3>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setPrompts((p) => ({ ...p, [m.id]: defaultPrompts[m.id] }))}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-gold px-2 py-1 rounded-md hover:bg-white/5 transition"
                    >
                      <RotateCcw className="h-3 w-3" /> Reset
                    </button>
                    <button className="flex items-center gap-1 text-xs text-gold hover:text-foreground px-2 py-1 rounded-md hover:bg-gold/10 transition">
                      <Save className="h-3 w-3" /> Save
                    </button>
                  </div>
                </div>
                <textarea
                  value={prompts[m.id]}
                  onChange={(e) => setPrompts((p) => ({ ...p, [m.id]: e.target.value }))}
                  rows={4}
                  className="w-full resize-y bg-black/30 border border-white/10 rounded-xl p-3 text-sm font-mono leading-relaxed text-foreground/90 outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Run */}
      <section className="mt-12 glass-strong rounded-3xl p-8 border-gold-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-glow)] pointer-events-none" />
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl">Ready to analyze</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {selected.size} module{selected.size === 1 ? "" : "s"} selected · Estimated ~{Math.max(5, selected.size * 3)}s
            </p>
          </div>
          <button
            onClick={runAnalysis}
            disabled={running || selected.size === 0}
            className="relative flex items-center gap-3 rounded-2xl bg-gradient-to-r from-gold to-gold-soft px-8 py-4 text-base font-medium text-background shadow-[var(--shadow-gold)] disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 animate-pulse-glow transition"
          >
            {running ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing… {progress}%
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Run AI Analysis
              </>
            )}
          </button>
        </div>

        {running && (
          <div className="relative mt-6">
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold to-gold-soft transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="shimmer-text text-xs mt-3 font-mono">
              {progress < 30 && "Transcribing audio stream…"}
              {progress >= 30 && progress < 60 && "Extracting intent signals & objections…"}
              {progress >= 60 && progress < 90 && "Scoring BANT, risks & deal probability…"}
              {progress >= 90 && "Composing final report…"}
            </p>
          </div>
        )}
      </section>
    </PageShell>
  );
}
