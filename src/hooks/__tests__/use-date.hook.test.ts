import { describe, expect, it } from "vitest";

import { getDateLocale, formatDate, useDate } from "../use-date.hook";

describe("getDateLocale", () => {
  it("should return correct locale for different language codes", () => {
    expect(getDateLocale("pt-BR")).toBeDefined();
    expect(getDateLocale("es-ES")).toBeDefined();
    expect(getDateLocale("fr-FR")).toBeDefined();
    expect(getDateLocale("hu-HU")).toBeDefined();
    expect(getDateLocale("pl-PL")).toBeDefined();
    expect(getDateLocale("tr-TR")).toBeDefined();
    expect(getDateLocale("ru-RU")).toBeDefined();
    expect(getDateLocale("it-IT")).toBeDefined();
    expect(getDateLocale("be-BY")).toBeDefined();
    expect(getDateLocale("zh-CN")).toBeDefined();
    expect(getDateLocale("da-DK")).toBeDefined();
  });

  it("should return enUS for unknown language codes", () => {
    expect(getDateLocale("unknown")).toBeDefined();
  });
});

describe("formatDate", () => {
  it("should format date in US format for English", () => {
    const date = new Date("2024-03-15");
    expect(formatDate(date, "en")).toBe("03-15-2024");
  });

  it("should format date in European format for non-English", () => {
    const date = new Date("2024-03-15");
    expect(formatDate(date, "pt")).toBe("15/03/2024");
  });

  it("should return N/A for invalid dates", () => {
    expect(formatDate("invalid-date", "en")).toBe("N/A");
  });
});

describe("useDate", () => {
  const { formatDistance, formatDiffInMillis, formatDateTime, formatDate } =
    useDate();

  describe("formatDistance", () => {
    it("should format distance between dates", () => {
      const date = new Date("2024-03-15");
      const baseDate = new Date("2024-03-10");
      expect(formatDistance(date, baseDate)).toBeDefined();
    });

    it("should handle invalid dates gracefully", () => {
      expect(formatDistance("invalid-date", new Date())).toBe("");
    });
  });

  describe("formatDiffInMillis", () => {
    it("should format time difference in milliseconds", () => {
      const millis = 3600000; // 1 hour
      const baseDate = new Date();
      expect(formatDiffInMillis(millis, baseDate)).toBeDefined();
    });

    it("should handle invalid inputs gracefully", () => {
      expect(formatDiffInMillis(NaN, new Date())).toBe("");
    });
  });

  describe("formatDateTime", () => {
    it("should format date and time correctly", () => {
      const date = new Date("2024-03-15T14:30:00");
      expect(formatDateTime(date)).toBe("03-15-2024 - 02:30 PM");
    });

    it("should handle invalid dates gracefully", () => {
      expect(formatDateTime("invalid-date")).toBe("");
    });
  });

  describe("formatDate", () => {
    it("should format date correctly", () => {
      const date = new Date("2024-03-15");
      expect(formatDate(date)).toBe("03-15-2024");
    });

    it("should handle invalid dates gracefully", () => {
      expect(formatDate("invalid-date")).toBe("N/A");
    });
  });
});
