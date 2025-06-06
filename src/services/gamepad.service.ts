import { GamepadLayout, getGamepadLayout } from "@/helpers";
import {
  GamepadAxisType,
  GamepadButtonType,
  GamepadAxisDirection,
  GamepadStickSide,
} from "@/types";

export interface ButtonRawState {
  pressed: boolean;
  value: number;
  lastUpdated: number;
}

export interface AxisRawState {
  value: number;
  lastUpdated: number;
}

export interface GamepadRawState {
  name: string;
  layout: string;
  buttons: Map<GamepadButtonType, ButtonRawState>;
  axes: Map<GamepadAxisType, AxisRawState>;
}

interface GamepadStickState {
  position: Vector2D;
  direction: GamepadAxisDirection | null;
  repeatTimer: number | null;
  lastMoveTime: number;
}

type GamepadRegistry = Map<number, globalThis.Gamepad>;
type ButtonPressCallback = () => void;
type StickMoveCallback = () => void;
type ButtonPressCallbacks = Map<GamepadButtonType, Set<ButtonPressCallback>>;
type StickMoveCallbacks = Map<
  GamepadStickSide,
  Map<GamepadAxisDirection, Set<StickMoveCallback>>
>;

export class GamepadService {
  private static instance: GamepadService;

  private readonly sticksDeadzone = 0.1;
  private readonly sticksDirectionThreshold = 0.5;
  private readonly sticksInitialRepeatDelay = 400;
  private readonly sticksRepeatInterval = 150;

  private isPolling = false;
  private animationFrameId: number | null = null;
  private lastActiveGamepad: number | null = null;

  private readonly gamepads: GamepadRegistry = new Map();
  private readonly gamepadStates = new Map<number, GamepadRawState>();
  private readonly buttonPressCallbacks: ButtonPressCallbacks = new Map();
  private readonly stickMoveCallbacks: StickMoveCallbacks = new Map();
  private readonly layoutCache = new Map<string, GamepadLayout>();

  private leftStickState: GamepadStickState = this.createInitialStickState();
  private rightStickState: GamepadStickState = this.createInitialStickState();

  private stateChangeCallbacks = new Set<() => void>();

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
      this.handleNewGamepadConnection
    );

    window.addEventListener(
      "gamepaddisconnected",
      this.handleGamepadDisconnection
    );
  }

  private createInitialStickState(): GamepadStickState {
    return {
      position: new Vector2D(0, 0),
      direction: null,
      repeatTimer: null,
      lastMoveTime: Date.now(),
    };
  }

  private readonly handleNewGamepadConnection = (event: GamepadEvent) => {
    const gamepad = event.gamepad;

    this.gamepads.set(gamepad.index, gamepad);

    if (!this.isPolling) {
      this.startPolling();
    }

    this.notifyStateChange();
  };

  private readonly handleGamepadDisconnection = (event: GamepadEvent) => {
    const gamepad = event.gamepad;

    this.gamepads.delete(gamepad.index);
    this.gamepadStates.delete(gamepad.index);

    this.clearAllTimers();

    if (this.gamepads.size === 0) {
      this.stopPolling();
    }

    this.notifyStateChange();
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
    this.clearAllTimers();
  }

  private updateButtonState(
    gamepadState: GamepadRawState,
    type: GamepadButtonType,
    buttonState: GamepadButton,
    index: number,
    now: number
  ) {
    const prevState = gamepadState.buttons.get(type);

    if (
      prevState?.pressed === buttonState.pressed &&
      prevState?.value === buttonState.value
    )
      return;

    gamepadState.buttons.set(type, {
      pressed: buttonState.pressed,
      value: buttonState.value,
      lastUpdated: now,
    });

    if (buttonState.pressed && index !== this.lastActiveGamepad)
      this.lastActiveGamepad = index;

    if (buttonState.pressed && !prevState?.pressed) {
      this.triggerButtonPressCallbacks(type);
    }
  }

  private updateAxisState(
    gamepadState: GamepadRawState,
    type: GamepadAxisType,
    axisState: number,
    gamepadIndex: number,
    now: number
  ): boolean {
    const prevState = gamepadState.axes.get(type);

    if (prevState?.value === axisState) return false;

    gamepadState.axes.set(type, {
      value: axisState,
      lastUpdated: now,
    });

    if (axisState !== 0 && gamepadIndex !== this.lastActiveGamepad)
      this.lastActiveGamepad = gamepadIndex;

    return true;
  }

  private triggerButtonPressCallbacks(type: GamepadButtonType): void {
    const callbacks = this.buttonPressCallbacks.get(type);
    if (callbacks) {
      callbacks.forEach((callback) => {
        callback();
      });
    }
  }

  public onButtonPress(
    type: GamepadButtonType,
    callback: () => void
  ): () => void {
    if (!this.buttonPressCallbacks.has(type)) {
      this.buttonPressCallbacks.set(type, new Set());
    }

    const callbacks = this.buttonPressCallbacks.get(type)!;
    callbacks.add(callback);

    return () => {
      const callbackSet = this.buttonPressCallbacks.get(type);
      if (!callbackSet) return;

      callbackSet.delete(callback);
      if (callbackSet.size === 0) {
        this.buttonPressCallbacks.delete(type);
      }
    };
  }

  private notifyStateChange(): void {
    this.stateChangeCallbacks.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error("Error in state change callback:", error);
      }
    });
  }

  private updateGamepadState(index: number, gamepad: Gamepad) {
    const layout = this.getNewLayoutOrCached(gamepad);
    const now = Date.now();

    if (!this.gamepadStates.has(index)) {
      this.gamepadStates.set(index, {
        name: gamepad.id,
        layout: layout.name,
        buttons: new Map(),
        axes: new Map(),
      });

      this.lastActiveGamepad ??= index;
    }

    const gamepadState = this.gamepadStates.get(index)!;
    const gamepadIndex = index;

    let hasButtonsStateChanged = false;
    let hasSticksStateChanged = false;

    for (const mapping of layout.buttons) {
      const { index, type } = mapping;
      const buttonState = gamepad.buttons[index];

      if (!buttonState) continue;

      const prevState = gamepadState.buttons.get(type);

      if (
        prevState?.pressed !== buttonState.pressed ||
        prevState?.value !== buttonState.value
      ) {
        hasButtonsStateChanged = true;

        this.updateButtonState(
          gamepadState,
          type,
          buttonState,
          gamepadIndex,
          now
        );
      }
    }

    const leftStickPosition = { x: 0, y: 0 };
    const rightStickPosition = { x: 0, y: 0 };

    for (const mapping of layout.axes) {
      const { index, type } = mapping;
      let axisState = gamepad.axes[index];

      if (axisState === undefined) continue;

      if (mapping.invert) {
        axisState = -axisState;
      }

      if (Math.abs(axisState) < this.sticksDeadzone) {
        axisState = 0;
      }

      const prevState = gamepadState.axes.get(type);

      if (
        !prevState ||
        Math.abs(prevState.value - axisState) >= this.sticksDeadzone
      ) {
        hasSticksStateChanged = true;

        gamepadState.axes.set(type, {
          value: axisState,
          lastUpdated: now,
        });
      }

      switch (type) {
        case GamepadAxisType.LEFT_STICK_X:
          leftStickPosition.x = axisState;
          break;
        case GamepadAxisType.LEFT_STICK_Y:
          leftStickPosition.y = axisState;
          break;
        case GamepadAxisType.RIGHT_STICK_X:
          rightStickPosition.x = axisState;
          break;
        case GamepadAxisType.RIGHT_STICK_Y:
          rightStickPosition.y = axisState;
          break;
      }

      if (axisState !== 0 && gamepadIndex !== this.lastActiveGamepad) {
        this.lastActiveGamepad = gamepadIndex;
      }
    }

    this.updateStickState(
      "left",
      new Vector2D(leftStickPosition.x, leftStickPosition.y),
      now
    );
    this.updateStickState(
      "right",
      new Vector2D(rightStickPosition.x, rightStickPosition.y),
      now
    );

    if (hasButtonsStateChanged || hasSticksStateChanged) {
      this.notifyStateChange();
    }
  }

  private updateStickState(
    side: GamepadStickSide,
    position: Vector2D,
    now: number
  ) {
    const stickState =
      side === "left" ? this.leftStickState : this.rightStickState;

    const prevDirection = stickState.direction;

    stickState.position = position;
    stickState.lastMoveTime = now;

    const magnitude = position.magnitude();

    const newDirection =
      magnitude > this.sticksDirectionThreshold
        ? position.dominantDirection()
        : null;

    if (newDirection === prevDirection) return;

    if (stickState.repeatTimer !== null) {
      window.clearTimeout(stickState.repeatTimer);
      stickState.repeatTimer = null;
    }

    stickState.direction = newDirection;

    if (newDirection) {
      this.triggerStickCallbacks(side, newDirection);
      this.setupStickRepeat(side, newDirection);
    }
  }

  private setupStickRepeat(
    side: GamepadStickSide,
    direction: GamepadAxisDirection
  ) {
    const stickState =
      side === "left" ? this.leftStickState : this.rightStickState;

    stickState.repeatTimer = window.setTimeout(() => {
      if (stickState.direction === direction) {
        this.triggerStickCallbacks(side, direction);
        this.repeatStickCallback(side, direction);
      } else {
        stickState.repeatTimer = null;
      }
    }, this.sticksInitialRepeatDelay);
  }

  private repeatStickCallback(
    side: GamepadStickSide,
    direction: GamepadAxisDirection
  ) {
    const stickState =
      side === "left" ? this.leftStickState : this.rightStickState;

    const repeat = () => {
      if (stickState.direction !== direction) {
        stickState.repeatTimer = null;
        return;
      }

      this.triggerStickCallbacks(side, direction);

      stickState.repeatTimer = window.setTimeout(
        repeat,
        this.sticksRepeatInterval
      );
    };

    stickState.repeatTimer = window.setTimeout(
      repeat,
      this.sticksInitialRepeatDelay
    );
  }

  private clearStickTimer(stickState: GamepadStickState) {
    if (stickState.repeatTimer !== null) {
      window.clearTimeout(stickState.repeatTimer);
      stickState.repeatTimer = null;
    }
  }

  private clearAllTimers() {
    this.clearStickTimer(this.leftStickState);
    this.clearStickTimer(this.rightStickState);

    this.leftStickState = this.createInitialStickState();
    this.rightStickState = this.createInitialStickState();
  }

  private triggerStickCallbacks(
    side: GamepadStickSide,
    direction: GamepadAxisDirection
  ) {
    const sideCallbacks = this.stickMoveCallbacks.get(side);
    if (!sideCallbacks) return;

    const callbacks = sideCallbacks.get(direction);
    if (!callbacks) return;

    callbacks.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error(
          `Error in stick move callback for ${side} ${direction}:`,
          error
        );
      }
    });
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
        axes: new Map(state.axes),
      };
    }

    const states = new Map<number, GamepadRawState>();
    this.gamepadStates.forEach((state, idx) => {
      states.set(idx, {
        name: state.name,
        layout: state.layout,
        buttons: new Map(state.buttons),
        axes: new Map(state.axes),
      });
    });

    return states;
  }

  public getLastActiveGamepad(): number | null {
    return this.lastActiveGamepad;
  }

  public onStateChange(callback: () => void): () => void {
    this.stateChangeCallbacks.add(callback);

    return () => {
      this.stateChangeCallbacks.delete(callback);
    };
  }

  public onStickMove(
    side: GamepadStickSide,
    direction: GamepadAxisDirection,
    callback: () => void
  ): () => void {
    if (!this.stickMoveCallbacks.has(side)) {
      this.stickMoveCallbacks.set(side, new Map());
    }

    const sideCallbacks = this.stickMoveCallbacks.get(side)!;

    if (!sideCallbacks.has(direction)) {
      sideCallbacks.set(direction, new Set());
    }

    const callbacks = sideCallbacks.get(direction)!;
    callbacks.add(callback);

    return () => {
      const sideMap = this.stickMoveCallbacks.get(side);
      if (sideMap) {
        const callbackSet = sideMap.get(direction);
        if (callbackSet) {
          callbackSet.delete(callback);
          if (callbackSet.size === 0) {
            sideMap.delete(direction);
            if (sideMap.size === 0) {
              this.stickMoveCallbacks.delete(side);
            }
          }
        }
      }
    };
  }

  public vibrate(
    duration: number,
    weakMagnitude: number,
    strongMagnitude: number,
    gamepadIndex: number
  ): void {
    const activeGamepad = this.gamepads.get(gamepadIndex);

    if (!activeGamepad?.vibrationActuator) return;

    try {
      activeGamepad.vibrationActuator.playEffect("dual-rumble", {
        startDelay: 0,
        duration: duration,
        weakMagnitude: Math.max(0, Math.min(1, weakMagnitude)),
        strongMagnitude: Math.max(0, Math.min(1, strongMagnitude)),
      });
    } catch (error) {
      console.error("Error ao tentar vibrar o controle:", error);
    }
  }

  public dispose(): void {
    this.stopPolling();
    window.removeEventListener(
      "gamepadconnected",
      this.handleNewGamepadConnection
    );
    window.removeEventListener(
      "gamepaddisconnected",
      this.handleGamepadDisconnection
    );
    this.gamepads.clear();
    this.buttonPressCallbacks.clear();
    this.stickMoveCallbacks.clear();
    this.clearAllTimers();
  }

  private getNewLayoutOrCached(gamepad: Gamepad) {
    if (!this.layoutCache.has(gamepad.id)) {
      const layout = getGamepadLayout(gamepad);
      this.layoutCache.set(gamepad.id, layout);
      return layout;
    }

    return this.layoutCache.get(gamepad.id)!;
  }
}

class Vector2D {
  private readonly deadzone = 0.1;

  constructor(
    public x: number,
    public y: number
  ) {}

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(): Vector2D {
    const magnitude = this.magnitude();
    if (magnitude === 0) return new Vector2D(0, 0);

    return new Vector2D(this.x / magnitude, this.y / magnitude);
  }

  scale(scalar: number): Vector2D {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  dominantDirection(): GamepadAxisDirection | null {
    const magnitude = this.magnitude();

    if (magnitude < this.deadzone) return null;

    const normalized = this.normalize();

    const projections = {
      [GamepadAxisDirection.UP]: -normalized.y,
      [GamepadAxisDirection.DOWN]: normalized.y,
      [GamepadAxisDirection.LEFT]: -normalized.x,
      [GamepadAxisDirection.RIGHT]: normalized.x,
    };

    return Object.entries(projections).reduce(
      (max, [direction, projection]) =>
        projection > max.projection
          ? { direction: direction as GamepadAxisDirection, projection }
          : max,
      { direction: null as GamepadAxisDirection | null, projection: -Infinity }
    ).direction;
  }
}
