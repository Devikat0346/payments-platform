"use client";

import { useEffect, useState } from "react";
import { BreakBadge } from "./BreakBadge";
import { Modal } from "@/components/Modal";
import { CHANNEL_LABELS } from "@/lib/channels";
import { fmtMoney } from "@/lib/format";
import { fetchBreakDetail } from "@/lib/reconciliation/api";
import { BreakDetail } from "@/lib/reconciliation/types";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-muted text-xs">{label}</div>
      <div className="text-sm font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
        {value}
      </div>
    </div>
  );
}

export function BreakDetailModal({ breakId, onClose }: { breakId: string; onClose: () => void }) {
  const [detail, setDetail] = useState<BreakDetail | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchBreakDetail(breakId)
      .then((d) => !cancelled && setDetail(d))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [breakId]);

  return (
    <Modal title="Break detail" onClose={onClose}>
      {error && <p className="text-secondary text-sm">Couldn&apos;t load this break — it may have aged out.</p>}
      {!error && !detail && <p className="text-muted text-sm">Loading…</p>}
      {detail && (
        <>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <BreakBadge type={detail.break.break_type} />
            <span className="text-muted text-xs">
              Detected {new Date(detail.break.detected_at).toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-secondary">{detail.break.description}</p>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">
              Origination record
            </h4>
            {detail.origination ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg" style={{ background: "var(--surface-accent-wash)" }}>
                <Field label="Channel" value={CHANNEL_LABELS[detail.origination.channel] ?? detail.origination.channel} />
                <Field label="Amount" value={fmtMoney(detail.origination.amount)} />
                <Field label="Status" value={detail.origination.status} />
                <Field
                  label="Updated"
                  value={new Date(detail.origination.updated_at).toLocaleTimeString()}
                />
              </div>
            ) : (
              <p className="text-muted text-sm italic">
                No origination transaction found — this settlement doesn&apos;t reference a known transaction.
              </p>
            )}
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">
              Settlement record{detail.settlements.length !== 1 ? "s" : ""} ({detail.settlements.length})
            </h4>
            {detail.settlements.length > 0 ? (
              <div className="flex flex-col gap-2">
                {detail.settlements.map((s) => (
                  <div
                    key={s.id}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg"
                    style={{ background: "var(--surface-accent-wash)" }}
                  >
                    <Field label="Source" value={s.source.replace("_", " ")} />
                    <Field label="Amount" value={fmtMoney(s.amount)} />
                    <Field label="Settled at" value={new Date(s.settled_at).toLocaleTimeString()} />
                    <Field label="ID" value={<span className="font-mono text-xs">{s.id.slice(0, 8)}…</span>} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-sm italic">
                No settlement record ever arrived for this transaction.
              </p>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
