import { describe, it, expect, vi, beforeEach } from "vitest";
import { useDownloadSourcesStore } from "../download-sources.store";
import { DownloadSourceStatus } from "@/constants";

vi.mock("../level-storage", () => ({
  levelStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe("useDownloadSourcesStore", () => {
  const mockDownloadSource = {
    name: "Test Source",
    url: "https://example.com/source.json",
    status: DownloadSourceStatus.UpToDate,
    downloadOptions: [
      {
        objectIds: ["123"],
        title: "Test Game",
        uris: ["https://example.com/game.zip"],
        fileSize: "1GB",
        uploadDate: "2024-01-01",
      },
    ],
    downloadCount: 1,
    fingerprint: "abc123",
  };

  beforeEach(() => {
    useDownloadSourcesStore.getState().clearDownloadSources();
  });

  describe("downloadSources", () => {
    it("should initialize with empty array", () => {
      expect(useDownloadSourcesStore.getState().downloadSources).toEqual([]);
    });

    it("should set download sources", () => {
      const sources = [mockDownloadSource];
      useDownloadSourcesStore.getState().setDownloadSources(sources);
      expect(useDownloadSourcesStore.getState().downloadSources).toEqual(
        sources
      );
    });

    it("should add download source", () => {
      useDownloadSourcesStore.getState().addDownloadSource(mockDownloadSource);
      expect(useDownloadSourcesStore.getState().downloadSources).toEqual([
        mockDownloadSource,
      ]);
    });

    it("should remove download source by url", () => {
      useDownloadSourcesStore.getState().addDownloadSource(mockDownloadSource);
      useDownloadSourcesStore
        .getState()
        .removeDownloadSource(mockDownloadSource.url);
      expect(useDownloadSourcesStore.getState().downloadSources).toEqual([]);
    });

    it("should clear all download sources", () => {
      useDownloadSourcesStore.getState().addDownloadSource(mockDownloadSource);
      useDownloadSourcesStore.getState().clearDownloadSources();
      expect(useDownloadSourcesStore.getState().downloadSources).toEqual([]);
    });
  });

  describe("multiple operations", () => {
    it("should handle multiple sources correctly", () => {
      const source2 = {
        ...mockDownloadSource,
        url: "https://example.com/source2.json",
      };
      const source3 = {
        ...mockDownloadSource,
        url: "https://example.com/source3.json",
      };

      useDownloadSourcesStore.getState().addDownloadSource(mockDownloadSource);
      useDownloadSourcesStore.getState().addDownloadSource(source2);
      useDownloadSourcesStore.getState().addDownloadSource(source3);

      const state = useDownloadSourcesStore.getState();
      expect(state.downloadSources).toHaveLength(3);
      expect(state.downloadSources[0].url).toBe(mockDownloadSource.url);
      expect(state.downloadSources[1].url).toBe(source2.url);
      expect(state.downloadSources[2].url).toBe(source3.url);
    });

    it("should handle remove and add operations in sequence", () => {
      const source2 = {
        ...mockDownloadSource,
        url: "https://example.com/source2.json",
      };

      useDownloadSourcesStore.getState().addDownloadSource(mockDownloadSource);
      useDownloadSourcesStore.getState().addDownloadSource(source2);
      useDownloadSourcesStore
        .getState()
        .removeDownloadSource(mockDownloadSource.url);
      useDownloadSourcesStore.getState().addDownloadSource(mockDownloadSource);

      const state = useDownloadSourcesStore.getState();
      expect(state.downloadSources).toHaveLength(2);
      expect(state.downloadSources[0].url).toBe(source2.url);
      expect(state.downloadSources[1].url).toBe(mockDownloadSource.url);
    });
  });

  describe("edge cases", () => {
    it("should not remove non-existent source", () => {
      useDownloadSourcesStore.getState().addDownloadSource(mockDownloadSource);
      useDownloadSourcesStore
        .getState()
        .removeDownloadSource("non-existent-url");
      expect(useDownloadSourcesStore.getState().downloadSources).toEqual([
        mockDownloadSource,
      ]);
    });

    it("should handle empty array in setDownloadSources", () => {
      useDownloadSourcesStore.getState().setDownloadSources([]);
      expect(useDownloadSourcesStore.getState().downloadSources).toEqual([]);
    });

    it("should handle duplicate urls in addDownloadSource", () => {
      useDownloadSourcesStore.getState().addDownloadSource(mockDownloadSource);
      useDownloadSourcesStore.getState().addDownloadSource(mockDownloadSource);
      expect(useDownloadSourcesStore.getState().downloadSources).toHaveLength(
        2
      );
    });
  });
});
