"use client";
import React, { useRef, useEffect, useState } from "react";

export type TickerSpeed = "slow" | "normal" | "fast";
export type TickerDirection = "rtl" | "ltr";

interface TickerProps {
  /** Text or segments to scroll */
  items: string[];
  /** Separator between items */
  separator?: string;
  /** Scroll speed */
  speed?: TickerSpeed;
  /** Scroll direction */
  direction?: TickerDirection;
  /** Pause on hover */
  pauseOnHover?: boolean;
  /** Custom class for the container */
  className?: string;
  /** Custom class for the text */
  textClassName?: string;
  /** Custom inline style for the container */
  style?: React.CSSProperties;
  /** Custom inline style for the text */
  textStyle?: React.CSSProperties;
}

const SPEED_MAP: Record<TickerSpeed, number> = {
  slow: 80,
  normal: 50,
  fast: 30,
};

export function Ticker({
  items,
  separator = "   ✦   ",
  speed = "normal",
  direction = "rtl",
  pauseOnHover = true,
  className,
  textClassName,
  style,
  textStyle,
}: TickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const fullText = items.join(separator);
  const durationS = (contentWidth / 100) * SPEED_MAP[speed] / 10;

  useEffect(() => {
    if (contentRef.current) {
      setContentWidth(contentRef.current.scrollWidth / 3); // we have 3 copies
    }
  }, [fullText]);

  const translateDir = direction === "rtl" ? 1 : -1;

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className ?? ""}`}
      style={style}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div
        ref={contentRef}
        className="flex whitespace-nowrap"
        style={contentWidth ? {
          animationName: "tickerScroll",
          animationDuration: `${durationS}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationPlayState: isPaused ? "paused" : "running",
          animationDirection: direction === "ltr" ? "reverse" : "normal",
        } : undefined}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`shrink-0 px-8 ${textClassName ?? ""}`}
            style={textStyle}
            aria-hidden={i > 0}
          >
            {fullText}
          </span>
        ))}
      </div>
    </div>
  );
}
