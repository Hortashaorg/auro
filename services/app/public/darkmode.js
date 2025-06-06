const getThemePreference = () => {
  if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
    return localStorage.getItem("theme");
  }
  // deno-lint-ignore no-window
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const isDark = getThemePreference() === "dark";
document.documentElement.classList[isDark ? "add" : "remove"]("dark");

if (typeof localStorage !== "undefined") {
  const observer = new MutationObserver(() => {
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
}

document.addEventListener("alpine:init", () => {
  Alpine.data("themeData", () => ({
    isDarkMode: document.documentElement.classList.contains("dark"),

    themeToggle() {
      this.isDarkMode = !this.isDarkMode;
      document.documentElement.classList.toggle("dark", this.isDarkMode);
    },
  }));
});
