export interface SupportTransaction {
  id: string;
  channel: string;
  status: string;
  amount: number;
  created_at: string;
  updated_at: string;
  decline_reason: string | null;
  return_code: string | null;
  technical_failure_reason: string | null;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  session_id: string;
  reply: string;
  transaction: SupportTransaction | null;
}
