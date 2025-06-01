export type FilterKey =
  | "genres"
  | "userTags"
  | "developers"
  | "publishers"
  | "downloadSourceFingerprints";

export interface FilterConfig {
  label: string;
  color: string;
  isObject: boolean;
}

export interface ActiveFilter {
  type: FilterKey;
  value: string | number;
  label: string;
  color: string;
}
