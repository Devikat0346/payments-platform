"use client";

import { useEffect, useState } from "react";
import { CHANNEL_LABELS, RAIL_LABELS } from "@/lib/channels";
import { fmtMoney, fmtMs } from "@/lib/format";
import { REASON_CODES } from "@/lib/glossary";
import { fetchTransactionById } from "@/lib/observability/api";
import { Transaction } from "@/lib/observability/types";
import { Modal } from "@/components/Modal";

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

export function TransactionDetailModal({ id, onClose }: { id: string; onClose: () => void }) {
  const [txn, setTxn] = useState<Transaction | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchTransactionById(id)
      .then((t) => !cancelled && setTxn(t))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const reasonCode = txn?.technical_failure_reason ?? txn?.decline_reason ?? txn?.return_code ?? null;

  return (
    <Modal title="Transaction detail" onClose={onClose}>
      {error && <p className="text-secondary text-sm">Couldn&apos;t load this transaction.</p>}
      {!error && !txn && <p className="text-muted text-sm">Loading…</p>}
      {txn && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Field label="Channel" value={CHANNEL_LABELS[txn.channel] ?? txn.channel} />
            <Field label="Rail" value={RAIL_LABELS[txn.rail] ?? txn.rail} />
            <Field label="Amount" value={fmtMoney(txn.amount)} />
            <Field label="Status" value={txn.status} />
            <Field label="Type" value={txn.txn_type} />
            <Field label="Batch" value={txn.batch_id ?? "—"} />
            <Field label="Created" value={new Date(txn.created_at).toLocaleString()} />
            <Field label="Updated" value={new Date(txn.updated_at).toLocaleString()} />
            <Field label="Auth latency" value={fmtMs(txn.auth_latency_ms)} />
            <Field label="Settle latency" value={fmtMs(txn.settle_latency_ms)} />
          </div>
          {reasonCode && (
            <div className="p-3 rounded-lg text-sm" style={{ background: "var(--surface-accent-wash)" }}>
              <span className="font-medium">{reasonCode}</span>
              <p className="text-secondary text-xs mt-1">
                {REASON_CODES[reasonCode] ?? "Reason code from the processing system."}
              </p>
            </div>
          )}
          <div>
            <div className="text-muted text-xs">Transaction ID</div>
            <div className="font-mono text-xs text-secondary">{txn.id}</div>
          </div>
        </>
      )}
    </Modal>
  );
}
