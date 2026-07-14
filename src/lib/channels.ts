export type Rail = "CARD" | "WIRE" | "ACH_BATCH" | "ZELLE";
export type Channel =
  | "pos"
  | "ecommerce"
  | "mobile_wallet"
  | "wire_online"
  | "wire_branch"
  | "wire_loaniq"
  | "wire_batch"
  | "wire_ivr"
  | "ach_batch_file"
  | "zelle_mobile"
  | "zelle_online";

export const CHANNEL_LABELS: Record<Channel, string> = {
  pos: "POS / Card-Present",
  ecommerce: "E-Commerce",
  mobile_wallet: "Mobile Wallet",
  wire_online: "Wire — Digital Banking",
  wire_branch: "Wire — Branch",
  wire_loaniq: "Wire — Commercial Loan (LoanIQ)",
  wire_batch: "Wire — Bulk Batch File",
  wire_ivr: "Wire — Phone / IVR",
  ach_batch_file: "ACH Batch File",
  zelle_mobile: "Zelle — Mobile App",
  zelle_online: "Zelle — Online Banking",
};

export const CHANNEL_ORIGIN_DESCRIPTIONS: Record<Channel, string> = {
  pos: "Card-present swipe/tap at a retail terminal",
  ecommerce: "Card-not-present checkout on a website",
  mobile_wallet: "In-app tap-to-pay (Apple Pay / Google Pay style)",
  wire_online: "Customer-initiated via online/digital banking",
  wire_branch: "Initiated in person at a branch",
  wire_loaniq: "Commercial loan funding/drawdown via LoanIQ",
  wire_batch: "Corporate customer submits a bulk wire file",
  wire_ivr: "Customer calls in and initiates via phone/IVR",
  ach_batch_file: "Bulk file origination (e.g. payroll, bill pay)",
  zelle_mobile: "P2P send/request via the mobile banking app",
  zelle_online: "P2P send/request via online banking",
};

// Channels processed in batch windows rather than per-transaction in real time —
// mirrors the backend's BATCH_CHANNELS. These never have auth latency, so the UI
// shows volume/return-rate trends for them instead of a latency sparkline.
export const BATCH_CHANNELS: Channel[] = ["ach_batch_file", "wire_batch"];

export const RAIL_LABELS: Record<Rail, string> = {
  CARD: "Card Network",
  WIRE: "Wire Transfer",
  ACH_BATCH: "ACH Network",
  ZELLE: "Zelle (P2P)",
};

// What actually distinguishes each rail — the network/settlement mechanism —
// and, in the same breath, whether it maps to credit/debit. ACH is *also*
// credit-or-debit under the hood (that's what the ach_credit/ach_debit split
// in the type-mix chart is showing) — it's a different rail from cards, not a
// different category of money movement.
export const RAIL_EXPLAINERS: Record<Rail, string> = {
  CARD: "Moves money through card networks (Visa/Mastercard-style rails), authorized and settled per transaction. Each one is run as either credit or debit.",
  WIRE: "Moves money bank-to-bank as an individual, often near-real-time transfer. No batching, and no credit/debit split — a wire is just a wire.",
  ACH_BATCH: "Moves money bank-to-bank in batches instead of through the card networks. Like a card, each transaction is either a credit (a deposit, e.g. payroll) or a debit (a pull, e.g. bill pay) — it just travels a different rail to get there.",
  ZELLE: "Moves money peer-to-peer, instantly, directly bank-to-bank. Its own network entirely — distinct from card, wire, and ACH, with no credit/debit split.",
};

export const TXN_TYPE_LABELS: Record<string, string> = {
  card_credit: "Card — Credit",
  card_debit: "Card — Debit",
  ach_credit: "ACH — Credit",
  ach_debit: "ACH — Debit",
  wire: "Wire",
  zelle: "Zelle",
};
