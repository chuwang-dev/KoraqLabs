"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = window.localStorage.getItem("koraq-admin-theme");
    if (saved === "dark" || saved === "light") setTheme(saved);
    const handleThemeChange = (event: Event) => {
      const nextTheme = (event as CustomEvent<Theme>).detail;
      if (nextTheme === "dark" || nextTheme === "light") setTheme(nextTheme);
    };
    window.addEventListener("koraq-admin-theme-change", handleThemeChange);
    return () => window.removeEventListener("koraq-admin-theme-change", handleThemeChange);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("koraq-admin-theme", theme);
  }, [theme]);

  return <div className={`admin-portal admin-theme-${theme}`}>{children}</div>;
}

export function AdminThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = window.localStorage.getItem("koraq-admin-theme");
    if (saved === "dark" || saved === "light") setTheme(saved);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    window.localStorage.setItem("koraq-admin-theme", nextTheme);
    window.dispatchEvent(new CustomEvent("koraq-admin-theme-change", { detail: nextTheme }));
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      className="rounded border border-ink-900/15 px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-900/5"
    >
      {theme === "light" ? "Dark mode" : "Light mode"}
    </button>
  );
}