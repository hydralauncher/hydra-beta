import { charMap } from "./char-map";

export const pipe =
  <T>(...fns: ((arg: T) => T)[]) =>
  (arg: T) =>
    fns.reduce((prev, fn) => fn(prev), arg);

export const removeReleaseYearFromName = (name: string) =>
  name.replace(/\(\d{4}\)/g, "");

export const removeSymbolsFromName = (name: string) =>
  name.replace(/[^A-Za-z 0-9]/g, "");

export const removeSpecialEditionFromName = (name: string) =>
  name.replace(
    /(The |Digital )?(GOTY|Deluxe|Standard|Ultimate|Definitive|Enhanced|Collector's|Premium|Gold|Digital|Limited|Game of the Year|Reloaded|\d{4}) Edition/gi,
    ""
  );

export const removeDuplicateSpaces = (name: string) =>
  name.replace(/\s{2,}/g, " ");

export const replaceDotsWithSpace = (name: string) => name.replace(/\./g, " ");

export const replaceNbspWithSpace = (name: string) =>
  name.replace(new RegExp(String.fromCharCode(160), "g"), " ");

export const replaceUnderscoreWithSpace = (name: string) =>
  name.replace(/_/g, " ");

export const removeAccents = (str: string) =>
  str.replace(
    new RegExp(Object.keys(charMap).join("|"), "g"),
    (match) => charMap[match as keyof typeof charMap]
  );

export const formatName = pipe(
  removeAccents,
  (str) => str.toLowerCase(),
  removeReleaseYearFromName,
  removeSpecialEditionFromName,
  replaceUnderscoreWithSpace,
  replaceDotsWithSpace,
  replaceNbspWithSpace,
  (str) => str.replace(/DIRECTOR'S CUT/gi, ""),
  (str) => str.replace(/Friend's Pass/gi, ""),
  removeSymbolsFromName,
  removeDuplicateSpaces,
  (str) => str.trim()
);

export const formatDownloadOptionName = pipe(
  (name) => name.replace("[DL]", ""),
  formatName
);
