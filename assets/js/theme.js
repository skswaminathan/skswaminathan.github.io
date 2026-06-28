---
---
(function () {
  const root = document.documentElement;

  function themeSetting() {
    const saved = localStorage.getItem("theme");
    return saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
  }

  function computedTheme(setting) {
    if (setting === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return setting;
  }

  function applyTheme(setting) {
    const activeSetting = setting || themeSetting();
    root.setAttribute("data-theme-setting", activeSetting);
    root.setAttribute("data-theme", computedTheme(activeSetting));
  }

  function cycleTheme() {
    const current = themeSetting();
    const next = current === "system" ? "light" : current === "light" ? "dark" : "system";
    localStorage.setItem("theme", next);
    applyTheme(next);
  }

  function updateProgress() {
    const progress = document.getElementById("progress");
    if (!progress) return;

    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const value = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progress.value = value;
  }

  function updateBackToTop(button) {
    button.classList.toggle("visible", window.scrollY > 300);
  }

  applyTheme();

  document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("light-toggle");
    if (toggle) {
      toggle.addEventListener("click", cycleTheme);
    }

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
      applyTheme();
    });

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    if ({{ site.back_to_top | jsonify }}) {
      const button = document.createElement("button");
      button.id = "back-to-top";
      button.type = "button";
      button.setAttribute("aria-label", "Back to top");
      button.textContent = "^";
      document.body.appendChild(button);
      updateBackToTop(button);
      button.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      window.addEventListener("scroll", function () {
        updateBackToTop(button);
      }, { passive: true });
    }
  });
})();
