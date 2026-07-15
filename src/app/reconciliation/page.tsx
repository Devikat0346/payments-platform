"use client";

import { AlertTriangle, Banknote, CircleGauge, RefreshCw } from "lucide-react";
import { BreakTypeMix } from "@/components/reconciliation/BreakTypeMix";
import { BreaksTable } from "@/components/reconciliation/BreaksTable";
import { StatTile } from "@/components/StatTile";
import { fmtCompactMoney, fmtPct } from "@/lib/format";
import { JARGON } from "@/lib/glossary";
import { useLiveData } from "@/lib/reconciliation/useLiveData";

export default function ReconciliationPage() {
  const { summary, breaks, connected } = useLiveData();

  return (
    <div className="px-6 py-10 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Payments Reconciliation &amp; Anomaly Detection
          </h1>
          <p className="text-secondary text-sm mt-1 max-w-2xl">
            An independent settlement feed runs alongside the observability platform&apos;s live
            transactions, and a batch engine matches the two every 30 seconds — the same shape as
            a real intraday reconciliation cycle, compressed so the breaks it catches are visible
            in a single sitting.
          </p>
        </div>
        <div
          className="badge shrink-0"
          style={{
            background: connected
              ? "color-mix(in srgb, var(--status-good) 14%, transparent)"
              : "color-mix(in srgb, var(--status-critical) 14%, transparent)",
            color: connected ? "var(--status-good)" : "var(--status-critical)",
          }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: connected ? "var(--status-good)" : "var(--status-critical)" }}
            aria-hidden
          />
          {connected ? "Live" : "Reconnecting…"}
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatTile
          label="Match rate (latest run)"
          value={
            summary?.latest_run?.match_rate != null ? fmtPct(summary.latest_run.match_rate) : "—"
          }
          sublabel={
            summary?.latest_run
              ? `${summary.latest_run.matched_count} of ${summary.latest_run.matched_count + summary.latest_run.break_count} matched`
              : "waiting for first run"
          }
          tooltip={JARGON.matchRate}
          icon={CircleGauge}
        />
        <StatTile
          label="Origination volume"
          value={summary ? fmtCompactMoney(summary.latest_run?.matched_amount ?? 0) : "—"}
          sublabel="matched, latest run"
          icon={Banknote}
        />
        <StatTile
          label="$ in open breaks"
          value={summary ? fmtCompactMoney(summary.total_break_amount) : "—"}
          sublabel={`across last ${summary?.runs_in_window ?? 0} run(s)`}
          icon={AlertTriangle}
        />
        <StatTile
          label="Overall match rate"
          value={summary?.overall_match_rate != null ? fmtPct(summary.overall_match_rate) : "—"}
          sublabel={`last ${summary?.runs_in_window ?? 0} run(s)`}
          tooltip={JARGON.matchRate}
          icon={RefreshCw}
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-1">
          <BreakTypeMix counts={summary?.break_counts_by_type ?? {}} />
        </div>
        <div className="lg:col-span-2 card p-5 flex flex-col gap-3">
          <h3 className="font-semibold">How this works</h3>
          <p className="text-secondary text-sm leading-relaxed">
            Every payments platform keeps at least two independent records of the same money
            movement: the system that originated it, and a downstream system that confirms it
            settled (core banking, a card network file, a correspondent bank). Those two records
            drift — a gateway times out after the money already moved, a settlement file gets a
            manual adjustment with no reference number, a batch runs twice. Reconciliation is the
            process that catches this before it becomes a customer-facing problem.
          </p>
          <p className="text-secondary text-sm leading-relaxed">
            This module simulates that independent settlement feed and reconciles it against the{" "}
            <a href="/observability" className="underline">
              observability platform&apos;s
            </a>{" "}
            transaction ledger — reading the same database directly rather than over an API, since
            both are ultimately consumers of the same shared history.
          </p>
        </div>
      </section>

      <section>
        <BreaksTable breaks={breaks} />
      </section>
    </div>
  );
}
