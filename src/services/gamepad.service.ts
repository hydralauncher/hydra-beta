import { GamepadButtonType } from "@/types";
import { getGamepadLayout } from "@/helpers/gamepad-layout";

export interface ButtonRawState {
  pressed: boolean;
  value: number;
  lastUpdated: Date;
}

type GamepadRawButtons = Map<GamepadButtonType, ButtonRawState>;
type GamepadRegistry = Map<number, globalThis.Gamepad>;

export interface GamepadRawState {
  name: string;
  layout: string;
  buttons: GamepadRawButtons;
}

export class GamepadService {
  private static instance: GamepadService;

  private gamepads: GamepadRegistry = new Map();
  private isPolling = false;
  private animationFrameId: number | null = null;

  private gamepadStates: Map<number, GamepadRawState> = new Map();
  private lastActiveGamepad: number | null = null;

  public static getInstance(): GamepadService {
    if (!GamepadService.instance) {
      GamepadService.instance = new GamepadService();
    }
    return GamepadService.instance;
  }

  constructor() {
    if (!this.isWindowAvailable()) return;

    this.setupListeners();
  }

  private isWindowAvailable() {
    return typeof window !== "undefined";
  }

  private setupListeners() {
    window.addEventListener("gamepadconnected", this.handleGamepadConnected);

    window.addEventListener(
      "gamepaddisconnected",
      this.handleGamepadDisconnected
    );
  }

  private handleGamepadConnected = (event: GamepadEvent) => {
    const gamepad = event.gamepad;

    this.gamepads.set(gamepad.index, gamepad);

    if (!this.isPolling) {
      this.startPolling();
    }
  };

  private handleGamepadDisconnected = (event: GamepadEvent) => {
    const gamepad = event.gamepad;

    this.gamepads.delete(gamepad.index);
    this.gamepadStates.delete(gamepad.index);

    if (this.gamepads.size === 0) {
      this.stopPolling();
    }
  };

  private pollGamepads() {
    const gamepads = navigator.getGamepads();

    for (const gamepad of gamepads) {
      if (!gamepad) continue;

      this.gamepads.set(gamepad.index, gamepad);
      this.updateGamepadState(gamepad.index, gamepad);
    }

    this.animationFrameId = requestAnimationFrame(() => this.pollGamepads());
  }

  private updateButtonState(
    gamepadState: GamepadRawState,
    type: GamepadButtonType,
    buttonState: GamepadButton,
    gamepadIndex: number,
    now: Date
  ): boolean {
    const prevState = gamepadState.buttons.get(type);

    if (
      prevState?.pressed === buttonState.pressed &&
      prevState?.value === buttonState.value
    )
      return false;

    gamepadState.buttons.set(type, {
      pressed: buttonState.pressed,
      value: buttonState.value,
      lastUpdated: now,
    });

    if (buttonState.pressed && gamepadIndex !== this.lastActiveGamepad)
      this.lastActiveGamepad = gamepadIndex;

    return true;
  }

  private updateGamepadState(index: number, gamepad: Gamepad) {
    const layout = getGamepadLayout(gamepad);
    const now = new Date();

    if (!this.gamepadStates.has(index)) {
      this.gamepadStates.set(index, {
        name: gamepad.id,
        layout: layout.name,
        buttons: new Map(),
      });

      if (this.lastActiveGamepad === null) {
        this.lastActiveGamepad = index;
      }
    }

    const gamepadState = this.gamepadStates.get(index);
    if (!gamepadState) return;

    for (const mapping of layout.buttons) {
      const { index: buttonIndex, type } = mapping;
      const buttonState = gamepad.buttons[buttonIndex];

      if (!buttonState) continue;

      this.updateButtonState(gamepadState, type, buttonState, index, now);
    }
  }

  private startPolling() {
    if (this.isPolling) return;

    this.isPolling = true;

    this.pollGamepads();
  }

  private stopPolling() {
    if (!this.isPolling) return;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.isPolling = false;
  }

  public getCurrentState(
    index?: number
  ): GamepadRawState | Map<number, GamepadRawState> | null {
    if (index !== undefined) {
      const state = this.gamepadStates.get(index);
      if (!state) return null;

      return {
        name: state.name,
        layout: state.layout,
        buttons: new Map(state.buttons),
      };
    }

    const states = new Map<number, GamepadRawState>();
    this.gamepadStates.forEach((state, idx) => {
      states.set(idx, {
        name: state.name,
        layout: state.layout,
        buttons: new Map(state.buttons),
      });
    });

    return states;
  }

  public getLastActiveGamepad(): number | null {
    return this.lastActiveGamepad;
  }

  public dispose(): void {
    this.stopPolling();
    window.removeEventListener("gamepadconnected", this.handleGamepadConnected);
    window.removeEventListener(
      "gamepaddisconnected",
      this.handleGamepadDisconnected
    );
    this.gamepads.clear();
  }
}
