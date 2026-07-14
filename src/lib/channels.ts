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

// What actually distinguishes each rail — the network/settlement mechanism, not
// just "it's a payment." ACH is *also* credit-or-debit under the hood (that's
// what the type-mix chart's ach_credit/ach_debit split is showing) — it's a
// different rail from cards, not a different category of credit/debit.
export const RAIL_EXPLAINERS: Record<Rail, string> = {
  CARD: "Settled via card networks (Visa/Mastercard-style rails). Each transaction is run as either credit or debit.",
  WIRE: "Bank-to-bank transfer, settled individually (often near-real-time), not categorized as credit or debit — it's its own settlement type.",
  ACH_BATCH: "Bank-to-bank transfers settled via the ACH network in batches rather than the card networks. Also either credit (a deposit, e.g. payroll) or debit (a pull, e.g. bill pay) — just a different rail than cards.",
  ZELLE: "Peer-to-peer instant payment network, settled directly bank-to-bank — its own rail, not credit, debit, wire, or ACH.",
};

export const TXN_TYPE_LABELS: Record<string, string> = {
  card_credit: "Card — Credit",
  card_debit: "Card — Debit",
  ach_credit: "ACH — Credit",
  ach_debit: "ACH — Debit",
  wire: "Wire",
  zelle: "Zelle",
};
