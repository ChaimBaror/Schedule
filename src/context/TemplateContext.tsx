"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import type { TemplateId } from "@/types/kehila";

const STORAGE_KEY = "schedule-template";
const DEFAULT: TemplateId = "classic";

interface TemplateCtx {
  templateId: TemplateId;
  setTemplateId: (id: TemplateId) => void;
}

const Ctx = createContext<TemplateCtx>({ templateId: DEFAULT, setTemplateId: () => {} });

export function TemplateProvider({ children }: { children: React.ReactNode }) {
  const [templateId, setTemplateIdState] = useState<TemplateId>(DEFAULT);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as TemplateId | null;
    if (saved) setTemplateIdState(saved);
  }, []);

  const setTemplateId = (id: TemplateId) => {
    setTemplateIdState(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  return <Ctx.Provider value={{ templateId, setTemplateId }}>{children}</Ctx.Provider>;
}

export const useTemplate = () => useContext(Ctx);
