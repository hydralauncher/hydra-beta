import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuthStore } from "../auth.store";

vi.mock("../level-storage", () => ({
  levelStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
  });

  describe("tokenExpirationTimestamp", () => {
    it("should initialize with 0", () => {
      expect(useAuthStore.getState().tokenExpirationTimestamp).toBe(0);
    });

    it("should update tokenExpirationTimestamp", () => {
      const newTimestamp = Date.now();
      useAuthStore.getState().setTokenExpirationTimestamp(newTimestamp);
      expect(useAuthStore.getState().tokenExpirationTimestamp).toBe(
        newTimestamp
      );
    });
  });

  describe("accessToken", () => {
    it("should initialize as undefined", () => {
      expect(useAuthStore.getState().accessToken).toBeUndefined();
    });

    it("should update accessToken", () => {
      const newToken = "new-access-token";
      useAuthStore.getState().setAccessToken(newToken);
      expect(useAuthStore.getState().accessToken).toBe(newToken);
    });
  });

  describe("refreshToken", () => {
    it("should initialize as undefined", () => {
      expect(useAuthStore.getState().refreshToken).toBeUndefined();
    });

    it("should update refreshToken", () => {
      const newToken = "new-refresh-token";
      useAuthStore.getState().setRefreshToken(newToken);
      expect(useAuthStore.getState().refreshToken).toBe(newToken);
    });
  });

  describe("clearAuth", () => {
    it("should reset all auth state to initial values", () => {
      useAuthStore.getState().setTokenExpirationTimestamp(Date.now());
      useAuthStore.getState().setAccessToken("some-access-token");
      useAuthStore.getState().setRefreshToken("some-refresh-token");

      useAuthStore.getState().clearAuth();

      const state = useAuthStore.getState();
      expect(state.tokenExpirationTimestamp).toBe(0);
      expect(state.accessToken).toBeUndefined();
      expect(state.refreshToken).toBeUndefined();
    });
  });

  describe("state persistence", () => {
    it("should maintain state between operations", () => {
      const newTimestamp = Date.now();
      const newAccessToken = "new-access-token";
      const newRefreshToken = "new-refresh-token";

      useAuthStore.getState().setTokenExpirationTimestamp(newTimestamp);
      useAuthStore.getState().setAccessToken(newAccessToken);
      useAuthStore.getState().setRefreshToken(newRefreshToken);

      const state = useAuthStore.getState();
      expect(state.tokenExpirationTimestamp).toBe(newTimestamp);
      expect(state.accessToken).toBe(newAccessToken);
      expect(state.refreshToken).toBe(newRefreshToken);
    });
  });

  describe("multiple state updates", () => {
    it("should handle multiple state updates correctly", () => {
      useAuthStore.getState().setTokenExpirationTimestamp(1000);
      useAuthStore.getState().setAccessToken("token1");
      useAuthStore.getState().setRefreshToken("refresh1");

      useAuthStore.getState().setTokenExpirationTimestamp(2000);
      useAuthStore.getState().setAccessToken("token2");
      useAuthStore.getState().setRefreshToken("refresh2");

      useAuthStore.getState().clearAuth();

      useAuthStore.getState().setTokenExpirationTimestamp(3000);
      useAuthStore.getState().setAccessToken("token3");
      useAuthStore.getState().setRefreshToken("refresh3");

      const state = useAuthStore.getState();
      expect(state.tokenExpirationTimestamp).toBe(3000);
      expect(state.accessToken).toBe("token3");
      expect(state.refreshToken).toBe("refresh3");
    });
  });
});
