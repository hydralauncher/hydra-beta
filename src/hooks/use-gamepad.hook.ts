import {
  GamepadButtonType,
  GamepadAxisDirection,
  GamepadStickSide,
  GamepadAxisType,
  GamepadVibrationOptions,
} from "@/types";
import { useGamepadStore } from "@/stores";
import { useEffect, useRef } from "react";

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
    initialize,
    cleanup,
  } = useGamepadStore();

  const callbackRefs = useRef<Map<string, () => void>>(new Map());

  useEffect(() => {
    initialize();

    const currentCallbacks = callbackRefs.current;

    return () => {
      currentCallbacks.forEach((removeCallback) => removeCallback());
      currentCallbacks.clear();
      cleanup();
    };
  }, [initialize, cleanup]);

  const getButtonState = (button: GamepadButtonType) => {
    if (!hasGamepadConnected) return null;

    const activeGamepad = getActiveGamepad();
    if (!activeGamepad) return null;

    const state = states.get(activeGamepad.index);
    if (!state) return null;

    return state.buttons.get(button) ?? null;
  };

  const getAxisState = (axis: GamepadAxisType) => {
    if (!hasGamepadConnected) return null;

    const activeGamepad = getActiveGamepad();
    if (!activeGamepad) return null;

    const state = states.get(activeGamepad.index);
    if (!state) return null;

    return state.axes.get(axis) ?? null;
  };

  const isButtonPressed = (button: GamepadButtonType) => {
    const buttonState = getButtonState(button);
    if (!buttonState) return false;

    return buttonState.pressed;
  };

  const getButtonValue = (button: GamepadButtonType) => {
    const buttonState = getButtonState(button);
    if (!buttonState) return 0;

    return buttonState.value;
  };

  const getAxisValue = (axis: GamepadAxisType) => {
    const axisState = getAxisState(axis);
    if (!axisState) return 0;

    return axisState.value;
  };

  const onButtonPressed = (button: GamepadButtonType, callback: () => void) => {
    const service = getService();
    if (!service) return () => {};

    const callbackId = Symbol(`press_${button}`).toString();
    const removeCallback = service.onButtonPress(button, callback);

    callbackRefs.current.set(callbackId, removeCallback);

    return () => {
      removeCallback();
      callbackRefs.current.delete(callbackId);
    };
  };

  const onStickMove = (
    side: GamepadStickSide,
    direction: GamepadAxisDirection,
    callback: () => void
  ) => {
    const service = getService();
    if (!service) return () => {};

    const callbackId = Symbol(`stick_${side}_${direction}`).toString();
    const removeCallback = service.onStickMove(side, direction, callback);

    callbackRefs.current.set(callbackId, removeCallback);

    return () => {
      removeCallback();
      callbackRefs.current.delete(callbackId);
    };
  };

  const vibrate = (options: GamepadVibrationOptions = {}) => {
    const service = getService();
    if (!service) return;

    const {
      duration = 200,
      weakMagnitude = 0.5,
      strongMagnitude = 0.5,
      gamepadIndex = getActiveGamepad()?.index ?? -1,
    } = options;

    service.vibrate(duration, weakMagnitude, strongMagnitude, gamepadIndex);
  };

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
