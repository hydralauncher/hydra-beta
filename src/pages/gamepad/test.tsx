import { useEffect, useRef, useState, useMemo } from "react";
import { useGamepadStore } from "@/stores/gamepad.store";
import { useGamepad } from "@/hooks/use-gamepad";
import {
  GamepadButtonType,
  GamepadAxisType,
  GamepadAxisDirection,
} from "@/types";

// 100% VIBE CODING, PRA ENTENDER COMO ISSO DE FATO FUNCIONA LEIA /src/pages/gamepad/example.tsx

export default function GamepadTestPage() {
  const gamepad = useGamepad();
  const [rowIndex, setRowIndex] = useState(0);
  const [colIndex, setColIndex] = useState(0);
  const [lastButton, setLastButton] = useState<string>("Nenhum");

  // Esquema de cores melhorado - contraste adequado, cores mais agradáveis
  const colors = {
    primary: "#2563eb", // Azul forte mais saturado
    secondary: "#475569", // Cinza azulado
    success: "#16a34a", // Verde mais saturado
    danger: "#dc2626", // Vermelho mais visível
    warning: "#f59e0b", // Laranja mais visível
    light: "#f5f5f5", // Cinza claro
    dark: "#334155", // Cinza escuro
    bg: "#ffffff", // Fundo branco
    border: "#d4d4d8", // Borda cinza
    selected: "#e0f2fe", // Azul claro para seleção
  };

  // Criar matriz (grid) de itens
  const menuGrid = useMemo(
    () => [
      ["Item 1-1", "Item 1-2", "Item 1-3"],
      ["Item 2-1", "Item 2-2", "Item 2-3"],
      ["Item 3-1", "Item 3-2", "Item 3-3"],
    ],
    []
  );

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const menuRefs = useRef<HTMLElement[][]>([]);

  // Configurar navegação com gamepad
  useEffect(() => {
    // Navegação vertical (rows)
    const unsubDpadUp = gamepad.onButtonPressed(
      GamepadButtonType.DPAD_UP,
      () => {
        setRowIndex((prev) => (prev > 0 ? prev - 1 : menuGrid.length - 1));
        setLastButton("DPAD_UP");
      }
    );

    const unsubDpadDown = gamepad.onButtonPressed(
      GamepadButtonType.DPAD_DOWN,
      () => {
        setRowIndex((prev) => (prev < menuGrid.length - 1 ? prev + 1 : 0));
        setLastButton("DPAD_DOWN");
      }
    );

    // Navegação horizontal (columns)
    const unsubDpadLeft = gamepad.onButtonPressed(
      GamepadButtonType.DPAD_LEFT,
      () => {
        setColIndex((prev) => {
          const rowLength = menuGrid[rowIndex]?.length || 0;
          return prev > 0 ? prev - 1 : rowLength - 1;
        });
        setLastButton("DPAD_LEFT");
      }
    );

    const unsubDpadRight = gamepad.onButtonPressed(
      GamepadButtonType.DPAD_RIGHT,
      () => {
        setColIndex((prev) => {
          const rowLength = menuGrid[rowIndex]?.length || 0;
          return prev < rowLength - 1 ? prev + 1 : 0;
        });
        setLastButton("DPAD_RIGHT");
      }
    );

    // Adicionar controle por sticks
    const unsubLeftStickUp = gamepad.onStickMove(
      "left",
      GamepadAxisDirection.UP,
      () => {
        setRowIndex((prev) => (prev > 0 ? prev - 1 : menuGrid.length - 1));
        setLastButton("LEFT_STICK_UP");
      }
    );

    const unsubLeftStickDown = gamepad.onStickMove(
      "left",
      GamepadAxisDirection.DOWN,
      () => {
        setRowIndex((prev) => (prev < menuGrid.length - 1 ? prev + 1 : 0));
        setLastButton("LEFT_STICK_DOWN");
      }
    );

    const unsubLeftStickLeft = gamepad.onStickMove(
      "left",
      GamepadAxisDirection.LEFT,
      () => {
        setColIndex((prev) => {
          const rowLength = menuGrid[rowIndex]?.length || 0;
          return prev > 0 ? prev - 1 : rowLength - 1;
        });
        setLastButton("LEFT_STICK_LEFT");
      }
    );

    const unsubLeftStickRight = gamepad.onStickMove(
      "left",
      GamepadAxisDirection.RIGHT,
      () => {
        setColIndex((prev) => {
          const rowLength = menuGrid[rowIndex]?.length || 0;
          return prev < rowLength - 1 ? prev + 1 : 0;
        });
        setLastButton("LEFT_STICK_RIGHT");
      }
    );

    const unsubButtonA = gamepad.onButtonPressed(
      GamepadButtonType.BUTTON_A,
      () => {
        if (menuGrid[rowIndex] && menuGrid[rowIndex][colIndex]) {
          setSelectedItem(menuGrid[rowIndex][colIndex]);
        }
        setLastButton("BUTTON_A");
      }
    );

    const unsubButtonB = gamepad.onButtonPressed(
      GamepadButtonType.BUTTON_B,
      () => {
        setSelectedItem(null);
        setLastButton("BUTTON_B");
      }
    );

    // Monitore outros botões para visualização
    const buttonTypes = [
      GamepadButtonType.BUTTON_X,
      GamepadButtonType.BUTTON_Y,
      GamepadButtonType.LEFT_BUMPER,
      GamepadButtonType.RIGHT_BUMPER,
      GamepadButtonType.START,
      GamepadButtonType.BACK,
      GamepadButtonType.HOME,
      GamepadButtonType.TRACKPAD,
    ];

    const unsubFunctions = buttonTypes.map((type) =>
      gamepad.onButtonPressed(type, () => {
        setLastButton(type);
      })
    );

    return () => {
      unsubDpadUp();
      unsubDpadDown();
      unsubDpadLeft();
      unsubDpadRight();
      unsubLeftStickUp();
      unsubLeftStickDown();
      unsubLeftStickLeft();
      unsubLeftStickRight();
      unsubButtonA();
      unsubButtonB();
      unsubFunctions.forEach((unsub) => unsub());
    };
  }, [gamepad, rowIndex, colIndex, menuGrid]);

  // Atualizar quando mudar o foco
  useEffect(() => {
    // Garante que colIndex não seja maior que o número de colunas na linha atual
    if (menuGrid[rowIndex] && colIndex >= menuGrid[rowIndex].length) {
      setColIndex(menuGrid[rowIndex].length - 1);
    }
  }, [rowIndex, colIndex, menuGrid]);

  // Status do gamepad
  const isConnected = useGamepadStore((state) => state.hasGamepadConnected);

  useEffect(() => {
    // Focar o elemento quando a navegação mudar
    if (menuRefs.current[rowIndex]?.[colIndex]) {
      menuRefs.current[rowIndex][colIndex].focus();
    }
  }, [rowIndex, colIndex]);

  // Renderizar barras de progresso para os gatilhos
  const renderTrigger = (type: GamepadButtonType) => {
    const value = gamepad.getButtonValue(type);

    // Use gradiente de cor baseado no valor em vez de estado binário
    return (
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
            fontSize: "14px",
          }}
        >
          <span style={{ fontWeight: "500" }}>{type}</span>
          <span style={{ fontWeight: "bold" }}>
            {(value * 100).toFixed(0)}%
          </span>
        </div>
        <div
          style={{
            height: "16px",
            backgroundColor: colors.light,
            borderRadius: "8px",
            overflow: "hidden",
            border: `1px solid ${colors.border}`,
          }}
        >
          <div
            style={{
              width: `${value * 100}%`,
              height: "100%",
              backgroundColor:
                value < 0.7
                  ? colors.primary
                  : value < 0.9
                    ? colors.warning
                    : colors.danger,
            }}
          ></div>
        </div>
      </div>
    );
  };

  // Agrupar botões por tipo
  const buttonGroups = {
    faceButtons: [
      GamepadButtonType.BUTTON_A,
      GamepadButtonType.BUTTON_B,
      GamepadButtonType.BUTTON_X,
      GamepadButtonType.BUTTON_Y,
    ],
    dpad: [
      GamepadButtonType.DPAD_UP,
      GamepadButtonType.DPAD_DOWN,
      GamepadButtonType.DPAD_LEFT,
      GamepadButtonType.DPAD_RIGHT,
    ],
    triggers: [GamepadButtonType.LEFT_TRIGGER, GamepadButtonType.RIGHT_TRIGGER],
    bumpers: [GamepadButtonType.LEFT_BUMPER, GamepadButtonType.RIGHT_BUMPER],
    sticks: [
      GamepadButtonType.LEFT_STICK_PRESS,
      GamepadButtonType.RIGHT_STICK_PRESS,
    ],
    menu: [
      GamepadButtonType.START,
      GamepadButtonType.BACK,
      GamepadButtonType.HOME,
      GamepadButtonType.TRACKPAD,
    ],
  };

  // Estilo para os contêineres, mais compacto
  const containerStyle = {
    backgroundColor: colors.bg,
    height: "fit-content",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "16px",
    border: `1px solid ${colors.border}`,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  };

  // Estilos para o menu em grade mais compacto
  const menuItemStyle = (isActive: boolean) => ({
    padding: "16px",
    borderRadius: "6px",
    fontSize: "16px",
    flex: 1,
    textAlign: "center" as const,
    backgroundColor: isActive ? colors.primary : colors.light,
    color: isActive ? "white" : colors.dark,
    border: `1px solid ${isActive ? colors.primary : colors.border}`,
    transition: "all 0.2s ease",
    fontWeight: isActive ? "bold" : "normal",
  });

  // Estilo compacto para os botões com dimensões fixas para evitar layout shift
  const buttonStyle = (isPressed: boolean) => ({
    padding: "12px",
    fontSize: "14px",
    backgroundColor: isPressed ? colors.primary : colors.light,
    color: isPressed ? "white" : colors.dark,
    borderRadius: "6px",
    border: `1px solid ${isPressed ? colors.primary : colors.border}`,
    textAlign: "center" as const,
    boxSizing: "border-box" as const, // Garante que border não altere dimensões
    minHeight: "44px", // Altura fixa
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "500", // Peso fixo para não mudar ao pressionar
    transition: "background-color 0.1s, color 0.1s", // Apenas transicionar cor
  });

  // Título de seção mais compacto
  const sectionTitle = {
    fontSize: "18px",
    marginBottom: "12px",
    color: colors.dark,
    fontWeight: "bold" as const,
    borderBottom: `2px solid ${colors.border}`,
    paddingBottom: "6px",
  };

  // Renderizar visualização dos sticks
  const renderStick = (
    xAxis: GamepadAxisType,
    yAxis: GamepadAxisType,
    label: string
  ) => {
    const xValue = gamepad.getAxisValue(xAxis);
    const yValue = gamepad.getAxisValue(yAxis);

    // Tamanho do container do stick
    const size = 120;
    const center = size / 2;
    const radius = size * 0.4;

    // Posição do stick baseada nos valores dos eixos
    const stickX = center + xValue * radius;
    const stickY = center + yValue * radius;

    return (
      <div style={{ marginBottom: "16px" }}>
        <div
          style={{ fontWeight: "500", marginBottom: "8px", fontSize: "14px" }}
        >
          {label}
        </div>
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "50%",
            border: `1px solid ${colors.border}`,
            backgroundColor: colors.light,
            position: "relative",
            margin: "0 auto",
          }}
        >
          {/* Linhas de referência */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: "1px",
              backgroundColor: `${colors.border}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: "1px",
              backgroundColor: `${colors.border}`,
            }}
          />

          {/* Círculo do stick */}
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              backgroundColor: colors.primary,
              position: "absolute",
              top: `${stickY - 15}px`,
              left: `${stickX - 15}px`,
              transform: "translate(0, 0)",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            marginTop: "4px",
          }}
        >
          <span>X: {xValue.toFixed(2)}</span>
          <span>Y: {yValue.toFixed(2)}</span>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1000px", // Aumentar a largura para evitar scroll
        margin: "0 auto",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        fontSize: "16px",
        color: colors.dark,
      }}
    >
      <h1
        style={{
          fontSize: "24px",
          marginBottom: "20px",
          color: colors.dark,
          borderBottom: `2px solid ${colors.primary}`,
          paddingBottom: "10px",
        }}
      >
        Teste de Gamepad (esse font end eh vibecoded nao julguem)
      </h1>

      {/* Status */}
      <div
        style={{
          ...containerStyle,
          backgroundColor: isConnected
            ? `${colors.success}10`
            : `${colors.danger}10`,
          borderLeft: `4px solid ${isConnected ? colors.success : colors.danger}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
            fontSize: "15px",
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              backgroundColor: isConnected ? colors.success : colors.danger,
              color: "white",
              padding: "6px 12px",
              borderRadius: "4px",
            }}
          >
            {isConnected ? "✓ Conectado" : "✗ Desconectado"}
          </span>
          <span>
            Botão: <strong>{lastButton}</strong>
          </span>
          <span>
            Posição:{" "}
            <strong>
              L{rowIndex + 1} C{colIndex + 1}
            </strong>
          </span>
        </div>
      </div>

      {/* Menu Grid */}
      <div style={containerStyle}>
        {menuGrid.map((row, rIndex) => (
          <div
            key={`row-${rIndex}`}
            style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
          >
            {row.map((item, cIndex) => (
              <div
                key={item}
                tabIndex={rIndex === rowIndex && cIndex === colIndex ? 0 : -1}
                ref={(el) => {
                  if (el) {
                    if (!menuRefs.current[rIndex]) {
                      menuRefs.current[rIndex] = [];
                    }
                    menuRefs.current[rIndex][cIndex] = el;
                  }
                }}
                style={menuItemStyle(
                  rIndex === rowIndex && cIndex === colIndex
                )}
              >
                {item}
              </div>
            ))}
          </div>
        ))}

        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            backgroundColor: `${selectedItem ? colors.success : colors.danger}15`,
            borderRadius: "6px",
            border: `1px solid ${selectedItem ? colors.success : colors.danger}`,
            fontSize: "15px",
            fontWeight: "500",
          }}
        >
          {selectedItem ? (
            <>
              Selecionado: <strong>{selectedItem}</strong>
            </>
          ) : (
            <>Nenhum item selecionado</>
          )}
        </div>
      </div>

      {/* Reorganizar layout em 3 colunas para sticks, triggers e buttons */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        {/* Coluna 1: D-Pad e Face Buttons juntos */}
        <div style={containerStyle}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              <h2 style={sectionTitle}>D-Pad</h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                {buttonGroups.dpad.map((type) => (
                  <div
                    key={type}
                    style={{
                      ...buttonStyle(gamepad.isButtonPressed(type)),
                      flex: "1 0 calc(50% - 4px)",
                    }}
                  >
                    {type}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 style={sectionTitle}>Botões de Ação</h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                {buttonGroups.faceButtons.map((type) => (
                  <div
                    key={type}
                    style={{
                      ...buttonStyle(gamepad.isButtonPressed(type)),
                      backgroundColor: gamepad.isButtonPressed(type)
                        ? (
                            {
                              BUTTON_A: "#34d399", // Verde
                              BUTTON_B: "#f87171", // Vermelho
                              BUTTON_X: "#60a5fa", // Azul
                              BUTTON_Y: "#fbbf24", // Amarelo
                            } as Record<string, string>
                          )[type] || colors.primary
                        : colors.light,
                      color: gamepad.isButtonPressed(type)
                        ? "white"
                        : colors.dark,
                      flex: "1 0 calc(50% - 5px)",
                    }}
                  >
                    {type.replace("BUTTON_", "")}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 2: Gatilhos */}
        <div style={containerStyle}>
          <h2 style={sectionTitle}>Gatilhos</h2>
          {renderTrigger(GamepadButtonType.LEFT_TRIGGER)}
          {renderTrigger(GamepadButtonType.RIGHT_TRIGGER)}

          <div>
            <h2 style={sectionTitle}>Bumpers e Sticks</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              {buttonGroups.bumpers.map((type) => (
                <div
                  key={type}
                  style={{
                    ...buttonStyle(gamepad.isButtonPressed(type)),
                    flex: "1 0 calc(50% - 5px)",
                  }}
                >
                  {type}
                </div>
              ))}

              {buttonGroups.sticks.map((type) => (
                <div
                  key={type}
                  style={{
                    ...buttonStyle(gamepad.isButtonPressed(type)),
                    flex: "1 0 calc(50% - 5px)",
                  }}
                >
                  {type}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna 3: Sticks */}
        <div style={containerStyle}>
          <h2 style={sectionTitle}>Analógicos</h2>
          {renderStick(
            GamepadAxisType.LEFT_STICK_X,
            GamepadAxisType.LEFT_STICK_Y,
            "Analógico Esquerdo"
          )}
          {renderStick(
            GamepadAxisType.RIGHT_STICK_X,
            GamepadAxisType.RIGHT_STICK_Y,
            "Analógico Direito"
          )}
        </div>
      </div>
    </div>
  );
}
