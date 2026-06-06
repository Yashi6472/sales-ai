import { createFileRoute } from "@tanstack/react-router";
import { Phone, Flame, CheckCircle2, TrendingUp, Search, SlidersHorizontal } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { StatCard } from "@/components/StatCard";
import { LeadCard } from "@/components/LeadCard";
import { leads } from "@/lib/leads-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MaisonAI — Completed Sales Calls" },
      { name: "description", content: "AI-powered luxury real estate sales call analysis dashboard." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const total = leads.length;
  const hot = leads.filter((l) => l.quality === "Hot").length;
  const completed = leads.filter((l) => l.status === "Completed").length;

  return (
    <PageShell>
      {/* Hero */}
      <section className="animate-fade-up">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold/80 mb-3">AI Sales Intelligence</p>
            <h1 className="font-display text-5xl md:text-6xl leading-[1.05]">
              Completed <span className="text-gold-gradient">Sales Calls</span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-xl">
              Curated intelligence on every premium client conversation. Analyze tone, intent and deal probability with cinematic clarity.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="glass flex items-center gap-2 rounded-xl px-3.5 py-2.5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search leads…"
                className="bg-transparent text-sm outline-none placeholder:text-muted-foreground w-48"
              />
            </div>
            <button className="glass flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm hover:border-gold/30 transition">
              <SlidersHorizontal className="h-4 w-4 text-gold" /> Filter
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Calls" value={String(total)} delta="+12% this week" icon={Phone} accent="silver" />
        <StatCard label="Hot Leads" value={String(hot)} delta="+3 new today" icon={Flame} accent="gold" />
        <StatCard label="Completed Analyses" value={String(completed)} delta="98% accuracy" icon={CheckCircle2} accent="success" />
        <StatCard label="Conversion Probability" value="64%" delta="+8% MoM" icon={TrendingUp} accent="navy" />
      </section>

      {/* Leads */}
      <section className="mt-10">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-display text-2xl">Recent Conversations</h2>
          <span className="text-xs text-muted-foreground">{leads.length} calls</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {leads.map((lead, i) => (
            <LeadCard key={lead.id} lead={lead} index={i} />
          ))}
        </div>
      </section>

      <footer className="mt-16 pb-4 text-center text-xs text-muted-foreground">
        MaisonAI · Premium real estate intelligence · © 2026
      </footer>
    </PageShell>
  );
}
