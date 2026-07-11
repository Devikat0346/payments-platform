export type Rail = "CARD" | "WIRE" | "ACH_BATCH";
export type Channel =
  | "pos"
  | "ecommerce"
  | "mobile_wallet"
  | "wire_online"
  | "wire_branch"
  | "ach_batch_file";

export const CHANNEL_LABELS: Record<Channel, string> = {
  pos: "POS / Card-Present",
  ecommerce: "E-Commerce",
  mobile_wallet: "Mobile Wallet",
  wire_online: "Wire — Online",
  wire_branch: "Wire — Branch",
  ach_batch_file: "ACH Batch File",
};

export const RAIL_LABELS: Record<Rail, string> = {
  CARD: "Card (Credit/Debit)",
  WIRE: "Wire Transfer",
  ACH_BATCH: "ACH Batch",
};
