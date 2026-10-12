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

      const button = document.createElement("button");
      button.className = "gallery-image-button";
      button.type = "button";
      button.setAttribute("aria-label", `View enlarged image: ${item.title || item.alt || "Performance photograph"}`);

      const image = document.createElement("img");
      image.src = new URL(item.image, projectRoot).href;
      image.alt = item.alt || item.title || "Performance photograph";
      image.loading = "lazy";
      image.decoding = "async";
      button.append(image);
      figure.append(button);

      if (item.title) {
        const caption = document.createElement("figcaption");
        caption.className = "gallery-caption";
        caption.textContent = item.title;
        figure.append(caption);
      }
      galleryGrid.append(figure);
    });
  }

  function setupLightbox() {
    const dialog = document.querySelector("#gallery-lightbox");
    const lightboxImage = dialog.querySelector(".lightbox-image");
    const lightboxCaption = dialog.querySelector(".lightbox-caption");
    const closeButton = dialog.querySelector(".lightbox-close");
    let opener = null;

    galleryGrid.addEventListener("click", event => {
      const button = event.target.closest(".gallery-image-button");
      if (!button) return;

      const image = button.querySelector("img");
      opener = button;
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = button.nextElementSibling
        ? button.nextElementSibling.textContent
        : image.alt;
      dialog.showModal();
      closeButton.focus();
    });

    closeButton.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", event => {
      if (event.target === dialog) dialog.close();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && dialog.open) dialog.close();
    });
    dialog.addEventListener("close", () => {
      lightboxImage.removeAttribute("src");
      lightboxImage.alt = "";
      lightboxCaption.textContent = "";
      if (opener?.isConnected) opener.focus();
      opener = null;
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
  setupLightbox();
  applyConfig();
  loadGallery();
})();
