import { ArrowLeftIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Typography } from "@/components";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const capitalize = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

const usePageTitle = () => {
  const { pathname, query } = useRouter();

  if (pathname.startsWith("/game/")) {
    const slug = query.slug as string;
    return slug ? slug.split("-").map(capitalize).join(" ") : "Game Details";
  }

  const firstSegment = pathname.split("/")[1];
  return firstSegment ? capitalize(firstSegment) : "Home";
};

export function Header() {
  const router = useRouter();
  const pageTitle = usePageTitle();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleInputFocus = () => {
    if (!isSearchOpen) setIsSearchOpen(true);
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const outside =
        containerRef.current &&
        !containerRef.current.contains(e.target as Node);
      if (outside) setIsSearchOpen(false);
    };

    const handleEscape = (e: KeyboardEvent) => {
      const pressedEscape = e.key === "Escape";
      const inputFocused = document.activeElement === inputRef.current;

      if (pressedEscape && inputFocused) {
        setIsSearchOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isSearchOpen]);

  return (
    <div className="header">
      <header className="header__container">
        <button className="header__action" onClick={() => router.back()}>
          <ArrowLeftIcon size={24} weight="bold" />

          <Typography variant="label" className="header__title">
            {pageTitle}
          </Typography>
        </button>

        <motion.div
          ref={containerRef}
          className="header__search"
          onClick={handleInputFocus}
          animate={isSearchOpen ? "expanded" : "collapsed"}
          variants={{
            expanded: { flex: 1, backgroundColor: "var(--surface)" },
            collapsed: { flex: 0, backgroundColor: "transparent" },
          }}
          transition={{
            duration: isSearchOpen ? 0.3 : 0,
            ease: "easeInOut",
          }}
        >
          <MagnifyingGlassIcon
            size={24}
            weight="bold"
            className="header__search-icon"
          />

          {isSearchOpen && (
            <input
              ref={inputRef}
              type="text"
              className="header__search-input typography typography--body"
              spellCheck={false}
            />
          )}
        </motion.div>
      </header>
    </div>
  );
}
