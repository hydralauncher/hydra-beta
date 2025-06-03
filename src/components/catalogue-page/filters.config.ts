export type FilterKey = "genres" | "tags" | "developers" | "publishers";

export interface FilterConfig {
  label: string;
  color: string;
  isObject: boolean;
}



export const FILTERS: Record<FilterKey, FilterConfig> = {
  genres: {
    label: "Genres",
    color: "magenta",
    isObject: false,
  },
  tags: {
    label: "User Tags",
    color: "yellow",
    isObject: true,
  },
  developers: {
    label: "Developers",
    color: "cyan",
    isObject: false,
  },
  publishers: {
    label: "Publishers",
    color: "limegreen",
    isObject: false,
  },
} as const;
