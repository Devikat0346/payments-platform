import { ConfidenceBadge, SeverityBadge } from "./Badges";
import { CHANNEL_LABELS, Channel, RAIL_LABELS, Rail } from "@/lib/channels";
import { fmtCompactMoney, fmtPct } from "@/lib/format";
import { IncidentCase } from "@/lib/incidents/types";

function fmtSeconds(v: number | null): string {
  if (v === null) return "—";
  return v < 1 ? `${(v * 1000).toFixed(0)}ms` : `${v.toFixed(1)}s`;
}

export function CaseCard({ c }: { c: IncidentCase }) {
  const failureAmount = c.metrics_snapshot?.failure_amount;
  const dollarImpact = typeof failureAmount === "number" && failureAmount > 0 ? failureAmount : null;
  const sloTarget = c.metrics_snapshot?.slo_success_rate;
  const actualSuccessRate = c.metrics_snapshot?.success_rate;

  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <h3 className="font-semibold">{CHANNEL_LABELS[c.channel as Channel] ?? c.channel}</h3>
          <p className="text-muted text-xs">
            {RAIL_LABELS[c.rail as Rail] ?? c.rail} · Detected {new Date(c.detected_at).toLocaleString()}
            {c.resolved_at && ` · resolved ${new Date(c.resolved_at).toLocaleTimeString()}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-medium text-secondary"
          >
            <span
              className="inline-block w-2 h-2 rounded-full shrink-0"
              style={{ background: c.active ? "var(--status-warning)" : "var(--status-good)" }}
              aria-hidden
            />
            {c.active ? "Active" : "Resolved"}
          </span>
          <SeverityBadge severity={c.severity} />
          <ConfidenceBadge confidence={c.confidence} />
        </div>
      </div>

      {typeof sloTarget === "number" && (
        <div className="text-xs text-secondary">
          Agreed SLA: <span className="font-medium">{fmtPct(sloTarget)} success</span>
          {typeof actualSuccessRate === "number" && (
            <>
              {" "}
              · Actual:{" "}
              <span className="font-medium" style={{ color: "var(--status-critical)" }}>
                {fmtPct(actualSuccessRate)}
              </span>
            </>
          )}
        </div>
      )}

      {c.analysis_error ? (
        <p className="text-sm" style={{ color: "var(--status-critical)" }}>
          Analysis failed: {c.analysis_error}
        </p>
      ) : c.generated_at ? (
        <>
          <p className="text-sm">{c.summary}</p>
          <div>
            <div className="text-muted text-xs mb-1">Likely root cause</div>
            <p className="text-sm text-secondary">{c.likely_root_cause}</p>
          </div>
          {c.recommended_actions.length > 0 && (
            <div>
              <div className="text-muted text-xs mb-1">Recommended actions</div>
              <ul className="text-sm text-secondary list-disc list-inside space-y-0.5">
                {c.recommended_actions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="text-xs text-muted pt-1 border-t flex flex-wrap gap-x-4 gap-y-1" style={{ borderColor: "var(--gridline)" }}>
            <span>
              Time to insight: <span className="text-secondary font-medium">{fmtSeconds(c.time_to_insight_seconds)}</span>
            </span>
            {dollarImpact && (
              <span>
                $ impact: <span className="text-secondary font-medium">{fmtCompactMoney(dollarImpact)}</span> in failed/returned transactions
              </span>
            )}
          </div>
        </>
      ) : (
        <p className="text-sm text-muted">Analyzing…</p>
      )}
    </div>
  );
}
