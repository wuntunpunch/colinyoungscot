"use client";

import { useState } from "react";
import Link from "next/link";

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-50 flex flex-col gap-1.5 p-2 focus:outline-none focus:ring-2 focus:ring-accent rounded"
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
