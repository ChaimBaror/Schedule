"use client";
import React, { useState, useEffect, useCallback } from "react";

interface AutoPageColumnsProps {
  /** Column contents to cycle through */
  columns: React.ReactNode[];
  /** Column labels */
  labels?: string[];
  /** Duration each column is displayed (ms) */
  interval?: number;
  /** Transition duration (ms) */
  transitionDuration?: number;
  /** Show dot indicators */
  showDots?: boolean;
  /** Custom dot class */
  dotClassName?: string;
  /** Active dot class */
  activeDotClassName?: string;
  className?: string;
}

export function AutoPageColumns({
  columns,
  labels,
  interval = 8000,
  transitionDuration = 600,
  showDots = true,
  dotClassName,
  activeDotClassName,
  className,
}: AutoPageColumnsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % columns.length);
      setIsTransitioning(false);
    }, transitionDuration / 2);
  }, [columns.length, transitionDuration]);

  useEffect(() => {
    if (isPaused || columns.length <= 1) return;
    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [isPaused, columns.length, interval, goToNext]);

  if (columns.length === 0) return null;
  if (columns.length === 1) return <>{columns[0]}</>;

  return (
    <div
      className={className}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Active label */}
      {labels && labels[activeIndex] && (
        <div className="text-center mb-2 transition-opacity duration-300"
          style={{ opacity: isTransitioning ? 0 : 1 }}>
          {labels[activeIndex]}
        </div>
      )}

      {/* Column content */}
      <div
        className="transition-all"
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? "translateY(8px)" : "translateY(0)",
          transitionDuration: `${transitionDuration / 2}ms`,
        }}
      >
        {columns[activeIndex]}
      </div>

      {/* Dots */}
      {showDots && (
        <div className="flex justify-center gap-2 mt-3">
          {columns.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setActiveIndex(i);
                  setIsTransitioning(false);
                }, transitionDuration / 2);
              }}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? `w-6 h-2 ${activeDotClassName ?? "bg-white/80"}`
                  : `w-2 h-2 ${dotClassName ?? "bg-white/30 hover:bg-white/50"}`
              }`}
              aria-label={labels?.[i] ?? `עמודה ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
