import * as Tooltip from '@radix-ui/react-tooltip';
import Image from "next/image";
import Link from "next/link";
import "./route-anchor.scss";

export interface RouteAnchorProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  label: string;
  icon: React.ReactNode | string;
  collapsed?: boolean;
  href: string;
  active?: boolean;
  disabled?: boolean;
}

export const RouteAnchor = ({
  href,
  label,
  icon,
  collapsed = false,
  active = false,
  disabled = false,
  ...props
}: RouteAnchorProps) => {
  const isGameIcon = typeof icon === "string";

  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={100}>
        <Tooltip.Trigger asChild>
          <div
            className={`state-wrapper ${disabled ? "state-wrapper--disabled" : ""} ${active ? "state-wrapper--active" : ""} ${collapsed ? "state-wrapper--collapsed" : ""}`}
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
              </div>
            </Link>
          </div>
        </Tooltip.Trigger>
        {collapsed && (
          <Tooltip.Portal>
            <Tooltip.Content
              className="tooltip-content"
              side="right"
              sideOffset={8}
            >
              <p className="tooltip-content__label">{label}</p>
            </Tooltip.Content>
          </Tooltip.Portal>
        )}
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
