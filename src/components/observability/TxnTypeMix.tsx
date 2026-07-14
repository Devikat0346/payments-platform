import { TXN_TYPE_LABELS } from "@/lib/channels";
import { TxnTypeBreakdownKey, TxnTypeMetric } from "@/lib/observability/types";

// Card and ACH each get two shades of the same hue (credit = saturated, debit =
// lighter) so the chart visually groups "these two both belong to this rail"
// instead of reading as six unrelated categories — card_credit and ach_credit
// are deliberately NOT the same color, since summing them would be the exact
// conflation this breakdown exists to avoid.
const TYPE_ORDER: TxnTypeBreakdownKey[] = [
  "card_credit",
  "card_debit",
  "ach_credit",
  "ach_debit",
  "wire",
  "zelle",
];
const TYPE_COLOR: Record<TxnTypeBreakdownKey, string> = {
  card_credit: "var(--cat-blue)",
  card_debit: "var(--seq-blue-300)",
  ach_credit: "var(--cat-green)",
  ach_debit: "var(--cat-green-light)",
  wire: "var(--cat-yellow)",
  zelle: "var(--cat-aqua)",
};

export function TxnTypeMix({
  txnTypes,
}: {
  txnTypes: Record<TxnTypeBreakdownKey, TxnTypeMetric> | undefined;
}) {
  const total = TYPE_ORDER.reduce((sum, t) => sum + (txnTypes?.[t]?.total ?? 0), 0);

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div>
        <h3 className="font-semibold">Transaction type mix</h3>
        <p className="text-muted text-xs mt-0.5">
          Card and ACH are each split into credit vs. debit — they&apos;re never combined, since a
          card credit and an ACH credit are different payment mechanisms.
        </p>
      </div>
      <div
        className="flex h-7 rounded-md overflow-hidden gap-0.5"
        style={{ background: "var(--surface-card)" }}
      >
        {TYPE_ORDER.map((t) => {
          const count = txnTypes?.[t]?.total ?? 0;
          const pct = total > 0 ? (count / total) * 100 : 0;
          if (pct === 0) return null;
          return (
            <div
              key={t}
              style={{ width: `${pct}%`, background: TYPE_COLOR[t] }}
              title={`${TXN_TYPE_LABELS[t]}: ${pct.toFixed(1)}%`}
            />
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {TYPE_ORDER.map((t) => {
          const count = txnTypes?.[t]?.total ?? 0;
          const pct = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={t} className="flex items-center gap-2">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: TYPE_COLOR[t] }}
                aria-hidden
              />
              <span className="text-secondary">{TXN_TYPE_LABELS[t]}</span>
              <span className="text-muted ml-auto" style={{ fontVariantNumeric: "tabular-nums" }}>
                {pct.toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
