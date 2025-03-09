import { create } from "zustand";

type Props = {
  theme: string;
  toggleTheme: () => void;
  setTheme: (theme: string) => void;
};

const useTheme = create<Props>((set) => ({
  theme: "light",
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      localStorage.setItem("theme", newTheme);
      return { theme: newTheme };
    }),
  setTheme: (theme: string) => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
    set({ theme });
  },
}));

export default useTheme;
