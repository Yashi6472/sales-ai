import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { AnalysisReport } from "@/components/AnalysisReport";
import { leads } from "@/lib/leads-data";

export const Route = createFileRoute("/results/$leadId")({
  head: () => ({ meta: [{ title: "Call Intelligence Report — MaisonAI" }] }),
  component: ResultsPage,
});

function ResultsPage() {
  const { leadId } = Route.useParams();
  const lead = leads.find((l) => l.id === leadId) ?? leads[0];

  return (
    <PageShell>
      <Link
        to="/analyze/$leadId"
        params={{ leadId: lead.id }}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition"
      >
        <ArrowLeft className="h-4 w-4" /> Reconfigure
      </Link>

      <header className="mt-4 animate-fade-up">
        <p className="text-xs uppercase tracking-[0.3em] text-gold/80">Call Intelligence Report</p>
        <h1 className="font-display text-4xl md:text-5xl mt-2">{lead.name}</h1>
        <p className="mt-2 text-muted-foreground">{lead.property} · {lead.callDuration} call</p>
      </header>

      <div className="mt-8">
        <AnalysisReport lead={lead} />
      </div>
    </PageShell>
  );
}
