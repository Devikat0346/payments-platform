"use client";

import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  Banknote,
  CircleGauge,
  ShieldCheck,
  TrendingDown,
} from "lucide-react";
import { ChannelCard } from "@/components/observability/ChannelCard";
import { IncidentBanner } from "@/components/observability/IncidentBanner";
import { LiveFeed } from "@/components/observability/LiveFeed";
import { RailRollupCards } from "@/components/observability/RailRollupCards";
import { TxnTypeMix } from "@/components/observability/TxnTypeMix";
import { StatTile } from "@/components/StatTile";
import { useLiveData } from "@/lib/observability/useLiveData";
import { CHANNEL_LABELS, Channel, RAIL_EXPLAINERS, RAIL_LABELS, Rail } from "@/lib/channels";
import { fmtBudgetBurn, fmtCompactMoney, fmtPct, fmtPctPrecise, fmtVolumeShare } from "@/lib/format";
import { JARGON } from "@/lib/glossary";

const RAIL_CHANNEL_GROUPS: { rail: Rail; channels: Channel[] }[] = [
  { rail: "CARD", channels: ["pos", "ecommerce", "mobile_wallet"] },
  { rail: "WIRE", channels: ["wire_online", "wire_branch", "wire_loaniq", "wire_batch", "wire_ivr"] },
  { rail: "ACH_BATCH", channels: ["ach_batch_file"] },
  { rail: "ZELLE", channels: ["zelle_mobile", "zelle_online"] },
];

export default function ObservabilityPage() {
  const { metrics, feed, incidents, history, connected } = useLiveData();

  const channels = metrics ? Object.values(metrics.channels) : [];
  const totalTxns = channels.reduce((sum, c) => sum + c.total, 0);
  const totalSuccess = channels.reduce((sum, c) => sum + c.success, 0);
  const overallSuccessRate = totalTxns > 0 ? totalSuccess / totalTxns : null;
  const activeIncidentCount = incidents.filter((i) => i.active).length;
  const worstChannel = channels.length
    ? channels.reduce((worst, c) => (c.error_budget_burn_pct > worst.error_budget_burn_pct ? c : worst))
    : null;
  const totalDollarVolume = channels.reduce((sum, c) => sum + c.total_amount, 0);
  const failedDollarVolume = channels.reduce((sum, c) => sum + c.failure_amount, 0);
  const failedVolumeShare = fmtVolumeShare(failedDollarVolume, totalDollarVolume);
  const totalTechnicalFailures = channels.reduce((sum, c) => sum + c.technical_failures, 0);
  const platformAvailability = totalTxns > 0 ? (totalTxns - totalTechnicalFailures) / totalTxns : null;

  return (
    <div className="px-6 py-10 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Multi-Rail Payments Observability
          </h1>
          <p className="text-secondary text-sm mt-1">
            Simulated credit, debit, wire &amp; Zelle transactions across real-time and batch
            origination channels — with live SLIs, SLOs, and error-budget tracking. Every rail
            carries a five-nines (99.999%) platform availability target, tracked separately from
            each rail&apos;s own approval-rate SLA.
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

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatTile
          label="Transactions (5m window)"
          value={totalTxns.toLocaleString()}
          sublabel="across all channels"
          icon={Activity}
        />
        <StatTile
          label="Total volume processed"
          value={fmtCompactMoney(totalDollarVolume)}
          sublabel="5m window, all channels"
          icon={Banknote}
        />
        <StatTile
          label="Platform availability"
          value={platformAvailability !== null ? fmtPctPrecise(platformAvailability) : "—"}
          sublabel="Target: 99.999% (5 nines)"
          tooltip={JARGON.platformAvailability}
          icon={ShieldCheck}
        />
        <StatTile
          label="Overall approval rate"
          value={overallSuccessRate !== null ? `${(overallSuccessRate * 100).toFixed(2)}%` : "—"}
          tooltip={JARGON.approvalRate}
          icon={CircleGauge}
        />
        <StatTile
          label="Dollars in failed payments"
          value={fmtCompactMoney(failedDollarVolume)}
          sublabel={failedVolumeShare ? `${failedVolumeShare} of the total above` : "5m window"}
          icon={ArrowDownRight}
        />
        <StatTile
          label="Active incidents"
          value={String(activeIncidentCount)}
          sublabel={activeIncidentCount ? "channels degraded" : "all clear"}
          icon={AlertTriangle}
        />
        <StatTile
          label="Biggest approval-rate miss"
          value={worstChannel && worstChannel.error_budget_burn_pct > 0 ? fmtBudgetBurn(worstChannel.error_budget_burn_pct) : "None"}
          sublabel={
            worstChannel && worstChannel.error_budget_burn_pct > 0
              ? `${CHANNEL_LABELS[worstChannel.channel]} · SLA: ${fmtPct(worstChannel.slo_success_rate)}`
              : "all within target"
          }
          tooltip={JARGON.approvalRate}
          icon={TrendingDown}
        />
      </section>

      <section className="mb-8">
        <IncidentBanner incidents={incidents} />
      </section>

      <section className="mb-8">
        <h2 className="section-label mb-3">Rails &amp; transaction types</h2>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <RailRollupCards rails={metrics?.rails} />
          </div>
          <TxnTypeMix txnTypes={metrics?.txn_types} />
        </div>
      </section>

      {RAIL_CHANNEL_GROUPS.map((group) => (
        <section key={group.rail} className="mb-8">
          <div className="mb-3">
            <h2 className="section-label">
              {RAIL_LABELS[group.rail]} — origination channels
            </h2>
            <p className="text-muted text-xs mt-1.5 max-w-2xl">{RAIL_EXPLAINERS[group.rail]}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {group.channels.map((channel) => {
              const metric = metrics?.channels[channel];
              if (!metric) {
                return (
                  <div key={channel} className="card p-5 text-muted text-sm">
                    {CHANNEL_LABELS[channel]} — collecting data…
                  </div>
                );
              }
              return (
                <ChannelCard key={channel} metric={metric} history={history[channel] ?? []} />
              );
            })}
          </div>
        </section>
      ))}

      <section>
        <LiveFeed transactions={feed} />
      </section>
    </div>
  );
}
