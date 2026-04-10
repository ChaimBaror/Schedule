"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";

interface AutoScrollContainerProps {
  children: React.ReactNode;
  /** Speed in pixels per second */
  speed?: number;
  /** Pause duration in ms when reaching top/bottom */
  pauseAtEdge?: number;
  /** Direction: "down" scrolls down then resets, "bounce" scrolls down then back up */
  mode?: "down" | "bounce";
  /** Pause scrolling on hover */
  pauseOnHover?: boolean;
  /** Minimum overflow (px) before scrolling activates */
  minOverflow?: number;
  className?: string;
}

export function AutoScrollContainer({
  children,
  speed = 30,
  pauseAtEdge = 3000,
  mode = "bounce",
  pauseOnHover = true,
  minOverflow = 20,
  className,
}: AutoScrollContainerProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [needsScroll, setNeedsScroll] = useState(false);
  const [hovered, setHovered] = useState(false);
  const animRef = useRef<number>(0);
  const directionRef = useRef<1 | -1>(1); // 1 = down, -1 = up
  const pauseUntilRef = useRef(0);

  // Check if content overflows
  useEffect(() => {
    const check = () => {
      if (!outerRef.current || !innerRef.current) return;
      const overflow = innerRef.current.scrollHeight - outerRef.current.clientHeight;
      setNeedsScroll(overflow > minOverflow);
    };
    check();
    const observer = new ResizeObserver(check);
    if (outerRef.current) observer.observe(outerRef.current);
    if (innerRef.current) observer.observe(innerRef.current);
    return () => observer.disconnect();
  }, [children, minOverflow]);

  const animate = useCallback(
    (prevTime: number) => {
      const now = performance.now();
      const dt = (now - prevTime) / 1000;

      if (!outerRef.current || !innerRef.current || hovered) {
        animRef.current = requestAnimationFrame(() => animate(now));
        return;
      }

      // Check if paused at edge
      if (now < pauseUntilRef.current) {
        animRef.current = requestAnimationFrame(() => animate(now));
        return;
      }

      const maxScroll = innerRef.current.scrollHeight - outerRef.current.clientHeight;
      const currentScroll = outerRef.current.scrollTop;
      const delta = speed * dt * directionRef.current;
      let newScroll = currentScroll + delta;

      if (mode === "bounce") {
        if (newScroll >= maxScroll) {
          newScroll = maxScroll;
          directionRef.current = -1;
          pauseUntilRef.current = now + pauseAtEdge;
        } else if (newScroll <= 0) {
          newScroll = 0;
          directionRef.current = 1;
          pauseUntilRef.current = now + pauseAtEdge;
        }
      } else {
        // "down" mode - scroll down then jump to top
        if (newScroll >= maxScroll) {
          newScroll = maxScroll;
          pauseUntilRef.current = now + pauseAtEdge;
          // After pause, jump to top
          setTimeout(() => {
            if (outerRef.current) {
              outerRef.current.scrollTop = 0;
            }
          }, pauseAtEdge);
        }
      }

      outerRef.current.scrollTop = newScroll;
      animRef.current = requestAnimationFrame(() => animate(now));
    },
    [speed, pauseAtEdge, mode, hovered]
  );

  useEffect(() => {
    if (!needsScroll) return;
    directionRef.current = 1;
    pauseUntilRef.current = performance.now() + pauseAtEdge; // Initial pause before starting
    animRef.current = requestAnimationFrame(() => animate(performance.now()));
    return () => cancelAnimationFrame(animRef.current);
  }, [needsScroll, animate, pauseAtEdge]);

  return (
    <div
      ref={outerRef}
      className={`overflow-hidden ${className ?? ""}`}
      onMouseEnter={() => pauseOnHover && setHovered(true)}
      onMouseLeave={() => pauseOnHover && setHovered(false)}
      style={{ scrollBehavior: "auto" }}
    >
      <div ref={innerRef}>
        {children}
      </div>
      {/* Fade edges when scrolling is active */}
      {needsScroll && (
        <>
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-current to-transparent opacity-[0.07]" />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-current to-transparent opacity-[0.07]" />
        </>
      )}
    </div>
  );
}
