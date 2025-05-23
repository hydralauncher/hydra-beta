import { useRef, useState } from "react";

export interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  showArrow?: boolean;
  offset?: number;
  active?: boolean;
}

export function Tooltip({
  children,
  content,
  position = "top",
  offset = 8,
  showArrow = true,
  active = true,
}: Readonly<TooltipProps>) {
  const [isHovering, setIsHovering] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  if (!active) return children;

  return (
    <div
      className="tooltip"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      role="tooltip"
      aria-hidden={!isHovering}
    >
      {children}
      {isHovering && (
        <div
          ref={tooltipRef}
          className={`tooltip__content tooltip__content--${position}`}
          data-offset={offset}
          data-show-arrow={showArrow}
        >
          {content}
        </div>
      )}
    </div>
  );
}
