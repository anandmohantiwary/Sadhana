(() => {
  "use strict";

  const galleryGrid = document.querySelector("#gallery-grid");

  function setupMenu() {
    const button = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");
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

    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
  }

  function renderGallery(items) {
    galleryGrid.replaceChildren();
    galleryGrid.setAttribute("aria-busy", "false");

    const photos = items.filter(item => item && typeof item.image === "string" && item.image.trim());
    if (!photos.length) {
      const message = document.createElement("p");
      message.className = "gallery-message";
      message.textContent = "Photographs will appear here soon.";
      galleryGrid.append(message);
      return;
    }

    const projectRoot = new URL("../", document.baseURI);
    photos.forEach(item => {
      const figure = document.createElement("figure");
      figure.className = "gallery-item";

      const image = document.createElement("img");
      image.src = new URL(item.image, projectRoot).href;
      image.alt = item.alt || item.title || "Performance photograph";
      image.loading = "lazy";
      image.decoding = "async";
      figure.append(image);

      if (item.title) {
        const caption = document.createElement("figcaption");
        caption.className = "gallery-caption";
        caption.textContent = item.title;
        figure.append(caption);
      }
      galleryGrid.append(figure);
    });
  }

  async function applyConfig() {
    try {
      const response = await fetch("../data/site-config.json", { cache: "no-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const config = await response.json();

      document.querySelectorAll("[data-brand]").forEach(element => {
        element.textContent = config.brand || "Rythm With Anand";
      });
      document.querySelectorAll("[data-email]").forEach(element => {
        element.textContent = config.email || "";
      });
      document.querySelectorAll("[data-email-link]").forEach(element => {
        element.href = `mailto:${config.email || ""}`;
      });
      document.querySelectorAll("[data-instagram-link]").forEach(element => {
        if (config.instagram) element.href = config.instagram;
      });
      document.querySelectorAll("[data-youtube-link]").forEach(element => {
        if (config.youtube) element.href = config.youtube;
      });
    } catch (error) {
      console.warn("Could not load site configuration.", error);
    }
  }

  async function loadGallery() {
    try {
      const response = await fetch("../data/gallery.json", { cache: "no-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const items = await response.json();
      if (!Array.isArray(items)) throw new TypeError("Gallery data must be a JSON array.");
      renderGallery(items);
    } catch (error) {
      console.error("Could not load the gallery.", error);
      galleryGrid.replaceChildren();
      galleryGrid.setAttribute("aria-busy", "false");
      const message = document.createElement("p");
      message.className = "gallery-message gallery-error";
      message.textContent = "The gallery could not be loaded. Please try again later.";
      galleryGrid.append(message);
    }
  }

  document.querySelectorAll("[data-year]").forEach(element => {
    element.textContent = new Date().getFullYear();
  });
  setupMenu();
  applyConfig();
  loadGallery();
})();
