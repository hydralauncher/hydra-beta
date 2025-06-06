import {
  GamepadButtonType,
  GamepadAxisDirection,
  GamepadStickSide,
  GamepadAxisType,
  GamepadVibrationOptions,
} from "@/types";
import { useGamepadStore } from "@/stores";
import { useEffect, useRef, useCallback } from "react";

export interface UseGamepadReturn {
  isButtonPressed: (button: GamepadButtonType) => boolean;
  getButtonValue: (button: GamepadButtonType) => number;
  getAxisValue: (axis: GamepadAxisType) => number;
  vibrate: (options: GamepadVibrationOptions) => void;
  connectedGamepads: Array<{ index: number; name: string; layout: string }>;
  hasGamepadConnected: boolean;

  onButtonPressed: (
    button: GamepadButtonType,
    callback: () => void
  ) => () => void;

  onStickMove: (
    side: GamepadStickSide,
    direction: GamepadAxisDirection,
    callback: () => void
  ) => () => void;
}

export function useGamepad(): UseGamepadReturn {
  const {
    states,
    hasGamepadConnected,
    connectedGamepads,
    getActiveGamepad,
    getService,
    sync,
  } = useGamepadStore();

  const callbackRefs = useRef<Map<string, () => void>>(new Map());

  useEffect(() => {
    sync();
  }, [sync]);

  useEffect(() => {
    const currentCallbacks = callbackRefs.current;

    return () => {
      currentCallbacks.forEach((removeCallback) => removeCallback());
      currentCallbacks.clear();
    };
  }, []);

  const getButtonState = useCallback(
    (button: GamepadButtonType) => {
      if (!hasGamepadConnected) return null;

      const activeGamepad = getActiveGamepad();
      if (!activeGamepad) return null;

      const state = states.get(activeGamepad.index);
      if (!state) return null;

      return state.buttons.get(button) ?? null;
    },
    [hasGamepadConnected, getActiveGamepad, states]
  );

  const getAxisState = useCallback(
    (axis: GamepadAxisType) => {
      if (!hasGamepadConnected) return null;

      const activeGamepad = getActiveGamepad();
      if (!activeGamepad) return null;

      const state = states.get(activeGamepad.index);
      if (!state) return null;

      return state.axes.get(axis) ?? null;
    },
    [hasGamepadConnected, getActiveGamepad, states]
  );

  const isButtonPressed = useCallback(
    (button: GamepadButtonType) => {
      const buttonState = getButtonState(button);
      if (!buttonState) return false;

      return buttonState.pressed;
    },
    [getButtonState]
  );

  const getButtonValue = useCallback(
    (button: GamepadButtonType) => {
      const buttonState = getButtonState(button);
      if (!buttonState) return 0;

      return buttonState.value;
    },
    [getButtonState]
  );

  const getAxisValue = useCallback(
    (axis: GamepadAxisType) => {
      const axisState = getAxisState(axis);
      if (!axisState) return 0;

      return axisState.value;
    },
    [getAxisState]
  );

  const onButtonPressed = useCallback(
    (button: GamepadButtonType, callback: () => void) => {
      const service = getService();
      const callbackId = Symbol(`press_${button}`).toString();
      const removeCallback = service.onButtonPress(button, callback);

      callbackRefs.current.set(callbackId, removeCallback);

      return () => {
        removeCallback();
        callbackRefs.current.delete(callbackId);
      };
    },
    [getService]
  );

  const onStickMove = useCallback(
    (
      side: GamepadStickSide,
      direction: GamepadAxisDirection,
      callback: () => void
    ) => {
      const service = getService();
      const callbackId = Symbol(`stick_${side}_${direction}`).toString();
      const removeCallback = service.onStickMove(side, direction, callback);

      callbackRefs.current.set(callbackId, removeCallback);

      return () => {
        removeCallback();
        callbackRefs.current.delete(callbackId);
      };
    },
    [getService]
  );

  const vibrate = useCallback(
    (options: GamepadVibrationOptions = {}) => {
      const service = getService();
      const {
        duration = 200,
        weakMagnitude = 0.5,
        strongMagnitude = 0.5,
        gamepadIndex = getActiveGamepad()?.index ?? -1,
      } = options;

      service.vibrate(duration, weakMagnitude, strongMagnitude, gamepadIndex);
    },
    [getService, getActiveGamepad]
  );

  return {
    isButtonPressed,
    getButtonValue,
    getAxisValue,
    onButtonPressed,
    onStickMove,
    vibrate,
    hasGamepadConnected,
    connectedGamepads,
  };
}
