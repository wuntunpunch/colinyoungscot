"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

const NON_NERDY_NAV_HINT_KEY = "non-nerdy-nav-hint-seen";
const HINT_DURATION_MS = 5000;

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavHint, setShowNavHint] = useState(false);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissNavHint = useCallback(() => {
    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = null;
    }
    setShowNavHint(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(NON_NERDY_NAV_HINT_KEY, "1");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(NON_NERDY_NAV_HINT_KEY)) return;

    setShowNavHint(true);
    hintTimeoutRef.current = setTimeout(() => {
      dismissNavHint();
    }, HINT_DURATION_MS);

    return () => {
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
      }
    };
  }, [dismissNavHint]);

  const toggleMenu = () => {
    if (showNavHint) dismissNavHint();
    setIsOpen((open) => !open);
  };

  return (
    <>
      <div className="fixed top-6 left-6 z-50 flex items-center gap-2 sm:gap-3 max-w-[calc(100vw-1.5rem)]">
        {showNavHint && (
          <p
            className="order-2 flex items-center gap-1 text-xs sm:text-sm text-foreground/90 animate-pulse motion-reduce:animate-none pointer-events-none select-none shrink min-w-0"
            aria-hidden
          >
            <span className="text-accent shrink-0" aria-hidden>
              ←
            </span>
            <span className="leading-tight">non nerdy navigation</span>
          </p>
        )}
        <button
          onClick={toggleMenu}
          className="order-1 shrink-0 flex flex-col gap-1.5 p-2 focus:outline-none focus:ring-2 focus:ring-accent rounded"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
        <span
          className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${
            isOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
          <nav
            className="fixed top-0 left-0 h-full w-64 bg-background border-r border-muted z-40 p-8 pt-20"
            aria-label="Main navigation"
          >
            <ul className="flex flex-col gap-6">
              <li>
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="text-foreground hover:text-accent transition-colors text-lg"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  onClick={() => setIsOpen(false)}
                  className="text-foreground hover:text-accent transition-colors text-lg"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  onClick={() => setIsOpen(false)}
                  className="text-foreground hover:text-accent transition-colors text-lg"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/case-studies"
                  onClick={() => setIsOpen(false)}
                  className="text-foreground hover:text-accent transition-colors text-lg"
                >
                  Case Studies
                </Link>
              </li>
            </ul>
          </nav>
        </>
      )}
    </>
  );
}
