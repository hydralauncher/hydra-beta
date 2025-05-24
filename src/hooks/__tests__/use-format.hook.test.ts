import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFormat } from "../use-format.hook";

describe("useFormat", () => {
  it("should return formatNumber and formatCompactNumber functions", () => {
    const { result } = renderHook(() => useFormat());

    expect(result.current.formatNumber).toBeDefined();
    expect(result.current.formatCompactNumber).toBeDefined();
    expect(typeof result.current.formatNumber).toBe("function");
    expect(typeof result.current.formatCompactNumber).toBe("function");
  });

  describe("formatNumber", () => {
    it("should format whole numbers correctly", () => {
      const { result } = renderHook(() => useFormat());

      expect(result.current.formatNumber(1000)).toBe("1,000");
      expect(result.current.formatNumber(1000000)).toBe("1,000,000");
      expect(result.current.formatNumber(0)).toBe("0");
    });

    it("should round decimal numbers to whole numbers", () => {
      const { result } = renderHook(() => useFormat());

      expect(result.current.formatNumber(1000.5)).toBe("1,001");
      expect(result.current.formatNumber(1000.4)).toBe("1,000");
      expect(result.current.formatNumber(1000.9)).toBe("1,001");
    });

    it("should handle negative numbers", () => {
      const { result } = renderHook(() => useFormat());

      expect(result.current.formatNumber(-1000)).toBe("-1,000");
      expect(result.current.formatNumber(-1000000)).toBe("-1,000,000");
    });
  });

  describe("formatCompactNumber", () => {
    it("should format numbers in compact notation", () => {
      const { result } = renderHook(() => useFormat());

      expect(result.current.formatCompactNumber(1000)).toBe("1K");
      expect(result.current.formatCompactNumber(1000000)).toBe("1M");
      expect(result.current.formatCompactNumber(1000000000)).toBe("1B");
    });

    it("should round decimal numbers to whole numbers in compact notation", () => {
      const { result } = renderHook(() => useFormat());

      expect(result.current.formatCompactNumber(1500)).toBe("2K");
      expect(result.current.formatCompactNumber(1400)).toBe("1K");
      expect(result.current.formatCompactNumber(1500000)).toBe("2M");
    });

    it("should handle negative numbers in compact notation", () => {
      const { result } = renderHook(() => useFormat());

      expect(result.current.formatCompactNumber(-1000)).toBe("-1K");
      expect(result.current.formatCompactNumber(-1000000)).toBe("-1M");
    });

    it("should handle small numbers without compact notation", () => {
      const { result } = renderHook(() => useFormat());

      expect(result.current.formatCompactNumber(100)).toBe("100");
      expect(result.current.formatCompactNumber(50)).toBe("50");
      expect(result.current.formatCompactNumber(0)).toBe("0");
    });
  });

  describe("formatPlayTime", () => {
    it("should format times less than 120 minutes in minutes", () => {
      const { result } = renderHook(() => useFormat());

      expect(result.current.formatPlayTime(0)).toBe("0 minutes");
      expect(result.current.formatPlayTime(60)).toBe("1 minutes");
      expect(result.current.formatPlayTime(3540)).toBe("59 minutes");
      expect(result.current.formatPlayTime(7140)).toBe("119 minutes");
    });

    it("should format times greater than or equal to 120 minutes in hours", () => {
      const { result } = renderHook(() => useFormat());

      expect(result.current.formatPlayTime(7200)).toBe("2 hours");
      expect(result.current.formatPlayTime(36000)).toBe("10 hours");
      expect(result.current.formatPlayTime(86400)).toBe("24 hours");
    });

    it("should handle edge cases", () => {
      const { result } = renderHook(() => useFormat());

      // Exactly 120 minutes
      expect(result.current.formatPlayTime(7200)).toBe("2 hours");

      // Just under 120 minutes
      expect(result.current.formatPlayTime(7199)).toBe("120 minutes");

      // Just over 120 minutes
      expect(result.current.formatPlayTime(7201)).toBe("2 hours");
    });
  });
});
