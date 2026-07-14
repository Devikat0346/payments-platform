import { Channel, Rail } from "@/lib/channels";

export type Health = "healthy" | "degraded" | "breached";

export interface Incident {
  id: string;
  rail: Rail;
  channel: Channel;
  kind: "latency_spike" | "failure_spike";
  magnitude: number;
  started_at: string;
  ended_at: string | null;
  description: string;
  active: boolean;
}

export interface ChannelMetric {
  channel: Channel;
  rail: Rail;
  health: Health;
  window_seconds: number;
  total: number;
  success: number;
  failure: number;
  success_rate: number | null;
  p50_latency_ms: number | null;
  p95_latency_ms: number | null;
  p99_latency_ms: number | null;
  total_amount: number;
  failure_amount: number;
  slo_success_rate: number;
  slo_latency_p99_ms: number | null;
  error_budget_burn_pct: number;
  active_incident: Incident | null;
}

export interface RailMetric {
  rail: Rail;
  total: number;
  success: number;
  failure: number;
  success_rate: number | null;
  total_amount: number;
  failure_amount: number;
  slo_success_rate: number;
}

// The raw per-transaction type — what a single transaction actually is.
export type TxnType = "credit" | "debit" | "wire" | "zelle";

// The type-mix rollup breaks a transaction's type down *by rail*, since "credit"
// on a card and "credit" on ACH are different payment mechanisms that just share
// a word (see metrics.py). Never sum card_credit and ach_credit together.
export type TxnTypeBreakdownKey =
  | "card_credit"
  | "card_debit"
  | "ach_credit"
  | "ach_debit"
  | "wire"
  | "zelle";

export interface TxnTypeMetric {
  txn_type: TxnTypeBreakdownKey;
  rail: Rail;
  total: number;
  success: number;
  failure: number;
  success_rate: number | null;
  total_amount: number;
  failure_amount: number;
}

export interface MetricsSummary {
  generated_at: string;
  channels: Record<Channel, ChannelMetric>;
  rails: Record<Rail, RailMetric>;
  txn_types: Record<TxnTypeBreakdownKey, TxnTypeMetric>;
}

export interface Transaction {
  id: string;
  rail: Rail;
  channel: Channel;
  txn_type: TxnType;
  amount: number;
  status:
    | "initiated"
    | "authorized"
    | "declined"
    | "settled"
    | "posted"
    | "failed"
    | "returned";
  created_at: string;
  updated_at: string;
  auth_latency_ms: number | null;
  settle_latency_ms: number | null;
  batch_id: string | null;
  decline_reason: string | null;
  return_code: string | null;
}
