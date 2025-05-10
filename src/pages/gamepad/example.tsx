import { useGamepad } from "@/hooks/use-gamepad";
import {
  GamepadAxisDirection,
  GamepadAxisType,
  GamepadButtonType,
} from "@/types";
import { useEffect } from "react";

export default function GamepadExample() {
  const gamepad = useGamepad();

  // 1. Callback quando um botão é pressionado
  useEffect(() => {
    const cleanup = gamepad.onButtonPressed(GamepadButtonType.BUTTON_Y, () => {
      alert("Botão Y pressionado");
    });

    return cleanup;
  }, [gamepad]);

  // 2. Callback quando o stick esquerdo é movido
  useEffect(() => {
    const cleanup = gamepad.onStickMove(
      "left", // lado do stick
      GamepadAxisDirection.UP, // direção do stick
      () => {
        alert("Stick esquerdo para cima");
      }
    );

    return cleanup;
  }, [gamepad]);

  return (
    <div
      style={{ backgroundColor: "slategray", padding: "32px", width: "100%" }}
    >
      {/* 3. Verificar o estado de um botão */}
      {gamepad.isButtonPressed(GamepadButtonType.BUTTON_A) ? (
        <p>O botão A esta pressionado</p>
      ) : (
        <p>Pressione o botão A</p>
      )}

      <p>
        {/* 4. Verificar o valor de um botão */}
        Valor do gatilho direito:{" "}
        {gamepad.getButtonValue(GamepadButtonType.RIGHT_TRIGGER)}
      </p>

      {/* 5. verificar posição do stick direito */}
      <p>
        Posição X do stick direito:{" "}
        {gamepad.getAxisValue(GamepadAxisType.RIGHT_STICK_X)}
      </p>
      <p>
        Posição Y do stick direito:{" "}
        {gamepad.getAxisValue(GamepadAxisType.RIGHT_STICK_Y)}
      </p>
    </div>
  );
}
