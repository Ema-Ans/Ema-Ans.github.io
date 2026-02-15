document.getElementById("year").textContent = new Date().getFullYear();

const root = document.documentElement;
const btn = document.getElementById("themeToggle");
const saved = localStorage.getItem("theme");
if (saved) root.setAttribute("data-theme", saved);

btn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "light" ? "" : "light";
  if (next) root.setAttribute("data-theme", next);
  else root.removeAttribute("data-theme");
  localStorage.setItem("theme", next || "dark");
});
