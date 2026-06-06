import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { BarChart3 } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — MaisonAI" }] }),
  component: () => (
    <PageShell>
      <div className="glass rounded-3xl p-16 text-center animate-fade-up">
        <BarChart3 className="h-12 w-12 text-gold mx-auto mb-4" />
        <h1 className="font-display text-4xl">Analytics</h1>
        <p className="text-muted-foreground mt-2">Cross-call performance dashboards arriving soon.</p>
      </div>
    </PageShell>
  ),
});
