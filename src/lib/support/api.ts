import { ChatResponse } from "./types";

export const API_URL =
  process.env.NEXT_PUBLIC_SUPPORT_API_URL ?? "http://localhost:8002";

export async function postChat(
  message: string,
  sessionId: string | null
): Promise<ChatResponse> {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: sessionId }),
  });
  if (!res.ok) throw new Error(`Chat request failed: ${res.status}`);
  return res.json();
}
