import { create } from "zustand";
import { GamepadRawState, GamepadService, ButtonRawState } from "@/services";

export interface GamepadStore {
  states: Map<number, GamepadRawState>;
  connectedIds: number[];
  lastUpdate: number;
  initialized: boolean;
  polling: boolean;
  debug: boolean;

  initialize: () => void;
  sync: () => void;
  startPolling: () => void;
  stopPolling: () => void;
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
    connectedIds: [],
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
        connectedIds: Array.from(rawStates.keys()),
        lastUpdate: Date.now(),
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

    logState: () => {
      const { states, connectedIds } = get();

      if (!get().debug || states.size === 0) return;

      const stateSnapshot = JSON.stringify({
        ids: connectedIds,
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
        connectedIds: [],
        initialized: false,
      });
    },
  };
});
