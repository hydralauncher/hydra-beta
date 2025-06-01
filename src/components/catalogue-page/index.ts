import Sidebar from "./sidebar";
import Filters from "./filters";
import Header from "./header";
import Card from "./card";
import Grid from "./grid";
import type { FilterKey, FilterConfig } from "@/types";

export const FILTER_COLORS = {
  genres: "magenta",
  userTags: "yellow",
  developers: "cyan",
  publishers: "limegreen",
  downloadSourceFingerprints: "red",
} as const;

export const FILTER_CONFIG: Record<FilterKey, FilterConfig> = {
  genres: {
    label: "Genres",
    color: FILTER_COLORS.genres,
    isObject: false,
  },
  userTags: {
    label: "User Tags",
    color: FILTER_COLORS.userTags,
    isObject: true,
  },
  downloadSourceFingerprints: {
    label: "Download Sources",
    color: FILTER_COLORS.downloadSourceFingerprints,
    isObject: true,
  },
  developers: {
    label: "Developers",
    color: FILTER_COLORS.developers,
    isObject: false,
  },
  publishers: {
    label: "Publishers",
    color: FILTER_COLORS.publishers,
    isObject: false,
  },
} as const;

export const Catalogue = {
  Sidebar,
  Filters,
  Header,
  Card,
  Grid,
};
