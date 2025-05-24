import { HeartStraight } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";

export interface RouteAnchorProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  label: string;
  icon: React.ReactNode | string;
  href: string;
  active?: boolean;
  disabled?: boolean;
  isFavorite?: boolean;
}

export const RouteAnchor = ({
  href,
  label,
  icon,
  active = false,
  disabled = false,
  isFavorite = false,
  ...props
}: RouteAnchorProps) => {
  const isGameIcon = typeof icon === "string";

  return (
    <div
      className={`state-wrapper ${disabled ? "state-wrapper--disabled" : ""} ${active ? "state-wrapper--active" : ""}`}
    >
      <Link href={href} {...props}>
        <div
          className={`route-anchor ${active ? "route-anchor--active" : ""} ${!isGameIcon ? "route-anchor--extra-padding" : ""}`}
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
          <div className="route-anchor__label">{label}</div>

          {isFavorite && (
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
    </div>
  );
};
