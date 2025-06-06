import {
  GamepadButtonType,
  GamepadAxisDirection,
  GamepadStickSide,
  GamepadAxisType,
  GamepadVibrationOptions,
} from "@/types";
import { useGamepadStore } from "@/stores";
import { useEffect, useRef } from "react";
import { GamepadService } from "@/services";

export interface UseGamepadReturn {
  isButtonPressed: (button: GamepadButtonType) => boolean;
  getButtonValue: (button: GamepadButtonType) => number;
  getAxisValue: (axis: GamepadAxisType) => number;
  vibrate: (options: GamepadVibrationOptions) => void;

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
  const { states, hasGamepadConnected, getActiveGamepad } = useGamepadStore();
  const callbackRefs = useRef<Map<string, () => void>>(new Map());

  useEffect(() => {
    const currentCallbacks = callbackRefs.current;

    return () => {
      currentCallbacks.forEach((removeCallback) => removeCallback());
      currentCallbacks.clear();
    };
  }, []);

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
    const gamepadService = GamepadService.getInstance();

    const callbackId = Symbol(`press_${button}`).toString();
    const removeCallback = gamepadService.onButtonPress(button, callback);

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
    const gamepadService = GamepadService.getInstance();

    const callbackId = Symbol(`stick_${side}_${direction}`).toString();
    const removeCallback = gamepadService.onStickMove(
      side,
      direction,
      callback
    );

    callbackRefs.current.set(callbackId, removeCallback);

    return () => {
      removeCallback();
      callbackRefs.current.delete(callbackId);
    };
  };

  const vibrate = (options: GamepadVibrationOptions = {}) => {
    const gamepadService = GamepadService.getInstance();
    const {
      duration = 200,
      weakMagnitude = 0.5,
      strongMagnitude = 0.5,
      gamepadIndex = getActiveGamepad()?.index ?? -1,
    } = options;

    gamepadService.vibrate(
      duration,
      weakMagnitude,
      strongMagnitude,
      gamepadIndex
    );
  };

  return {
    isButtonPressed,
    getButtonValue,
    getAxisValue,
    onButtonPressed,
    onStickMove,
    vibrate,
  };
}
