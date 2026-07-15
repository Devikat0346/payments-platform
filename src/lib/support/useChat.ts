"use client";

import { useState } from "react";
import { postChat } from "./api";
import { ChatMessage, SupportTransaction } from "./types";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<SupportTransaction | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setSending(true);
    setError(null);

    try {
      const res = await postChat(trimmed, sessionId);
      setSessionId(res.session_id);
      setTransaction(res.transaction);
      setMessages((prev) => [...prev, { role: "assistant", content: res.reply }]);
    } catch {
      setError("Couldn't reach the support agent — it may be waking up from a cold start. Try again in a moment.");
    } finally {
      setSending(false);
    }
  }

  return { messages, transaction, sending, error, send };
}
