import type { StateStorage } from "zustand/middleware";
import { getCookie, setCookie, removeCookie } from "typescript-cookie";

const cookiesStorage: StateStorage = {
  getItem: (name: string) => {
    return getCookie(name) ?? null;
  },
  setItem: (name: string, value: string) => {
    setCookie(name, value, { expires: 1 });
  },
  removeItem: (name: string) => {
    removeCookie(name);
  },
};

export default cookiesStorage;
