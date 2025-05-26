import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";

export interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  showArrow?: boolean;
  offset?: number;
  active?: boolean;
  className?: string;
  id?: string;
}

export function Tooltip({
  children,
  content,
  position = "top",
  offset = 8,
  showArrow = true,
  active = true,
  className = "",
  id,
}: Readonly<TooltipProps>) {
  const [isHovering, setIsHovering] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<number>(0);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let x = 0,
      y = 0;

    switch (position) {
      case "top":
        x = rect.left + scrollX + rect.width / 2;
        y = rect.top + scrollY - offset;
        break;
      case "bottom":
        x = rect.left + scrollX + rect.width / 2;
        y = rect.bottom + scrollY + offset;
        break;
      case "left":
        x = rect.left + scrollX - offset;
        y = rect.top + scrollY + rect.height / 2;
        break;
      case "right":
        x = rect.right + scrollX + offset;
        y = rect.top + scrollY + rect.height / 2;
        break;
    }

    setTooltipPosition({ x, y });
  }, [position, offset]);

  const handleMouseEnter = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    setIsHovering(true);
    calculatePosition();
  };

  const handleMouseLeave = () => setIsHovering(false);

  const handleScroll = useCallback(() => {
    setIsHovering(false);

    setTimeout(() => {
      if (triggerRef.current?.matches(":hover")) {
        setIsHovering(true);
        calculatePosition();
      }
    }, 100);
  }, [calculatePosition]);

  useEffect(() => {
    const currentTimeout = scrollTimeoutRef.current;

    if (isHovering) {
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
    };
  }, [isHovering, handleScroll]);

  const tooltipContent = useMemo(
    () => (
      <div
        ref={tooltipRef}
        className={`tooltip__portal tooltip__content--${position} ${className}`}
        data-offset={offset}
        data-show-arrow={showArrow}
        style={{
          left: tooltipPosition.x,
          top: tooltipPosition.y,
        }}
        role="tooltip"
        id={id}
      >
        {content}
      </div>
    ),
    [tooltipPosition, position, offset, showArrow, content, className, id]
  );

  if (!active) return children;

  return (
    <>
      <div
        ref={triggerRef}
        className="tooltip"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="tooltip"
        aria-hidden={!isHovering}
      >
        {children}
      </div>
      {isHovering && createPortal(tooltipContent, document.body)}
    </>
  );
}
