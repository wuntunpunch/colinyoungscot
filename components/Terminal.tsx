"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SnakeGame from "@/components/SnakeGame";

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

const PROMPT = "colin@colinyoung:~$ ";

// Generated with: figlet -f big Colinaut
const ASCII_BANNER =
  "\n" +
  "  _____      _ _                   _   \n" +
  " / ____|    | (_)                 | |  \n" +
  "| |     ___ | |_ _ __   __ _ _   _| |_ \n" +
  "| |    / _ \\| | | '_ \\ / _` | | | | __|\n" +
  "| |___| (_) | | | | | | (_| | |_| | |_ \n" +
  " \\_____\\___/|_|_|_| |_|\\__,_|\\__,_|\\__|\n";

const FORTUNES = [
  "There are only two hard things in Computer Science: cache invalidation and naming things.",
  "rm -rf remains the most reliable uninstall method.",
  "I'd rather write code than documentation. Sadly, the code documents my priorities.",
  "Stack Overflow: it was nice while it lasted.",
  "The best code is no code at all.",
  "It works on my machine. (It's a very nice machine.)",
  "Weeks of coding can save you hours of planning.",
];

const LS_DIRECTORIES = ["case-studies", "projects"] as const;

const README_CONTENT =
  "# colinyoung.scot\n\n" +
  "Platform engineer by day, piano teacher by night.\n\n" +
  "## What I do\n\n" +
  "- Build web and mobile apps\n" +
  "- Automate manual business processes\n" +
  "- Teach piano\n\n" +
  "## Navigation\n\n" +
  "  cd case-studies  - View case studies\n" +
  "  cd projects     - View projects\n" +
  "  help            - List all commands\n";

const MAN_COLIN =
  "COLIN(1)                    General Commands Manual                   COLIN(1)\n\n" +
  "NAME\n" +
  "     Colin – Platform engineer and piano teacher\n\n" +
  "SYNOPSIS\n" +
  "     colin [--build] [--automate] [--teach]\n\n" +
  "DESCRIPTION\n" +
  "     Colin creates web and mobile applications, specializing in automating\n" +
  "     manual business processes. By night, he teaches piano.\n\n" +
  "OPTIONS\n" +
  "     --build      Creates custom software solutions\n" +
  "     --automate   Eliminates repetitive admin work\n" +
  "     --teach      Piano instruction\n\n" +
  "SEE ALSO\n" +
  "     whoami(1), neofetch(1), man(1)\n";

const COW_SAY = (msg: string) => {
  const maxLen = 40;
  const displayMsg = msg.length > maxLen - 2 ? msg.slice(0, maxLen - 3) + "…" : msg;
  const line = "─".repeat(Math.min(displayMsg.length + 2, maxLen));
  return (
    ` ${line}\n` +
    `< ${displayMsg} >\n` +
    ` ${line}\n` +
    "        \\   ^__^\n" +
    "         \\  (oo)\\_______\n" +
    "            (__)\\       )\\/\\\n" +
    "                ||----w |\n" +
    "                ||     ||\n"
  );
};

const KONAMI_CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "KeyB", "KeyA"];

const initialText = [
  "Hi, I'm Colin.",
  "",
  "",
  "Platform engineer by day, piano teacher by night.",
  "",
  "",
  "If manual business processes and repetitive admin work are eating up your day, you're wasting time and money. I build web and mobile apps that automate what shouldn't need a human.",
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
    "neofetch": {
      description: "Display system information (Colin edition)",
    },
    "ls": {
      description: "List directory contents",
    },
    "cd": {
      description: "Change directory (cd case-studies, cd projects)",
    },
    "theme": {
      description: "Change terminal color scheme (e.g. theme green)",
    },
    "colors": {
      description: "Alias for theme",
    },
    "banner": {
      description: "Display ASCII banner",
    },
    "date": {
      description: "Display current date and time",
    },
    "pwd": {
      description: "Print working directory",
    },
    "man": {
      description: "Display manual page (e.g. man colin)",
    },
    "cowsay": {
      description: "Cow says a fortune (or cowsay <message>)",
    },
    "cat": {
      description: "Display file contents (try: cat README)",
    },
    "git": {
      description: "Git commands (try: git status)",
    },
    "snake": {
      description: "Play snake",
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
  const [colorTheme, setColorTheme] = useState<"default" | "green" | "amber" | "nord">("default");
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const mountTimeRef = useRef<number>(0);
  const [startupLine, setStartupLine] = useState<string | null>(null);
  const [showBoot, setShowBoot] = useState(true);
  const [useBlockCursor] = useState(true);
  const [showSnakeGame, setShowSnakeGame] = useState(false);
  const konamiIndexRef = useRef(0);

  // Check sessionStorage after mount to avoid hydration mismatch
  useEffect(() => {
    mountTimeRef.current = performance.now();
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

    const savedTheme = localStorage.getItem("terminal-color-theme") as "green" | "amber" | "nord" | null;
    if (savedTheme === "green" || savedTheme === "amber" || savedTheme === "nord") {
      queueMicrotask(() => setColorTheme(savedTheme));
    }

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

    // Boot sequence - skip if returning visitor
    let bootTimer: ReturnType<typeof setTimeout> | null = null;
    const hasBooted = sessionStorage.getItem("terminal-booted") === "true";

    const setStartupLineWithDuration = () => {
      const endTime = performance.now();
      const durationMs = Math.round(endTime - mountTimeRef.current);
      const now = new Date();
      const timeStr = now.toTimeString().slice(0, 8); // HH:mm:ss
      setStartupLine(
        `${timeStr} runtime.Colinaut - Startup completed in ${durationMs}ms`
      );
    };

    if (hasBooted) {
      queueMicrotask(() => {
        setShowBoot(false);
        requestAnimationFrame(setStartupLineWithDuration);
      });
    } else {
      bootTimer = setTimeout(() => {
        setStartupLineWithDuration();
        setShowBoot(false);
        sessionStorage.setItem("terminal-booted", "true");
      }, 2000);
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      if (bootTimer) clearTimeout(bootTimer);
    };
  }, []);

  // Typing animation effect - pause until BIOS boot is complete
  useEffect(() => {
    if (!isMounted || showBoot) return; // Wait for mount and boot to complete

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
  }, [currentLineIndex, currentCharIndex, isTyping, isMounted, showBoot]);

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
    } else if (trimmedCmd === "neofetch") {
      output =
        "       colinyoung.scot\n" +
        "─────────────────────────────────────\n" +
        "OS:         macOS\n" +
        "Shell:      zsh\n" +
        "Editor:     vim / Cursor\n" +
        "Languages:  TypeScript, Python\n" +
        "Focus:      Platform Engineering\n" +
        "Side quest: Piano teaching\n" +
        "─────────────────────────────────────";
    } else if (trimmedCmd === "vim" || trimmedCmd.startsWith("vim ")) {
      output =
        "This is fine. Press :q to exit.\n\n(Just kidding, you're already out.)";
    } else if (trimmedCmd === "sudo" || trimmedCmd.startsWith("sudo ")) {
      output = "sudo: Nice try. Permission denied.";
    } else if (trimmedCmd === "fortune") {
      output =
        FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    } else if (trimmedCmd === "exit" || trimmedCmd === "quit") {
      output = "You can't exit. You're in a browser.";
    } else if (trimmedCmd === "reboot") {
      output = "Nice try.";
    } else if (trimmedCmd === "sl") {
      output = "sl: command not found. Did you mean ls?";
    } else if (trimmedCmd === "uname" || trimmedCmd.startsWith("uname ")) {
      output =
        "Colinaut colinyoung.scot 1.0.0 Colinaut x86_64 colinyoung-scot-generic";
    } else if (trimmedCmd === "date") {
      output = new Date().toString();
    } else if (trimmedCmd === "rm -rf /" || /^rm\s+-rf\s+\/\s*$/.test(trimmedCmd)) {
      output = "I'm sorry, I'm afraid I can't do that.";
    } else if (trimmedCmd === "pwd") {
      output = "/home/colin";
    } else if (trimmedCmd.startsWith("cat ")) {
      const file = trimmedCmd.replace(/^cat\s+/, "").trim();
      if (file.toLowerCase() === "readme") {
        output = README_CONTENT;
      } else {
        output = `cat: ${file}: No such file or directory`;
      }
    } else if (trimmedCmd === "git" || trimmedCmd.startsWith("git ")) {
      if (trimmedCmd === "git status") {
        output =
          "On branch main\nYour branch is up to date with 'origin/main'.\n\n" +
          "nothing to commit, working tree clean";
      } else {
        output =
          "git status was just a flex. That's the only git command that works here.";
      }
    } else if (trimmedCmd.startsWith("man ")) {
      const manArg = trimmedCmd.replace(/^man\s+/, "").trim().toLowerCase();
      if (manArg === "colin") {
        output = MAN_COLIN;
      } else if (manArg === "ls") {
        output =
          "LS(1)                    User Commands                    LS(1)\n\nNAME\n     ls - list directory contents\n\nSYNOPSIS\n     ls [OPTION]... [FILE]...\n\nDESCRIPTION\n     List information about directories (case-studies, projects).\n";
      } else if (manArg === "cd") {
        output =
          "CD(1)                    User Commands                    CD(1)\n\nNAME\n     cd - change directory\n\nSYNOPSIS\n     cd DIRECTORY\n\nDESCRIPTION\n     Change to DIRECTORY. Use 'ls' to see available directories.\n";
      } else if (manArg === "help" || manArg === "theme") {
        output = `No manual entry for ${manArg}. Try 'help' for usage.`;
      } else {
        output = `No manual entry for ${manArg}`;
      }
    } else if (trimmedCmd === "cowsay" || trimmedCmd.startsWith("cowsay ")) {
      const msg =
        trimmedCmd === "cowsay"
          ? FORTUNES[Math.floor(Math.random() * FORTUNES.length)]
          : trimmedCmd.replace(/^cowsay\s+/, "");
      output = COW_SAY(msg);
    } else if (trimmedCmd === "cd" || trimmedCmd.startsWith("cd ")) {
      if (trimmedCmd === "cd") {
        output = `Usage: cd <directory>\nAvailable: ${LS_DIRECTORIES.join(", ")}`;
      } else {
        const dir = trimmedCmd.replace(/^cd\s+/, "").trim().toLowerCase();
        const normalizedDir = LS_DIRECTORIES.find(
          (d) => d.toLowerCase() === dir || d.toLowerCase().startsWith(dir)
        );
        if (normalizedDir) {
          output = `Changing directory to ${normalizedDir}...`;
          setCommandHistory((prev: Command[]) => [
            ...prev,
            { command: cmd, output },
          ]);
          setCurrentInput("");
          setHistoryIndex(-1);
          setTimeout(() => {
            router.push(`/${normalizedDir}`);
          }, 500);
          return;
        } else {
          output = `404: Directory not found: ${dir}`;
        }
      }
    } else if (trimmedCmd === "ls" || trimmedCmd === "ls -la" || trimmedCmd === "ls -l") {
      if (trimmedCmd === "ls") {
        output = "case-studies/\tprojects/";
      } else {
        output =
          "drwxr-xr-x  2 colin  staff  128  colinyoung  case-studies\n" +
          "drwxr-xr-x  2 colin  staff  128  colinyoung  projects";
      }
    } else if (trimmedCmd === "banner") {
      output = ASCII_BANNER;
    } else if (trimmedCmd === "theme" || trimmedCmd === "colors") {
      output =
        "Available themes: default, green, amber, nord\n" +
        "Usage: theme <name>\n\n" +
        "Current: " + colorTheme;
    } else if (trimmedCmd.startsWith("theme ") || trimmedCmd.startsWith("colors ")) {
      const themeArg = trimmedCmd.replace(/^(theme|colors) /, "").trim().toLowerCase();
      const validThemes = ["default", "green", "amber", "nord"];
      if (validThemes.includes(themeArg)) {
        setColorTheme(themeArg as "default" | "green" | "amber" | "nord");
        if (typeof window !== "undefined") {
          if (themeArg === "default") {
            localStorage.removeItem("terminal-color-theme");
          } else {
            localStorage.setItem("terminal-color-theme", themeArg);
          }
        }
        output = `Theme set to ${themeArg}.`;
      } else {
        output = `Unknown theme: ${themeArg}\nAvailable: ${validThemes.join(", ")}`;
      }
    } else if (trimmedCmd === "snake") {
      output = "ssssnake...";
      setCommandHistory((prev: Command[]) => [
        ...prev,
        { command: cmd, output },
      ]);
      setCurrentInput("");
      setHistoryIndex(-1);
      setShowSnakeGame(true);
      return;
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
    const trimmedInput = input.trimStart();
    const trimmedLower = trimmedInput.toLowerCase();
    if (!trimmedLower) return input;

    // Handle "cd <dir>" - tab complete directory names
    const cdMatch = trimmedLower.match(/^cd\s+(.*)$/);
    if (cdMatch) {
      const dirPrefix = cdMatch[1];
      const matchingDirs = LS_DIRECTORIES.filter((d) =>
        d.toLowerCase().startsWith(dirPrefix.toLowerCase())
      );
      if (matchingDirs.length === 0) return input;
      if (matchingDirs.length === 1) {
        return `cd ${matchingDirs[0]}`;
      }
      // Multiple matches - find longest common prefix
      let commonPrefix: string = matchingDirs[0];
      for (let i = 1; i < matchingDirs.length; i++) {
        const d = matchingDirs[i];
        let j = 0;
        while (
          j < commonPrefix.length &&
          j < d.length &&
          commonPrefix[j].toLowerCase() === d[j].toLowerCase()
        ) {
          j++;
        }
        commonPrefix = commonPrefix.substring(0, j);
      }
      if (commonPrefix.length > dirPrefix.length) {
        return `cd ${commonPrefix}`;
      }
      return input;
    }

    // Handle "theme <name>" and "colors <name>" - tab complete theme names
    const themeMatch = trimmedLower.match(/^(theme|colors)\s+(.*)$/);
    if (themeMatch) {
      const themePrefix = themeMatch[2];
      const validThemes = ["default", "green", "amber", "nord"];
      const matchingThemes = validThemes.filter((t) =>
        t.toLowerCase().startsWith(themePrefix.toLowerCase())
      );
      if (matchingThemes.length === 0) return input;
      if (matchingThemes.length === 1) {
        return `${trimmedInput.split(/\s+/)[0]} ${matchingThemes[0]}`;
      }
      let commonPrefix: string = matchingThemes[0];
      for (let i = 1; i < matchingThemes.length; i++) {
        const t = matchingThemes[i];
        let j = 0;
        while (
          j < commonPrefix.length &&
          j < t.length &&
          commonPrefix[j].toLowerCase() === t[j].toLowerCase()
        ) {
          j++;
        }
        commonPrefix = commonPrefix.substring(0, j);
      }
      if (commonPrefix.length > themePrefix.length) {
        return `${trimmedInput.split(/\s+/)[0]} ${commonPrefix}`;
      }
      return input;
    }

    // Find commands that start with the input
    const matchingCommands = Object.keys(commands).filter((cmd) =>
      cmd.toLowerCase().startsWith(trimmedLower)
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
      if (commonPrefix.length > trimmedLower.length) {
        return commonPrefix;
      }

      // Otherwise, show available commands
      return input;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Konami code detection
    if (KONAMI_CODE[konamiIndexRef.current] === e.code) {
      konamiIndexRef.current++;
      if (konamiIndexRef.current === KONAMI_CODE.length) {
        konamiIndexRef.current = 0;
        setColorTheme("green");
        if (typeof window !== "undefined") {
          localStorage.setItem("terminal-color-theme", "green");
        }
        setCommandHistory((prev) => [
          ...prev,
          {
            command: "↑↑↓↓←→←→BA",
            output: "+30 lives. Green phosphor mode activated!",
          },
        ]);
        setCurrentInput("");
        setHistoryIndex(-1);
        return;
      }
    } else {
      konamiIndexRef.current = 0;
    }

    if (e.key === "Enter") {
      handleCommand(currentInput);
    } else if (e.key === "Tab" && !isMobile) {
      // Only enable tab completion on non-mobile devices
      e.preventDefault();
      const completed = handleTabComplete(currentInput);
      if (completed !== currentInput) {
        setCurrentInput(completed);
      } else {
        const trimmedInput = currentInput.trim().toLowerCase();
        // Check for cd <dir> multiple matches
        const cdMatch = trimmedInput.match(/^cd\s+(.*)$/);
        if (cdMatch) {
          const dirPrefix = cdMatch[1];
          const matchingDirs = LS_DIRECTORIES.filter((d) =>
            d.toLowerCase().startsWith(dirPrefix.toLowerCase())
          );
          if (matchingDirs.length > 1) {
            const output = `Available directories: ${matchingDirs.join(", ")}`;
            setCommandHistory((prev: Command[]) => [
              ...prev,
              { command: currentInput, output },
            ]);
            setCurrentInput("");
            setHistoryIndex(-1);
          }
        } else {
          const themeMatch = trimmedInput.match(/^(theme|colors)\s+(.*)$/);
          if (themeMatch) {
            const themePrefix = themeMatch[2];
            const validThemes = ["default", "green", "amber", "nord"];
            const matchingThemes = validThemes.filter((t) =>
              t.toLowerCase().startsWith(themePrefix.toLowerCase())
            );
            if (matchingThemes.length > 1) {
              const output = `Available themes: ${matchingThemes.join(", ")}`;
              setCommandHistory((prev: Command[]) => [
                ...prev,
                { command: currentInput, output },
              ]);
              setCurrentInput("");
              setHistoryIndex(-1);
            }
          } else {
            // Show available commands if multiple matches
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

  // Theme colors - colorTheme overrides when set to green/amber/nord
  const colorPalettes = {
    "default-dark": {
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
    "default-light": {
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
    green: {
      bg: "#0a0a0a",
      terminalBg: "#0a0a0a",
      terminalBorder: "#1a3d1a",
      headerBg: "#0a0a0a",
      headerBorder: "#1a3d1a",
      text: "#33ff33",
      textMuted: "#228b22",
      textOutput: "#2ed42e",
      cursor: "#33ff33",
      scrollbar: "#1a3d1a",
    },
    amber: {
      bg: "#0a0a0a",
      terminalBg: "#0a0a0a",
      terminalBorder: "#3d351a",
      headerBg: "#0a0a0a",
      headerBorder: "#3d351a",
      text: "#ffb000",
      textMuted: "#b8860b",
      textOutput: "#daa520",
      cursor: "#ffb000",
      scrollbar: "#3d351a",
    },
    nord: {
      bg: "#2e3440",
      terminalBg: "#2e3440",
      terminalBorder: "#4c566a",
      headerBg: "#2e3440",
      headerBorder: "#4c566a",
      text: "#eceff4",
      textMuted: "#88c0d0",
      textOutput: "#d8dee9",
      cursor: "#eceff4",
      scrollbar: "#4c566a",
    },
  };

  const paletteKey =
    colorTheme === "default"
      ? isDarkMode
        ? "default-dark"
        : "default-light"
      : colorTheme;
  const colors = colorPalettes[paletteKey];
  const isRetroTheme = colorTheme === "green" || colorTheme === "amber";

  // Boot sequence screen
  if (showBoot) {
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
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{ backgroundColor: colors.bg }}
    >
      {showSnakeGame && (
        <SnakeGame
          onClose={() => setShowSnakeGame(false)}
          isMobile={isMobile}
          colors={{
            bg: colors.terminalBg,
            text: colors.text,
            muted: colors.textMuted,
            border: colors.terminalBorder,
          }}
        />
      )}
      <div className="w-full max-w-5xl relative">
        {/* Terminal Window - Ghostty style */}
        <div
          className="relative rounded-lg shadow-xl overflow-hidden"
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
            {/* Theme Toggle - cycles dark/light for default, resets from custom themes */}
            <button
              onClick={() => {
                if (colorTheme !== "default") {
                  setColorTheme("default");
                  localStorage.removeItem("terminal-color-theme");
                }
                setIsDarkMode(!isDarkMode);
              }}
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
            className="relative p-4 md:p-6 font-mono text-sm h-[400px] md:h-[600px] overflow-y-auto cursor-text"
            style={{
              backgroundColor: colors.terminalBg,
              color: colors.text,
              fontFamily: "monospace",
              scrollbarWidth: "thin",
              scrollbarColor: `${colors.scrollbar} ${colors.terminalBg}`,
            }}
          >
            {/* CRT Scanlines - green/amber themes only */}
            {isRetroTheme && (
              <div
                className="absolute inset-0 pointer-events-none overflow-hidden"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(0,0,0,0.15) 2px,
                    rgba(0,0,0,0.15) 4px
                  )`,
                }}
                aria-hidden
              />
            )}
            {/* ASCII Banner - shown on load */}
            <div
              className="mb-4 whitespace-pre font-mono text-xs md:text-sm opacity-80"
              style={{ color: colors.textMuted, lineHeight: 1.3 }}
            >
              {ASCII_BANNER}
            </div>
            {/* Startup line */}
            {startupLine && (
              <div
                className="mb-4 font-mono text-sm"
                style={{ color: colors.textMuted }}
              >
                {startupLine}
              </div>
            )}
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
                        className="inline-block animate-pulse"
                        style={{
                          width: useBlockCursor ? "1ch" : "2px",
                          height: "1.2em",
                          marginLeft: useBlockCursor ? "1px" : "4px",
                          backgroundColor: colors.cursor,
                          verticalAlign: "text-bottom",
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
                  width: useBlockCursor ? "1ch" : "2px",
                  height: "1.2em",
                  backgroundColor: colors.cursor,
                  verticalAlign: "text-bottom",
                }}
              ></span>
            )}

            {/* Command history */}
            {commandHistory.map((item: Command, index: number) => (
              <div key={index} className="mt-3">
                <div className="mb-1" style={{ color: colors.text }}>
                  <span style={{ color: colors.textMuted }}>{PROMPT}</span>
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
                  {PROMPT}
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
                  className="inline-block animate-pulse"
                  style={{
                    width: useBlockCursor ? "1ch" : "2px",
                    height: "1.2em",
                    marginLeft: useBlockCursor ? "1px" : "4px",
                    backgroundColor: colors.cursor,
                    verticalAlign: "text-bottom",
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
