import { describe, it, expect, vi, beforeEach } from "vitest";
import { useUserStore } from "../user.store";

vi.mock("../level-storage", () => ({
  levelStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe("useUserStore", () => {
  const mockUser = {
    id: "123",
    displayName: "Test User",
    profileImageUrl: "https://example.com/avatar.png",
  };

  beforeEach(() => {
    useUserStore.getState().clearUser();
  });

  describe("user", () => {
    it("should initialize as null", () => {
      expect(useUserStore.getState().user).toBeNull();
    });

    it("should set user", () => {
      useUserStore.getState().setUser(mockUser);
      expect(useUserStore.getState().user).toEqual(mockUser);
    });

    it("should clear user", () => {
      useUserStore.getState().setUser(mockUser);
      useUserStore.getState().clearUser();
      expect(useUserStore.getState().user).toBeNull();
    });
  });

  describe("multiple operations", () => {
    it("should handle user updates correctly", () => {
      const updatedUser = { ...mockUser, displayName: "Updated Name" };
      useUserStore.getState().setUser(mockUser);
      useUserStore.getState().setUser(updatedUser);
      expect(useUserStore.getState().user).toEqual(updatedUser);
    });

    it("should handle set and clear operations in sequence", () => {
      useUserStore.getState().setUser(mockUser);
      useUserStore.getState().clearUser();
      useUserStore.getState().setUser(mockUser);
      expect(useUserStore.getState().user).toEqual(mockUser);
    });
  });

  describe("edge cases", () => {
    it("should handle clearing when user is already null", () => {
      useUserStore.getState().clearUser();
      expect(useUserStore.getState().user).toBeNull();
    });

    it("should handle setting same user multiple times", () => {
      useUserStore.getState().setUser(mockUser);
      useUserStore.getState().setUser(mockUser);
      expect(useUserStore.getState().user).toEqual(mockUser);
    });
  });
});
