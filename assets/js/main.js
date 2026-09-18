document.getElementById("year").textContent = new Date().getFullYear();

const root = document.documentElement;
const btn = document.getElementById("themeToggle");
const saved = localStorage.getItem("theme");
if (saved) root.setAttribute("data-theme", saved);

if (btn) {
  btn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "" : "light";
    if (next) root.setAttribute("data-theme", next);
    else root.removeAttribute("data-theme");
    localStorage.setItem("theme", next || "dark");
  });
}

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

// HOMEPAGE SECTION NAVIGATION
const homeNavLinks = Array.from(
  document.querySelectorAll('.home-page .nav a[href^="#"]')
);

if (homeNavLinks.length && 'IntersectionObserver' in window) {
  const homeSections = homeNavLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver(entries => {
    const current = entries.find(entry => entry.isIntersecting);
    if (!current) return;

    homeNavLinks.forEach(link => {
      const isCurrent = link.getAttribute('href') === `#${current.target.id}`;
      if (isCurrent) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, {
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  });

  homeSections.forEach(section => sectionObserver.observe(section));
}
