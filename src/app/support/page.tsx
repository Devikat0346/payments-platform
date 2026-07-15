import { AlertTriangle } from "lucide-react";
import { ChatWindow } from "@/components/support/ChatWindow";

export default function SupportPage() {
  return (
    <div className="px-6 py-10 md:px-12 lg:px-20 max-w-[800px] mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Payments Support Agent</h1>
        <p className="text-secondary text-sm mt-1">
          A multi-turn, guardrailed conversational agent that answers questions about a specific
          transaction — grounded only in the live record it looks up, never invented. Evaluated
          with RAGAS and DeepEval (faithfulness, context precision, hallucination, guardrail
          adherence) — see the write-up on{" "}
          <a
            href="https://github.com/Devikat0346/payments-support-agent"
            className="underline"
            style={{ color: "var(--accent-fg)" }}
          >
            GitHub
          </a>
          .
        </p>
      </header>

      <div
        className="flex items-center gap-2.5 text-xs rounded-md px-3 py-2.5 mb-6"
        style={{
          background: "color-mix(in srgb, var(--status-warning) 12%, transparent)",
          color: "var(--text-secondary)",
        }}
      >
        <AlertTriangle size={15} strokeWidth={2} style={{ color: "var(--status-warning)" }} className="shrink-0" />
        <span>
          <strong className="font-medium" style={{ color: "var(--text-primary)" }}>
            Demo, not a real support channel.
          </strong>{" "}
          It can look up any transaction from this platform&apos;s live synthetic data by ID, but
          it can&apos;t approve, refund, or override anything — try asking it to and see what
          happens.
        </span>
      </div>

      <ChatWindow />
    </div>
  );
}
