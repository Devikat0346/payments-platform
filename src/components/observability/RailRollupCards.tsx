import { RAIL_LABELS, Rail } from "@/lib/channels";
import { RailMetric } from "@/lib/observability/types";

const RAIL_ORDER: Rail[] = ["CARD", "WIRE", "ACH_BATCH", "ZELLE"];

function fmtPct(v: number | null): string {
  if (v === null || v === undefined) return "—";
  return `${(v * 100).toFixed(1)}%`;
}

export function RailRollupCards({ rails }: { rails: Record<Rail, RailMetric> | undefined }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {RAIL_ORDER.map((rail) => {
        const m = rails?.[rail];
        const belowSlo =
          m?.success_rate !== null && m?.success_rate !== undefined && m.slo_success_rate
            ? m.success_rate < m.slo_success_rate
            : false;
        return (
          <div key={rail} className="card p-5 flex flex-col gap-1">
            <span className="text-muted text-sm">{RAIL_LABELS[rail]}</span>
            <span className="text-2xl font-semibold tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
              {m ? m.total.toLocaleString() : "—"}
            </span>
            <span
              className="text-xs"
              style={{ color: belowSlo ? "var(--status-warning)" : "var(--text-secondary)" }}
            >
              {m ? fmtPct(m.success_rate) : "—"} success · {m ? fmtPct(m.slo_success_rate) : "—"} SLO target
            </span>
          </div>
        );
      })}
    </div>
  );
}
