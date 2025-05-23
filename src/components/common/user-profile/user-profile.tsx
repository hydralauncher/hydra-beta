import { Users, Bell, Copy } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export interface UserProfileProps {
  image: string;
  name: string;
  friendCode: string;
  playingStatus: {
    isPlaying: boolean;
    icon?: string;
    label: string;
  };
  collapsed?: boolean;
}

interface UserProfileContentProps {
  image: string;
  name: string;
  friendCode: string;
  playingStatus: {
    isPlaying: boolean;
    icon?: string;
    label: string;
  };
}

interface UserProfileActionsProps {
  friendsCount: number;
}

function UserProfileActions({
  friendsCount,
}: Readonly<UserProfileActionsProps>) {
  const [isHoveringNotification, setIsHoveringNotification] = useState(false);

  return (
    <div className="user-profile__actions">
      <Link href="/friends" className="user-profile__actions__friends">
        <Users size={20} className="user-profile__actions__friends__icon" />

        <p className="user-profile__actions__friends__count">
          <span className="user-profile__actions__friends__count__number">
            {friendsCount}
          </span>{" "}
          friends online
        </p>
      </Link>

      <button
        className="user-profile__actions__notification"
        onMouseEnter={() => setIsHoveringNotification(true)}
        onMouseLeave={() => setIsHoveringNotification(false)}
      >
        <Bell size={20} weight={isHoveringNotification ? "fill" : "regular"} />
      </button>
    </div>
  );
}

function UserProfileContent({
  image,
  name,
  friendCode,
}: Readonly<UserProfileContentProps>) {
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
        <p className="user-profile-content__info__friend-code">
          <Copy
            size={16}
            className="user-profile-content__info__friend-code__icon"
          />
          <span className="user-profile-content__info__friend-code__text">
            {friendCode}
          </span>
        </p>
      </div>
    </div>
  );
}

export function UserProfile({
  image,
  name,
  friendCode,
  playingStatus,
}: Readonly<UserProfileProps>) {
  return (
    <div className="user-profile-container">
      <UserProfileContent
        image={image}
        name={name}
        friendCode={friendCode}
        playingStatus={playingStatus}
      />

      <UserProfileActions friendsCount={8} />
    </div>
  );
}

// export const UserProfileOld = ({
//   image,
//   name,
//   href,
//   playingStatus,
//   collapsed = false,
// }: UserProfileProps) => {
//   const nameInitials = name
//     .split(" ")
//     .filter((word) => word.length > 0)
//     .slice(0, 2)
//     .map((word) => word[0].toUpperCase())
//     .join("");

//   return (
//     <Link href={href}>
//       <div
//         className={`user-profile ${collapsed ? "user-profile--collapsed" : ""}`}
//       >
//         <div className="user-profile__image-wrapper">
//           {image ? (
//             <Image
//               src={image}
//               alt="User"
//               className="user-profile__image"
//               width={48}
//               height={48}
//               onError={(e) => {
//                 e.currentTarget.style.display = "none";
//               }}
//             />
//           ) : (
//             <div className="user-profile__initials">{nameInitials}</div>
//           )}
//           {collapsed && playingStatus?.icon && (
//             <div className="user-profile__status-icon--collapsed">
//               <Image
//                 src={playingStatus.icon}
//                 alt={playingStatus.label}
//                 width={16}
//                 height={16}
//               />
//             </div>
//           )}
//         </div>
//         {!collapsed && (
//           <div className="user-profile__info">
//             <div className="user-profile__info__name">{name}</div>
//             {playingStatus && (
//               <div className="user-profile__info__status">
//                 {playingStatus.icon && (
//                   <Image
//                     src={playingStatus.icon}
//                     alt={playingStatus.label}
//                     width={16}
//                     height={16}
//                     className="user-profile__info__status__icon"
//                   />
//                 )}
//                 <span className="user-profile__info__status__label">
//                   {playingStatus.label}
//                 </span>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       <UserProfileActions friendsCount={8} />
//     </Link>
//   );
// };
