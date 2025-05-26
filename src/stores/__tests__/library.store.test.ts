import { describe, it, expect, vi, beforeEach } from "vitest";
import { useLibraryStore } from "../library.store";
import type { GameShop } from "@/types";

vi.mock("../level-storage", () => ({
  levelStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe("useLibraryStore", () => {
  const mockGame = {
    id: "123",
    title: "Test Game",
    iconUrl: "https://example.com/icon.png",
    objectId: "456",
    shop: "steam" as GameShop,
    isFavorite: false,
    playTimeInMilliseconds: 3600000,
  };

  beforeEach(() => {
    useLibraryStore.getState().clearLibrary();
  });

  describe("library", () => {
    it("should initialize with empty array", () => {
      expect(useLibraryStore.getState().library).toEqual([]);
    });

    it("should set library", () => {
      const games = [mockGame];
      useLibraryStore.getState().setLibrary(games);
      expect(useLibraryStore.getState().library).toEqual(games);
    });

    it("should clear library", () => {
      useLibraryStore.getState().setLibrary([mockGame]);
      useLibraryStore.getState().clearLibrary();
      expect(useLibraryStore.getState().library).toEqual([]);
    });
  });

  describe("multiple operations", () => {
    it("should handle multiple games correctly", () => {
      const game2 = { ...mockGame, id: "789", title: "Test Game 2" };
      const game3 = { ...mockGame, id: "101", title: "Test Game 3" };

      useLibraryStore.getState().setLibrary([mockGame, game2, game3]);
      const state = useLibraryStore.getState();
      expect(state.library).toHaveLength(3);
      expect(state.library[0].id).toBe(mockGame.id);
      expect(state.library[1].id).toBe(game2.id);
      expect(state.library[2].id).toBe(game3.id);
    });

    it("should handle set and clear operations in sequence", () => {
      useLibraryStore.getState().setLibrary([mockGame]);
      useLibraryStore.getState().clearLibrary();
      useLibraryStore.getState().setLibrary([mockGame]);
      expect(useLibraryStore.getState().library).toEqual([mockGame]);
    });
  });

  describe("edge cases", () => {
    it("should handle empty array in setLibrary", () => {
      useLibraryStore.getState().setLibrary([]);
      expect(useLibraryStore.getState().library).toEqual([]);
    });

    it("should handle duplicate games in setLibrary", () => {
      useLibraryStore.getState().setLibrary([mockGame, mockGame]);
      expect(useLibraryStore.getState().library).toHaveLength(2);
    });
  });
});
