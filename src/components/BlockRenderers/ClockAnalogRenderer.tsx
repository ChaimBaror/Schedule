"use client";
import React, { useEffect, useState } from "react";
import type { ClockContent } from "@/types/block";

export function ClockAnalogRenderer({
  content,
  className,
}: {
  content: ClockContent;
  className?: string;
}) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const hourDeg = hours * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6;
  const secondDeg = seconds * 6;

  const size = 140;
  const cx = size / 2;
  const cy = size / 2;

  const hand = (angle: number, length: number, width: number, color: string) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return (
      <line
        x1={cx}
        y1={cy}
        x2={cx + length * Math.cos(rad)}
        y2={cy + length * Math.sin(rad)}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
    );
  };

  return (
    <div className={`flex flex-col items-center ${className ?? ""}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Face */}
        <circle cx={cx} cy={cy} r={cx - 4} fill="none" stroke="currentColor" strokeWidth={2} opacity={0.3} />
        {/* Hour markers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = ((i * 30 - 90) * Math.PI) / 180;
          const r1 = cx - 8;
          const r2 = cx - 14;
          return (
            <line
              key={i}
              x1={cx + r1 * Math.cos(angle)}
              y1={cy + r1 * Math.sin(angle)}
              x2={cx + r2 * Math.cos(angle)}
              y2={cy + r2 * Math.sin(angle)}
              stroke="currentColor"
              strokeWidth={2}
              opacity={0.5}
            />
          );
        })}
        {/* Hands */}
        {hand(hourDeg, 32, 4, "currentColor")}
        {hand(minuteDeg, 46, 2.5, "currentColor")}
        {content.showSeconds && hand(secondDeg, 50, 1, "#ef4444")}
        <circle cx={cx} cy={cy} r={3} fill="currentColor" />
      </svg>
      {content.label && <p className="text-xs opacity-70 mt-1 text-center">{content.label}</p>}
    </div>
  );
}
