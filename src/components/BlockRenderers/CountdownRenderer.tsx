"use client";
import React, { useEffect, useState } from "react";
import type { CountdownContent } from "@/types/block";

export function CountdownRenderer({
  content,
  className,
}: {
  content: CountdownContent;
  className?: string;
}) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const target = new Date(content.targetDate);
  const diff = target.getTime() - now.getTime();
  const isPast = diff <= 0;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (isPast) {
    return (
      <div className={`text-center ${className ?? ""}`}>
        <p className="font-bold text-lg">{content.label}</p>
        <p className="text-sm opacity-60 mt-1">האירוע הסתיים</p>
      </div>
    );
  }

  return (
    <div className={`text-center ${className ?? ""}`}>
      <p className="font-bold text-lg mb-2">{content.label}</p>
      <div className="flex items-center justify-center gap-3 font-mono text-2xl font-bold tabular-nums" dir="ltr">
        {(content.showDays !== false) && (
          <div className="flex flex-col items-center">
            <span>{days}</span>
            <span className="text-[10px] font-normal opacity-50">ימים</span>
          </div>
        )}
        {(content.showHours !== false) && (
          <>
            <span className="opacity-30">:</span>
            <div className="flex flex-col items-center">
              <span>{pad(hours)}</span>
              <span className="text-[10px] font-normal opacity-50">שעות</span>
            </div>
          </>
        )}
        {(content.showMinutes !== false) && (
          <>
            <span className="opacity-30">:</span>
            <div className="flex flex-col items-center">
              <span>{pad(minutes)}</span>
              <span className="text-[10px] font-normal opacity-50">דקות</span>
            </div>
          </>
        )}
        <span className="opacity-30">:</span>
        <div className="flex flex-col items-center">
          <span>{pad(seconds)}</span>
          <span className="text-[10px] font-normal opacity-50">שניות</span>
        </div>
      </div>
    </div>
  );
}
