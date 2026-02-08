"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Command {
  command: string;
  output: string;
}

interface CommandInfo {
  description: string;
  action?: () => void;
}

type Commands = {
  [key: string]: CommandInfo;
};

const initialText = [
  "Hi, I'm Colin.",
  "",
  "",
  "Platform engineer by day, piano teacher by night.",
  "",
  "",
  "If manual processes and repetitive admin work are eating up your day, you're wasting time and money. I build web and mobile apps that automate what shouldn't need a human.",
  "",
  "Type 'help' for available commands.",
];

export default function Terminal() {
  const router = useRouter();
  const commands: Commands = {
    "help": {
      description: "Show available commands",
    },
    "case-studies": {
      description: "Navigate to case studies page",
      action: () => {
        router.push("/case-studies");
      },
    },
    "projects": {
      description: "Navigate to projects page",
      action: () => {
        router.push("/projects");
      },
    },
    "clear": {
      description: "Clear the terminal",
    },
    "email": {
      description: "Show contact email",
    },
    "whoami": {
      description: "Display information about Colin",
    },
  };
  const [displayedText, setDisplayedText] = useState<string[]>([""]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [commandHistory, setCommandHistory] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Check sessionStorage after mount to avoid hydration mismatch
  useEffect(() => {
    // Defer state update to avoid cascading renders
    queueMicrotask(() => {
      setIsMounted(true);
    });

    // Detect mobile device
    const checkMobile = () => {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) ||
        (typeof window !== "undefined" && window.innerWidth < 768) ||
        ("ontouchstart" in window || navigator.maxTouchPoints > 0);
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const hasAnimated = sessionStorage.getItem("terminal-animated") === "true";

    if (hasAnimated) {
      // Defer state updates to avoid cascading renders
      queueMicrotask(() => {
        // Skip animation, show all text immediately
        setDisplayedText(initialText);
        setCurrentLineIndex(initialText.length);
        setCurrentCharIndex(initialText[initialText.length - 1]?.length || 0);
        setIsTyping(false);
      });
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Typing animation effect
  useEffect(() => {
    if (!isMounted) return; // Wait for mount to avoid hydration issues

    if (!isTyping || currentLineIndex >= initialText.length) {
      // Defer state update to avoid cascading renders
      queueMicrotask(() => {
        setIsTyping(false);
      });
      // Mark animation as complete in sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem("terminal-animated", "true");
      }
      return;
    }

    const currentLine = initialText[currentLineIndex];
    if (currentCharIndex < currentLine.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev: string[]) => {
          const newText = [...prev];
          if (newText[currentLineIndex] === undefined) {
            newText[currentLineIndex] = "";
          }
          newText[currentLineIndex] = currentLine.substring(
            0,
            currentCharIndex + 1
          );
          return newText;
        });
        setCurrentCharIndex((prev: number) => prev + 1);
      }, 30);

      return () => clearTimeout(timer);
    } else {
      setTimeout(() => {
        setCurrentLineIndex((prev: number) => prev + 1);
        setCurrentCharIndex(0);
        if (currentLineIndex < initialText.length - 1) {
          setDisplayedText((prev: string[]) => [...prev, ""]);
        }
      }, 100);
    }
  }, [currentLineIndex, currentCharIndex, isTyping, isMounted]);

  // Scroll to bottom when content changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [displayedText, commandHistory]);

  // Focus input when typing is done
  useEffect(() => {
    if (!isTyping && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTyping]);

  // Focus input immediately if animation already played
  useEffect(() => {
    if (isMounted && !isTyping && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMounted, isTyping]);

  // Handle clicking anywhere in terminal to focus input
  const handleTerminalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only focus if typing is done and click wasn't on the input itself
    if (!isTyping && inputRef.current && e.target !== inputRef.current) {
      // Check if click was on a button or other interactive element
      const target = e.target as HTMLElement;
      if (target.tagName !== "BUTTON" && !target.closest("button")) {
        inputRef.current.focus();
      }
    }
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();

    if (trimmedCmd === "") {
      return;
    }

    let output = "";

    if (trimmedCmd === "help") {
      const tabCompleteText = isMobile
        ? "Available commands:\n\n"
        : "Available commands (tab complete available):\n\n";
      output = tabCompleteText;
      Object.entries(commands).forEach(([cmd, info]: [string, CommandInfo]) => {
        output += `  ${cmd.padEnd(15)} - ${info.description}\n`;
      });
    } else if (trimmedCmd === "clear") {
      setCommandHistory([]);
      return;
    } else if (trimmedCmd === "email") {
      output = "colin@colinyoung.scot";
    } else if (trimmedCmd === "whoami") {
      output =
        "Colin Young\nPlatform Engineer & Piano Teacher\n\nI create web apps and mobile apps. I work with businesses to help streamline processes.";
    } else if (trimmedCmd in commands) {
      const command = commands[trimmedCmd as keyof Commands];
      if (command.action) {
        output = `Navigating to ${trimmedCmd}...`;
        setCommandHistory((prev: Command[]) => [
          ...prev,
          { command: cmd, output },
        ]);
        setCurrentInput("");
        setHistoryIndex(-1);
        setTimeout(() => {
          command.action?.();
        }, 500);
        return;
      } else {
        output = command.description;
      }
    } else {
      output = `Command not found: ${trimmedCmd}\nType 'help' for available commands.`;
    }

    setCommandHistory((prev: Command[]) => [...prev, { command: cmd, output }]);
    setCurrentInput("");
    setHistoryIndex(-1);
  };

  const handleTabComplete = (input: string): string => {
    const trimmedInput = input.trim().toLowerCase();
    if (!trimmedInput) return input;

    // Find commands that start with the input
    const matchingCommands = Object.keys(commands).filter((cmd) =>
      cmd.toLowerCase().startsWith(trimmedInput)
    );

    if (matchingCommands.length === 0) {
      return input; // No matches
    } else if (matchingCommands.length === 1) {
      // Single match - complete it
      return matchingCommands[0];
    } else {
      // Multiple matches - find the longest common prefix
      const firstMatch = matchingCommands[0];
      let commonPrefix = firstMatch;

      for (let i = 1; i < matchingCommands.length; i++) {
        const cmd = matchingCommands[i];
        let j = 0;
        while (
          j < commonPrefix.length &&
          j < cmd.length &&
          commonPrefix[j].toLowerCase() === cmd[j].toLowerCase()
        ) {
          j++;
        }
        commonPrefix = commonPrefix.substring(0, j);
      }

      // If the common prefix is longer than the input, use it
      if (commonPrefix.length > trimmedInput.length) {
        return commonPrefix;
      }

      // Otherwise, show available commands
      return input;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(currentInput);
    } else if (e.key === "Tab" && !isMobile) {
      // Only enable tab completion on non-mobile devices
      e.preventDefault();
      const completed = handleTabComplete(currentInput);
      if (completed !== currentInput) {
        setCurrentInput(completed);
      } else {
        // Show available commands if multiple matches
        const trimmedInput = currentInput.trim().toLowerCase();
        const matchingCommands = Object.keys(commands).filter((cmd) =>
          cmd.toLowerCase().startsWith(trimmedInput)
        );
        if (matchingCommands.length > 1) {
          const output = `Available commands: ${matchingCommands.join(", ")}`;
          setCommandHistory((prev: Command[]) => [
            ...prev,
            { command: currentInput, output },
          ]);
          setCurrentInput("");
          setHistoryIndex(-1);
        }
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex].command);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput("");
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex].command);
        }
      }
    }
  };

  // Theme colors
  const theme = {
    dark: {
      bg: "#0f4c82",
      terminalBg: "#252525",
      terminalBorder: "#4a4a4a",
      headerBg: "#252525",
      headerBorder: "#4a4a4a",
      text: "#f0f0f0",
      textMuted: "#a0a0a0",
      textOutput: "#d0d0d0",
      cursor: "#f0f0f0",
      scrollbar: "#404040",
    },
    light: {
      bg: "#0f4c82",
      terminalBg: "#ffffff",
      terminalBorder: "#e0e0e0",
      headerBg: "#ffffff",
      headerBorder: "#e0e0e0",
      text: "#1a1a1a",
      textMuted: "#666666",
      textOutput: "#333333",
      cursor: "#1a1a1a",
      scrollbar: "#d0d0d0",
    },
  };

  const colors = isDarkMode ? theme.dark : theme.light;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="w-full max-w-5xl">
        {/* Terminal Window - Ghostty style */}
        <div
          className="rounded-lg shadow-xl overflow-hidden"
          style={{
            backgroundColor: colors.terminalBg,
            border: `1px solid ${colors.terminalBorder}`,
          }}
        >
          {/* Terminal Header */}
          <div
            className="px-4 py-2.5 flex items-center justify-between"
            style={{
              backgroundColor: colors.headerBg,
              borderBottom: `1px solid ${colors.headerBorder}`,
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "#ff5f56" }}
                ></div>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "#ffbd2e" }}
                ></div>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "#27c93f" }}
                ></div>
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: colors.textMuted }}
              >
                colin@colinyoung.scot
              </span>
            </div>
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 rounded hover:bg-opacity-20 transition-colors"
              style={{
                backgroundColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
                color: colors.textMuted,
              }}
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
          </div>

          {/* Terminal Content */}
          <div
            ref={terminalRef}
            onClick={handleTerminalClick}
            className="p-4 md:p-6 font-mono text-sm h-[400px] md:h-[600px] overflow-y-auto cursor-text"
            style={{
              backgroundColor: colors.terminalBg,
              color: colors.text,
              fontFamily: "monospace",
              scrollbarWidth: "thin",
              scrollbarColor: `${colors.scrollbar} ${colors.terminalBg}`,
            }}
          >
            {/* Animated intro text */}
            {displayedText.length > 0 &&
              displayedText.map((line: string, index: number) => (
                <div
                  key={index}
                  className="mb-0.5"
                  style={{
                    lineHeight: "1.6",
                    minHeight: line === "" ? "0.5em" : "auto",
                  }}
                >
                  {line !== "" && (
                    <span style={{ color: colors.text }}>{line}</span>
                  )}
                  {index === currentLineIndex &&
                    currentCharIndex <
                      initialText[currentLineIndex]?.length && (
                      <span
                        className="inline-block ml-0.5 animate-pulse"
                        style={{
                          width: "2px",
                          height: "16px",
                          backgroundColor: colors.cursor,
                        }}
                      ></span>
                    )}
                </div>
              ))}

            {/* Show cursor while typing even if no text yet */}
            {isTyping && displayedText.length === 0 && (
              <span
                className="inline-block animate-pulse"
                style={{
                  width: "2px",
                  height: "16px",
                  backgroundColor: colors.cursor,
                }}
              ></span>
            )}

            {/* Command history */}
            {commandHistory.map((item: Command, index: number) => (
              <div key={index} className="mt-3">
                <div className="mb-1" style={{ color: colors.text }}>
                  <span style={{ color: colors.textMuted }}>$ </span>
                  <span style={{ color: colors.text }}>{item.command}</span>
                </div>
                <div
                  className="mt-1 whitespace-pre-wrap"
                  style={{ color: colors.textOutput, lineHeight: "1.6" }}
                >
                  {item.output}
                </div>
              </div>
            ))}

            {/* Command input */}
            {!isTyping && (
              <div className="mt-3 flex items-center">
                <span className="mr-2" style={{ color: colors.textMuted }}>
                  $
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setCurrentInput(e.target.value);
                    setHistoryIndex(-1);
                  }}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none font-mono"
                  style={{ color: colors.text, caretColor: colors.cursor }}
                  autoFocus
                  autoComplete="off"
                  spellCheck="false"
                />
                <span
                  className="inline-block ml-1 animate-pulse"
                  style={{
                    width: "2px",
                    height: "16px",
                    backgroundColor: colors.cursor,
                  }}
                ></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
