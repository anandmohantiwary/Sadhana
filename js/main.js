(() => {
  "use strict";

  const CONFIG_URL = "data/site-config.json";
  const GALLERY_URL = "data/gallery.json";
  const VIDEOS_URL = "data/videos.json";

  const qs = (selector, parent = document) => parent.querySelector(selector);
  const qsa = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  async function loadJson(url, fallback) {
    try {
      const response = await fetch(url, { cache: "no-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn(`Could not load ${url}`, error);
      return fallback;
    }
  }

  function applyConfig(config) {
    qsa("[data-brand]").forEach(el => el.textContent = config.brand || "Rythm With Anand");
    qsa("[data-email]").forEach(el => el.textContent = config.email || "");
    qsa("[data-email-link]").forEach(el => {
      el.href = `mailto:${config.email || ""}`;
    });

    qsa("[data-instagram-link]").forEach(el => {
      if (config.instagram) el.href = config.instagram;
    });
    qsa("[data-youtube-link]").forEach(el => {
      if (config.youtube) el.href = config.youtube;
    });

    qsa("[data-year]").forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }

  function renderPerformances(items) {
    const container = qs("#performance-preview");
    if (!container) return;

    if (!items.length) {
      container.innerHTML = `
        <div class="gallery-empty">
          <div>
            <strong>Performance stories are coming here.</strong>
            <span>Add your event photographs and details to <code>data/gallery.json</code>.</span>
          </div>
        </div>`;
      return;
    }

    container.innerHTML = items.slice(0, 3).map(item => `
      <article class="performance-card">
        <div class="card-media">
          ${item.image
            ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt || item.title)}" loading="lazy">`
            : `<div class="placeholder"><span class="placeholder-mark">♪</span></div>`}
        </div>
        <div class="performance-info">
          <div class="meta">${escapeHtml(item.type || item.category || "Performance")} • ${escapeHtml(item.year || "")}</div>
          <h3>${escapeHtml(item.title || "Live Performance")}</h3>
          <p>${escapeHtml(item.description || "")}</p>
        </div>
      </article>
    `).join("");
  }

  function renderVideos(items) {
    const container = qs("#video-preview");
    if (!container) return;

    if (!items.length) {
      container.innerHTML = `
        <div class="video-placeholder">
          <strong>Your performances, on video.</strong>
          <span>Add real YouTube URLs to <code>data/videos.json</code> — no placeholder URLs are used.</span>
        </div>`;
      return;
    }

    container.innerHTML = items.slice(0, 3).map(item => {
      const videoId = getYouTubeId(item.youtubeUrl);
      const thumbnail = item.thumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "");
      const safeUrl = item.youtubeUrl || "#";
      return `
        <article class="video-card">
          <a class="video-thumb" href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Watch ${escapeHtml(item.title || "performance")} on YouTube">
            ${thumbnail ? `<img src="${escapeHtml(thumbnail)}" alt="" loading="lazy">` : ""}
            <span class="play" aria-hidden="true">▶</span>
          </a>
          <div class="video-info">
            <div class="meta">${escapeHtml(item.category || "Performance")} • ${escapeHtml(item.year || "")}</div>
            <h3>${escapeHtml(item.title || "Live Performance")}</h3>
          </div>
        </article>`;
    }).join("");
  }

  function renderGallery(items) {
    const container = qs("#gallery-preview");
    if (!container) return;

    if (!items.length) {
      container.innerHTML = `
        <div class="gallery-empty">
          <div>
            <strong>Moments in music will appear here.</strong>
            <span>Add 6–8 or more photographs to <code>data/gallery.json</code> and place the files under <code>assets/images/</code>.</span>
          </div>
        </div>`;
      return;
    }

    container.innerHTML = items.slice(0, 8).map(item => `
      <a class="gallery-item" href="pages/gallery.html">
        <img src="${escapeHtml(item.image)}"
             alt="${escapeHtml(item.alt || item.title || "Performance photograph")}"
             loading="lazy">
        ${item.title ? `<span class="gallery-caption">${escapeHtml(item.title)}</span>` : ""}
      </a>
    `).join("");
  }

  function getYouTubeId(url = "") {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&?/]+)/i);
    return match ? match[1] : "";
  }

  function escapeHtml(value = "") {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[char]));
  }

  function setupMenu() {
    const button = qs(".menu-toggle");
    const nav = qs(".site-nav");
    if (!button || !nav) return;

    const closeMenu = () => {
      button.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    };

    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });

    qsa(".site-nav a").forEach(link => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
  }

  function setupReveal() {
    const elements = qsa(".reveal");
    if (!("IntersectionObserver" in window)) {
      elements.forEach(el => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    elements.forEach(el => observer.observe(el));
  }

  async function init() {
    setupMenu();

    const [config, gallery, videos] = await Promise.all([
      loadJson(CONFIG_URL, {}),
      loadJson(GALLERY_URL, []),
      loadJson(VIDEOS_URL, [])
    ]);

    applyConfig(config);
    renderPerformances(gallery);
    renderGallery(gallery);
    renderVideos(videos);
    setupReveal();
  }

  init();
})();
