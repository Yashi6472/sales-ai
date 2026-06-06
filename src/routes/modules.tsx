import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/modules")({
  head: () => ({ meta: [{ title: "AI Modules — MaisonAI" }] }),
  component: () => (
    <PageShell>
      <div className="glass rounded-3xl p-16 text-center animate-fade-up">
        <Sparkles className="h-12 w-12 text-gold mx-auto mb-4" />
        <h1 className="font-display text-4xl">AI Modules</h1>
        <p className="text-muted-foreground mt-2">Manage and tune AI analysis modules globally.</p>
      </div>
    </PageShell>
  ),
});
