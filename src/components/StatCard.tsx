import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
  accent?: "gold" | "silver" | "success" | "navy";
}

const accentMap = {
  gold: "from-gold/20 to-gold/0 text-gold",
  silver: "from-silver/20 to-silver/0 text-silver",
  success: "from-[color:var(--success)]/20 to-transparent text-[color:var(--success)]",
  navy: "from-navy/40 to-transparent text-silver",
} as const;

export function StatCard({ label, value, delta, icon: Icon, accent = "gold" }: Props) {
  return (
    <div className="glass relative overflow-hidden rounded-2xl p-6 animate-fade-up group hover:border-gold/30 transition-all duration-500">
      <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${accentMap[accent]} blur-2xl opacity-60 group-hover:opacity-90 transition`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
          <p className="mt-3 font-display text-4xl text-foreground">{value}</p>
          {delta && <p className="mt-1 text-xs text-[color:var(--success)]">{delta}</p>}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 ${accentMap[accent].split(" ").pop()}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
