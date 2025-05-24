import { Typography } from "@/components/common";
import { SteamAchievement } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Box } from "./box";
import { TitleBox } from "./title-box";

export interface AchievementsBoxProps {
  achievements: SteamAchievement[];
}

export function AchievementsBox({ achievements }: AchievementsBoxProps) {
  return (
    <div className="game-page__box-group">
      <TitleBox title="Achievements" />

      {achievements.slice(0, 5).map((achievement) => (
        <Box key={achievement.name} className="game-page__achievement">
          <Image
            src={achievement.icon}
            width={56}
            height={56}
            className="game-page__achievement-icon"
            alt={achievement.displayName}
            loading="lazy"
          />

          <div className="game-page__achievement-info">
            <Typography>{achievement.displayName}</Typography>

            <Typography style={{ color: "rgba(255, 255, 255, 0.5)" }}>
              {achievement.description}
            </Typography>
          </div>
        </Box>
      ))}

      <Box style={{ textAlign: "center" }}>
        <Link href="/achievements">
          <Typography>View All Achievements</Typography>
        </Link>
      </Box>
    </div>
  );
}
