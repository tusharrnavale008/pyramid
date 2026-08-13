function themeInitScript() {
  try {
    var theme = localStorage.getItem("pyramid-theme") || "light";
    var accent = localStorage.getItem("pyramid-color") || "blue";
    var root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-accent", accent);
  } catch (e) {}
}

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(${themeInitScript.toString()})();`,
      }}
    />
  );
}