import { RAIL_LABELS, Rail } from "@/lib/channels";
import { IncidentCase } from "@/lib/incidents/types";

const RAIL_ORDER: Rail[] = ["CARD", "WIRE", "ACH_BATCH", "ZELLE"];

export function RailBreakdown({ cases }: { cases: IncidentCase[] }) {
  const total = cases.length;

  return (
    <div className="card p-5">
      <h3 className="font-semibold mb-3">Cases by rail</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        {RAIL_ORDER.map((rail) => {
          const count = cases.filter((c) => c.rail === rail).length;
          const pct = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={rail} className="flex flex-col gap-0.5">
              <span className="text-muted text-xs">{RAIL_LABELS[rail]}</span>
              <span className="font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
                {count}
                {total > 0 && <span className="text-muted text-xs font-normal"> ({pct.toFixed(0)}%)</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
