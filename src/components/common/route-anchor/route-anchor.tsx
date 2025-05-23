import { HeartStraight } from "@phosphor-icons/react";
import { Tooltip } from "../tooltip/tooltip";
import Image from "next/image";
import Link from "next/link";
export interface RouteAnchorProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  label: string;
  icon: React.ReactNode | string;
  collapsed?: boolean;
  href: string;
  active?: boolean;
  disabled?: boolean;
  isFavorite?: boolean;
}

export const RouteAnchor = ({
  href,
  label,
  icon,
  collapsed = false,
  active = false,
  disabled = false,
  isFavorite = false,
  ...props
}: RouteAnchorProps) => {
  const isGameIcon = typeof icon === "string";

  return (
    <div
      className={`state-wrapper ${disabled ? "state-wrapper--disabled" : ""} ${active ? "state-wrapper--active" : ""} ${collapsed ? "state-wrapper--collapsed" : ""}`}
    >
      <Tooltip
        content={label}
        position="right"
        showArrow={false}
        active={collapsed}
      >
        <Link href={href} {...props}>
          <div
            className={`route-anchor ${collapsed ? "route-anchor--collapsed" : ""} ${active ? "route-anchor--active" : ""} ${!isGameIcon ? "route-anchor--extra-padding" : ""}`}
          >
            <div
              className={`route-anchor__icon ${isGameIcon ? "route-anchor__icon--large-size" : "route-anchor__icon--small-size"}`}
            >
              {isGameIcon ? (
                <Image src={icon} alt={label} width={32} height={32} />
              ) : (
                icon
              )}
            </div>
            <div
              className={
                collapsed
                  ? "route-anchor__label--collapsed"
                  : "route-anchor__label"
              }
            >
              {label}
            </div>

            {isFavorite && !collapsed && (
              <div className="route-anchor__favorite">
                <HeartStraight
                  size={18}
                  weight="fill"
                  className="route-anchor__favorite__icon"
                />
              </div>
            )}
          </div>
        </Link>
      </Tooltip>
    </div>
  );
};
