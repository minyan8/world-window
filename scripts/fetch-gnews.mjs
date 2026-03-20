import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const apiKey = process.env.GNEWS_API_KEY;

if (!apiKey) {
  console.error("Missing GNEWS_API_KEY");
  process.exit(1);
}

const now = new Date();
const since = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();
const baseUrl = "https://gnews.io/api/v4";

const sections = {
  world: `${baseUrl}/top-headlines?category=world&lang=en&max=8&apikey=${apiKey}`,
  business: `${baseUrl}/top-headlines?category=business&lang=en&max=8&apikey=${apiKey}`,
  science: `${baseUrl}/top-headlines?category=science&lang=en&max=8&apikey=${apiKey}`,
  ai: `${baseUrl}/search?q=${encodeURIComponent(
    '"artificial intelligence" OR OpenAI OR "large language model" OR AI'
  )}&lang=en&max=8&sortby=publishedAt&from=${encodeURIComponent(since)}&apikey=${apiKey}`,
};

function normalizeArticle(article) {
  return {
    title: article.title || "",
    description: article.description || article.content || "",
    url: article.url || "",
    image: article.image || "",
    publishedAt: article.publishedAt || new Date().toISOString(),
    source: article.source?.name || "",
  };
}

function uniqueByUrl(articles) {
  const seen = new Set();
  return articles.filter((article) => {
    const key = article.url || article.title;
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

async function fetchSection(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GNews request failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  return uniqueByUrl((data.articles || []).map(normalizeArticle));
}

const payload = {
  provider: "gnews",
  fetchedAt: now.toISOString(),
  sections: {},
};

for (const [section, url] of Object.entries(sections)) {
  payload.sections[section] = await fetchSection(url);
}

const outputDir = path.resolve(process.cwd(), "data");
await mkdir(outputDir, { recursive: true });
await writeFile(
  path.join(outputDir, "news.json"),
  `${JSON.stringify(payload, null, 2)}\n`,
  "utf8"
);

console.log("Updated data/news.json from GNews API");
