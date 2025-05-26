import { describe, it, expect, vi, beforeEach } from "vitest";
import { levelStorage } from "../level-storage";
import * as constants from "@/constants";
import * as tauri from "@tauri-apps/api/core";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

const mockDB = new Map<string, unknown>();

const levelMethods = {
  get: vi.fn((key: string) => {
    if (!mockDB.has(key)) return null;
    return mockDB.get(key);
  }),
  put<T>(key: string, value: T): void {
    mockDB.set(key, value);
  },
  del: (key: string) => {
    mockDB.delete(key);
  },
};

vi.mock("level", () => {
  return {
    Level: vi.fn(() => levelMethods),
  };
});

describe("levelStorage", () => {
  const key = "test-key";
  const value = { foo: "bar" };

  beforeEach(() => {
    vi.restoreAllMocks();
    mockDB.clear();
  });

  describe("when IS_BROWSER is false", () => {
    beforeEach(() => {
      vi.spyOn(constants, "IS_BROWSER", "get").mockReturnValue(false);
    });

    it("should return null for getItem", async () => {
      const result = await levelStorage.getItem(key);
      expect(result).toBeNull();
    });

    it("should not call anything on setItem or removeItem", async () => {
      await expect(levelStorage.setItem(key, value)).resolves.toBeUndefined();
      await expect(levelStorage.removeItem(key)).resolves.toBeUndefined();
    });
  });

  describe("when IS_BROWSER is true and IS_DESKTOP is true", () => {
    beforeEach(() => {
      vi.spyOn(constants, "IS_BROWSER", "get").mockReturnValue(true);
      vi.spyOn(constants, "IS_DESKTOP", "get").mockReturnValue(true);
    });

    it("should call Tauri invoke for getItem", async () => {
      vi.mocked(tauri.invoke).mockResolvedValue(value);
      const result = await levelStorage.getItem(key);
      expect(result).toEqual(value);
      expect(tauri.invoke).toHaveBeenCalledWith("get_leveldb_item", { key });
    });

    it("should call Tauri invoke for setItem", async () => {
      await levelStorage.setItem(key, value);
      expect(tauri.invoke).toHaveBeenCalledWith("set_leveldb_item", {
        key,
        value,
      });
    });

    it("should call Tauri invoke for removeItem", async () => {
      await levelStorage.removeItem(key);
      expect(tauri.invoke).toHaveBeenCalledWith("delete_leveldb_item", { key });
    });
  });

  describe("when IS_BROWSER is true and IS_DESKTOP is false", () => {
    beforeEach(() => {
      vi.spyOn(constants, "IS_BROWSER", "get").mockReturnValue(true);
      vi.spyOn(constants, "IS_DESKTOP", "get").mockReturnValue(false);
    });

    it("should get and return value from Level instance", async () => {
      await levelStorage.setItem(key, value);
      const result = await levelStorage.getItem<typeof value>(key);
      expect(result).toEqual(value);
    });

    it("should remove value from Level instance", async () => {
      await levelStorage.setItem(key, value);
      await levelStorage.removeItem(key);
      const result = await levelStorage.getItem(key);
      expect(result).toBeNull();
    });
  });
});
