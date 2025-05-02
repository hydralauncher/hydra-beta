type GamepadRegistry = Map<number, globalThis.Gamepad>;

export class Gamepad {
  private gamepads: GamepadRegistry = new Map();
  private isPolling = false;
  private animationFrameId: number | null = null;

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
      if (!gamepad) {
        continue;
      }

      this.gamepads.set(gamepad.index, gamepad);

      // TODO: processar inputs dps
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

  public getConnectedGamepads(): globalThis.Gamepad[] {
    return Array.from(this.gamepads.values());
  }

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

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
