# Rythm With Anand — Home Page

## Structure

```text
rythm-with-anand-home/
├── index.html
├── css/
│   ├── style.css
│   └── home.css
├── js/
│   └── main.js
├── data/
│   ├── site-config.json
│   ├── gallery.json
│   └── videos.json
└── assets/
    └── images/
        ├── profile/
        │   └── TablaProfile.png
        ├── bhajan/
        └── tabla/
```

## Photograph

`TablaProfile.png` is already placed at:

`assets/images/profile/TablaProfile.png`

If moving this project into an existing repository, copy that file into the same relative path. No image regeneration or editing is required.

## Add gallery photographs

Place photographs anywhere under `assets/images/`, then add entries to `data/gallery.json`:

```json
[
  {
    "title": "Event Name",
    "image": "assets/images/gallery/event-01.jpg",
    "alt": "Anand Tiwary performing Tabla at Event Name",
    "type": "Live Performance",
    "year": "2026",
    "description": "Short description."
  }
]
```

The Home page automatically previews up to 8 entries. The full Gallery page can later consume the same data source.

## Add YouTube videos

Only add real URLs:

```json
[
  {
    "title": "Video Title",
    "youtubeUrl": "https://www.youtube.com/watch?v=XXXXXXXX",
    "thumbnail": "",
    "event": "Event Name",
    "year": "2026",
    "category": "Bhajan Jamming"
  }
]
```

If `thumbnail` is blank, the JavaScript can derive a standard YouTube thumbnail from supported YouTube URL formats.

## Change contact/social information

Edit only `data/site-config.json`.

Update:

- `email`
- `instagram`
- `youtube`

Phone/WhatsApp is disabled by default. To use it later, set the relevant values under `phone`.

Also update the canonical URL from `https://USERNAME.github.io/REPOSITORY/` to the final GitHub Pages URL.

## GitHub Pages

1. Create or open the GitHub repository.
2. Copy the contents of this folder into the repository root.
3. Commit and push.
4. In GitHub, open **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**.
6. Select your publishing branch (commonly `main`) and `/ (root)`.
7. Save and wait for GitHub Pages to publish.
8. Replace the canonical/OG URL placeholders in `index.html` and `data/site-config.json` with the actual Pages URL.

All internal links use relative paths so the Home page works under a repository subpath such as:

`https://USERNAME.github.io/REPOSITORY/`

## Future pages

The navigation already points to:

- `pages/about.html`
- `pages/bhajan-jamming.html`
- `pages/tabla.html`
- `pages/services.html`
- `pages/performances.html`
- `pages/gallery.html`
- `pages/contact.html`

Those pages are intentionally not included in this Home-page package.
