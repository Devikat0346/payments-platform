import { ArrowLeftRight, CreditCard, Landmark, Smartphone, type LucideIcon } from "lucide-react";
import { InfoTip } from "@/components/InfoTip";
import { RAIL_EXPLAINERS, RAIL_LABELS, Rail } from "@/lib/channels";
import { fmtCompactMoney, fmtPct, fmtPctPrecise } from "@/lib/format";
import { JARGON } from "@/lib/glossary";
import { RailMetric } from "@/lib/observability/types";

const RAIL_ORDER: Rail[] = ["CARD", "WIRE", "ACH_BATCH", "ZELLE"];

const RAIL_ICON: Record<Rail, LucideIcon> = {
  CARD: CreditCard,
  WIRE: ArrowLeftRight,
  ACH_BATCH: Landmark,
  ZELLE: Smartphone,
};

export function RailRollupCards({ rails }: { rails: Record<Rail, RailMetric> | undefined }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {RAIL_ORDER.map((rail) => {
        const m = rails?.[rail];
        const belowSlo =
          m?.success_rate !== null && m?.success_rate !== undefined && m.slo_success_rate
            ? m.success_rate < m.slo_success_rate
            : false;
        const RailIcon = RAIL_ICON[rail];
        return (
          <div key={rail} className="card p-5 flex flex-col gap-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-muted text-sm inline-flex items-center gap-1">
                {RAIL_LABELS[rail]}
                <InfoTip text={RAIL_EXPLAINERS[rail]} />
              </span>
              <span className="icon-tile !w-7 !h-7 !rounded-lg">
                <RailIcon size={14} strokeWidth={2} />
              </span>
            </div>
            <span className="text-2xl font-semibold tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
              {m ? m.total.toLocaleString() : "—"}
            </span>
            <span className="text-muted text-xs" style={{ fontVariantNumeric: "tabular-nums" }}>
              {m ? fmtCompactMoney(m.total_amount) : "—"} in volume
            </span>
            <span
              className="text-xs"
              style={{ color: belowSlo ? "var(--status-warning)" : "var(--text-secondary)" }}
            >
              {m ? fmtPct(m.success_rate) : "—"} success ·{" "}
              <span className="inline-flex items-center gap-1">
                {m ? fmtPct(m.slo_success_rate) : "—"} SLA
                <InfoTip text={JARGON.slo} />
              </span>
            </span>
            <span className="text-xs text-muted inline-flex items-center gap-1">
              Availability target: {m ? fmtPctPrecise(m.availability_slo_target) : "—"}
              <InfoTip text={JARGON.platformAvailability} />
            </span>
          </div>
        );
      })}
    </div>
  );
}
