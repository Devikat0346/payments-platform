// Plain-English explanations for jargon and reason codes shown in the UI —
// aimed at a non-SRE reader (business stakeholder, recruiter, interviewer).
export const JARGON: Record<string, string> = {
  sli: "Service Level Indicator — a measured number (like success rate or latency) that describes how well something is actually performing right now.",
  slo: "Service Level Objective — the target we've committed to for an SLI (e.g. '99% of transactions succeed'). It's the line that shouldn't be crossed.",
  errorBudgetBurn:
    "Every reliability target allows for some failures (e.g. 99% success still permits 1% to fail). This tracks how much of that allowance has been used. 'X% of budget used' means still within the allowance; 'Nx over budget' means it's failing N times more often than the target permits.",
  mttd: "Mean Time To Detect — how long it takes to notice something is wrong.",
  mttr: "Mean Time To Resolve — how long it takes to fix something once it's noticed.",
  timeToInsight:
    "How long after a problem was detected the AI took to produce a diagnosis — this platform's stand-in for MTTD in an AI-assisted workflow.",
  typicalSpeed: "The middle transaction — half of all transactions were faster than this, half were slower. Technically called 'p50 latency.'",
  slowestCases: "How slow the worst 1% of transactions were. A few slow outliers can hurt real customers even when the typical case looks fine. Technically called 'p99 latency.'",
  platformAvailability:
    "Did the platform return a decision at all — approved or declined — without erroring or timing out? This is different from the approval rate: a card declined for insufficient funds is the system working correctly, not an availability problem. Target is 'five nines' (99.999%) across every rail, since this is an infrastructure commitment, not a business outcome.",
  approvalRate:
    "Of the transactions the platform actually processed, how many were approved? This includes expected business declines (fraud holds, insufficient funds, compliance holds) — a high decline rate here can be completely normal and by design, unlike an availability miss.",
};

export const REASON_CODES: Record<string, string> = {
  insufficient_funds: "The account didn't have enough available balance to cover the transaction.",
  fraud_suspected: "Automated fraud screening flagged this transaction for review.",
  invalid_account: "The account or card number provided doesn't match a valid, active account.",
  limit_exceeded: "The transaction would exceed a spending or transfer limit on the account.",
  invalid_beneficiary_bank: "The receiving bank's routing information couldn't be validated.",
  ofac_hold: "Held for sanctions/compliance (OFAC) screening before it can proceed.",
  collateral_verification_failed: "The loan's collateral couldn't be verified in time to release funds.",
  compliance_hold: "Held by a compliance review before the loan wire can be released.",
  invalid_loan_reference: "The loan reference number on the wire didn't match a known loan.",
  funding_conditions_not_met: "A condition required before funding (e.g. a signed document) hadn't been satisfied.",
  voice_auth_failed: "The caller couldn't be verified via voice/phone authentication.",
  otp_mismatch: "The one-time passcode the caller provided didn't match.",
  customer_hung_up: "The customer ended the call before the transaction could be completed.",
  recipient_not_enrolled: "The person receiving the Zelle payment hasn't enrolled their account yet.",
  daily_limit_exceeded: "This would exceed the sender's daily Zelle send limit.",
  fraud_hold: "Held for suspected fraud/scam activity, common with P2P payment scams.",
  duplicate_request: "This looks like a duplicate of a request already sent.",
  R01_insufficient_funds: "ACH return code R01 — the account didn't have enough funds.",
  R02_account_closed: "ACH return code R02 — the account has been closed.",
  R03_no_account: "ACH return code R03 — no account matching that number exists.",
  R29_unauthorized: "ACH return code R29 — the account holder didn't authorize this debit.",
  duplicate_wire_reference: "This wire's reference number was already used in a prior batch.",
  insufficient_funds_at_settlement: "Funds were available when submitted but not by the time the batch settled.",
  FILE_REJECTED: "The entire batch file was rejected before any individual item was processed.",
  // Technical/system failures — these are availability misses, not business
  // declines. Kept in the same lookup since the UI shows them the same way
  // (a reason code next to a transaction), but they mean something different.
  gateway_timeout: "The system never got a response from the processing gateway in time. A genuine technical failure, not a business decline.",
  internal_error: "An unexpected internal error prevented the platform from reaching a decision. A genuine technical failure, not a business decline.",
  downstream_unavailable: "A required downstream service was unavailable when this transaction was processed. A genuine technical failure, not a business decline.",
  file_rejected: "The whole batch file was rejected before processing — a technical/operational failure, not a business decision on any individual item.",
};
