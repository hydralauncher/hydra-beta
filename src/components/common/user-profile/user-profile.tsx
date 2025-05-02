import Image from "next/image";

export interface UserProfileProps {
  image?: string;
  name: string;
  href: string;
  playingStatus?: {
    icon: string;
    label: string;
  };
  collapsed?: boolean;
}

export const UserProfile = ({
  image,
  name,
  href,
  playingStatus,
  collapsed = false,
}: UserProfileProps) => {
  const nameInitials = name
    .split(" ")
    .filter((word) => word.length > 0)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  return (
    <a href={href}>
      <div
        className={`user-profile ${collapsed ? "user-profile--collapsed" : ""}`}
      >
        <div className="user-profile__image-wrapper">
          {image ? (
            <Image
              src={image}
              alt="User"
              className="user-profile__image"
              width={48}
              height={48}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="user-profile__initials">{nameInitials}</div>
          )}
          {collapsed && playingStatus && (
            <div className="user-profile__status-icon--collapsed">
              <Image
                src={playingStatus.icon}
                alt={playingStatus.label}
                width={16}
                height={16}
              />
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="user-profile__info">
            <div className="user-profile__info__name">{name}</div>
            {playingStatus && (
              <div className="user-profile__info__status">
                <Image
                  src={playingStatus.icon}
                  alt={playingStatus.label}
                  width={16}
                  height={16}
                  className="user-profile__info__status__icon"
                />
                <span className="user-profile__info__status__label">
                  {playingStatus.label}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </a>
  );
};
