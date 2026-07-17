import { ArrowLeftRight, CreditCard, Landmark, Smartphone, type LucideIcon } from "lucide-react";
import { InfoTip } from "@/components/InfoTip";
import { Rail, RAIL_LABELS } from "@/lib/channels";
import { RailEconomics } from "@/lib/insights/types";

const RAIL_ICON: Record<Rail, LucideIcon> = {
  CARD: CreditCard,
  WIRE: ArrowLeftRight,
  ACH_BATCH: Landmark,
  ZELLE: Smartphone,
};

const RAIL_COLOR: Record<Rail, string> = {
  CARD: "var(--cat-blue)",
  WIRE: "var(--cat-yellow)",
  ACH_BATCH: "var(--cat-green)",
  ZELLE: "var(--cat-aqua)",
};

const RAIL_MODEL_NOTE: Record<Rail, string> = {
  CARD: "Interchange revenue scales with dollar volume — a percentage of every approved transaction.",
  WIRE: "A flat fee per wire regardless of amount — a $50 wire and a $5M wire earn the same fee.",
  ACH_BATCH: "A small flat per-item fee — high volume, low margin by design.",
  ZELLE: "No direct revenue. Real Zelle is free to consumers — this rail is a cost center funded by retention value, not fees.",
};

const RAIL_ORDER: Rail[] = ["CARD", "WIRE", "ACH_BATCH", "ZELLE"];

export function EconomicsCard({ economics }: { economics: RailEconomics | null }) {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <h3 className="font-semibold">Rail economics</h3>
        <InfoTip text="Modeled assumptions, not real card-network or ACH-operator rate schedules — those aren't public and vary by issuer agreement. These illustrate the shape of each rail's revenue model." />
      </div>
      <div className="flex flex-col gap-3">
        {RAIL_ORDER.map((rail) => {
          const Icon = RAIL_ICON[rail];
          const color = RAIL_COLOR[rail];
          const econ = economics?.[rail];
          return (
            <div key={rail} className="flex items-start gap-3">
              <span
                className="icon-tile mt-0.5"
                style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}
              >
                <Icon size={15} strokeWidth={2} />
              </span>
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium text-sm">{RAIL_LABELS[rail]}</span>
                  <span className="text-xs text-secondary" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {econ
                      ? econ.revenue_rate > 0
                        ? `${(econ.revenue_rate * 100).toFixed(1)}% interchange`
                        : econ.revenue_flat > 0
                        ? `$${econ.revenue_flat.toFixed(2)}/txn`
                        : "$0/txn"
                      : "—"}
                  </span>
                </div>
                <p className="text-muted text-xs mt-0.5">{RAIL_MODEL_NOTE[rail]}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
