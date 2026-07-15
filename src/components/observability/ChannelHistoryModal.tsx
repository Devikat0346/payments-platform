"use client";

import { useEffect, useState } from "react";
import { CHANNEL_LABELS, Channel } from "@/lib/channels";
import { fmtMoney, fmtMs } from "@/lib/format";
import { fetchChannelHistory } from "@/lib/observability/api";
import { Transaction } from "@/lib/observability/types";
import { Modal } from "@/components/Modal";

const PAGE_SIZE = 50;

const STATUS_COLOR: Record<string, string> = {
  initiated: "var(--text-muted)",
  authorized: "var(--seq-blue-450)",
  settled: "var(--status-good)",
  posted: "var(--status-good)",
  declined: "var(--status-critical)",
  failed: "var(--status-critical)",
  returned: "var(--status-serious)",
};

export function ChannelHistoryModal({ channel, onClose }: { channel: Channel; onClose: () => void }) {
  const [rows, setRows] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);

  const loadMore = () => {
    setLoading(true);
    fetchChannelHistory(channel, PAGE_SIZE, rows.length)
      .then((page: Transaction[]) => {
        setRows((prev) => [...prev, ...page]);
        setHasMore(page.length === PAGE_SIZE);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const page: Transaction[] = await fetchChannelHistory(channel, PAGE_SIZE, 0);
        if (cancelled) return;
        setRows(page);
        setHasMore(page.length === PAGE_SIZE);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [channel]);

  return (
    <Modal title={`${CHANNEL_LABELS[channel] ?? channel} — full history`} onClose={onClose}>
      <p className="text-muted text-xs -mt-2">
        Read directly from the database, not the live dashboard&apos;s rolling window — reaches
        back over everything retained, not just the last few hours.
      </p>
      {error && <p className="text-secondary text-sm">Couldn&apos;t load history for this channel.</p>}
      {!error && rows.length === 0 && !loading && (
        <p className="text-muted text-sm">No history found — persistence may not be configured.</p>
      )}
      {rows.length > 0 && (
        <div className="max-h-[28rem] overflow-y-auto -mx-5 px-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted text-xs sticky top-0" style={{ background: "var(--surface-card)" }}>
                <th className="py-2 pr-3 font-medium">Time</th>
                <th className="py-2 pr-3 font-medium">Amount</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 pr-3 font-medium">Latency</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((txn, i) => (
                <tr
                  key={txn.id}
                  className="border-t"
                  style={{
                    borderColor: "var(--gridline)",
                    background: i % 2 === 1 ? "color-mix(in srgb, var(--text-primary) 2%, transparent)" : "transparent",
                  }}
                >
                  <td className="py-2 pr-3 text-muted whitespace-nowrap" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {new Date(txn.updated_at).toLocaleString()}
                  </td>
                  <td className="py-2 pr-3" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {fmtMoney(txn.amount)}
                  </td>
                  <td className="py-2 pr-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: STATUS_COLOR[txn.status] ?? "var(--text-muted)" }}
                        aria-hidden
                      />
                      {txn.status}
                    </span>
                  </td>
                  <td className="py-2 pr-3 text-secondary" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {fmtMs(txn.auth_latency_ms)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {hasMore && rows.length > 0 && (
        <button
          type="button"
          onClick={loadMore}
          disabled={loading}
          className="text-sm font-medium rounded-md px-3 py-1.5 self-start"
          style={{ background: "var(--accent-wash)", color: "var(--accent)" }}
        >
          {loading ? "Loading…" : "Load more"}
        </button>
      )}
    </Modal>
  );
}
