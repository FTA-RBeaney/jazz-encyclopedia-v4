import { ref } from "vue";

const theme = ref("default"); // or your default theme name

export function useTheme() {
  const setTheme = (newTheme: string) => {
    theme.value = newTheme;
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // On load, restore theme
  if (import.meta.client) {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }

  watch(theme, (val) => {
    if (import.meta.client) {
      document.documentElement.setAttribute("data-theme", val);
      localStorage.setItem("theme", val);
    }
  });

  return { theme, setTheme };
}
