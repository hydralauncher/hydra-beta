export const IS_BROWSER = typeof window !== "undefined";

export const IS_DESKTOP = IS_BROWSER && "__TAURI_INTERNALS__" in window;
