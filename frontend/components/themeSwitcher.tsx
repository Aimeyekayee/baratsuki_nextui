// app/components/ThemeSwitcher.tsx
"use client";

import { useTheme } from "next-themes";
import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";
import { useEffect, useState } from "react";
import { GeneralStore } from "@/store/general.store";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const shift = GeneralStore((state)=>state.shift)

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button onClick={toggleTheme} aria-label="Toggle Theme">
      {theme === "light" ? <SunFilledIcon /> : <MoonFilledIcon />}
    </button>
  );
}
