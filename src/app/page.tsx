"use client";

import Link from "next/link";
import { useOverviewStatus } from "@/lib/useOverviewStatus";

interface ModuleCard {
  href: string;
  title: string;
  description: string;
  status: "live" | "soon";
  statLine?: string;
}

export default function Home() {
  const status = useOverviewStatus();

  const modules: ModuleCard[] = [
    {
      href: "/observability",
      title: "Observability",
      description:
        "Simulates credit, debit, wire (digital, branch, LoanIQ, batch, IVR), ACH, and Zelle transactions across real-time and batch origination channels, with live SLIs, SLOs, and error-budget burn.",
      status: "live",
      statLine:
        status.channelsTotal !== null
          ? `${status.channelsHealthy}/${status.channelsTotal} channels healthy`
          : undefined,
    },
    {
      href: "/incidents",
      title: "Incident Copilot",
      description:
        "Watches the observability platform's telemetry and uses an LLM to independently diagnose likely root cause the moment a channel degrades.",
      status: "live",
      statLine: status.activeCases !== null ? `${status.activeCases} active case(s)` : undefined,
    },
    {
      href: "/reconciliation",
      title: "Reconciliation",
      description:
        "Batch-reconciles origination records against settlement/posting records, flags breaks, and scores transactions for anomalies.",
      status: "soon",
    },
    {
      href: "/insights",
      title: "Business Insights",
      description:
        "Payments economics (interchange, fees), KPI tracking, and ROI/scenario modeling for new payments initiatives — a business-case dashboard.",
      status: "soon",
    },
  ];

  return (
    <div className="px-6 py-12 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
      <section className="max-w-2xl mb-12">
        <h1 className="text-3xl font-semibold tracking-tight mb-3">
          A payments platform, built end-to-end
        </h1>
        <p className="text-secondary">
          Every module below reads from the same underlying multi-channel transaction data —
          credit, debit, wire, ACH, and Zelle, across eleven distinct origination journeys (POS,
          e-commerce, mobile wallet, digital/branch/LoanIQ/batch/IVR wire, ACH batch, and Zelle
          mobile/online) spanning real-time and batch rails. It&apos;s one system, not four demos:
          transactions flow in, get observed, get triaged by AI when something breaks, and roll up
          into reconciliation and business reporting.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.status === "live" ? m.href : "#"}
            aria-disabled={m.status !== "live"}
            className="card p-6 flex flex-col gap-3 transition-transform"
            style={{
              opacity: m.status === "live" ? 1 : 0.6,
              cursor: m.status === "live" ? "pointer" : "default",
              pointerEvents: m.status === "live" ? "auto" : "none",
            }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">{m.title}</h2>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  color: m.status === "live" ? "var(--status-good)" : "var(--text-muted)",
                  border: `1px solid ${m.status === "live" ? "var(--status-good)" : "var(--border)"}`,
                }}
              >
                {m.status === "live" ? "Live" : "Coming soon"}
              </span>
            </div>
            <p className="text-secondary text-sm">{m.description}</p>
            {m.statLine && <p className="text-muted text-xs mt-auto pt-2">{m.statLine}</p>}
          </Link>
        ))}
      </section>

      <section
        className="mt-8 card p-4 text-xs text-secondary"
        style={{ borderStyle: "dashed" }}
      >
        <strong style={{ color: "var(--text-primary)" }}>If a module above looks empty when you click in:</strong>{" "}
        both live modules run on a free-tier host that sleeps after ~15 minutes of no traffic and
        takes 30-60s to wake up on the first request after that — refresh once after a moment. Data
        should always be flowing within a minute; if it still looks stuck longer than that, the
        module itself may be down.
      </section>

      <footer className="mt-8 text-muted text-xs">
        Synthetic data, generated in-process for demonstration purposes. No real payment data is
        used or stored.
      </footer>
    </div>
  );
}
