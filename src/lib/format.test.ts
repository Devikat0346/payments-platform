import { describe, expect, it } from "vitest";
import { fmtCompactMoney, fmtMoney, fmtMs, fmtPct } from "./format";

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
});
