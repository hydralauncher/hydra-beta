import { DownloadSourceStatus } from "./workers/download-sources/constants";

export type GameShop = "steam";

export interface DexieModel {
  id?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Download extends DexieModel {
  title: string;
  uris: string[];
  fileSize: string;
  uploadDate: string;
  downloadSourceId: number;
  objectIds: string[];
}

export interface DownloadSource extends DexieModel {
  url: string;
  name: string;
  objectIds: string[];
  downloadCount: number;
  status: DownloadSourceStatus;
  fingerprint: string;
}

export interface HowLongToBeatCategory {
  title: string;
  duration: string;
  accuracy: string;
}

export interface HowLongToBeatEntry extends DexieModel {
  objectId: string;
  categories: HowLongToBeatCategory[];
  shop: GameShop;
}

export interface SteamGamesByLetter extends DexieModel {
  letter: string;
  games: { id: number; name: string }[];
}

export type SteamGamesByLetterResponse = Record<
  string,
  { id: number; name: string }[]
>;

export interface SteamGenre {
  id: string;
  name: string;
}

export interface SteamScreenshot {
  id: number;
  path_thumbnail: string;
  path_full: string;
}

export interface SteamVideoSource {
  max: string;
  "480": string;
}

export interface SteamMovies {
  id: number;
  mp4: SteamVideoSource;
  webm: SteamVideoSource;
  thumbnail: string;
  name: string;
  highlight: boolean;
}

export interface SteamAppDetails {
  name: string;
  steam_appid: number;
  detailed_description: string;
  about_the_game: string;
  short_description: string;
  publishers: string[];
  genres: SteamGenre[];
  movies?: SteamMovies[];
  screenshots?: SteamScreenshot[];
  pc_requirements: {
    minimum: string;
    recommended: string;
  };
  mac_requirements: {
    minimum: string;
    recommended: string;
  };
  linux_requirements: {
    minimum: string;
    recommended: string;
  };
  release_date: {
    coming_soon: boolean;
    date: string;
  };
  content_descriptors: {
    ids: number[];
  };
}

export interface User {
  id: string;
  displayName: string;
  profileImageUrl: string;
}

export interface Auth {
  accessToken: string;
  refreshToken: string;
  tokenExpirationTimestamp: number;
}

export enum GamepadButtonType {
  BUTTON_A = "buttonA",
  BUTTON_B = "buttonB",
  BUTTON_X = "buttonX",
  BUTTON_Y = "buttonY",
  LEFT_BUMPER = "leftBumper",
  RIGHT_BUMPER = "rightBumper",
  LEFT_TRIGGER = "leftTrigger",
  RIGHT_TRIGGER = "rightTrigger",
  DPAD_UP = "dpadUp",
  DPAD_DOWN = "dpadDown",
  DPAD_LEFT = "dpadLeft",
  DPAD_RIGHT = "dpadRight",
  LEFT_STICK_PRESS = "leftStickPress",
  RIGHT_STICK_PRESS = "rightStickPress",
  BACK = "back",
  START = "start",
  HOME = "home",
  TRACKPAD = "trackpad",
}

export enum GamepadAxisType {
  LEFT_STICK_X = "leftStickX",
  LEFT_STICK_Y = "leftStickY",
  RIGHT_STICK_X = "rightStickX",
  RIGHT_STICK_Y = "rightStickY",
}

export enum GamepadAxisDirection {
  LEFT = "left",
  RIGHT = "right",
  UP = "up",
  DOWN = "down",
  NONE = "none",
}

export type GamepadStickSide = "left" | "right";

export interface GamepadVibrationOptions {
  duration?: number;
  weakMagnitude?: number;
  strongMagnitude?: number;
  gamepadIndex?: number;
}
