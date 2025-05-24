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
});
