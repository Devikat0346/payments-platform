import { BREAK_CONFIG } from "./BreakBadge";
import { InfoTip } from "@/components/InfoTip";
import { JARGON } from "@/lib/glossary";
import { BreakType } from "@/lib/reconciliation/types";

const TYPE_ORDER: BreakType[] = [
  "missing_settlement",
  "duplicate_settlement",
  "amount_mismatch",
  "orphaned_settlement",
];

const TYPE_JARGON_KEY: Record<BreakType, string> = {
  missing_settlement: "missingSettlement",
  duplicate_settlement: "duplicateSettlement",
  amount_mismatch: "amountMismatch",
  orphaned_settlement: "orphanedSettlement",
};

export function BreakTypeMix({ counts }: { counts: Partial<Record<BreakType, number>> }) {
  const total = TYPE_ORDER.reduce((sum, t) => sum + (counts[t] ?? 0), 0);

  return (
    <div className="card p-5 flex flex-col gap-3">
      <h3 className="font-semibold">Breaks by type</h3>
      <div className="flex flex-col gap-2.5">
        {TYPE_ORDER.map((t) => {
          const cfg = BREAK_CONFIG[t];
          const Icon = cfg.icon;
          const count = counts[t] ?? 0;
          const pct = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={t} className="flex items-center gap-2.5">
              <span
                className="icon-tile !w-7 !h-7 !rounded-lg shrink-0"
                style={{ background: `color-mix(in srgb, ${cfg.color} 15%, transparent)`, color: cfg.color }}
              >
                <Icon size={13} strokeWidth={2.5} />
              </span>
              <span className="text-secondary text-sm inline-flex items-center gap-1">
                {cfg.label}
                <InfoTip text={JARGON[TYPE_JARGON_KEY[t]]} />
              </span>
              <span className="ml-auto text-sm font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
                {count}
              </span>
              <span className="text-muted text-xs w-10 text-right" style={{ fontVariantNumeric: "tabular-nums" }}>
                {total > 0 ? `${pct.toFixed(0)}%` : "—"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
