"use client";

import { ChannelCard } from "@/components/observability/ChannelCard";
import { IncidentBanner } from "@/components/observability/IncidentBanner";
import { LiveFeed } from "@/components/observability/LiveFeed";
import { RailRollupCards } from "@/components/observability/RailRollupCards";
import { TxnTypeMix } from "@/components/observability/TxnTypeMix";
import { StatTile } from "@/components/StatTile";
import { useLiveData } from "@/lib/observability/useLiveData";
import { CHANNEL_LABELS, Channel, RAIL_EXPLAINERS, RAIL_LABELS, Rail } from "@/lib/channels";
import { fmtBudgetBurn, fmtCompactMoney, fmtPct, fmtVolumeShare } from "@/lib/format";
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

  return (
    <div className="px-6 py-10 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Multi-Rail Payments Observability
          </h1>
          <p className="text-secondary text-sm mt-1">
            Simulated credit, debit, wire &amp; Zelle transactions across real-time and batch
            origination channels — with live SLIs, SLOs, and error-budget tracking.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm shrink-0">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: connected ? "var(--status-good)" : "var(--status-critical)" }}
            aria-hidden
          />
          <span className="text-secondary">{connected ? "Live" : "Reconnecting…"}</span>
        </div>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatTile
          label="Transactions (5m window)"
          value={totalTxns.toLocaleString()}
          sublabel="across all channels"
        />
        <StatTile
          label="Total volume processed"
          value={fmtCompactMoney(totalDollarVolume)}
          sublabel="5m window, all channels"
        />
        <StatTile
          label="Overall success rate"
          value={overallSuccessRate !== null ? `${(overallSuccessRate * 100).toFixed(2)}%` : "—"}
        />
        <StatTile
          label="Dollars in failed payments"
          value={fmtCompactMoney(failedDollarVolume)}
          sublabel={failedVolumeShare ? `${failedVolumeShare} of the total above` : "5m window"}
        />
        <StatTile
          label="Active incidents"
          value={String(activeIncidentCount)}
          sublabel={activeIncidentCount ? "channels degraded" : "all clear"}
        />
        <StatTile
          label="Biggest reliability miss"
          value={worstChannel && worstChannel.error_budget_burn_pct > 0 ? fmtBudgetBurn(worstChannel.error_budget_burn_pct) : "None"}
          sublabel={
            worstChannel && worstChannel.error_budget_burn_pct > 0
              ? `${CHANNEL_LABELS[worstChannel.channel]} · SLA: ${fmtPct(worstChannel.slo_success_rate)}`
              : "all within target"
          }
          tooltip={JARGON.errorBudgetBurn}
        />
      </section>

      <section className="mb-8">
        <IncidentBanner incidents={incidents} />
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-secondary uppercase tracking-wide mb-3">
          Rails &amp; transaction types
        </h2>
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
            <h2 className="text-sm font-semibold text-secondary uppercase tracking-wide">
              {RAIL_LABELS[group.rail]} — origination channels
            </h2>
            <p className="text-muted text-xs mt-0.5 max-w-2xl">{RAIL_EXPLAINERS[group.rail]}</p>
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
