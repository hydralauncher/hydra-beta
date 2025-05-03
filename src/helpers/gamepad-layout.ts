import { GamepadButtonType } from "@/types";

export interface GamepadButtonMapping {
  index: number;
  type: GamepadButtonType;
}

export interface GamepadLayout {
  name: string;
  buttons: GamepadButtonMapping[];
  idPatterns: RegExp[];
}

const GAMEPAD_LAYOUTS: GamepadLayout[] = [
  {
    name: "Xbox Controller",
    idPatterns: [/xbox/i, /xinput/i, /microsoft/i],
    buttons: [
      { index: 0, type: GamepadButtonType.BUTTON_A },
      { index: 1, type: GamepadButtonType.BUTTON_B },
      { index: 2, type: GamepadButtonType.BUTTON_X },
      { index: 3, type: GamepadButtonType.BUTTON_Y },
      { index: 4, type: GamepadButtonType.LEFT_BUMPER },
      { index: 5, type: GamepadButtonType.RIGHT_BUMPER },
      { index: 6, type: GamepadButtonType.LEFT_TRIGGER },
      { index: 7, type: GamepadButtonType.RIGHT_TRIGGER },
      { index: 8, type: GamepadButtonType.BACK },
      { index: 9, type: GamepadButtonType.START },
      { index: 10, type: GamepadButtonType.LEFT_STICK_PRESS },
      { index: 11, type: GamepadButtonType.RIGHT_STICK_PRESS },
      { index: 12, type: GamepadButtonType.DPAD_UP },
      { index: 13, type: GamepadButtonType.DPAD_DOWN },
      { index: 14, type: GamepadButtonType.DPAD_LEFT },
      { index: 15, type: GamepadButtonType.DPAD_RIGHT },
      { index: 16, type: GamepadButtonType.HOME },
    ],
  },
];

export const gamepadLayouts = GAMEPAD_LAYOUTS;

export const getGamepadLayout = (gamepad: globalThis.Gamepad) => {
  for (const layout of GAMEPAD_LAYOUTS) {
    if (layout.idPatterns.some((pattern: RegExp) => pattern.test(gamepad.id))) {
      return layout;
    }
  }

  return GAMEPAD_LAYOUTS[0];
};
