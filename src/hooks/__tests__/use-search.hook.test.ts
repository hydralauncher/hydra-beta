import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSearch } from "../use-search.hook";

describe("useSearch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should return all items when search is empty", () => {
    const items = [
      { id: 1, name: "Apple", description: "A fruit" },
      { id: 2, name: "Banana", description: "Another fruit" },
    ];

    const { result } = renderHook(() =>
      useSearch(items, ["name", "description"])
    );

    expect(result.current.filteredItems).toEqual(items);
  });

  it("should filter items based on search term", () => {
    const items = [
      { id: 1, name: "Apple", description: "A fruit" },
      { id: 2, name: "Banana", description: "Another fruit" },
    ];

    const { result } = renderHook(() =>
      useSearch(items, ["name", "description"])
    );

    act(() => {
      result.current.setSearch("apple");
    });

    expect(result.current.filteredItems).toEqual([items[0]]);
  });

  it("should be case insensitive", () => {
    const items = [
      { id: 1, name: "Apple", description: "A fruit" },
      { id: 2, name: "Banana", description: "Another fruit" },
    ];

    const { result } = renderHook(() =>
      useSearch(items, ["name", "description"])
    );

    act(() => {
      result.current.setSearch("APPLE");
    });

    expect(result.current.filteredItems).toEqual([items[0]]);
  });

  it("should search across multiple fields", () => {
    const items = [
      { id: 1, name: "Apple", description: "A red fruit" },
      { id: 2, name: "Banana", description: "A yellow fruit" },
    ];

    const { result } = renderHook(() =>
      useSearch(items, ["name", "description"])
    );

    act(() => {
      result.current.setSearch("red");
    });

    expect(result.current.filteredItems).toEqual([items[0]]);
  });

  it("should handle non-string fields gracefully", () => {
    const items = [
      { id: 1, name: "Apple", count: 5 },
      { id: 2, name: "Banana", count: 10 },
    ];

    const { result } = renderHook(() => useSearch(items, ["name", "count"]));

    act(() => {
      result.current.setSearch("apple");
    });

    expect(result.current.filteredItems).toEqual([items[0]]);
  });

  it("should debounce search updates", () => {
    const items = [
      { id: 1, name: "Apple", description: "A fruit" },
      { id: 2, name: "Banana", description: "Another fruit" },
    ];

    const { result } = renderHook(() =>
      useSearch(items, ["name", "description"])
    );

    // Set initial search
    act(() => {
      result.current.setSearch("apple");
    });

    // Verify immediate filtering
    expect(result.current.filteredItems).toEqual([items[0]]);

    // Set multiple rapid updates
    act(() => {
      result.current.setSearch("a");
      result.current.setSearch("ap");
      result.current.setSearch("app");
      result.current.setSearch("appl");
      result.current.setSearch("apple");
    });

    // Verify final state after debounce
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.filteredItems).toEqual([items[0]]);
  });

  it("should handle empty items array", () => {
    const items: { id: number; name: string }[] = [];

    const { result } = renderHook(() => useSearch(items, ["name"]));

    act(() => {
      result.current.setSearch("apple");
    });

    expect(result.current.filteredItems).toEqual([]);
  });
});
