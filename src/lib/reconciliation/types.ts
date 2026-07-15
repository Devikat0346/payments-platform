import { Channel, Rail } from "@/lib/channels";

export type BreakType =
  | "amount_mismatch"
  | "missing_settlement"
  | "duplicate_settlement"
  | "orphaned_settlement";

export interface ReconciliationRun {
  id: string;
  run_at: string;
  window_start: string;
  window_end: string;
  total_origination: number;
  total_settlement: number;
  matched_count: number;
  break_count: number;
  matched_amount: number;
  break_amount: number;
  match_rate: number | null;
}

export interface ReconciliationBreak {
  id: string;
  run_id: string;
  break_type: BreakType;
  rail: Rail;
  channel: Channel;
  origination_id: string | null;
  settlement_id: string | null;
  origination_amount: number | null;
  settlement_amount: number | null;
  description: string;
  detected_at: string;
}

export interface ReconciliationSummary {
  latest_run: ReconciliationRun | null;
  runs_in_window: number;
  total_origination: number;
  total_break_amount: number;
  overall_match_rate: number | null;
  break_counts_by_type: Partial<Record<BreakType, number>>;
}

export interface OriginationRecord {
  id: string;
  rail: Rail;
  channel: Channel;
  txn_type: string;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SettlementRecordDetail {
  id: string;
  origination_id: string | null;
  rail: Rail;
  channel: Channel;
  amount: number;
  source: string;
  settled_at: string;
}

export interface BreakDetail {
  break: ReconciliationBreak;
  origination: OriginationRecord | null;
  settlements: SettlementRecordDetail[];
}

export interface RunDetail {
  run: ReconciliationRun;
  breaks: ReconciliationBreak[];
}
