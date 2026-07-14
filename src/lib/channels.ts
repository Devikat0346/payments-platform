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

export const RAIL_LABELS: Record<Rail, string> = {
  CARD: "Card (Credit/Debit)",
  WIRE: "Wire Transfer",
  ACH_BATCH: "ACH Batch",
  ZELLE: "Zelle (P2P)",
};

export const TXN_TYPE_LABELS: Record<string, string> = {
  credit: "Credit",
  debit: "Debit",
  wire: "Wire",
  zelle: "Zelle",
};
