import { TXN_TYPE_LABELS } from "@/lib/channels";
import { TxnType, TxnTypeMetric } from "@/lib/observability/types";

const TYPE_ORDER: TxnType[] = ["credit", "debit", "wire", "zelle"];
const TYPE_COLOR: Record<TxnType, string> = {
  credit: "var(--cat-blue)",
  debit: "var(--cat-aqua)",
  wire: "var(--cat-yellow)",
  zelle: "var(--cat-green)",
};

export function TxnTypeMix({
  txnTypes,
}: {
  txnTypes: Record<TxnType, TxnTypeMetric> | undefined;
}) {
  const total = TYPE_ORDER.reduce((sum, t) => sum + (txnTypes?.[t]?.total ?? 0), 0);

  return (
    <div className="card p-5 flex flex-col gap-4">
      <h3 className="font-semibold">Transaction type mix</h3>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
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
