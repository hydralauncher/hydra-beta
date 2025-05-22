import { IS_BROWSER, IS_DESKTOP } from "@/constants";
import { invoke } from "@tauri-apps/api/core";
import { Level } from "level";

const getLevelInstance = <T>() =>
  new Level<string, T>("hydra-db", {
    valueEncoding: "json",
  });

export const levelStorage = {
  getItem: async <T>(key: string) => {
    if (!IS_BROWSER) {
      return null;
    }

    if (IS_DESKTOP) {
      const value = await invoke<T>("get_leveldb_item", { key });
      return value;
    }

    const value = await getLevelInstance<T>().get(key);
    return value as T;
  },
  setItem: async <T>(key: string, value: T) => {
    if (!IS_BROWSER) {
      return;
    }

    if (IS_DESKTOP) {
      await invoke("set_leveldb_item", { key, value });
    } else {
      await getLevelInstance<T>().put(key, value);
    }
  },
  removeItem: async <T>(key: string) => {
    if (!IS_BROWSER) {
      return;
    }

    if (IS_DESKTOP) {
      await invoke("delete_leveldb_item", { key });
    } else {
      await getLevelInstance<T>().del(key);
    }
  },
};
