import { describe, it, expect } from "vitest";
import {
  removeReleaseYearFromName,
  removeSymbolsFromName,
  removeSpecialEditionFromName,
  removeDuplicateSpaces,
  replaceDotsWithSpace,
  replaceNbspWithSpace,
  replaceUnderscoreWithSpace,
  removeAccents,
  formatName,
  formatDownloadOptionName,
} from "../string-formatting";

describe("string formatting functions", () => {
  describe("removeReleaseYearFromName", () => {
    it("should remove year in parentheses", () => {
      expect(removeReleaseYearFromName("Game Name (2023)")).toBe("Game Name ");
      expect(removeReleaseYearFromName("(1999) Game Name")).toBe(" Game Name");
      expect(removeReleaseYearFromName("Game (2023) Name")).toBe("Game  Name");
    });

    it("should not modify strings without years", () => {
      expect(removeReleaseYearFromName("Game Name")).toBe("Game Name");
      expect(removeReleaseYearFromName("(Game) Name")).toBe("(Game) Name");
    });
  });

  describe("removeSymbolsFromName", () => {
    it("should remove special characters", () => {
      expect(removeSymbolsFromName("Game! Name?")).toBe("Game Name");
      expect(removeSymbolsFromName("Game: Name - Special")).toBe(
        "Game Name  Special"
      );
      expect(removeSymbolsFromName("Game@#$%^&*Name")).toBe("GameName");
    });

    it("should keep alphanumeric characters and spaces", () => {
      expect(removeSymbolsFromName("Game123 Name456")).toBe("Game123 Name456");
    });
  });

  describe("removeSpecialEditionFromName", () => {
    it("should remove various edition suffixes", () => {
      expect(removeSpecialEditionFromName("Game GOTY Edition")).toBe("Game ");
      expect(removeSpecialEditionFromName("Game Deluxe Edition")).toBe("Game ");
      expect(removeSpecialEditionFromName("Game Ultimate Edition")).toBe(
        "Game "
      );
      expect(removeSpecialEditionFromName("Game Collector's Edition")).toBe(
        "Game "
      );
    });

    it("should handle case insensitivity", () => {
      expect(removeSpecialEditionFromName("Game goty EDITION")).toBe("Game ");
      expect(removeSpecialEditionFromName("Game DELUXE edition")).toBe("Game ");
    });
  });

  describe("removeDuplicateSpaces", () => {
    it("should replace multiple spaces with single space", () => {
      expect(removeDuplicateSpaces("Game    Name")).toBe("Game Name");
      expect(removeDuplicateSpaces("Game  Name  Test")).toBe("Game Name Test");
    });
  });

  describe("replaceDotsWithSpace", () => {
    it("should replace dots with spaces", () => {
      expect(replaceDotsWithSpace("Game.Name")).toBe("Game Name");
      expect(replaceDotsWithSpace("Game.Name.Test")).toBe("Game Name Test");
    });
  });

  describe("replaceUnderscoreWithSpace", () => {
    it("should replace underscores with spaces", () => {
      expect(replaceUnderscoreWithSpace("Game_Name")).toBe("Game Name");
      expect(replaceUnderscoreWithSpace("Game_Name_Test")).toBe(
        "Game Name Test"
      );
    });
  });

  describe("removeAccents", () => {
    it("should remove accents from characters", () => {
      expect(removeAccents("áéíóú")).toBe("aeiou");
      expect(removeAccents("Café")).toBe("Cafe");
    });
  });

  describe("formatName", () => {
    it("should format game names correctly", () => {
      expect(formatName("Resident Evil 5 Gold Edition")).toBe(
        "resident evil 5"
      );
      expect(formatName("Ghost of Tsushima DIRECTOR'S CUT")).toBe(
        "ghost of tsushima"
      );
      expect(formatName("S.T.A.L.K.E.R. 2: Heart of Chornobyl")).toBe(
        "s t a l k e r 2 heart of chornobyl"
      );
      expect(formatName("Watch_Dogs™")).toBe("watch dogs");
    });
  });

  describe("formatDownloadOptionName", () => {
    it("should format download option names correctly", () => {
      expect(formatDownloadOptionName("[DL] Game Name")).toBe("game name");
      expect(formatDownloadOptionName("Game [DL] Name")).toBe("game name");
    });
  });

  describe("replaceNbspWithSpace", () => {
    it("should replace non-breaking spaces with regular spaces", () => {
      const textWithNbsp = `Game${String.fromCharCode(160)}Name`;
      expect(replaceNbspWithSpace(textWithNbsp)).toBe("Game Name");

      const multipleNbsp = `Game${String.fromCharCode(160)}${String.fromCharCode(160)}Name`;
      expect(replaceNbspWithSpace(multipleNbsp)).toBe("Game  Name");
    });

    it("should not modify strings without non-breaking spaces", () => {
      expect(replaceNbspWithSpace("Game Name")).toBe("Game Name");
    });
  });
});
