import { ArrowLeftIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Typography } from "@/components";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";
import clsx from "clsx";
import debounce from "lodash-es/debounce";

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
  const searchRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const debouncedPush = useMemo(
    () =>
      debounce((value: string) => {
        router.push(
          {
            pathname: "/catalogue",
            query: { title: value || undefined },
          },
          undefined,
          { shallow: true }
        );
      }, 300),
    [router]
  );

  const handleInputFocus = () => {
    if (router.pathname !== "/catalogue") {
      router.push("/catalogue");
    }

    if (!isSearchOpen) setIsSearchOpen(true);
  };

  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node)) {
        setIsSearchOpen(false);
        inputRef.current?.blur();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
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

        <button
          ref={searchRef}
          className={clsx("header__search", {
            "header__search--open": isSearchOpen,
          })}
          onClick={handleInputFocus}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence>
            {isSearchOpen || isHovered ? (
              <motion.div
                key="left"
                initial={{ x: 24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 24, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut", delay: 0.1 }}
                className="header__search-icon header__search-icon--left"
              >
                <MagnifyingGlassIcon size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="right"
                initial={{ x: -24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -24, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut", delay: 0.1 }}
                className="header__search-icon header__search-icon--right"
              >
                <MagnifyingGlassIcon size={24} />
              </motion.div>
            )}
          </AnimatePresence>

          <input
            ref={inputRef}
            type="text"
            className="header__search-input typography typography--body"
            spellCheck={false}
            placeholder="Looking for anything in particular?"
            onChange={(e) => debouncedPush(e.target.value)}
          />
        </button>
      </header>
    </div>
  );
}
