"use client";

import { FormEvent, useState } from "react";
import { CHANNEL_LABELS, Channel } from "@/lib/channels";
import { fmtCompactMoney } from "@/lib/format";
import { useChat } from "@/lib/support/useChat";

export function ChatWindow() {
  const { messages, transaction, sending, error, send } = useChat();
  const [draft, setDraft] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = draft;
    setDraft("");
    send(text);
  }

  return (
    <div className="card flex flex-col overflow-hidden" style={{ height: "560px" }}>
      {transaction && (
        <div
          className="px-4 py-2.5 text-xs border-b flex items-center justify-between gap-3 flex-wrap"
          style={{ borderColor: "var(--gridline)", background: "color-mix(in srgb, var(--accent-fg) 6%, transparent)" }}
        >
          <span className="text-secondary">
            Discussing: <span className="font-medium" style={{ color: "var(--text-primary)" }}>
              {CHANNEL_LABELS[transaction.channel as Channel] ?? transaction.channel}
            </span>{" "}
            · {fmtCompactMoney(transaction.amount)} · {transaction.status}
          </span>
          <span className="text-muted font-mono">{transaction.id.slice(0, 8)}…</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-muted text-sm">
            Ask about a specific transaction — e.g. &quot;why did transaction &lt;id&gt; fail?&quot;. Grab a
            transaction ID from the <span style={{ color: "var(--text-secondary)" }}>Observability</span> page&apos;s
            live feed to try it with real data.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className="max-w-[80%] rounded-2xl px-3.5 py-2 text-sm"
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "var(--gradient-brand)" : "var(--border)",
              color: m.role === "user" ? "var(--accent-fg)" : "var(--text-primary)",
            }}
          >
            {m.content}
          </div>
        ))}
        {sending && (
          <div
            className="max-w-[80%] rounded-2xl px-3.5 py-2 text-sm text-muted"
            style={{ alignSelf: "flex-start", background: "var(--border)" }}
          >
            Thinking…
          </div>
        )}
        {error && (
          <p className="text-sm" style={{ color: "var(--status-critical)" }}>
            {error}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2" style={{ borderColor: "var(--gridline)" }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask about a transaction…"
          className="flex-1 rounded-full px-4 py-2 text-sm outline-none"
          style={{ background: "var(--border)", color: "var(--text-primary)" }}
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          className="rounded-full px-4 py-2 text-sm font-medium disabled:opacity-50"
          style={{ background: "var(--gradient-brand)", color: "var(--accent-fg)" }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
