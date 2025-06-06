import { create } from "zustand";
import { GamepadRawState, GamepadService } from "@/services";

type GamepadStateMap = Map<number, GamepadRawState>;

interface GamepadInfo {
  index: number;
  name: string;
  layout: string;
}

export interface GamepadState {
  states: Map<number, GamepadRawState>;
  connectedGamepads: GamepadInfo[];
  hasGamepadConnected: boolean;
  lastUpdate: number;
  initialized: boolean;

  initialize: () => void;
  sync: () => void;
  getActiveGamepad: () => GamepadInfo | null;
  getService: () => GamepadService | null;
  cleanup: () => void;
}

export const useGamepadStore = create<GamepadState>((set, get) => {
  let service: GamepadService | null = null;
  let cachedConnectedGamepads: GamepadInfo[] = [];
  let unsubscribeStateChange: (() => void) | null = null;
  let lastConnectedCount = 0;

  return {
    states: new Map(),
    connectedGamepads: [],
    hasGamepadConnected: false,
    lastUpdate: 0,
    initialized: false,

    initialize: () => {
      if (get().initialized) return;

      service = GamepadService.getInstance();

      unsubscribeStateChange = service.onStateChange(() => {
        get().sync();
      });

      set({ initialized: true });
      get().sync();
    },

    sync: () => {
      if (!service) return;

      const rawStates = service.getCurrentState() as GamepadStateMap;
      const hasGamepadConnected = rawStates.size > 0;

      let connectedGamepads = cachedConnectedGamepads;

      if (rawStates.size !== lastConnectedCount) {
        connectedGamepads = Array.from(rawStates.entries()).map(
          ([idx, state]) => ({
            index: idx,
            name: state.name,
            layout: state.layout,
          })
        );

        cachedConnectedGamepads = connectedGamepads;
        lastConnectedCount = rawStates.size;
      }

      set({
        states: rawStates,
        lastUpdate: Date.now(),
        hasGamepadConnected,
        connectedGamepads,
      });
    },

    getActiveGamepad: () => {
      if (!service) return null;

      const activeGamepadIndex = service.getLastActiveGamepad();
      if (activeGamepadIndex === null) return null;

      const state = get().states.get(activeGamepadIndex);
      if (!state) return null;

      return {
        index: activeGamepadIndex,
        name: state.name,
        layout: state.layout,
      };
    },

    getService: () => service,

    cleanup: () => {
      if (unsubscribeStateChange) {
        unsubscribeStateChange();
        unsubscribeStateChange = null;
      }

      if (service) {
        service.dispose();
        service = null;
      }

      lastConnectedCount = 0;
      cachedConnectedGamepads = [];

      set({
        states: new Map(),
        connectedGamepads: [],
        hasGamepadConnected: false,
        lastUpdate: 0,
        initialized: false,
      });
    },
  };
});
