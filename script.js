const RSS_PROXY = "https://api.rss2json.com/v1/api.json?rss_url=";

const NEWS_SECTIONS = [
  {
    key: "world",
    label: "World",
    limit: 4,
    feeds: [
      { name: "BBC World", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
      { name: "Reuters World", url: "https://feeds.reuters.com/Reuters/worldNews" },
      { name: "AP News", url: "https://apnews.com/hub/ap-top-news?output=rss" },
      { name: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml" },
    ],
  },
  {
    key: "ai",
    label: "AI",
    limit: 4,
    feeds: [
      {
        name: "Google News AI",
        url: "https://news.google.com/rss/search?q=artificial+intelligence&hl=en-US&gl=US&ceid=US:en",
      },
      {
        name: "Google News LLM",
        url: "https://news.google.com/rss/search?q=large+language+model&hl=en-US&gl=US&ceid=US:en",
      },
      {
        name: "Google News OpenAI",
        url: "https://news.google.com/rss/search?q=OpenAI&hl=en-US&gl=US&ceid=US:en",
      },
    ],
  },
  {
    key: "business",
    label: "Business",
    limit: 4,
    feeds: [
      {
        name: "Reuters Business",
        url: "https://feeds.reuters.com/reuters/businessNews",
      },
      {
        name: "Google News Markets",
        url: "https://news.google.com/rss/search?q=global+markets&hl=en-US&gl=US&ceid=US:en",
      },
    ],
  },
  {
    key: "science",
    label: "Science",
    limit: 4,
    feeds: [
      {
        name: "Google News Science",
        url: "https://news.google.com/rss/headlines/section/topic/SCIENCE?hl=en-US&gl=US&ceid=US:en",
      },
      {
        name: "ScienceDaily",
        url: "https://www.sciencedaily.com/rss/top/science.xml",
      },
    ],
  },
];

const SCENERY_COLLECTION = [
  {
    title: "Sunlit fjords and distant peaks",
    description: "A calm, high-contrast landscape to balance the fast pace of the headlines.",
    query: "fjord,mountains,travel",
  },
  {
    title: "Ocean cliffs with open sky",
    description: "Wide horizons and sea air energy for today’s global snapshot.",
    query: "coastline,ocean,landscape",
  },
  {
    title: "Quiet forest valley",
    description: "A softer scene picked to slow the page down and give it some breathing room.",
    query: "forest,valley,nature",
  },
  {
    title: "Golden desert light",
    description: "Warm terrain, long shadows, and a change of continent for the day.",
    query: "desert,dunes,scenery",
  },
  {
    title: "Lakeside alpine air",
    description: "Cool water and mountain reflections for a fresh reset.",
    query: "lake,alps,landscape",
  },
  {
    title: "Tropical coast at dusk",
    description: "A quieter end-of-day palette from a warmer part of the world.",
    query: "tropical,beach,sunset",
  },
];

const newsStatus = document.querySelector("#newsStatus");
const lastUpdated = document.querySelector("#lastUpdated");
const sceneryImage = document.querySelector("#sceneryImage");
const sceneryTitle = document.querySelector("#sceneryTitle");
const sceneryDescription = document.querySelector("#sceneryDescription");
const refreshButton = document.querySelector("#refreshButton");
const newsCardTemplate = document.querySelector("#newsCardTemplate");

const dateKey = new Date().toISOString().slice(0, 10);

function sanitizeHtml(input) {
  const element = document.createElement("div");
  element.innerHTML = input ?? "";
  return element.textContent?.trim() ?? "";
}

function stripTrailingText(text, limit = 160) {
  if (text.length <= limit) {
    return text;
  }

  return `${text.slice(0, limit).trimEnd()}...`;
}

function relativeTime(timestamp) {
  const delta = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.round(delta / 60000);

  if (minutes < 60) {
    return `${Math.max(minutes, 1)} min ago`;
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `${hours} hr ago`;
  }

  const days = Math.round(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function emptyMarkup(message) {
  return `<div class="empty-state">${message}</div>`;
}

function getSectionGrid(sectionKey) {
  return document.querySelector(`#newsGrid-${sectionKey}`);
}

function getSectionStatus(sectionKey) {
  return document.querySelector(`#status-${sectionKey}`);
}

function renderSection(section, items) {
  const grid = getSectionGrid(section.key);
  grid.innerHTML = "";

  items.forEach((item) => {
    const node = newsCardTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector(".news-source").textContent = item.source;
    node.querySelector(".news-title").textContent = item.title;
    node.querySelector(".news-snippet").textContent = item.description;
    node.querySelector(".news-time").textContent = relativeTime(item.pubDate);
    node.querySelector(".news-link").href = item.link;
    grid.appendChild(node);
  });
}

async function fetchFeed(feed) {
  const response = await fetch(`${RSS_PROXY}${encodeURIComponent(feed.url)}`);
  if (!response.ok) {
    throw new Error(`Feed request failed: ${feed.name}`);
  }

  const data = await response.json();
  if (!Array.isArray(data.items)) {
    throw new Error(`Malformed feed data: ${feed.name}`);
  }

  return data.items.slice(0, 6).map((item) => ({
    source: feed.name,
    title: sanitizeHtml(item.title),
    description: stripTrailingText(
      sanitizeHtml(item.description || item.content || "Open the article for details.")
    ),
    link: item.link,
    pubDate: item.pubDate || new Date().toISOString(),
  }));
}

async function loadSection(section) {
  const grid = getSectionGrid(section.key);
  const status = getSectionStatus(section.key);
  grid.innerHTML = emptyMarkup(`Loading ${section.label.toLowerCase()} news...`);
  status.textContent = "Loading...";

  const results = await Promise.allSettled(section.feeds.map(fetchFeed));
  const stories = results
    .filter((result) => result.status === "fulfilled")
    .flatMap((result) => result.value)
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .slice(0, section.limit);

  const goodFeeds = results.filter((result) => result.status === "fulfilled").length;

  if (!stories.length) {
    grid.innerHTML = emptyMarkup(`No ${section.label.toLowerCase()} headlines available right now.`);
    status.textContent = "Unavailable";
    return { ok: false, stories: 0 };
  }

  renderSection(section, stories);
  status.textContent = `${stories.length} stories`;
  return { ok: goodFeeds > 0, stories: stories.length };
}

async function loadNewsBoard() {
  newsStatus.textContent = "Loading sections...";

  const results = await Promise.all(NEWS_SECTIONS.map(loadSection));
  const activeSections = results.filter((result) => result.ok).length;
  const totalStories = results.reduce((sum, result) => sum + result.stories, 0);

  if (!totalStories) {
    newsStatus.textContent = "Feeds unavailable";
    return;
  }

  newsStatus.textContent = `${totalStories} stories across ${activeSections} sections`;
  lastUpdated.textContent = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());
}

function buildSceneryState() {
  try {
    const cached = localStorage.getItem("world-window-scenery");
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.dateKey === dateKey) {
        return parsed;
      }
    }
  } catch {
    localStorage.removeItem("world-window-scenery");
  }

  const index = Math.floor(Math.abs(hashString(dateKey)) % SCENERY_COLLECTION.length);
  const pick = SCENERY_COLLECTION[index];
  const state = {
    dateKey,
    title: pick.title,
    description: pick.description,
    imageUrl: `https://source.unsplash.com/featured/1600x900/?${encodeURIComponent(
      pick.query
    )}&sig=${index + 1}`,
  };

  try {
    localStorage.setItem("world-window-scenery", JSON.stringify(state));
  } catch {
    // Ignore storage write issues and keep the session working.
  }
  return state;
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function loadScenery() {
  const state = buildSceneryState();
  sceneryTitle.textContent = state.title;
  sceneryDescription.textContent = state.description;
  sceneryImage.src = state.imageUrl;
}

sceneryImage.addEventListener("error", () => {
  sceneryImage.src =
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80";
  sceneryTitle.textContent = "Panoramic reset";
  sceneryDescription.textContent =
    "The live scenic source was unavailable, so this fallback landscape is standing in for today.";
});

refreshButton.addEventListener("click", () => {
  loadNewsBoard().catch(() => {
    newsStatus.textContent = "Refresh failed";
  });
});

loadScenery();
loadNewsBoard().catch(() => {
  newsStatus.textContent = "Refresh failed";
});
