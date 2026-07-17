"use client";

import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { InfoTip } from "@/components/InfoTip";
import { fmtCompactMoney } from "@/lib/format";
import { fetchForecast } from "@/lib/insights/api";
import { ForecastResult } from "@/lib/insights/types";

const METRICS: { key: "revenue" | "volume"; label: string }[] = [
  { key: "revenue", label: "Revenue" },
  { key: "volume", label: "Volume" },
];

export function ForecastChart() {
  const [metric, setMetric] = useState<"revenue" | "volume">("revenue");
  const [result, setResult] = useState<ForecastResult | null>(null);
  const [error, setError] = useState(false);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const slowTimer = setTimeout(() => {
      if (!cancelled) setSlow(true);
    }, 6000);
    (async () => {
      setResult(null);
      setSlow(false);
      try {
        const data: ForecastResult = await fetchForecast(metric, 12);
        if (!cancelled) setResult(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setSlow(false);
      }
    })();
    return () => {
      cancelled = true;
      clearTimeout(slowTimer);
    };
  }, [metric]);

  const lastHistoricalIndex = result ? result.points.map((p) => p.is_forecast).lastIndexOf(false) : -1;
  const chartData =
    result?.points.map((p, i) => ({
      t: new Date(p.period_start).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric" }),
      historical: p.is_forecast ? null : p.value,
      forecast: p.is_forecast || i === lastHistoricalIndex ? p.value : null,
    })) ?? [];

  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <h3 className="font-semibold">Trend &amp; forecast</h3>
          <InfoTip text="Holt's linear-trend forecast, backtested by holding out the last few periods and scoring the forecast against what actually happened. The MAPE score is shown as-is, including when it's unflattering — synthetic transaction volume is close to random noise hour to hour, so a simple trend model often can't predict it well, and that's worth knowing rather than hiding." />
        </div>
        <div className="flex items-center gap-1">
          {METRICS.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMetric(m.key)}
              className="text-xs font-medium px-2.5 py-1 rounded-full transition-colors"
              style={{
                background: metric === m.key ? "var(--accent)" : "transparent",
                color: metric === m.key ? "var(--accent-fg)" : "var(--text-secondary)",
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-secondary text-sm">Couldn&apos;t load the forecast.</p>}
      {!error && !result && (
        <p className="text-muted text-sm">
          {slow
            ? "Still fitting the forecast — this can take up to 20s on the free tier, especially right after a cold start."
            : "Loading…"}
        </p>
      )}

      {result?.insufficient_data && (
        <p className="text-muted text-sm italic">
          Not enough history yet to forecast — check back once more data has accumulated.
        </p>
      )}

      {result && !result.insufficient_data && (
        <>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted">Backtest accuracy:</span>
            {result.backtest_mape !== null ? (
              <span
                className="font-medium px-2 py-0.5 rounded-full"
                style={{
                  background:
                    result.backtest_mape < 15
                      ? "color-mix(in srgb, var(--status-good) 15%, transparent)"
                      : "color-mix(in srgb, var(--status-warning) 15%, transparent)",
                  color: result.backtest_mape < 15 ? "var(--status-good)" : "var(--status-warning)",
                }}
              >
                {result.backtest_mape.toFixed(1)}% MAPE
              </span>
            ) : (
              <span className="text-muted">unavailable</span>
            )}
          </div>
          <div className="h-64 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--gridline)" vertical={false} />
                <XAxis dataKey="t" tick={{ fontSize: 10, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} minTickGap={40} />
                <YAxis
                  tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => fmtCompactMoney(v)}
                  width={56}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface-card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(value) => [fmtCompactMoney(typeof value === "number" ? value : 0), metric]}
                />
                <Line type="monotone" dataKey="historical" stroke="var(--accent)" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
