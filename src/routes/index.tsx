import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Phone, Flame, CheckCircle2, TrendingUp, Search, SlidersHorizontal, X } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { StatCard } from "@/components/StatCard";
import { LeadCard } from "@/components/LeadCard";
import { leads as fallbackLeads, type Lead } from "@/lib/leads-data";
import { getPostCalls } from "@/services/api";

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
  const [leads, setLeads] = useState<Lead[]>(fallbackLeads);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getPostCalls()
      .then((backendLeads) => {
        if (backendLeads.length > 0) setLeads(backendLeads);
      })
      .catch(() => {
        setLeads(fallbackLeads);
      });
  }, []);

  const total = leads.length;
  const hot = leads.filter((l) => l.quality === "Hot").length;
  const completed = leads.filter((l) => l.status === "Completed").length;
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredLeads = useMemo(() => {
    if (!normalizedSearch) return leads;

    return leads.filter((lead) =>
      [
        lead.id,
        lead.name,
        lead.type,
        lead.stage,
        lead.quality,
        lead.summary,
        lead.status,
        lead.property,
        lead.budget,
        lead.callDuration,
        lead.agent,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [leads, normalizedSearch]);
  const suggestions = useMemo(() => {
    if (!normalizedSearch) return [];
    return filteredLeads.slice(0, 5);
  }, [filteredLeads, normalizedSearch]);

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
          <div className="relative flex gap-2">
            <div className="glass flex items-center gap-2 rounded-xl px-3.5 py-2.5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search leads…"
                className="bg-transparent text-sm outline-none placeholder:text-muted-foreground w-48"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-muted-foreground hover:text-foreground transition"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button className="glass flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm hover:border-gold/30 transition">
              <SlidersHorizontal className="h-4 w-4 text-gold" /> Filter
            </button>

            {searchQuery && (
              <div className="glass-strong absolute right-0 top-12 z-30 w-full min-w-72 overflow-hidden rounded-xl border border-border/60 shadow-[var(--shadow-elegant)]">
                {suggestions.length > 0 ? (
                  suggestions.map((lead) => (
                    <button
                      type="button"
                      key={lead.id}
                      onClick={() => setSearchQuery(lead.name)}
                      className="flex w-full items-start justify-between gap-3 border-b border-border/40 px-4 py-3 text-left last:border-0 hover:bg-foreground/5 transition"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{lead.name}</span>
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          {lead.type} · {lead.stage} · {lead.quality}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs text-gold">{lead.id}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-muted-foreground">No matching leads found</div>
                )}
              </div>
            )}
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
          <span className="text-xs text-muted-foreground">
            {filteredLeads.length} of {leads.length} calls
          </span>
        </div>
        {filteredLeads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredLeads.map((lead, i) => (
              <LeadCard key={lead.id} lead={lead} index={i} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-8 text-center">
            <p className="font-display text-2xl">No matching conversations</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try searching by lead name, stage, quality, property, agent, or call summary.
            </p>
          </div>
        )}
      </section>

      <footer className="mt-16 pb-4 text-center text-xs text-muted-foreground">
        MaisonAI · Premium real estate intelligence · © 2026
      </footer>
    </PageShell>
  );
}
