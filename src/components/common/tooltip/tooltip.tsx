import { useEffect, useRef, useState } from "react";
import "./tooltip.scss";

export interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  showArrow?: boolean;
  offset?: number;
}

export function Tooltip({
  children,
  content,
  position = "top",
  offset = 8,
  showArrow = true,
}: Readonly<TooltipProps>) {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHovering) {
      setIsVisible(true);
      return;
    }

    const element = tooltipRef.current;
    if (!element) return;

    const hideTooltip = () => !isHovering && setIsVisible(false);
    element.addEventListener("transitionend", hideTooltip);

    return () => element.removeEventListener("transitionend", hideTooltip);
  }, [isHovering]);

  return (
    <div
      className="tooltip"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      role="tooltip"
      aria-hidden={!isHovering}
    >
      {children}
      {(isVisible || isHovering) && (
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
