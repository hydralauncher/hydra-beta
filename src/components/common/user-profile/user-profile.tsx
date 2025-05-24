import { Users, Bell, Copy, Check } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export interface UserProfileProps {
  image: string;
  name: string;
  friendCode: string;
}

interface UserProfileContentProps {
  image: string;
  name: string;
  friendCode: string;
}

interface UserProfileActionsProps {
  friendsCount: number;
}

function UserProfileActions({
  friendsCount,
}: Readonly<UserProfileActionsProps>) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="user-profile__actions">
      <Link href="/friends" className="user-profile__actions__friends">
        <Users size={20} className="user-profile__actions__friends__icon" />

        <p className="user-profile__actions__friends__count">
          <span className="user-profile__actions__friends__count__number">
            {friendsCount}
          </span>{" "}
          <span className="user-profile__actions__friends__count__text">
            friends online
          </span>
        </p>
      </Link>

      <button
        className="user-profile__actions__notification"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Bell size={20} weight={isHovering ? "fill" : "regular"} />
      </button>
    </div>
  );
}

function UserProfileContent({
  image,
  name,
  friendCode,
}: Readonly<UserProfileContentProps>) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (isCopied) return;
    setIsCopied(true);
    navigator.clipboard.writeText(friendCode);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="user-profile-content">
      <Image
        src={image}
        alt={name}
        className="user-profile-content__image"
        width={48}
        height={48}
      />

      <div className="user-profile-content__info">
        <p className="user-profile-content__info__name">{name}</p>
        <button
          className="user-profile-content__info__friend-code"
          onClick={handleCopy}
        >
          {friendCode}
          {isCopied ? (
            <Check
              size={14}
              className="user-profile-content__info__friend-code__icon"
            />
          ) : (
            <Copy
              size={14}
              className="user-profile-content__info__friend-code__icon"
            />
          )}
        </button>
      </div>
    </div>
  );
}

export function UserProfile({
  image,
  name,
  friendCode,
}: Readonly<UserProfileProps>) {
  return (
    <div className="user-profile-container">
      <UserProfileContent image={image} name={name} friendCode={friendCode} />
      <UserProfileActions friendsCount={8} />
    </div>
  );
}
