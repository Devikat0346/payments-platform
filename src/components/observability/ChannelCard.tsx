"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { HealthBadge } from "./HealthBadge";
import { Meter } from "./Meter";
import { HistoryPoint } from "@/lib/observability/useLiveData";
import { ChannelMetric } from "@/lib/observability/types";
import { BATCH_CHANNELS, CHANNEL_LABELS, CHANNEL_ORIGIN_DESCRIPTIONS } from "@/lib/channels";
import { fmtMs, fmtPct } from "@/lib/format";

interface ChannelCardProps {
  metric: ChannelMetric;
  history: HistoryPoint[];
}

export function ChannelCard({ metric, history }: ChannelCardProps) {
  const isBatch = BATCH_CHANNELS.includes(metric.channel);

  const chartData = isBatch
    ? history.map((h) => ({ t: h.t, value: h.successRate !== null ? h.successRate * 100 : null }))
    : history.map((h) => ({ t: h.t, value: h.p50 }));

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold leading-tight">{CHANNEL_LABELS[metric.channel]}</h3>
          <p className="text-muted text-xs">{CHANNEL_ORIGIN_DESCRIPTIONS[metric.channel]}</p>
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
        {chartData.some((d) => d.value !== null) ? (
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
                stroke="var(--seq-blue-450)"
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
              <div className="text-muted text-xs">p50 latency</div>
              <div className="font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
                {fmtMs(metric.p50_latency_ms)}
              </div>
            </div>
            <div>
              <div className="text-muted text-xs">p99 latency</div>
              <div className="font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
                {fmtMs(metric.p99_latency_ms)}
              </div>
            </div>
          </>
        )}
      </div>

      <Meter label="Error budget burn (30m window)" pct={metric.error_budget_burn_pct} />
    </div>
  );
}
