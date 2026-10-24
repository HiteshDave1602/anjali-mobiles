/* =====================================================================
   Anjali Mobile & Electronics: landing page script
   Plain JavaScript, no libraries.

   Contents
     1. STORE DETAILS  <- edit your shop details here
     2. Store details -> page
     3. Header (mobile menu, scroll shadow)
     4. Light / dark theme toggle
     5. Hero carousel
     6. Products (data, cards, filter)
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
  whatsappNumber: '917575050007',
  whatsappDisplay: '+91 75750 50007',

  // Phone: used for tap-to-call links
  phoneNumber: '+917575050007',
  phoneDisplay: '+91 75750 50007',

  address: '10, Dilar Shopping Centre, Opp: Post Office, Vesma, Navsari, Gujarat 396475',

  hours: [                                    // TODO
    { days: 'Mon – Sat',         time: '10:00 am – 9:00 pm' },
    { days: 'Sunday',            time: '11:00 am – 7:00 pm' }
  ],
  hoursShort: 'Open 7 days a week',           // TODO short line shown in the top bar

  // Google Maps (address search; swap in your shop's Maps "Share" link for an exact pin)
  mapsDirectionsUrl: 'https://www.google.com/maps/search/?api=1&query=10+Dilar+Shopping+Centre+Vesma+Navsari+Gujarat+396475',
  mapEmbedUrl: 'https://www.google.com/maps?q=10+Dilar+Shopping+Centre+Vesma+Navsari+Gujarat+396475&output=embed',

  // Social profiles
  instagramUrl: 'https://www.instagram.com/anjali_mobile_electronic/',
  instagramHandle: '@anjali_mobile_electronic',
  facebookUrl: 'https://www.facebook.com/750781834989761/',

  // Numbers in the "Why choose us" section
  stats: {                                    // TODO
    years: '10+',
    customers: '25,000+',
    products: '1,000+'
  },

  // Pre-filled WhatsApp messages
  defaultMessage: 'Hi Anjali Mobile, I have a question about your accessories.'
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
  document.querySelectorAll('[data-link="instagram"]').forEach((a) => { a.href = STORE.instagramUrl; });
  document.querySelectorAll('[data-link="facebook"]').forEach((a) => { a.href = STORE.facebookUrl; });
  document.querySelectorAll('[data-wa]').forEach((a) => { a.href = whatsappLink(a.dataset.wa || STORE.defaultMessage); });

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
   - Auto-advances every 5 s in an infinite loop (clones at both ends)
   - Pauses under the mouse, on keyboard focus, while swiping and when
     the tab is hidden
   - Touch swipe, arrow keys, dots, previous/next buttons
   - prefers-reduced-motion: no autoplay and no sliding animation
   - Height comes from CSS alone: every slide shares one aspect ratio
     (--hero-ratio in style.css), so nothing here measures or sets it
   --------------------------------------------------------------------- */
function setupCarousel(root) {
  if (!root) return;

  const INTERVAL = 5000;
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
  let hoverPaused = false;
  let dragPaused = false;

  // Dots
  const dots = slides.map((slide, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot';
    // Slides are banner images, so the image's alt text names the slide
    const title = slide.querySelector('.banner-img')?.alt.trim() || '';
    dot.setAttribute('aria-label', `Slide ${i + 1} of ${count}: ${title}`);
    dot.addEventListener('click', () => goTo(i + 1));
    dotsWrap.append(dot);
    return dot;
  });

  const currentIndex = () => (position - 1 + count) % count;

  /** Move the track. animate=false jumps instantly. */
  function render(animate) {
    track.classList.toggle('no-anim', !animate);
    track.style.transform = `translateX(${-position * 100}%)`;
    if (!animate) void track.offsetWidth; // force a reflow so the next move animates again
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
  const shouldPlay = () => !motionPaused && !focusPaused && !hoverPaused && !dragPaused && !document.hidden;

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

  // Pause while a mouse is over the carousel (touch taps don't count, or
  // autoplay would stay paused after the first tap on a phone)
  root.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'mouse') { hoverPaused = true; restartAutoplay(); }
  });
  root.addEventListener('pointerleave', (e) => {
    if (e.pointerType === 'mouse') { hoverPaused = false; restartAutoplay(); }
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

  // Slides 2+ load lazily so the first banner gets the bandwidth. Once the
  // page has finished loading, fetch them too, so they are ready before
  // they slide into view.
  const warmUp = () => root.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
  if (document.readyState === 'complete') warmUp();
  else window.addEventListener('load', warmUp, { once: true });

  // Initial state
  render(false);
  updateState();
  restartAutoplay();
}


/* ---------------------------------------------------------------------
   6. Products ("Popular at our counter")
   Every card is built from PRODUCTS below. To add a product, copy a line
   and give it a new id. Fields:
     id            unique; also the photo's file name (tv-01 -> tv-01.webp)
     name, tag     card title and badge
     tone          badge colour: info | success | primary | neutral
     group         general | major
     category      general: mobiles | chargers | cases | audio
                   major:   tv | fridge | ac | washing
     image         assets/products/<category>/<id>.webp. A .png (or .jpg)
                   with the same name works too. Until the file exists,
                   the card shows the category icon and the product name.
     alt           describes the photo for screen readers
   IMAGES-NEEDED.md (project root) lists the photo for every product.
   --------------------------------------------------------------------- */

/** Chips under each group tab, in order, with the icon for photo-less cards. */
const CATEGORIES = {
  mobiles:  { group: 'general', label: 'Mobiles',           icon: 'i-smartphone' },
  chargers: { group: 'general', label: 'Chargers',          icon: 'i-charger' },
  cases:    { group: 'general', label: 'Phone Cases',       icon: 'i-case' },
  audio:    { group: 'general', label: 'Audio & Wearables', icon: 'i-headphones' },
  tv:       { group: 'major',   label: 'TV',                icon: 'i-tv' },
  fridge:   { group: 'major',   label: 'Fridge',            icon: 'i-fridge' },
  ac:       { group: 'major',   label: 'AC',                icon: 'i-ac' },
  washing:  { group: 'major',   label: 'Washing Machine',   icon: 'i-washer' }
};

const PRODUCTS = [
  // General
  { id: 'mobiles-01', name: 'Smartphones', tag: 'Latest models', tone: 'info', group: 'general', category: 'mobiles',
    image: 'assets/products/mobiles/mobiles-01.webp', alt: 'Red smartphone, back view showing its triple camera' },
  { id: 'chargers-01', name: 'Charger with Cable', tag: 'For iPhone', tone: 'success', group: 'general', category: 'chargers',
    image: 'assets/products/chargers/chargers-01.webp', alt: 'White USB-C wall charger with a coiled white Lightning cable' },
  { id: 'cases-01', name: 'Phone Case', tag: 'Bestseller', tone: 'primary', group: 'general', category: 'cases',
    image: 'assets/products/cases/cases-01.webp', alt: 'Six suede-finish phone cases in a row: grey, navy, green, maroon, black and tan' },
  { id: 'audio-01', name: 'Wireless Earbuds', tag: 'New arrival', tone: 'info', group: 'general', category: 'audio',
    image: 'assets/products/audio/audio-01.webp', alt: 'Black wireless earbuds in their open charging case' },
  { id: 'audio-04', name: 'Bluetooth Speaker', tag: 'Room-filling sound', tone: 'primary', group: 'general', category: 'audio',
    image: 'assets/products/audio/audio-04.webp', alt: 'Grey fabric-covered Bluetooth speaker with a silver base' },

  // Major appliances
  { id: 'tv-01', name: 'LED Smart TV', tag: 'Smart TV', tone: 'info', group: 'major', category: 'tv',
    image: 'assets/products/tv/tv-01.webp', alt: 'Slim LED smart TV on a centre stand, screen showing a mountain lake' },
  { id: 'fridge-01', name: 'Refrigerator', tag: 'Family size', tone: 'primary', group: 'major', category: 'fridge',
    image: 'assets/products/fridge/fridge-01.webp', alt: 'White glass-finish multi-door refrigerator' },
  { id: 'ac-01', name: 'Split AC', tag: 'Summer pick', tone: 'success', group: 'major', category: 'ac',
    image: 'assets/products/ac/ac-01.webp', alt: 'White split air conditioner indoor unit with a temperature display' },
  { id: 'washing-01', name: 'Washing Machine', tag: 'Front load', tone: 'neutral', group: 'major', category: 'washing',
    image: 'assets/products/washing/washing-01.webp', alt: 'White front-load washing machine' }
];

/* Product photos that actually exist. Vite finds them when it builds the
   site (and while `npm run dev` runs: drop a file in and the page
   reloads), and copies them into the build. Only these files are
   requested, so a missing photo never shows up as a 404. If the page is
   served without Vite, this stays null and each card tries the file
   names in turn instead. */
let PRODUCT_IMAGE_FILES = null;
try {
  PRODUCT_IMAGE_FILES = import.meta.glob('/assets/products/*/*.{webp,png,jpg}', { eager: true, query: '?url', import: 'default' });
} catch (e) { /* not built by Vite */ }

/** Photo URLs to try for a product, best format first. */
function productImageUrls(product) {
  const base = product.image.replace(/\.(webp|png|jpe?g)$/i, '');
  const paths = ['webp', 'png', 'jpg'].map((ext) => `${base}.${ext}`);
  if (!PRODUCT_IMAGE_FILES) return paths;
  return paths.map((path) => PRODUCT_IMAGE_FILES[`/${path}`]).filter(Boolean);
}

const escapeHTML = (text) => String(text).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function productCard(product) {
  const category = CATEGORIES[product.category];
  const name = escapeHTML(product.name);
  const li = document.createElement('li');
  li.className = 'product-card';
  li.dataset.group = product.group;
  li.dataset.category = product.category;
  li.innerHTML = `
    <div class="product-media" data-state="loading">
      <div class="product-fallback" aria-hidden="true">
        <svg class="icon"><use href="#${category.icon}"/></svg><span>${name}</span>
      </div>
    </div>
    <div class="product-body">
      <span class="badge b-${product.tone}">${escapeHTML(product.tag)}</span>
      <h3 class="product-name">${name}</h3>
    </div>`;

  // Photo: try each URL until one loads; if none does, keep the icon tile
  const media = li.querySelector('.product-media');
  const urls = productImageUrls(product);
  if (!urls.length) {
    media.dataset.state = 'fallback';
    return li;
  }
  const img = new Image(1200, 1200);
  img.alt = product.alt;
  img.loading = 'lazy';
  img.decoding = 'async';
  let attempt = 0;
  img.addEventListener('load', () => { media.dataset.state = 'image'; });
  img.addEventListener('error', () => {
    if (attempt < urls.length) { img.src = urls[attempt++]; return; }
    img.remove();
    media.dataset.state = 'fallback';
  });
  img.src = urls[attempt++];
  media.append(img);
  return li;
}

/* Group tabs (All | General | Major Appliances) and the chosen group's
   category chips are two ARIA tablists over one panel: arrow keys, Home
   and End move between tabs. Category cards, hero banner buttons and
   footer links use data-filter-link="<category>|general|major|all". */
function setupProducts() {
  const grid = document.getElementById('product-grid');
  const panel = document.getElementById('product-panel');
  const tabList = document.querySelector('#products [role="tablist"]:not(#product-chips)');
  const chipRow = document.getElementById('product-chips');
  const status = document.getElementById('product-status');
  if (!grid || !panel || !tabList || !chipRow) return;

  const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
  const cards = PRODUCTS.map((product) => {
    const card = productCard(product);
    grid.append(card);
    return card;
  });

  const empty = document.createElement('li');
  empty.className = 'product-empty';
  empty.hidden = true;
  empty.innerHTML = `
    <svg class="icon" aria-hidden="true"><use href="#i-grid"/></svg>
    <p>New stock for this category is on its way. Message us and we'll tell you what's in store today.</p>
    <a class="btn btn-tonal btn-sm" href="${escapeHTML(whatsappLink(STORE.defaultMessage))}" target="_blank" rel="noopener">
      <svg class="icon" aria-hidden="true"><use href="#i-whatsapp"/></svg>Ask on WhatsApp
    </a>`;
  grid.append(empty);

  let group = 'all';
  let category = 'all';

  const select = (tab, selected) => {
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  };

  /** One chip per category in the group, plus "All". */
  function renderChips() {
    chipRow.hidden = group === 'all';
    if (group === 'all') { chipRow.replaceChildren(); return; }
    const entries = [['all', 'All'], ...Object.entries(CATEGORIES)
      .filter(([, c]) => c.group === group)
      .map(([key, c]) => [key, c.label])];
    chipRow.replaceChildren(...entries.map(([key, label]) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.setAttribute('role', 'tab');
      chip.id = `chip-${group}-${key}`;
      chip.dataset.filter = key;
      chip.setAttribute('aria-controls', 'product-panel');
      chip.textContent = label;
      return chip;
    }));
  }

  function apply({ announce = true, animate = true } = {}) {
    let shown = 0;
    cards.forEach((card) => {
      const match = (group === 'all' || card.dataset.group === group)
        && (category === 'all' || card.dataset.category === category);
      card.hidden = !match;
      if (match) shown += 1;
    });
    empty.hidden = shown > 0;

    tabs.forEach((tab) => select(tab, tab.dataset.groupFilter === group));
    const chips = Array.from(chipRow.querySelectorAll('[role="tab"]'));
    chips.forEach((chip) => select(chip, chip.dataset.filter === category));
    const activeChip = chips.find((chip) => chip.dataset.filter === category);
    panel.setAttribute('aria-labelledby', [`tab-${group}`, activeChip?.id].filter(Boolean).join(' '));

    if (animate) {
      grid.classList.remove('is-filtering');
      void grid.offsetWidth; // restart the fade-in
      grid.classList.add('is-filtering');
    }
    if (announce && status) status.textContent = `Showing ${shown} product${shown === 1 ? '' : 's'}`;
  }

  function setGroup(value) {
    group = value;
    category = 'all'; // a new tab always starts on its "All" chip
    renderChips();
    apply();
  }

  function setCategory(value) {
    category = value;
    apply();
  }

  tabList.addEventListener('click', (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (tab && tab.dataset.groupFilter !== group) setGroup(tab.dataset.groupFilter);
  });
  chipRow.addEventListener('click', (e) => {
    const chip = e.target.closest('[role="tab"]');
    if (chip && chip.dataset.filter !== category) setCategory(chip.dataset.filter);
  });

  // Arrow keys / Home / End move to a tab and select it
  const onArrowKeys = (list, activate) => (e) => {
    const items = Array.from(list.querySelectorAll('[role="tab"]'));
    const index = items.indexOf(document.activeElement);
    if (index < 0) return;
    const target = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: items.length - 1 }[e.key];
    if (target === undefined) return;
    e.preventDefault();
    const item = items[(target + items.length) % items.length];
    activate(item);
    item.focus();
  };
  tabList.addEventListener('keydown', onArrowKeys(tabList, (tab) => {
    if (tab.dataset.groupFilter !== group) setGroup(tab.dataset.groupFilter);
  }));
  chipRow.addEventListener('keydown', onArrowKeys(chipRow, (chip) => {
    if (chip.dataset.filter !== category) setCategory(chip.dataset.filter);
  }));

  document.querySelectorAll('[data-filter-link]').forEach((link) => {
    link.addEventListener('click', () => {
      const value = link.dataset.filterLink;
      if (CATEGORIES[value]) {
        group = CATEGORIES[value].group;
        category = value;
        renderChips();
        apply();
      } else {
        setGroup(['general', 'major'].includes(value) ? value : 'all');
      }
    });
  });

  renderChips();
  apply({ announce: false, animate: false });
  tuckFloatingButton(grid);
}

/** Flag the floating WhatsApp button while the grid is behind it (CSS then hides it). */
function tuckFloatingButton(grid) {
  const fab = document.querySelector('.wa-fab');
  if (!fab) return;
  let queued = false;
  const update = () => {
    queued = false;
    const fabTop = fab.getBoundingClientRect().top || window.innerHeight - 72;
    const rect = grid.getBoundingClientRect();
    fab.classList.toggle('is-tucked', rect.top < window.innerHeight && rect.bottom > fabTop - 8);
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  new ResizeObserver(queue).observe(grid);
  update();
}


/* ---------------------------------------------------------------------
   7. Start-up (the script is loaded with defer, so the DOM is ready)
   --------------------------------------------------------------------- */
applyStoreDetails();
setupHeader();
setupThemeToggle();
setupCarousel(document.getElementById('hero-carousel'));
setupProducts();
