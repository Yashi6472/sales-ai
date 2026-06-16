import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Building2 } from "lucide-react";

const items = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
];

export function TopNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass-strong border-b border-border/40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-gold-soft shadow-[var(--shadow-gold)] transition-transform group-hover:scale-105">
              <Building2 className="h-5 w-5 text-white" strokeWidth={2.2} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg tracking-wide">Maison<span className="text-gold-gradient">AI</span></span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Sales Intelligence</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {items.map((it) => {
              const active = pathname === it.to || (it.to !== "/" && pathname.startsWith(it.to));
              const Icon = it.icon;
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all ${
                    active
                      ? "bg-gold/10 text-gold border border-gold/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {it.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-navy to-secondary text-xs font-medium border border-border">PS</div>
          </div>
        </div>
      </div>
    </header>
  );
}
