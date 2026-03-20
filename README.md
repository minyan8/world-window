# World Window

A static news dashboard with:

- global news
- AI news
- business news
- science news
- a daily scenery image

## Local run

```bash
cd /Users/minyan/Documents/finance_test
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/`.

You can also double-click:

- `/Users/minyan/Documents/finance_test/start_world_window.command`
- `/Users/minyan/Desktop/World Window.command`

## Deploy to GitHub Pages

This project is already suitable for GitHub Pages because it is a plain static site.

### Option 1: Project site

1. Create a GitHub repository, for example `world-window`.
2. Upload these files to the repository root:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `.nojekyll`
3. Push to GitHub.
4. In GitHub, open `Settings` -> `Pages`.
5. Under `Build and deployment`, choose:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - `Folder`: `/ (root)`
6. Save and wait for GitHub Pages to publish.

Your URL will usually be:

`https://YOUR_USERNAME.github.io/world-window/`

### Option 2: User site

If your repository is named `YOUR_USERNAME.github.io`, then the site can be served at:

`https://YOUR_USERNAME.github.io/`

## Important note

This site fetches live news and images from third-party public sources in the browser.
That means GitHub Pages can host the site itself, but the live content still depends on:

- RSS feeds being reachable
- the RSS-to-JSON service responding normally
- image providers being available

If you want a more stable public version later, the next upgrade is to add a small backend or serverless function for the news fetching.
