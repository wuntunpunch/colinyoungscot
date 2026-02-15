"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Terminal from "@/components/Terminal";

const BOOT_DURATION_MS = 2000;

export default function HomePageWrapper() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const hasBooted = typeof window !== "undefined" && sessionStorage.getItem("terminal-booted") === "true";

    if (hasBooted) {
      setShowContent(true);
    } else {
      const timer = setTimeout(() => {
        sessionStorage.setItem("terminal-booted", "true");
        setShowContent(true);
      }, BOOT_DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!showContent) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 font-mono text-sm"
        style={{ backgroundColor: "#0a0a0a", color: "#33ff33" }}
      >
        <div className="max-w-lg w-full whitespace-pre-wrap animate-pulse">
          {"Colinaut BIOS v1.0\n\n"}
          <span className="opacity-80">
            {"CPU: OK\n"}
            {"Memory: OK\n"}
            {"Storage: OK\n"}
            {"Network: OK\n\n"}
            {"Booting Colinaut...\n"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="px-6 pt-6 pb-2 text-center">
        <h1 className="text-2xl md:text-3xl font-normal text-foreground mb-3">
          Business Process Streamlining
        </h1>
        <p className="text-foreground/90 max-w-xl mx-auto mb-4">
          Custom booking systems, admin tools, and web apps that replace manual
          processes. West Scotland.
        </p>
        <nav className="flex justify-center gap-6 text-sm">
          <Link href="/services" className="text-accent hover:underline">
            Services
          </Link>
          <Link href="/case-studies" className="text-accent hover:underline">
            Case Studies
          </Link>
        </nav>
      </header>
      <Terminal skipBoot />
    </>
  );
}
