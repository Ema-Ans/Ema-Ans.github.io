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

// JOURNAL
async function loadJournal() {
  const res = await fetch('data/journal.json');
  const entries = await res.json();

  const container = document.getElementById('journal-list');
  if (!container) return;

  entries.forEach(entry => {
    const el = document.createElement('div');
    el.className = 'journal';
    el.style.marginBottom = '40px';

    el.innerHTML = `
      <p class="entry-date">${entry.date}</p>
      <h3>${entry.title}</h3>
      <p>${entry.preview}</p>
      <a href="${entry.file}" class="text-link">read →</a>
    `;

    container.appendChild(el);
  });
}

loadJournal();


// POEMS
async function loadPoems() {
  const res = await fetch('data/poems.json');
  const poems = await res.json();

  const container = document.getElementById('poem-list');
  if (!container) return;

  poems.forEach(poem => {
    const el = document.createElement('div');
    el.className = 'journal';
    el.style.marginBottom = '40px';

    el.innerHTML = `
      <p class="entry-date">${poem.date}</p>
      <h3>${poem.title}</h3>
      <a href="${poem.file}" class="text-link">read →</a>
    `;

    container.appendChild(el);
  });
}

loadPoems();