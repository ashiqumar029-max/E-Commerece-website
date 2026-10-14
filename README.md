# LUMA — Everyday, Elevated

A responsive fashion e-commerce storefront built with plain HTML, CSS, and JavaScript. Designed as a polished portfolio project and suitable for GitHub Pages.

## Features

- Responsive desktop, tablet, and mobile layouts
- Product grid with category filters
- Live product search and sorting
- Shopping bag drawer with quantity controls, remove item, and subtotal
- Newsletter form validation and feedback
- Mobile navigation, toast notifications, keyboard Escape support
- Accessible labels and reduced-motion preference support
- No build tools, package installation, or ZIP extraction required

## Project files

- `index.html` — page structure and content
- `style.css` — styling, responsive layouts, and animations
- `script.js` — product data, filters, sorting, cart, and form interactions

## Run locally

Open `index.html` in a browser. For a local development server, open this folder in VS Code and use the Live Server extension.

## Publish with GitHub Pages

1. Create a new public GitHub repository named `fashion-store`.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root (not inside another nested folder).
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then save.
6. Wait for GitHub Pages to publish and open the URL shown in the Pages section.

## Important demo notes

- Product photography is loaded from Unsplash over the internet, and fonts are loaded from Google Fonts.
- The checkout button is intentionally a demo message. No payment is processed.
- The newsletter form validates the email in the browser but does not save or send it anywhere.
- For a production store, connect a backend/catalog database, secure authentication if needed, and a trusted payment provider. Never store secret keys in frontend JavaScript.

## Customization

Edit the `products` array near the top of `script.js` to change product names, prices, categories, descriptions, and image URLs.
