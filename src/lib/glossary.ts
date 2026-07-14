// Plain-English explanations for jargon and reason codes shown in the UI —
// aimed at a non-SRE reader (business stakeholder, recruiter, interviewer).
export const JARGON: Record<string, string> = {
  sli: "Service Level Indicator — a measured number (like success rate or latency) that describes how well something is actually performing right now.",
  slo: "Service Level Objective — the target we've committed to for an SLI (e.g. '99% of transactions succeed'). It's the line that shouldn't be crossed.",
  errorBudgetBurn:
    "How much of the 'allowed failure' budget has been used up. 100% means the budget for this period is fully spent — anything past that is failing more than the target permits.",
  mttd: "Mean Time To Detect — how long it takes to notice something is wrong.",
  mttr: "Mean Time To Resolve — how long it takes to fix something once it's noticed.",
  timeToInsight:
    "How long after a problem was detected the AI took to produce a diagnosis — this platform's stand-in for MTTD in an AI-assisted workflow.",
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
};
