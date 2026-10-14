/* =====================================================================
   Anjali Mobile & Electronics: landing page script
   Plain JavaScript, no libraries.

   Contents
     1. STORE DETAILS  <- edit your shop details here
     2. Store details -> page
     3. Header (mobile menu, scroll shadow)
     4. Light / dark theme toggle
     5. Hero carousel
     6. Product filter
     7. Start-up
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. STORE DETAILS
   Every value marked TODO is a PLACEHOLDER. Replace it with the real
   detail and the whole page updates (header, store section, footer,
   every WhatsApp and call button).
   --------------------------------------------------------------------- */
const STORE = {
  name: 'Anjali Mobile & Electronics',

  // WhatsApp: country code + number, digits only (no +, spaces or dashes)
  whatsappNumber: '910000000000',            // TODO e.g. '919876543210'
  whatsappDisplay: '+91 XXXXX XXXXX',         // TODO how it is shown on the page

  // Phone: used for tap-to-call links
  phoneNumber: '+910000000000',              // TODO e.g. '+919876543210'
  phoneDisplay: '+91 XXXXX XXXXX',            // TODO

  address: '[Shop No.], [Building / Market Name], [Street], [Area], [City] – [PIN Code]', // TODO

  hours: [                                    // TODO
    { days: 'Mon – Sat',         time: '10:00 am – 9:00 pm' },
    { days: 'Sunday',            time: '11:00 am – 7:00 pm' }
  ],
  hoursShort: 'Open 7 days a week',           // TODO short line shown in the top bar

  // Google Maps
  mapsDirectionsUrl: 'https://www.google.com/maps', // TODO paste your shop's Google Maps "Share" link
  mapEmbedUrl: '',                            // Optional: paste the src="" from Google Maps > Share > Embed a map

  // Numbers in the "Why choose us" section
  stats: {                                    // TODO
    years: '10+',
    customers: '25,000+',
    products: '1,000+'
  },

  // Pre-filled WhatsApp messages
  defaultMessage: 'Hi Anjali Mobile, I have a question about your accessories.',
  productMessage: (product) => `Hi Anjali Mobile, I'm interested in the ${product}. Is it available for my phone? My model is: `
};


/* ---------------------------------------------------------------------
   2. Store details -> page
   --------------------------------------------------------------------- */

/** Build a wa.me link with an optional pre-filled message. */
function whatsappLink(message) {
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${STORE.whatsappNumber}${text}`;
}

/** Read a dotted path such as "stats.years" from STORE. */
function readStore(path) {
  return path.split('.').reduce((obj, key) => (obj == null ? undefined : obj[key]), STORE);
}

function applyStoreDetails() {
  // Text: <span data-store="phoneDisplay">
  document.querySelectorAll('[data-store]').forEach((el) => {
    const value = readStore(el.dataset.store);
    if (typeof value === 'string') el.textContent = value;
  });

  // Opening hours lists
  document.querySelectorAll('[data-store-hours]').forEach((list) => {
    list.replaceChildren(...STORE.hours.map(({ days, time }) => {
      const li = document.createElement('li');
      const d = document.createElement('span');
      const t = document.createElement('span');
      d.textContent = days;
      t.textContent = time;
      li.append(d, t);
      return li;
    }));
  });

  // Links
  document.querySelectorAll('[data-link="tel"]').forEach((a) => { a.href = `tel:${STORE.phoneNumber}`; });
  document.querySelectorAll('[data-link="maps"]').forEach((a) => { a.href = STORE.mapsDirectionsUrl; });
  document.querySelectorAll('[data-wa]').forEach((a) => { a.href = whatsappLink(a.dataset.wa || STORE.defaultMessage); });
  document.querySelectorAll('[data-wa-product]').forEach((a) => { a.href = whatsappLink(STORE.productMessage(a.dataset.waProduct)); });

  // Live map (only if an embed URL is set)
  const frame = document.querySelector('[data-map-frame]');
  if (frame && STORE.mapEmbedUrl) {
    const iframe = document.createElement('iframe');
    iframe.src = STORE.mapEmbedUrl;
    iframe.title = `Map showing the location of ${STORE.name}`;
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.allowFullscreen = true;
    frame.replaceChildren(iframe);
  }

  // Footer year
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
}


/* ---------------------------------------------------------------------
   3. Header
   --------------------------------------------------------------------- */
function setupHeader() {
  const topbar = document.querySelector('.topbar');
  const button = document.querySelector('.menu-btn');
  const nav = document.getElementById('site-nav');
  if (!topbar || !button || !nav) return;

  const icon = button.querySelector('use');

  const setOpen = (open) => {
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    icon.setAttribute('href', open ? '#i-close' : '#i-menu');
    nav.classList.toggle('is-open', open);
  };

  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));

  // Close after choosing a link, on Escape, or on a click outside the header
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      button.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('is-open') && !e.target.closest('.topbar')) setOpen(false);
  });
  window.matchMedia('(min-width: 1021px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });

  // Soft shadow once the page scrolls
  const onScroll = () => topbar.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


/* ---------------------------------------------------------------------
   4. Light / dark theme toggle
   Follows the system setting until the visitor presses the button; the
   choice is saved and re-applied by the inline script in <head>.
   --------------------------------------------------------------------- */
function setupThemeToggle() {
  const button = document.querySelector('.theme-btn');
  if (!button) return;

  const root = document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const icon = button.querySelector('use');
  const themeColors = document.querySelectorAll('meta[name="theme-color"]');

  const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : systemDark.matches);

  function render() {
    const dark = isDark();
    icon.setAttribute('href', dark ? '#i-sun' : '#i-moon');
    button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    // Once a theme is chosen, the browser bar colour follows it instead of the system
    if (root.dataset.theme) themeColors.forEach((meta) => { meta.content = dark ? '#141414' : '#FFFFFF'; });
  }

  button.addEventListener('click', () => {
    const theme = isDark() ? 'light' : 'dark';
    root.dataset.theme = theme;
    try { localStorage.setItem('theme', theme); } catch (e) { /* storage blocked: applies for this visit only */ }
    render();
  });
  systemDark.addEventListener('change', render);
  render();
}


/* ---------------------------------------------------------------------
   5. Hero carousel
   - Auto-advances every 4.5 s in an infinite loop (clones at both ends)
   - Keeps scrolling under the mouse; pauses only on keyboard focus,
     while swiping and when the tab is hidden
   - Touch swipe, arrow keys, dots, previous/next buttons
   - prefers-reduced-motion: no autoplay and no sliding animation
   --------------------------------------------------------------------- */
function setupCarousel(root) {
  if (!root) return;

  const INTERVAL = 4500;
  const track = root.querySelector('.carousel-track');
  const viewport = root.querySelector('.carousel-viewport');
  const dotsWrap = root.querySelector('.carousel-dots');
  const prevBtn = root.querySelector('[data-carousel="prev"]');
  const nextBtn = root.querySelector('[data-carousel="next"]');
  const slides = Array.from(track.children);
  const count = slides.length;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (count < 2) {
    root.querySelector('.carousel-controls')?.remove();
    return;
  }

  // Clone the last slide to the front and the first slide to the end
  // so the loop can wrap around seamlessly.
  const makeClone = (slide) => {
    const clone = slide.cloneNode(true);
    clone.removeAttribute('role');
    clone.removeAttribute('aria-roledescription');
    clone.removeAttribute('aria-label');
    clone.setAttribute('aria-hidden', 'true');
    clone.inert = true;
    return clone;
  };
  track.prepend(makeClone(slides[count - 1]));
  track.append(makeClone(slides[0]));

  let position = 1;        // index in the track, including the clones
  let animating = false;
  let safetyTimer = null;
  let autoplayTimer = null;

  // Reasons to pause. Autoplay runs only when all are false.
  let motionPaused = reducedMotion.matches;
  let focusPaused = false;
  let dragPaused = false;

  // Dots
  const dots = slides.map((slide, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot';
    const title = slide.querySelector('.slide-title')?.textContent.trim() || '';
    dot.setAttribute('aria-label', `Slide ${i + 1} of ${count}: ${title}`);
    dot.addEventListener('click', () => goTo(i + 1));
    dotsWrap.append(dot);
    return dot;
  });

  const currentIndex = () => (position - 1 + count) % count;

  /** Move the track. animate=false jumps instantly. */
  function render(animate) {
    if (animate) {
      track.classList.remove('no-anim');
      track.style.transform = `translateX(${-position * 100}%)`;
    } else {
      track.classList.add('no-anim');
      track.style.transform = `translateX(${-position * 100}%)`;
      void track.offsetWidth; // force a reflow so the next move animates again
    }
  }

  /** After landing on a clone, jump to the matching real slide. */
  function settle() {
    animating = false;
    clearTimeout(safetyTimer);
    if (position === 0) { position = count; render(false); }
    else if (position === count + 1) { position = 1; render(false); }
  }

  /** Mark the active slide, hide the others from assistive tech and the tab order. */
  function updateState() {
    const active = currentIndex();
    slides.forEach((slide, i) => {
      const isActive = i === active;
      slide.setAttribute('aria-hidden', String(!isActive));
      slide.inert = !isActive;
    });
    dots.forEach((dot, i) => dot.setAttribute('aria-current', i === active ? 'true' : 'false'));
  }

  function goTo(target) {
    if (animating) return;
    position = target;
    const animate = !reducedMotion.matches;
    render(animate);
    if (animate) {
      animating = true;
      // Fallback in case transitionend never fires (e.g. a hidden tab)
      safetyTimer = setTimeout(settle, 800);
    } else {
      settle();
    }
    updateState();
    restartAutoplay();
  }

  const next = () => goTo(position + 1);
  const prev = () => goTo(position - 1);

  track.addEventListener('transitionend', (e) => {
    if (e.target === track && e.propertyName === 'transform') settle();
  });

  /* Autoplay */
  const shouldPlay = () => !motionPaused && !focusPaused && !dragPaused && !document.hidden;

  function restartAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
    const playing = shouldPlay();
    if (playing) autoplayTimer = setInterval(next, INTERVAL);
    // Announce slide changes only when the user is in control
    track.setAttribute('aria-live', playing ? 'off' : 'polite');
  }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Pause while keyboard focus is inside the carousel
  root.addEventListener('focusin', (e) => {
    if (e.target.matches(':focus-visible')) { focusPaused = true; restartAutoplay(); }
  });
  root.addEventListener('focusout', (e) => {
    if (!root.contains(e.relatedTarget)) { focusPaused = false; restartAutoplay(); }
  });

  // Arrow keys (from the controls; not from a CTA inside a slide, which would lose focus)
  root.addEventListener('keydown', (e) => {
    if (e.target.closest('.slide')) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
  });

  // Pause when the tab is in the background
  document.addEventListener('visibilitychange', restartAutoplay);

  /* Touch swipe (pointer events; mouse uses the buttons) */
  let startX = 0;
  let startY = 0;
  let deltaX = 0;
  let pointerId = null;
  let horizontal = null; // decided after the first few pixels of movement

  viewport.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' || animating) return;
    pointerId = e.pointerId;
    startX = e.clientX;
    startY = e.clientY;
    deltaX = 0;
    horizontal = null;
    dragPaused = true;
    restartAutoplay();
  });

  viewport.addEventListener('pointermove', (e) => {
    if (e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (horizontal === null && Math.abs(dx) + Math.abs(dy) > 8) horizontal = Math.abs(dx) > Math.abs(dy);
    if (!horizontal) return;
    deltaX = dx;
    track.classList.add('no-anim');
    track.style.transform = `translateX(calc(${-position * 100}% + ${deltaX}px))`;
  });

  const endSwipe = (e) => {
    if (e.pointerId !== pointerId) return;
    pointerId = null;
    dragPaused = false;
    const threshold = Math.min(80, viewport.offsetWidth * 0.15);
    if (horizontal && deltaX < -threshold) next();
    else if (horizontal && deltaX > threshold) prev();
    else { render(true); restartAutoplay(); }
  };
  viewport.addEventListener('pointerup', endSwipe);
  viewport.addEventListener('pointercancel', endSwipe);

  // React if the visitor changes their motion setting while the page is open
  reducedMotion.addEventListener('change', (e) => {
    motionPaused = e.matches;
    restartAutoplay();
  });

  // Initial state
  render(false);
  updateState();
  restartAutoplay();
}


/* ---------------------------------------------------------------------
   6. Product filter
   Tabs above the grid, plus category cards and footer links with
   data-filter-link="protection|charging|audio|all".
   --------------------------------------------------------------------- */
function setupProductFilter() {
  const buttons = Array.from(document.querySelectorAll('[data-filter]'));
  const cards = Array.from(document.querySelectorAll('#product-grid [data-category]'));
  const status = document.getElementById('product-status');
  if (!buttons.length || !cards.length) return;

  function applyFilter(filter) {
    let shown = 0;
    cards.forEach((card) => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.hidden = !match;
      if (match) shown += 1;
    });
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
    if (status) status.textContent = `Showing ${shown} product${shown === 1 ? '' : 's'}`;
  }

  buttons.forEach((b) => b.addEventListener('click', () => applyFilter(b.dataset.filter)));
  document.querySelectorAll('[data-filter-link]').forEach((link) => {
    link.addEventListener('click', () => applyFilter(link.dataset.filterLink));
  });
}


/* ---------------------------------------------------------------------
   7. Start-up (the script is loaded with defer, so the DOM is ready)
   --------------------------------------------------------------------- */
applyStoreDetails();
setupHeader();
setupThemeToggle();
setupCarousel(document.getElementById('hero-carousel'));
setupProductFilter();
