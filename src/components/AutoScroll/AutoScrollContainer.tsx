"use client";
import React, { useRef, useEffect, useState } from "react";

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
  const hoveredRef = useRef(false);
  const animRef = useRef<number>(0);
  const directionRef = useRef<1 | -1>(1);
  const pauseUntilRef = useRef(0);

  // Store latest props in refs so the animation loop always sees current values
  const speedRef = useRef(speed);
  const pauseAtEdgeRef = useRef(pauseAtEdge);
  const modeRef = useRef(mode);
  speedRef.current = speed;
  pauseAtEdgeRef.current = pauseAtEdge;
  modeRef.current = mode;

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

  useEffect(() => {
    if (!needsScroll) return;

    directionRef.current = 1;
    pauseUntilRef.current = performance.now() + pauseAtEdgeRef.current;

    let prevTime = performance.now();

    const step = () => {
      const now = performance.now();
      const dt = (now - prevTime) / 1000;
      prevTime = now;

      if (!outerRef.current || !innerRef.current || hoveredRef.current) {
        animRef.current = requestAnimationFrame(step);
        return;
      }

      if (now < pauseUntilRef.current) {
        animRef.current = requestAnimationFrame(step);
        return;
      }

      const maxScroll = innerRef.current.scrollHeight - outerRef.current.clientHeight;
      const currentScroll = outerRef.current.scrollTop;
      const delta = speedRef.current * dt * directionRef.current;
      let newScroll = currentScroll + delta;

      if (modeRef.current === "bounce") {
        if (newScroll >= maxScroll) {
          newScroll = maxScroll;
          directionRef.current = -1;
          pauseUntilRef.current = now + pauseAtEdgeRef.current;
        } else if (newScroll <= 0) {
          newScroll = 0;
          directionRef.current = 1;
          pauseUntilRef.current = now + pauseAtEdgeRef.current;
        }
      } else {
        if (newScroll >= maxScroll) {
          newScroll = 0;
          directionRef.current = 1;
          pauseUntilRef.current = now + pauseAtEdgeRef.current;
        }
      }

      outerRef.current.scrollTop = newScroll;
      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [needsScroll]);

  return (
    <div
      ref={outerRef}
      className={`overflow-hidden relative ${className ?? ""}`}
      onMouseEnter={() => { if (pauseOnHover) hoveredRef.current = true; }}
      onMouseLeave={() => { hoveredRef.current = false; }}
      style={{ scrollBehavior: "auto" }}
    >
      <div ref={innerRef}>
        {children}
      </div>
      {needsScroll && (
        <>
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-current to-transparent opacity-[0.07]" />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-current to-transparent opacity-[0.07]" />
        </>
      )}
    </div>
  );
}
