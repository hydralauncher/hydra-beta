export type SteamGamesByLetterResponse = Record<
  string,
  { id: number; name: string }[]
>;

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

export interface TrendingGame {
  id: number;
  documentId: string;
  uri: string;
  background: string;
  logo: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  locale: string;
}

export * from "./api.types";
export * from "./steam.types";
