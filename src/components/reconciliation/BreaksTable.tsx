import { BreakBadge } from "./BreakBadge";
import { CHANNEL_LABELS } from "@/lib/channels";
import { fmtMoney } from "@/lib/format";
import { ReconciliationBreak } from "@/lib/reconciliation/types";

export function BreaksTable({ breaks }: { breaks: ReconciliationBreak[] }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: "var(--status-warning)" }}
          aria-hidden
        />
        <h3 className="font-semibold">Reconciliation breaks</h3>
      </div>
      <div className="max-h-[32rem] overflow-y-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted text-xs sticky top-0" style={{ background: "var(--surface-card)" }}>
              <th className="px-5 py-2 font-medium">Detected</th>
              <th className="px-5 py-2 font-medium">Type</th>
              <th className="px-5 py-2 font-medium">Channel</th>
              <th className="px-5 py-2 font-medium">Origination</th>
              <th className="px-5 py-2 font-medium">Settlement</th>
              <th className="px-5 py-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {breaks.slice(0, 100).map((b, i) => (
              <tr
                key={b.id}
                className="border-t"
                style={{
                  borderColor: "var(--gridline)",
                  background: i % 2 === 1 ? "color-mix(in srgb, var(--text-primary) 2%, transparent)" : "transparent",
                }}
              >
                <td className="px-5 py-2 text-muted whitespace-nowrap" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {new Date(b.detected_at).toLocaleTimeString()}
                </td>
                <td className="px-5 py-2">
                  <BreakBadge type={b.break_type} />
                </td>
                <td className="px-5 py-2 whitespace-nowrap">{CHANNEL_LABELS[b.channel] ?? b.channel}</td>
                <td className="px-5 py-2" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {b.origination_amount !== null ? fmtMoney(b.origination_amount) : "—"}
                </td>
                <td className="px-5 py-2" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {b.settlement_amount !== null ? fmtMoney(b.settlement_amount) : "—"}
                </td>
                <td className="px-5 py-2 text-secondary text-xs max-w-md">{b.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {breaks.length === 0 && (
          <div className="px-5 py-8 text-center text-muted text-sm">
            No breaks yet — waiting for the first reconciliation run.
          </div>
        )}
      </div>
    </div>
  );
}
