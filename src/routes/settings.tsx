import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Settings as SettingsIcon } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — MaisonAI" }] }),
  component: () => (
    <PageShell>
      <div className="glass rounded-3xl p-16 text-center animate-fade-up">
        <SettingsIcon className="h-12 w-12 text-gold mx-auto mb-4" />
        <h1 className="font-display text-4xl">Settings</h1>
        <p className="text-muted-foreground mt-2">Workspace, integrations and team preferences.</p>
      </div>
    </PageShell>
  ),
});
