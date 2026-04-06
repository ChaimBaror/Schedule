"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getAllKehilot } from "@/services/kehila.service";
import type { Kehila } from "@/types/kehila";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

// ─── Nav items ───────────────────────────────────────────────────────────────

const MAIN_NAV = [
  {
    href: "/",
    label: "לוח זמנים",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    href: "/calendar",
    label: "לוח חודשי עברי",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
];

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  const [kehilot] = useState<Kehila[]>(() => getAllKehilot());
  const [kehilotOpen, setKehilotOpen] = useState(true);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target as Node) || trigger.current.contains(target as Node)) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [sidebarOpen, setSidebarOpen]);

  // close on Escape
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Backdrop overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        ref={sidebar}
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 border-r border-white/5 duration-300 ease-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
        dir="rtl"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setSidebarOpen(false)}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-base leading-tight">Schedule</h1>
              <p className="text-white/30 text-xs leading-tight">ניהול לוח זמנים</p>
            </div>
          </Link>

          {/* Close button (mobile) */}
          <button
            ref={trigger}
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="סגור תפריט"
          >
            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-6 scrollbar-thin">

          {/* Main navigation */}
          <div>
            <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest text-white/25 uppercase">ניווט</p>
            <nav className="space-y-0.5">
              {MAIN_NAV.map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive(href)
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className={`transition-colors ${isActive(href) ? "text-amber-400" : "text-white/40 group-hover:text-white/70"}`}>
                    {icon}
                  </span>
                  <span>{label}</span>
                  {isActive(href) && (
                    <span className="mr-auto w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Kehilot section */}
          {kehilot.length > 0 && (
            <div>
              <button
                onClick={() => setKehilotOpen(!kehilotOpen)}
                className="flex items-center justify-between w-full px-3 mb-2 group"
              >
                <p className="text-[10px] font-semibold tracking-widest text-white/25 uppercase group-hover:text-white/40 transition-colors">
                  קהילות
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  strokeWidth={2} stroke="currentColor"
                  className={`size-3 text-white/25 group-hover:text-white/40 transition-all duration-200 ${kehilotOpen ? "rotate-180" : ""}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {kehilotOpen && (
                <nav className="space-y-0.5">
                  {kehilot.map((k) => {
                    const kehilaPath = `/kehila/${k.slug}`;
                    const adminPath = `/admin/${k.slug}`;
                    const isKehilaActive = pathname === kehilaPath || pathname === adminPath;

                    return (
                      <div key={k.slug} className="group">
                        <div
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                            isKehilaActive
                              ? "bg-white/10 shadow-sm"
                              : "hover:bg-white/5"
                          }`}
                        >
                          {/* Color dot */}
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-white/10"
                            style={{ backgroundColor: k.primaryColor }}
                          />

                          {/* Kehila info + links */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${isKehilaActive ? "text-white" : "text-white/50 group-hover:text-white/80"} transition-colors`}>
                              {k.name}
                            </p>
                            <p className="text-[11px] text-white/25 truncate">{k.city}</p>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={kehilaPath}
                              onClick={() => setSidebarOpen(false)}
                              className="p-1 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors"
                              title="תצוגה ציבורית"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                              </svg>
                            </Link>
                            <Link
                              href={adminPath}
                              onClick={() => setSidebarOpen(false)}
                              className="p-1 rounded-lg text-white/30 hover:text-amber-400 hover:bg-white/10 transition-colors"
                              title="ניהול"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </nav>
              )}
            </div>
          )}

          {/* Profile */}
          <div>
            <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest text-white/25 uppercase">חשבון</p>
            <nav>
              <Link
                href="/profile"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive("/profile")
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className={`transition-colors ${isActive("/profile") ? "text-amber-400" : "text-white/40 group-hover:text-white/70"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </span>
                <span>פרופיל</span>
                {isActive("/profile") && (
                  <span className="mr-auto w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </Link>
            </nav>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-white/40">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/40 text-xs truncate">Schedule v1.0</p>
              <p className="text-white/20 text-[10px]">לוח זמנים חכם</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
