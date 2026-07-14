import { InfoTip } from "@/components/InfoTip";
import { fmtBudgetBurn, fmtPct } from "@/lib/format";

interface MeterProps {
  label: string;
  pct: number; // error-budget burn, 0-100 nominal, can exceed 100
  tooltip: string;
  sloTarget?: number; // the agreed target this budget is measured against
  sloLabel?: string; // defaults to "Agreed SLA"
}

function severityColor(pct: number): string {
  if (pct >= 100) return "var(--status-critical)";
  if (pct >= 70) return "var(--status-warning)";
  return "var(--seq-blue-450)";
}

export function Meter({ label, pct, tooltip, sloTarget, sloLabel = "Agreed SLA" }: MeterProps) {
  const display = Math.min(pct, 100);
  const color = severityColor(pct);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-secondary inline-flex items-center gap-1">
          {label}
          <InfoTip text={tooltip} />
        </span>
        <span className="font-medium" style={{ fontVariantNumeric: "tabular-nums", color }}>
          {fmtBudgetBurn(pct)}
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: "var(--seq-blue-300)", opacity: 0.25 }}
      >
      </div>
      <div
        className="h-2 rounded-full -mt-2 transition-all duration-500"
        style={{ width: `${display}%`, background: color }}
      />
      {sloTarget !== undefined && (
        <span className="text-muted text-xs">
          {sloLabel}: {fmtPct(sloTarget)}
        </span>
      )}
    </div>
  );
}
