export type GameShop = "steam";

export interface User {
  id: string;
  displayName: string;
  profileImageUrl: string;
}

export interface ShopAssets {
  objectId: string;
  shop: GameShop;
  title: string;
  iconUrl: string | null;
  libraryHeroImageUrl: string;
  libraryImageUrl: string;
  logoImageUrl: string;
  logoPosition: string | null;
  coverImageUrl: string;
}

export interface UserGame extends ShopAssets {
  objectId: string;
  shop: GameShop;
  title: string;
  playTimeInSeconds: number;
  lastTimePlayed: Date | null;
  unlockedAchievementCount: number;
  achievementCount: number;
  achievementsPointsEarnedSum: number;
  isFavorite?: boolean;
  friendsWhoPlayed: User[];
}

export interface GameStats {
  downloadCount: number;
  playerCount: number;
  assets: ShopAssets | null;
}

export interface HowLongToBeatCategory {
  title: string;
  duration: string;
  accuracy: string;
}

export interface CatalogueGame {
  id: string;
  title: string;
  shop: GameShop;
  objectId: string;
  iconHash: string;
  libraryHeroImageUrl: string;
  libraryImageUrl: string;
  logoImageUrl: string;
  logoPosition: number;
  tags: string[];
  genres: string[];
  developer: string;
  publisher: string;
  installCount: number;
  reviewScore: number;
  achievementCount: number;
  achievementsPointsTotal: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SteamAchievement {
  name: string;
  displayName: string;
  description?: string;
  icon: string;
  icongray: string;
  hidden: boolean;
  points?: number;
}
