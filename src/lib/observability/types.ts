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
  // Availability is a different axis from success_rate/error_budget_burn_pct:
  // did the platform return a decision at all (approved or declined), vs. a
  // genuine technical failure (timeout, internal error) where it didn't. A
  // channel can be fully within its approval-rate SLA while still burning
  // availability budget, or vice versa.
  technical_failures: number;
  availability: number | null;
  availability_slo_target: number;
  availability_burn_pct: number;
  // Raw counts from the SAME 30m budget window availability_burn_pct is
  // computed over — deliberately not technical_failures/total above (those
  // are the 5m window), since a single rare failure can burn hundreds of
  // times the five-nines budget and the count needs to match the number it's
  // explaining.
  availability_budget_window_technical_failures: number;
  availability_budget_window_total: number;
  active_incident: Incident | null;
  // Present only for channels that can be more than one transaction type (card
  // and ACH channels) — e.g. { credit: {...}, debit: {...} }. null for channels
  // with exactly one possible type (wire, Zelle), since there's nothing to split.
  txn_type_breakdown: Record<string, { total: number; total_amount: number }> | null;
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
  availability_slo_target: number;
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
  technical_failure_reason: string | null;
}
