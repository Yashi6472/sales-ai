import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock, Home, Wallet, User } from "lucide-react";
import type { Lead } from "@/lib/leads-data";

const qualityStyles: Record<Lead["quality"], string> = {
  Hot: "bg-[color:var(--destructive)]/15 text-[color:var(--destructive)] border-[color:var(--destructive)]/30",
  Warm: "bg-[color:var(--warning)]/15 text-[color:var(--warning)] border-[color:var(--warning)]/30",
  Cold: "bg-silver/10 text-silver border-silver/30",
};

const statusStyles: Record<Lead["status"], string> = {
  Completed: "bg-[color:var(--success)]/15 text-[color:var(--success)] border-[color:var(--success)]/30",
  "In Progress": "bg-gold/15 text-gold border-gold/30",
  Pending: "bg-white/5 text-muted-foreground border-white/10",
};

export function LeadCard({ lead, index }: { lead: Lead; index: number }) {
  return (
    <article
      className="glass group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-gold/30 hover:shadow-[var(--shadow-gold)] animate-fade-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-navy to-secondary border border-white/10 font-display text-lg text-gold">
            {lead.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div>
            <h3 className="font-display text-xl text-foreground leading-tight">{lead.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{lead.type} · {lead.id}</p>
          </div>
        </div>
        <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border ${qualityStyles[lead.quality]}`}>
          {lead.quality}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-[11px]">
        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-muted-foreground">
          Stage · <span className="text-foreground">{lead.stage}</span>
        </span>
        <span className={`px-2.5 py-1 rounded-md border ${statusStyles[lead.status]}`}>{lead.status}</span>
      </div>

      <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-2">{lead.summary}</p>

      <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground"><Home className="h-3.5 w-3.5 text-gold/70" /> <span className="truncate">{lead.property}</span></div>
        <div className="flex items-center gap-2 text-muted-foreground"><Wallet className="h-3.5 w-3.5 text-gold/70" /> {lead.budget}</div>
        <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-3.5 w-3.5 text-gold/70" /> {lead.callDuration}</div>
        <div className="flex items-center gap-2 text-muted-foreground"><User className="h-3.5 w-3.5 text-gold/70" /> {lead.agent}</div>
      </div>

      <Link
        to="/analyze/$leadId"
        params={{ leadId: lead.id }}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-soft px-4 py-2.5 text-sm font-medium text-background shadow-[var(--shadow-gold)] hover:brightness-110 transition-all"
      >
        Analyze Call
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </article>
  );
}
