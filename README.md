# Spidey's Little World 🕷️

A mobile-friendly, retro pixel-art Spider-Man virtual pet game made with plain HTML, CSS and JavaScript.

## Features
- Fit, athletic pixel-art Spider-Man character (not chubby!)
- Feed him, let him rest, hang out and compliment him
- Snack, energy and mood stats
- Web coins and a room shop with unlockable decorations
- Web-slinging mini-game: collect coins and dodge pigeons
- Hidden affectionate/funny messages
- Saves progress in browser localStorage
- Responsive layout for mobile and desktop

## Run locally in VS Code
1. Extract the ZIP file.
2. Open the `spidey_pet_game` folder in VS Code.
3. Open `index.html` in a browser.
   - Recommended: install the **Live Server** extension in VS Code.
   - Right-click `index.html` → **Open with Live Server**.

No npm install or build step is required.

## Deploy free with GitHub Pages
1. Create a new GitHub repository, e.g. `spideys-little-world`.
2. Upload `index.html`, `style.css`, and `script.js` to the repository root.
3. Open **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**.
5. Choose branch `main`, folder `/ (root)`, then Save.
6. Wait for the published URL shown in the Pages section.

## Or deploy with Vercel
1. Push the three files to a GitHub repository.
2. Sign in to Vercel and choose **Add New → Project**.
3. Import the repository.
4. Framework preset: **Other**; build command and output directory can be left blank for a static site.
5. Deploy.

## Personalise before gifting
- Change `secretMessages` in `script.js` to add your own inside jokes and messages.
- Change the page title and footer text in `index.html`.
- The game saves data on the same browser/device using `localStorage`. It does not sync progress between devices and it has no login or backend.
- A Google Fonts import is used for typography; if offline, the game falls back to system fonts.

## Controls
- Use the action buttons to feed, rest, play, or compliment Spidey.
- In the mini-game, click/tap the game area or press Space to swing upward.
- Collect gold web coins and avoid pigeons. Each run awards coins, including a small completion bonus.
- Use web coins in the room shop to unlock room themes and decorations.
