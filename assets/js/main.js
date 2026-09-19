const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// JOURNAL
async function loadJournal() {
  const container = document.getElementById('journal-list');
  if (!container) return;

  const res = await fetch('data/journal.json');
  const entries = await res.json();

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
  const container = document.getElementById('poem-list');
  if (!container) return;

  const res = await fetch('data/poems.json');
  const poems = await res.json();

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

// HOMEPAGE SCANDAL INDEX
const scandalStories = {
  teaching: {
    label: 'Teaching desk',
    status: 'Confirmed',
    headline: 'Sources allege she actually enjoys teaching.',
    body: 'Office hours appear to bring her an alarming amount of joy.',
    footer: 'seen repeatedly near deep-learning slides',
    images: [
      {
        src: 'assets/img/editorial/office-hours-hkust.jpg',
        alt: 'Eman wearing a Carnegie Mellon hoodie while teaching machine learning at HKUST',
        caption: 'photo evidence // teaching ML at HKUST in a CMU hoodie'
      }
    ]
  },
  butterfly: {
    label: 'Hong Kong field note',
    status: 'Unauthorized co-author',
    headline: 'Local butterfly requests immediate co-authorship.',
    body: 'A butterfly joined me for coffee and immediately began behaving like it deserved co-authorship.',
    footer: 'campus wildlife // peer review pending',
    images: [
      {
        src: 'assets/img/editorial/hkust-butterfly-coffee.jpg',
        alt: 'Eman holding a coffee with a butterfly resting on her shoulder at HKUST',
        caption: 'coffee secured // collaborator self-appointed'
      }
    ]
  },
  bamboo: {
    label: 'Cultural incident',
    status: 'Well-intentioned',
    headline: 'Friendship campaign accidentally targets elders.',
    body: 'I arrived in Hong Kong with lucky bamboo and little vases for everyone on my floor, hoping to make friends. Apparently, I had selected a gift traditionally associated with elders.',
    footer: 'filed under: aggressive friendship via houseplant',
    images: [
      {
        src: 'assets/img/editorial/hong-kong-bamboo.jpg',
        alt: 'A glass vase of lucky bamboo held beside a window overlooking the HKUST campus and sea',
        caption: 'arrival evidence // several very hopeful plants'
      }
    ]
  },
  debugging: {
    label: 'Debugging bulletin',
    status: 'Rare event observed',
    headline: 'Code works; giant crabs called to verify.',
    body: 'This is how I react when my code works. The giant crabs were called in as independent witnesses.',
    footer: 'build passed // crustacean verification committee assembled',
    images: [
      {
        src: 'assets/img/editorial/aquarium-code-reaction.jpg',
        alt: 'Eman reacting delightedly in front of a large aquarium',
        caption: 'the face of an unexpectedly successful run'
      },
      {
        src: 'assets/img/editorial/hong-kong-giant-crabs.jpg',
        alt: 'Several enormous live crabs gathered in a market basket',
        caption: 'independent verification committee'
      }
    ]
  },
  'three-mt': {
    label: 'Stage report',
    status: 'Passion observed',
    headline: 'Witnesses report an alarming amount of conviction.',
    body: 'Three minutes proved insufficient to contain the explanation; the microphone remained active afterward.',
    footer: 'HKUST 3MT finalist // 2026',
    images: [
      {
        src: 'assets/img/editorial/three-mt-passion-retouched.jpg',
        alt: 'Eman speaking passionately onstage during the HKUST Three Minute Thesis competition',
        caption: 'three minutes // conviction at unsafe levels'
      },
      {
        src: 'assets/img/editorial/three-mt-qa-wide.jpg',
        alt: 'Eman speaking into a microphone during the HKUST Three Minute Thesis finalist discussion',
        caption: 'after the clock // finalist discussion'
      },
      {
        src: 'assets/img/editorial/three-mt-qa-close.jpg',
        alt: 'Eman continuing the HKUST Three Minute Thesis discussion with a microphone',
        caption: 'microphone still active // explanation continued'
      }
    ]
  },
  running: {
    label: 'Dawn patrol',
    status: 'Suspiciously awake',
    headline: '5:00 a.m. runner reportedly knows every retiree on the route.',
    body: 'She started running before sunrise and somehow became friends with every elderly regular on the route.',
    footer: 'dawn patrol // neighborhood aunties and uncles approve',
    images: [
      {
        type: 'video',
        src: 'assets/video/running-5am.mp4',
        poster: 'assets/img/editorial/running-5am-poster.jpg',
        alt: 'Eman running along a waterfront road in Hong Kong',
        caption: '5:00 a.m. evidence // voice removed for public safety'
      }
    ]
  }
};

const scandalButtons = Array.from(document.querySelectorAll('[data-scandal-key]'));
const scandalPreview = document.getElementById('scandal-hover-preview');
const scandalDialog = document.getElementById('scandal-dialog');
const scandalDialogContent = scandalDialog?.querySelector('.scandal-dialog-content');
const scandalDialogClose = scandalDialog?.querySelector('.scandal-dialog-close');
const canHoverScandals = window.matchMedia('(hover: hover) and (pointer: fine)');
let activeScandalButton = null;

function makeScandalStory(story, previewOnly = false) {
  const article = document.createElement('article');
  article.className = `scandal-story${previewOnly ? ' scandal-story-preview' : ''}`;

  const media = document.createElement('div');
  const visibleImages = previewOnly ? story.images.slice(0, 1) : story.images;
  media.className = `scandal-story-media image-count-${visibleImages.length}`;

  visibleImages.forEach(imageData => {
    const figure = document.createElement('figure');
    const caption = document.createElement('figcaption');
    caption.textContent = imageData.caption;

    if (imageData.type === 'video') {
      const video = document.createElement('video');
      video.src = imageData.src;
      video.poster = imageData.poster;
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.controls = !previewOnly;
      video.setAttribute('aria-label', imageData.alt);
      figure.append(video, caption);
    } else {
      const image = document.createElement('img');
      image.src = imageData.src;
      image.alt = imageData.alt;
      image.loading = previewOnly ? 'eager' : 'lazy';
      figure.append(image, caption);
    }
    media.appendChild(figure);
  });

  if (previewOnly && story.images.length > 1) {
    const more = document.createElement('span');
    more.className = 'scandal-more-evidence';
    more.textContent = `+ ${story.images.length - 1} more piece${story.images.length > 2 ? 's' : ''} of evidence`;
    media.appendChild(more);
  }

  const copy = document.createElement('div');
  copy.className = 'scandal-story-copy';

  const evidenceLabel = document.createElement('p');
  evidenceLabel.className = 'scandal-evidence-label';
  evidenceLabel.textContent = story.label;

  const stamp = document.createElement('p');
  stamp.className = 'scandal-story-stamp';
  const stampLabel = document.createElement('span');
  stampLabel.textContent = '✦ Scandal';
  const stampStatus = document.createElement('strong');
  stampStatus.textContent = story.status;
  stamp.append(stampLabel, stampStatus);

  const headline = document.createElement('blockquote');
  headline.textContent = story.headline;

  const body = document.createElement('p');
  body.className = 'scandal-story-body';
  body.textContent = story.body;

  const footer = document.createElement('small');
  footer.textContent = story.footer;

  copy.append(evidenceLabel, stamp, headline, body, footer);
  article.append(media, copy);
  return article;
}

function clearScandalButtonState() {
  scandalButtons.forEach(button => button.classList.remove('is-active'));
}

function hideScandalPreview() {
  if (!scandalPreview) return;
  scandalPreview.classList.remove('is-visible');
  scandalPreview.setAttribute('aria-hidden', 'true');
  if (!scandalDialog?.open) clearScandalButtonState();
}

function positionScandalPreview(button) {
  if (!scandalPreview) return;
  const buttonRect = button.getBoundingClientRect();
  const previewRect = scandalPreview.getBoundingClientRect();
  const gutter = 22;
  let left = buttonRect.left - previewRect.width - gutter;
  if (left < gutter) left = Math.min(window.innerWidth - previewRect.width - gutter, buttonRect.right + gutter);
  const idealTop = buttonRect.top + (buttonRect.height / 2) - (previewRect.height / 2);
  const top = Math.max(gutter, Math.min(idealTop, window.innerHeight - previewRect.height - gutter));
  scandalPreview.style.left = `${left}px`;
  scandalPreview.style.top = `${top}px`;
}

function showScandalPreview(button) {
  if (!scandalPreview || !canHoverScandals.matches) return;
  const story = scandalStories[button.dataset.scandalKey];
  if (!story) return;

  clearScandalButtonState();
  button.classList.add('is-active');
  scandalPreview.replaceChildren(makeScandalStory(story, true));
  scandalPreview.setAttribute('aria-hidden', 'false');
  scandalPreview.classList.add('is-visible');

  requestAnimationFrame(() => positionScandalPreview(button));
  const previewMedia = scandalPreview.querySelector('img, video');
  if (previewMedia instanceof HTMLImageElement && !previewMedia.complete) {
    previewMedia.addEventListener('load', () => positionScandalPreview(button), { once: true });
  } else if (previewMedia instanceof HTMLVideoElement && previewMedia.readyState < 1) {
    previewMedia.addEventListener('loadedmetadata', () => positionScandalPreview(button), { once: true });
  }
}

function openScandalDialog(button) {
  if (!scandalDialog || !scandalDialogContent) return;
  const story = scandalStories[button.dataset.scandalKey];
  if (!story) return;

  activeScandalButton = button;
  hideScandalPreview();
  clearScandalButtonState();
  button.classList.add('is-active');
  scandalDialogContent.replaceChildren(makeScandalStory(story));
  if (typeof scandalDialog.showModal === 'function') scandalDialog.showModal();
  else scandalDialog.setAttribute('open', '');
  scandalDialogClose?.focus();
}

scandalButtons.forEach(button => {
  button.addEventListener('pointerenter', () => showScandalPreview(button));
  button.addEventListener('pointerleave', hideScandalPreview);
  button.addEventListener('focus', () => showScandalPreview(button));
  button.addEventListener('blur', hideScandalPreview);
  button.addEventListener('click', () => openScandalDialog(button));
});

scandalDialogClose?.addEventListener('click', () => scandalDialog.close());
scandalDialog?.addEventListener('click', event => {
  if (event.target === scandalDialog) scandalDialog.close();
});
scandalDialog?.addEventListener('close', () => {
  clearScandalButtonState();
  activeScandalButton?.focus();
  activeScandalButton = null;
});
window.addEventListener('scroll', hideScandalPreview, { passive: true });
window.addEventListener('resize', hideScandalPreview);
