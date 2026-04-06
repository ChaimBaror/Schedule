"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { HeaderFullscreen } from "../RequireFullscreen/HeaderFullscreen";
import AppHeaderUser from "../AppHeaderUser";
import { useTemplate } from "@/context/TemplateContext";
import { TEMPLATE_META } from "@/templates/index";
import type { TemplateId } from "@/types/kehila";

// ─── Nav links ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  {
    href: "/",
    label: "לוח זמנים",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    href: "/calendar",
    label: "לוח חודשי",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
];

// ─── Template picker dropdown ─────────────────────────────────────────────────

function TemplatePicker() {
  const { templateId, setTemplateId } = useTemplate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Only show on home page
  if (pathname !== "/") return null;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = TEMPLATE_META[templateId];
  const ids = Object.keys(TEMPLATE_META) as TemplateId[];

  return (
    <div ref={ref} className="relative" dir="rtl">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-sm font-medium
          ${open
            ? "bg-white/20 border-white/30 text-white"
            : "bg-white/10 border-white/15 text-white/70 hover:bg-white/15 hover:text-white hover:border-white/25"
          }`}
        aria-label="בחר עיצוב"
        aria-expanded={open}
      >
        <span className="text-base leading-none">{current.preview}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          strokeWidth={2.5} stroke="currentColor"
          className={`size-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 w-64 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          style={{ background: "rgba(10,10,20,0.97)", backdropFilter: "blur(16px)" }}>

          <div className="px-3 pt-3 pb-1">
            <p className="text-white/40 text-xs font-medium tracking-wider">בחר עיצוב תצוגה</p>
          </div>

          <div className="p-2 grid grid-cols-1 gap-0.5">
            {ids.map((id) => {
              const meta = TEMPLATE_META[id];
              const isActive = id === templateId;
              return (
                <button
                  key={id}
                  onClick={() => { setTemplateId(id); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-right transition-all
                    ${isActive
                      ? "bg-white/15 text-white"
                      : "text-white/60 hover:bg-white/8 hover:text-white"
                    }`}
                >
                  {/* Preview emoji */}
                  <span className="text-xl w-7 text-center shrink-0">{meta.preview}</span>

                  {/* Labels */}
                  <div className="flex-1 min-w-0 text-right">
                    <div className="font-semibold text-sm leading-tight">{meta.label}</div>
                    <div className="text-white/35 text-xs leading-tight mt-0.5 truncate">{meta.description}</div>
                  </div>

                  {/* Active check */}
                  {isActive && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4 text-white shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer hint */}
          <div className="px-3 pb-2.5 pt-1 border-t border-white/5 mt-1">
            <p className="text-white/25 text-xs text-center">הבחירה נשמרת אוטומטית</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex w-full bg-black/95 backdrop-blur-sm border-b border-white/5 drop-shadow-lg">
      <div className="flex flex-grow items-center justify-between px-4 py-2.5 md:px-6 2xl:px-11 gap-2 sm:gap-3">

        {/* Hamburger + logo (mobile) */}
        <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
          <button
            aria-controls="sidebar"
            aria-label="פתח תפריט"
            onClick={(e) => { e.stopPropagation(); props.setSidebarOpen(!props.sidebarOpen); }}
            className="rounded-lg border border-white/20 bg-white/10 p-1.5 hover:bg-white/20 transition-colors"
          >
            <svg className="size-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <Link href="/" className="block flex-shrink-0">
            <Image width={26} height={26} src="/assets/logo.png" alt="לוגו" />
          </Link>
        </div>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-1 flex-1 justify-center lg:justify-start" dir="rtl">
          {NAV_LINKS.map(({ href, label, icon }) => {
            const isActive = pathname === href;
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive ? "bg-white/20 text-white" : "text-white/55 hover:text-white hover:bg-white/10"}`}
              >
                {icon}
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side: template picker + fullscreen + user */}
        <div className="flex items-center gap-2">
          <TemplatePicker />
          <div className="bg-red-500 rounded">
            <HeaderFullscreen />
          </div>
          <AppHeaderUser />
        </div>

      </div>
    </header>
  );
};

export default Header;
