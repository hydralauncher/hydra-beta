import { create } from "zustand";
import { GamepadRawState, GamepadService, ButtonRawState } from "@/services";

interface GamepadInfo {
  index: number;
  name: string;
  layout: string;
}

export interface GamepadStore {
  states: Map<number, GamepadRawState>;
  connectedGamepads: GamepadInfo[];
  activeGamepad: GamepadInfo | null;
  hasGamepadConnected: boolean;
  lastUpdate: number;
  initialized: boolean;
  polling: boolean;
  debug: boolean;

  initialize: () => void;
  sync: () => void;
  startPolling: () => void;
  stopPolling: () => void;
  getActiveGamepad: () => GamepadInfo | null;
  logState: () => void;
  cleanup: () => void;
}

export const useGamepadStore = create<GamepadStore>((set, get) => {
  const isDevelopment = process.env.NODE_ENV === "development";
  let service: GamepadService | null = null;
  let pollingInterval: number | null = null;
  let lastLoggedState = "";

  return {
    states: new Map(),
    connectedGamepads: [],
    activeGamepad: null,
    hasGamepadConnected: false,
    lastUpdate: 0,
    initialized: false,
    polling: false,
    debug: isDevelopment,

    initialize: () => {
      if (get().initialized) return;

      service = GamepadService.getInstance();
      set({ initialized: true });
      get().sync();
    },

    sync: () => {
      if (!service) return;

      const rawStates = service.getCurrentState() as Map<
        number,
        GamepadRawState
      >;

      set({
        states: rawStates,
        lastUpdate: Date.now(),
        activeGamepad: get().getActiveGamepad(),
        hasGamepadConnected: rawStates.size > 0,
        connectedGamepads: Array.from(rawStates.keys()).map((idx) => ({
          index: idx,
          name: rawStates.get(idx)?.name ?? "",
          layout: rawStates.get(idx)?.layout ?? "",
        })),
      });

      get().logState();
    },

    startPolling: () => {
      if (get().polling || !service) return;

      pollingInterval = window.setInterval(() => {
        get().sync();
      }, 16); // ~60FPS

      set({ polling: true });
    },

    stopPolling: () => {
      if (!get().polling || !pollingInterval) return;

      clearInterval(pollingInterval);
      pollingInterval = null;

      set({ polling: false });
    },

    getActiveGamepad: () => {
      const activeGamepad = get().activeGamepad;
      if (!activeGamepad) return null;

      return {
        index: activeGamepad.index,
        name: activeGamepad.name,
        layout: activeGamepad.layout,
      };
    },

    logState: () => {
      const { states, connectedGamepads } = get();

      if (!get().debug || states.size === 0) return;

      const stateSnapshot = JSON.stringify({
        gamepads: connectedGamepads,
        buttons: Array.from(states.entries()).map(([id, state]) => ({
          id,
          buttonValues: Array.from(state.buttons.entries()).map(
            ([type, btn]) => ({
              type,
              value: btn.value.toFixed(2),
              pressed: btn.pressed,
            })
          ),
        })),
      });

      if (stateSnapshot === lastLoggedState) return;

      lastLoggedState = stateSnapshot;

      const statesObj: Record<
        number,
        Omit<GamepadRawState, "buttons"> & {
          buttons: Record<string, ButtonRawState>;
        }
      > = {};
      states.forEach((value, key) => {
        const buttonsObj: Record<string, ButtonRawState> = {};
        value.buttons.forEach((btn, btnType) => {
          buttonsObj[String(btnType)] = btn;
        });

        statesObj[key] = {
          ...value,
          buttons: buttonsObj,
        };
      });

      console.log("Gamepad States:", statesObj);
    },

    cleanup: () => {
      get().stopPolling();

      if (service) {
        service.dispose();
        service = null;
      }

      set({
        states: new Map(),
        connectedGamepads: [],
        hasGamepadConnected: false,
        activeGamepad: null,
        initialized: false,
      });
    },
  };
});
