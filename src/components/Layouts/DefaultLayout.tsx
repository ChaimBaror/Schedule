"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { TemplateProvider } from "@/context/TemplateContext";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      contentRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  return (
    <TemplateProvider>
      {/* Page Wrapper Start */}
      <div className="flex overflow-hidden w-full">
        {/* Sidebar – hidden in fullscreen */}
        {!isFullscreen && (
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}

        {/* Content Area Start */}
        <div
          ref={contentRef}
          className={`relative flex flex-1 flex-col overflow-x-hidden h-screen ${
            isFullscreen ? "bg-black overflow-hidden" : "overflow-y-auto"
          }`}
        >
          {/* Header – hidden in fullscreen */}
          {!isFullscreen && (
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          )}

          {/* Fullscreen toggle button */}
          <button
            onClick={toggleFullscreen}
            className={`fixed z-50 bg-gray-700/80 hover:bg-gray-600 text-white text-xs font-medium py-1.5 px-3 rounded-lg shadow-lg transition-all ${
              isFullscreen
                ? "top-3 left-3 opacity-0 hover:opacity-100"
                : "bottom-4 left-4"
            }`}
            title={isFullscreen ? "יציאה ממסך מלא" : "מסך מלא"}
          >
            {isFullscreen ? "✕ יציאה" : "⛶ מסך מלא"}
          </button>

          {/* Main Content */}
          <main className={isFullscreen ? "" : "p-4"}>
            {children}
          </main>
        </div>
        {/* Content Area End */}
      </div>
      {/* Page Wrapper End */}
    </TemplateProvider>
  );
}
