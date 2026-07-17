"use client";

import { useEffect, useState } from "react";
import { Banknote, PiggyBank, Receipt, TrendingUp } from "lucide-react";
import { EconomicsCard } from "@/components/insights/EconomicsCard";
import { ForecastChart } from "@/components/insights/ForecastChart";
import { ScenarioCalculator } from "@/components/insights/ScenarioCalculator";
import { StatTile } from "@/components/StatTile";
import { fmtCompactMoney } from "@/lib/format";
import { fetchEconomics, fetchSummary } from "@/lib/insights/api";
import { InsightsSummary, RailEconomics } from "@/lib/insights/types";

export default function InsightsPage() {
  const [summary, setSummary] = useState<InsightsSummary | null>(null);
  const [economics, setEconomics] = useState<RailEconomics | null>(null);
  const [error, setError] = useState(false);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const slowTimer = setTimeout(() => {
      if (!cancelled) setSlow(true);
    }, 6000);
    (async () => {
      try {
        const [summaryData, economicsData] = await Promise.all([fetchSummary(), fetchEconomics()]);
        if (cancelled) return;
        setSummary(summaryData);
        setEconomics(economicsData);
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
  }, []);

  return (
    <div className="px-6 py-10 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Payments Business Insights &amp; ROI Modeling
        </h1>
        <p className="text-secondary text-sm mt-1 max-w-2xl">
          Payments economics, KPI tracking, a backtested revenue/volume forecast, and a
          rail-shift scenario calculator — computed from the same shared transaction ledger as
          the rest of this platform, over however much real history has accumulated so far.
        </p>
      </header>

      {error && (
        <div className="card p-6 text-center text-secondary text-sm mb-8">
          Couldn&apos;t reach the insights service — it may be waking up from a cold start,
          refresh in a moment.
        </div>
      )}

      {!error && slow && !summary && (
        <div className="card p-4 text-center text-secondary text-xs mb-8">
          Still loading — the forecast endpoint fits a statistical model on every request and can
          take up to 20s on this service&apos;s free tier, especially right after it wakes up.
        </div>
      )}

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatTile
          label="Total revenue"
          value={summary ? fmtCompactMoney(summary.total_revenue) : "—"}
          sublabel={summary ? `across ${summary.periods} hourly period(s)` : undefined}
          icon={Banknote}
        />
        <StatTile
          label="Total volume"
          value={summary ? fmtCompactMoney(summary.total_volume) : "—"}
          sublabel={summary ? `${summary.total_count.toLocaleString()} transactions` : undefined}
          icon={TrendingUp}
        />
        <StatTile
          label="Total cost"
          value={summary ? fmtCompactMoney(summary.total_cost) : "—"}
          sublabel="modeled network/processing cost"
          icon={Receipt}
        />
        <StatTile
          label="Net margin"
          value={summary ? fmtCompactMoney(summary.total_revenue - summary.total_cost) : "—"}
          sublabel="revenue minus cost"
          icon={PiggyBank}
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-1">
          <EconomicsCard economics={economics} />
        </div>
        <div className="lg:col-span-2">
          <ForecastChart />
        </div>
      </section>

      <section>
        <ScenarioCalculator />
      </section>
    </div>
  );
}
