import { Dexie, Table } from "dexie";
import type {
  CatalogueGameModel,
  Download,
  DownloadSource,
  HowLongToBeatEntry,
} from "@/types";

export class DexieService extends Dexie {
  private static instance: DexieService;

  private static readonly dbName = "Hydra";
  private static readonly dbVersion = 2;

  games!: Table<CatalogueGameModel>;
  downloads!: Table<Download>;
  downloadSources!: Table<DownloadSource>;
  howLongToBeatEntries!: Table<HowLongToBeatEntry>;

  private static readonly tables = {
    games:
      "++id, title, shop, objectId, iconHash, tags, genres, developer, publisher, installCount, reviewScore, achievementCount, achievementsPointsTotal, createdAt, updatedAt",
    downloads:
      "++id, title, uris, fileSize, uploadDate, downloadSourceId, objectIds, createdAt, updatedAt",
    downloadSources:
      "++id, url, name, objectIds, downloadCount, status, fingerprint, createdAt, updatedAt",
    howLongToBeatEntries:
      "++id, categories, [shop+objectId], createdAt, updatedAt",
  };

  private constructor() {
    super(DexieService.dbName);
    this.version(DexieService.dbVersion).stores(DexieService.tables);
  }

  private initialize() {
    this.open();
  }

  public static getInstance(): DexieService {
    if (!DexieService.instance) {
      const instance = new DexieService();
      instance.initialize();
      DexieService.instance = instance;
    }

    return DexieService.instance;
  }
}
