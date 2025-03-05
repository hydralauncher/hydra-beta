import "./user-profile.scss";

export interface UserProfileProps {
  image?: string;
  name: string;
  href: string;
  status?: {
    icon: string;
    label: string;
  };
  collapsed?: boolean;
}

export const UserProfile = ({
  image,
  name,
  href,
  status,
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
      <div className="user-profile">
        <div className="user-profile__image-wrapper">
          {image ? (
            <img
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
          {collapsed && status && (
            <div className="user-profile__status-icon--collapsed">
              <img
                src={status.icon}
                alt={status.label}
                width={16}
                height={16}
              />
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="user-profile__info">
            <div className="user-profile__info__name">{name}</div>
            {status && (
              <div className="user-profile__info__status">
                <img
                  src={status.icon}
                  alt={status.label}
                  width={16}
                  height={16}
                  className="user-profile__info__status__icon"
                />
                <span className="user-profile__info__status__label">
                  {status.label}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </a>
  );
};
