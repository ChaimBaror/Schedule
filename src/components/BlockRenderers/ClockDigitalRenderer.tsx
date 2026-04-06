"use client";
import React, { useEffect, useState } from "react";
import type { ClockContent } from "@/types/block";

export function ClockDigitalRenderer({
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

  const pad = (n: number) => n.toString().padStart(2, "0");
  const timeStr = content.showSeconds
    ? `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    : `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  return (
    <div className={`flex flex-col items-center ${className ?? ""}`}>
      <span className="font-mono text-3xl font-bold tabular-nums">{timeStr}</span>
      {content.label && <p className="text-xs opacity-70 mt-1">{content.label}</p>}
    </div>
  );
}
