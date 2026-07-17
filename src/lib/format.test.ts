import { describe, expect, it } from "vitest";
import { fmtBudgetBurn, fmtCompactMoney, fmtMoney, fmtMs, fmtPct, fmtPctPrecise, fmtVolumeShare } from "./format";

describe("fmtMs", () => {
  it("returns an em dash for null/undefined", () => {
    expect(fmtMs(null)).toBe("—");
    expect(fmtMs(undefined)).toBe("—");
  });

  it("formats sub-second values in milliseconds", () => {
    expect(fmtMs(250)).toBe("250ms");
    expect(fmtMs(999)).toBe("999ms");
  });

  it("formats values >= 1000ms in seconds", () => {
    expect(fmtMs(1000)).toBe("1.00s");
    expect(fmtMs(2345)).toBe("2.35s");
  });
});

describe("fmtPct", () => {
  it("returns an em dash for null/undefined", () => {
    expect(fmtPct(null)).toBe("—");
    expect(fmtPct(undefined)).toBe("—");
  });

  it("formats a ratio as a percentage with one decimal", () => {
    expect(fmtPct(0.99)).toBe("99.0%");
    expect(fmtPct(1)).toBe("100.0%");
    expect(fmtPct(0)).toBe("0.0%");
  });

  it("accepts a custom decimal count", () => {
    expect(fmtPct(0.99999, 3)).toBe("99.999%");
  });
});

describe("fmtPctPrecise", () => {
  it("shows enough precision that 'five nines' doesn't round away", () => {
    // At 1 decimal place, 99.999% incorrectly rounds up to a meaningless
    // "100.0%" — exactly the case this function exists to avoid.
    expect(fmtPctPrecise(0.99999)).toBe("99.999%");
  });

  it("returns an em dash for null/undefined", () => {
    expect(fmtPctPrecise(null)).toBe("—");
    expect(fmtPctPrecise(undefined)).toBe("—");
  });
});

describe("fmtMoney", () => {
  it("formats as USD currency", () => {
    expect(fmtMoney(1234.5)).toBe("$1,234.50");
    expect(fmtMoney(0)).toBe("$0.00");
  });
});

describe("fmtCompactMoney", () => {
  it("uses full currency format under $1,000", () => {
    expect(fmtCompactMoney(500)).toBe("$500.00");
  });

  it("uses K suffix for thousands", () => {
    expect(fmtCompactMoney(12_500)).toBe("$12.5K");
  });

  it("uses M suffix for millions", () => {
    expect(fmtCompactMoney(2_340_000)).toBe("$2.34M");
  });

  it("uses B suffix for billions", () => {
    expect(fmtCompactMoney(1_330_370_000)).toBe("$1.33B");
  });
});

describe("fmtBudgetBurn", () => {
  it("shows '% of budget used' at or under 100", () => {
    expect(fmtBudgetBurn(38)).toBe("38% of budget used");
    expect(fmtBudgetBurn(0)).toBe("0% of budget used");
  });

  it("switches to an 'x over budget' multiplier above 100", () => {
    expect(fmtBudgetBurn(100)).toBe("1.0x over budget");
    expect(fmtBudgetBurn(503)).toBe("5.0x over budget");
    expect(fmtBudgetBurn(2600)).toBe("26.0x over budget");
  });
});

describe("fmtVolumeShare", () => {
  it("returns null when total is zero or negative", () => {
    expect(fmtVolumeShare(100, 0)).toBeNull();
  });

  it("formats a share of total as a whole-number percentage", () => {
    expect(fmtVolumeShare(25, 100)).toBe("25% of all volume");
    expect(fmtVolumeShare(2_510_000, 20_900_000)).toBe("12% of all volume");
  });
});
