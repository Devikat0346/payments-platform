"use client";

import { ArrowLeftRight, CreditCard, Landmark, Smartphone, type LucideIcon } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { HealthBadge } from "./HealthBadge";
import { Meter } from "./Meter";
import { InfoTip } from "@/components/InfoTip";
import { HistoryPoint } from "@/lib/observability/useLiveData";
import { ChannelMetric } from "@/lib/observability/types";
import { BATCH_CHANNELS, CHANNEL_LABELS, CHANNEL_ORIGIN_DESCRIPTIONS, Rail } from "@/lib/channels";
import { fmtMs, fmtPct } from "@/lib/format";
import { JARGON } from "@/lib/glossary";

const RAIL_ICON: Record<Rail, LucideIcon> = {
  CARD: CreditCard,
  WIRE: ArrowLeftRight,
  ACH_BATCH: Landmark,
  ZELLE: Smartphone,
};

// Same hue each rail uses in the transaction-type-mix chart, so identity stays
// consistent wherever a rail shows up — never repainted per view.
const RAIL_COLOR: Record<Rail, string> = {
  CARD: "var(--cat-blue)",
  WIRE: "var(--cat-yellow)",
  ACH_BATCH: "var(--cat-green)",
  ZELLE: "var(--cat-aqua)",
};

interface ChannelCardProps {
  metric: ChannelMetric;
  history: HistoryPoint[];
}

function TypeBreakdownLine({ breakdown }: { breakdown: Record<string, { total: number; total_amount: number }> }) {
  const entries = Object.entries(breakdown);
  const total = entries.reduce((sum, [, v]) => sum + v.total, 0);
  if (total === 0) return null;

  return (
    <div className="text-xs text-secondary flex flex-wrap gap-x-3 gap-y-0.5">
      {entries.map(([type, v]) => (
        <span key={type} className="capitalize">
          {type}: {((v.total / total) * 100).toFixed(0)}%
        </span>
      ))}
    </div>
  );
}

export function ChannelCard({ metric, history }: ChannelCardProps) {
  const isBatch = BATCH_CHANNELS.includes(metric.channel);
  const RailIcon = RAIL_ICON[metric.rail];
  const railColor = RAIL_COLOR[metric.rail];

  const chartData = isBatch
    ? history.map((h) => ({ t: h.t, value: h.successRate !== null ? h.successRate * 100 : null }))
    : history.map((h) => ({ t: h.t, value: h.p50 }));
  const chartPointCount = chartData.filter((d) => d.value !== null).length;

  return (
    <div className="card card-interactive p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <span
            className="icon-tile mt-0.5"
            style={{ background: `color-mix(in srgb, ${railColor} 15%, transparent)`, color: railColor }}
          >
            <RailIcon size={16} strokeWidth={2} />
          </span>
          <div>
            <h3 className="font-semibold leading-tight">{CHANNEL_LABELS[metric.channel]}</h3>
            <p className="text-muted text-xs">{CHANNEL_ORIGIN_DESCRIPTIONS[metric.channel]}</p>
          </div>
        </div>
        <HealthBadge health={metric.health} />
      </div>

      {metric.active_incident && (
        <div
          className="text-xs rounded-md px-2.5 py-1.5"
          style={{ background: "color-mix(in srgb, var(--status-warning) 15%, transparent)", color: "var(--text-primary)" }}
        >
          ⚠ {metric.active_incident.description}
        </div>
      )}

      <div className="h-14 -mx-1">
        {chartPointCount >= 2 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
              <YAxis hide domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{
                  background: "var(--surface-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelFormatter={() => ""}
                formatter={(value) =>
                  isBatch
                    ? [`${typeof value === "number" ? value.toFixed(1) : "—"}%`, "success rate"]
                    : [fmtMs(typeof value === "number" ? value : null), "p50 latency"]
                }
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={railColor}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center text-muted text-xs">Collecting data…</div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <div className="text-muted text-xs">Success rate</div>
          <div className="font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
            {fmtPct(metric.success_rate)}
          </div>
        </div>
        {isBatch ? (
          <>
            <div>
              <div className="text-muted text-xs">Processed (5m)</div>
              <div className="font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
                {metric.total.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-muted text-xs">Returned/failed</div>
              <div className="font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
                {metric.failure.toLocaleString()}
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <div className="text-muted text-xs inline-flex items-center gap-1">
                Typical speed
                <InfoTip text={JARGON.typicalSpeed} />
              </div>
              <div className="font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
                {fmtMs(metric.p50_latency_ms)}
              </div>
            </div>
            <div>
              <div className="text-muted text-xs inline-flex items-center gap-1">
                Slowest cases
                <InfoTip text={JARGON.slowestCases} />
              </div>
              <div className="font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
                {fmtMs(metric.p99_latency_ms)}
              </div>
            </div>
          </>
        )}
      </div>

      {metric.txn_type_breakdown && <TypeBreakdownLine breakdown={metric.txn_type_breakdown} />}

      <Meter
        label="Platform availability (30m)"
        pct={metric.availability_burn_pct}
        tooltip={JARGON.platformAvailability}
        sloTarget={metric.availability_slo_target}
        sloLabel="Target (5 nines)"
        sloTargetPrecise
        countContext={
          metric.availability_budget_window_technical_failures > 0
            ? `${metric.availability_budget_window_technical_failures} technical failure${metric.availability_budget_window_technical_failures === 1 ? "" : "s"} of ${metric.availability_budget_window_total}`
            : undefined
        }
      />

      <Meter
        label="Approval-rate budget (30m)"
        pct={metric.error_budget_burn_pct}
        tooltip={JARGON.approvalRate}
        sloTarget={metric.slo_success_rate}
        sloLabel="Agreed SLA"
      />
    </div>
  );
}
