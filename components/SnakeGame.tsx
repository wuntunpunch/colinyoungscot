"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

const COLS = 20;
const ROWS = 14;
const CELL_SIZE = 16;
const INITIAL_SPEED = 150;

type Direction = "up" | "down" | "left" | "right";

interface SnakeGameProps {
  onClose: () => void;
  isMobile: boolean;
  colors: {
    bg: string;
    text: string;
    muted: string;
    border: string;
  };
}

export default function SnakeGame({ onClose, isMobile, colors }: SnakeGameProps) {
  const [snake, setSnake] = useState<[number, number][]>([
    [Math.floor(COLS / 2), Math.floor(ROWS / 2)],
    [Math.floor(COLS / 2) - 1, Math.floor(ROWS / 2)],
    [Math.floor(COLS / 2) - 2, Math.floor(ROWS / 2)],
  ]);
  const [food, setFood] = useState<[number, number]>([10, 7]);
  const [nextDirection, setNextDirection] = useState<Direction>("right");
  const nextDirectionRef = useRef<Direction>("right");
  nextDirectionRef.current = nextDirection;

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const spawnFood = useCallback((snakeBody: [number, number][]) => {
    let newFood: [number, number];
    do {
      newFood = [
        Math.floor(Math.random() * COLS),
        Math.floor(Math.random() * ROWS),
      ];
    } while (
      snakeBody.some(([sx, sy]) => sx === newFood[0] && sy === newFood[1])
    );
    return newFood;
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveSnake = () => {
      const dir = nextDirectionRef.current;

      setSnake((prev) => {
        const head = prev[0];
        let newHead: [number, number];

        switch (dir) {
          case "up":
            newHead = [head[0], head[1] - 1];
            break;
          case "down":
            newHead = [head[0], head[1] + 1];
            break;
          case "left":
            newHead = [head[0] - 1, head[1]];
            break;
          case "right":
          default:
            newHead = [head[0] + 1, head[1]];
            break;
        }

        // Wall collision
        if (
          newHead[0] < 0 ||
          newHead[0] >= COLS ||
          newHead[1] < 0 ||
          newHead[1] >= ROWS
        ) {
          setGameOver(true);
          return prev;
        }

        // Self collision
        if (prev.some(([x, y]) => x === newHead[0] && y === newHead[1])) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Food collision
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setScore((s) => s + 10);
          setFood(spawnFood(newSnake));
          if (speed > 80) setSpeed((s) => Math.max(80, s - 5));
          return newSnake;
        }

        newSnake.pop();
        return newSnake;
      });
    };

    const timer = setInterval(moveSnake, speed);
    return () => clearInterval(timer);
  }, [gameStarted, gameOver, food, speed, spawnFood]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (gameOver) return;

      const keyToDir: Record<string, Direction> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };
      const newDir = keyToDir[e.key];
      if (newDir) {
        e.preventDefault();
        setGameStarted(true);
        setNextDirection((prev) => {
          const opposites: Record<Direction, Direction> = {
            up: "down",
            down: "up",
            left: "right",
            right: "left",
          };
          if (opposites[prev] === newDir) return prev;
          return newDir;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver, onClose]);

  const handleDirectionPress = (dir: Direction) => {
    if (gameOver) return;
    setGameStarted(true);
    setNextDirection((prev) => {
      const opposites: Record<Direction, Direction> = {
        up: "down",
        down: "up",
        left: "right",
        right: "left",
      };
      if (opposites[prev] === dir) return prev;
      return dir;
    });
  };

  const handleRestart = () => {
    setSnake([
      [Math.floor(COLS / 2), Math.floor(ROWS / 2)],
      [Math.floor(COLS / 2) - 1, Math.floor(ROWS / 2)],
      [Math.floor(COLS / 2) - 2, Math.floor(ROWS / 2)],
    ]);
    setFood([10, 7]);
    setNextDirection("right");
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    setSpeed(INITIAL_SPEED);
  };

  const snakeSet = new Set(snake.map(([x, y]) => `${x},${y}`));
  const foodKey = `${food[0]},${food[1]}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="rounded-lg shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: colors.bg,
          border: `2px solid ${colors.border}`,
          maxWidth: COLS * CELL_SIZE + 32,
        }}
      >
        {/* Header */}
        <div
          className="px-4 py-2 flex items-center justify-between"
          style={{
            backgroundColor: colors.border,
            color: colors.text,
          }}
        >
          <span className="font-mono text-sm font-medium">snake</span>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm">Score: {score}</span>
            <button
              onClick={onClose}
              className="p-1 rounded hover:opacity-80 transition-opacity"
              aria-label="Close game"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Game area */}
        <div className="p-4 flex flex-col items-center gap-4">
          <div
            className="rounded border-2 font-mono"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE}px)`,
              backgroundColor: "#0a0a0a",
              borderColor: colors.border,
            }}
          >
            {Array.from({ length: ROWS * COLS }, (_, i) => {
              const x = i % COLS;
              const y = Math.floor(i / COLS);
              const key = `${x},${y}`;
              const isSnake = snakeSet.has(key);
              const isFood = key === foodKey;

              return (
                <div
                  key={key}
                  className="rounded-sm"
                  style={{
                    width: CELL_SIZE - 2,
                    height: CELL_SIZE - 2,
                    margin: 1,
                    backgroundColor: isSnake
                      ? colors.text
                      : isFood
                      ? "#ff4444"
                      : "transparent",
                    borderRadius: isFood ? "50%" : 2,
                  }}
                />
              );
            })}
          </div>

          {gameOver && (
            <div className="text-center">
              <p className="font-mono font-bold mb-2" style={{ color: colors.text }}>
                Game Over! Score: {score}
              </p>
              <button
                onClick={handleRestart}
                className="px-4 py-2 rounded font-mono text-sm"
                style={{
                  backgroundColor: colors.border,
                  color: colors.text,
                }}
              >
                Play again
              </button>
            </div>
          )}

          {!gameStarted && !gameOver && (
            <p className="font-mono text-sm" style={{ color: colors.muted }}>
              {isMobile ? "Tap arrows to start" : "Use arrow keys to start"}
            </p>
          )}

          {/* Mobile D-pad */}
          {isMobile && (
            <div className="flex flex-col items-center gap-1 mt-2">
              <button
                onClick={() => handleDirectionPress("up")}
                className="w-14 h-10 flex items-center justify-center rounded"
                style={{ backgroundColor: colors.border, color: colors.text }}
                aria-label="Up"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
                </svg>
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDirectionPress("left")}
                  className="w-14 h-10 flex items-center justify-center rounded"
                  style={{ backgroundColor: colors.border, color: colors.text }}
                  aria-label="Left"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                  </svg>
                </button>
                <div className="w-14" />
                <button
                  onClick={() => handleDirectionPress("right")}
                  className="w-14 h-10 flex items-center justify-center rounded"
                  style={{ backgroundColor: colors.border, color: colors.text }}
                  aria-label="Right"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => handleDirectionPress("down")}
                className="w-14 h-10 flex items-center justify-center rounded"
                style={{ backgroundColor: colors.border, color: colors.text }}
                aria-label="Down"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                </svg>
              </button>
            </div>
          )}

          <p className="font-mono text-xs" style={{ color: colors.muted }}>
            Esc to close
          </p>
        </div>
      </div>
    </div>
  );
}
