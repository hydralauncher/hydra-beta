import { Tooltip } from "../common";

import type { UserGame } from "@/types";
import { useDate, useFormat } from "@/hooks";
import { Typography } from "../common";
import Image from "next/image";

export interface PlaytimeBarProps {
  profileGame: UserGame | null;
}

export function PlaytimeBar({ profileGame }: PlaytimeBarProps) {
  const { formatDistance } = useDate();
  const { formatPlayTime } = useFormat();

  return (
    <div className="game-page__playtime-bar">
      <div>
        <Typography>
          Played for{" "}
          <strong>{formatPlayTime(profileGame?.playTimeInSeconds ?? 0)}</strong>
        </Typography>
        <Typography style={{ color: "rgba(255, 255, 255, 0.5)" }}>
          {profileGame?.lastTimePlayed ? (
            <>
              Last played{" "}
              {formatDistance(profileGame.lastTimePlayed, new Date(), {
                addSuffix: true,
              })}
            </>
          ) : (
            <>You haven&apos;t played {profileGame?.title} yet</>
          )}
        </Typography>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <ul
            style={{
              display: "flex",
              listStyle: "none",
              justifyContent: "flex-end",
            }}
          >
            {profileGame?.friendsWhoPlayed.slice(0, 3).map((friend, index) => (
              <li
                key={friend.id}
                style={{
                  transform: `translateX(-${(index + 1) * 8}px)`,
                  zIndex: 100 - index,
                  position: "relative",
                  border: "1px solid #0E0E0E",
                  borderRadius: 4,
                  width: 24,
                  height: 24,
                }}
              >
                <Tooltip
                  content={friend.displayName}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Image
                    src={friend.profileImageUrl}
                    alt={friend.id}
                    width={36}
                    height={36}
                    style={{
                      borderRadius: 4,
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </Tooltip>
              </li>
            ))}
          </ul>

          <Typography>Also played by</Typography>
        </div>

        <Typography>
          {profileGame?.friendsWhoPlayed[0]?.displayName} and{" "}
          {profileGame?.friendsWhoPlayed.length
            ? profileGame?.friendsWhoPlayed.length - 1
            : 0}
          {profileGame?.friendsWhoPlayed.length ? " others" : ""}
        </Typography>
      </div>
    </div>
  );
}
