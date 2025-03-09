"use client";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import useThemeStore from "@/hooks/useTheme";
import React from "react";

export const ThemeToggle = () => {
  const { theme, toggleTheme, setTheme } = useThemeStore();

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, [setTheme]);

  return (
    <div className="flex items-center justify-end space-x-2 px-[30px] py-[10px]">
      <Switch
        id="airplane-mode"
        checked={theme === "dark"}
        onCheckedChange={() => toggleTheme()}
      />
      <Label htmlFor="airplane-mode">
        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </Label>
    </div>
  );
};
