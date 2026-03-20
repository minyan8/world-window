const RSS_PROXY = "https://api.rss2json.com/v1/api.json?rss_url=";
const FX_API = "https://api.frankfurter.dev/v1/latest?base=USD&symbols=CNY,CAD";
const GOLD_API = "https://api.gold-api.com/price/XAU";
const BTC_API = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";

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
const marketStatus = document.querySelector("#marketStatus");

const marketTickers = {
  usdCny: document.querySelector("#ticker-usd-cny"),
  usdCad: document.querySelector("#ticker-usd-cad"),
  cadCny: document.querySelector("#ticker-cad-cny"),
  gold: document.querySelector("#ticker-gold"),
  btc: document.querySelector("#ticker-btc"),
};

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

function formatRate(value, digits = 4) {
  return Number(value).toFixed(digits);
}

function formatGold(value) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
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

async function loadMarketBoard() {
  marketStatus.textContent = "Loading market data...";

  const [fxResult, goldResult, btcResult] = await Promise.allSettled([
    fetch(FX_API).then((response) => {
      if (!response.ok) {
        throw new Error("FX request failed");
      }
      return response.json();
    }),
    fetch(GOLD_API, {
      headers: {
        Accept: "application/json",
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Gold request failed");
      }
      return response.json();
    }),
    fetch(BTC_API).then((response) => {
      if (!response.ok) {
        throw new Error("BTC request failed");
      }
      return response.json();
    }),
  ]);

  let successCount = 0;

  if (fxResult.status === "fulfilled" && fxResult.value?.rates) {
    const usdCny = fxResult.value.rates.CNY;
    const usdCad = fxResult.value.rates.CAD;
    const cadCny = usdCny && usdCad ? usdCny / usdCad : null;

    marketTickers.usdCny.textContent = usdCny ? formatRate(usdCny) : "--";
    marketTickers.usdCad.textContent = usdCad ? formatRate(usdCad) : "--";
    marketTickers.cadCny.textContent = cadCny ? formatRate(cadCny) : "--";
    successCount += 1;
  } else {
    marketTickers.usdCny.textContent = "--";
    marketTickers.usdCad.textContent = "--";
    marketTickers.cadCny.textContent = "--";
  }

  if (goldResult.status === "fulfilled") {
    const goldPrice =
      goldResult.value?.price ??
      goldResult.value?.price_gram_24k ??
      goldResult.value?.priceGram24k;
    marketTickers.gold.textContent = goldPrice ? formatGold(goldPrice) : "--";
    if (goldPrice) {
      successCount += 1;
    }
  } else {
    marketTickers.gold.textContent = "--";
  }

  if (btcResult.status === "fulfilled" && btcResult.value?.bitcoin?.usd) {
    marketTickers.btc.textContent = formatGold(btcResult.value.bitcoin.usd);
    successCount += 1;
  } else {
    marketTickers.btc.textContent = "--";
  }

  marketStatus.textContent =
    successCount > 0 ? "Market data live" : "Market data unavailable";
}

function loadTradingViewWidget() {
  const container = document.querySelector("#tradingview-widget");
  if (!container) {
    return;
  }

  container.innerHTML = "";

  const widget = document.createElement("div");
  widget.className = "tradingview-widget-container";
  widget.innerHTML = '<div class="tradingview-widget-container__widget"></div>';
  container.appendChild(widget);

  const script = document.createElement("script");
  script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
  script.async = true;
  script.textContent = JSON.stringify({
    width: "100%",
    height: 420,
    locale: "en",
    colorTheme: "light",
    backgroundColor: "#fffdf8",
    showSymbolLogo: false,
    symbolsGroups: [
      {
        name: "Indexes",
        symbols: [
          { name: "FOREXCOM:SPXUSD", displayName: "S&P 500" },
          { name: "NASDAQ:IXIC", displayName: "Nasdaq" },
          { name: "FOREXCOM:DJI", displayName: "Dow Jones" },
          { name: "HSI:HSI", displayName: "Hang Seng" },
          { name: "SSE:000001", displayName: "Shanghai Composite" },
        ],
      },
    ],
  });
  widget.appendChild(script);
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
  Promise.allSettled([loadNewsBoard(), loadMarketBoard()]).then((results) => {
    if (results[0].status === "rejected") {
      newsStatus.textContent = "Refresh failed";
    }
    if (results[1].status === "rejected") {
      marketStatus.textContent = "Refresh failed";
    }
  });
});

loadScenery();
loadNewsBoard().catch(() => {
  newsStatus.textContent = "Refresh failed";
});
loadMarketBoard().catch(() => {
  marketStatus.textContent = "Refresh failed";
});
loadTradingViewWidget();
