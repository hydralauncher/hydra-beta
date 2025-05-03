import { GamepadButtonType } from "@/types";
import { getGamepadLayout } from "@/helpers/gamepad-layout";

interface ButtonRawState {
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
    window.addEventListener(
      "gamepadconnected",
      this.handleGamepadConnected.bind(this)
    );

    window.addEventListener(
      "gamepaddisconnected",
      this.handleGamepadDisconnected.bind(this)
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

    if (this.gamepads.size === 0) {
      this.stopPolling();
    }
  };

  private pollGamepads() {
    const gamepads = navigator.getGamepads();

    for (const gamepad of gamepads) {
      if (!gamepad) continue;

      this.gamepads.set(gamepad.index, gamepad);

      const gamepadLayout = getGamepadLayout(gamepad);

      if (!this.gamepadStates.has(gamepad.index)) {
        this.gamepadStates.set(gamepad.index, {
          name: gamepad.id,
          layout: gamepadLayout.name,
          buttons: new Map(),
        });
      }

      const gamepadState = this.gamepadStates.get(gamepad.index);

      if (!gamepadState) continue;

      for (const mapping of gamepadLayout.buttons) {
        const { index, type } = mapping;

        const buttonState = gamepad.buttons[index];

        if (!buttonState) continue;

        const prevState = gamepadState.buttons.get(type);
        const stateChanged =
          !prevState ||
          prevState.pressed !== buttonState.pressed ||
          prevState.value !== buttonState.value;

        if (!stateChanged) continue;

        gamepadState.buttons.set(type, {
          pressed: buttonState.pressed,
          value: buttonState.value,
          lastUpdated: new Date(),
        });
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.pollGamepads());
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

  public getCurrentState(): Map<number, GamepadRawState>;
  public getCurrentState(
    index?: number
  ): GamepadRawState | null | Map<number, GamepadRawState> {
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

    this.gamepadStates.forEach((state, index) => {
      states.set(index, {
        name: state.name,
        layout: state.layout,
        buttons: new Map(state.buttons),
      });
    });

    return states;
  }

  public dispose(): void {
    this.stopPolling();
    window.removeEventListener(
      "gamepadconnected",
      this.handleGamepadConnected.bind(this)
    );
    window.removeEventListener(
      "gamepaddisconnected",
      this.handleGamepadDisconnected.bind(this)
    );
    this.gamepads.clear();
  }
}
