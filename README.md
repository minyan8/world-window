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

## Official News API Setup

This project now supports an official server-side news pipeline using GNews API.

The frontend will:

1. try to read `data/news.json`
2. use that official API snapshot when available
3. fall back to RSS only if the official data file is missing or empty

To enable the official API flow on GitHub:

1. Create a GNews API key.
2. Open your repository on GitHub.
3. Go to `Settings` -> `Secrets and variables` -> `Actions`.
4. Add a new repository secret named `GNEWS_API_KEY`.
5. In `Actions`, run the workflow named `Update News Data` once.

After that:

- GitHub Actions will refresh `data/news.json` every hour
- the Pages frontend will read that file first
- your API key stays in GitHub Secrets and is not exposed in the browser

## Important note

If the official API file is unavailable, the site still falls back to RSS so the page does not go blank.
