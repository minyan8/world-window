const RSS_PROXY = "https://api.rss2json.com/v1/api.json?rss_url=";
const FX_API = "https://api.frankfurter.dev/v1/latest?base=USD&symbols=CNY,CAD";
const GOLD_API = "https://api.gold-api.com/price/XAU";
const BTC_API = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";
const LANGUAGE_STORAGE_KEY = "world-window-language";

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

const TORONTO_SCENERY_IMAGE = "./assets/toronto-skyline.svg";

const translations = {
  en: {
    pageTitle: "World Window",
    sceneryAlt: "Toronto skyline artwork",
    htmlLang: "en",
    toggleLabel: "中文",
    brandEyebrow: "Daily global brief",
    refreshButton: "Refresh news",
    heroKicker: "See the world in one glance",
    heroTitle: "Latest news, plus a short English verse.",
    heroText:
      "A simple homepage for news and English poetry, designed to feel calm, clear, and easy to return to.",
    updatedLabel: "Updated",
    updatedLoading: "Loading...",
    sourcesLabel: "Sources",
    sourcesValue: "BBC, Reuters, Google News, ScienceDaily",
    sceneryTag: "Toronto view",
    sceneryTitle: "Toronto skyline and waterfront",
    sceneryDescription:
      '"The heavens declare the glory of God; the skies proclaim the work of his hands." Psalm 19:1',
    newsBoardTag: "News board",
    newsBoardTitle: "Headlines by section",
    sectionIntro:
      "I split the news into a few focused lanes so you can check world events and AI updates without everything mixing together.",
    worldTag: "World",
    worldTitle: "Global headlines",
    aiTitle: "Artificial intelligence",
    businessTag: "Business",
    businessTitle: "Markets and economy",
    scienceTag: "Science",
    scienceTitle: "Research and discovery",
    marketsTag: "Markets",
    marketsTitle: "Market Snapshot",
    usdCnyNote: "1 US dollar in Chinese yuan",
    usdCadNote: "1 US dollar in Canadian dollars",
    cadCnyNote: "1 Canadian dollar in Chinese yuan",
    goldLabel: "Gold",
    goldNote: "Spot gold in US dollars per ounce",
    bitcoinLabel: "Bitcoin",
    bitcoinNote: "Bitcoin price in US dollars",
    benchmarksTag: "Benchmarks",
    benchmarksTitle: "Major indexes",
    marketNote:
      "FX uses a public exchange-rate API. Gold and Bitcoin use public market APIs. Major indexes are embedded through a live market widget for broader coverage.",
    loadingSections: "Loading sections...",
    feedsUnavailable: "Feeds unavailable",
    storiesAcross: (stories, sections) => `${stories} stories across ${sections} sections`,
    loadingSection: (label) => `Loading ${label.toLowerCase()} news...`,
    noHeadlines: (label) => `No ${label.toLowerCase()} headlines available right now.`,
    unavailable: "Unavailable",
    storiesCount: (count) => `${count} stories`,
    loadingMarketData: "Loading market data...",
    marketLive: "Market data live",
    marketUnavailable: "Market data unavailable",
    refreshFailed: "Refresh failed",
    readStory: "Read story",
    minAgo: (n) => `${n} min ago`,
    hrAgo: (n) => `${n} hr ago`,
    dayAgo: (n) => `${n} day${n > 1 ? "s" : ""} ago`,
    sectionLabels: {
      world: "World",
      ai: "AI",
      business: "Business",
      science: "Science",
    },
    sourceNames: {
      "BBC World": "BBC World",
      "Reuters World": "Reuters World",
      "AP News": "AP News",
      "Al Jazeera": "Al Jazeera",
      "Google News AI": "Google News AI",
      "Google News LLM": "Google News LLM",
      "Google News OpenAI": "Google News OpenAI",
      "Reuters Business": "Reuters Business",
      "Google News Markets": "Google News Markets",
      "Google News Science": "Google News Science",
      ScienceDaily: "ScienceDaily",
    },
  },
  zh: {
    pageTitle: "世界之窗",
    sceneryAlt: "多伦多天际线插画",
    htmlLang: "zh-CN",
    toggleLabel: "EN",
    brandEyebrow: "每日全球简报",
    refreshButton: "刷新新闻",
    heroKicker: "一眼看世界",
    heroTitle: "最新新闻，加上一段英文诗意文字。",
    heroText: "这是一个更简单的首页：前面是新闻，旁边是一段英文诗歌，整体更安静也更耐看。",
    updatedLabel: "更新时间",
    updatedLoading: "加载中...",
    sourcesLabel: "来源",
    sourcesValue: "BBC、Reuters、Google News、ScienceDaily",
    sceneryTag: "多伦多风景",
    sceneryTitle: "多伦多天际线与湖滨",
    sceneryDescription: '"诸天述说神的荣耀；穹苍传扬他的手段。" 诗篇 19:1',
    newsBoardTag: "新闻看板",
    newsBoardTitle: "分栏头条",
    sectionIntro: "我把新闻拆成几个栏目，这样你可以更快地区分世界新闻、AI、商业和科学。",
    worldTag: "世界",
    worldTitle: "全球头条",
    aiTitle: "人工智能",
    businessTag: "商业",
    businessTitle: "市场与经济",
    scienceTag: "科学",
    scienceTitle: "研究与发现",
    marketsTag: "财经",
    marketsTitle: "市场速览",
    usdCnyNote: "1 美元兑换人民币",
    usdCadNote: "1 美元兑换加元",
    cadCnyNote: "1 加元兑换人民币",
    goldLabel: "黄金",
    goldNote: "现货黄金，美元/盎司",
    bitcoinLabel: "比特币",
    bitcoinNote: "比特币美元价格",
    benchmarksTag: "基准指数",
    benchmarksTitle: "主要指数",
    marketNote: "汇率使用公开外汇接口，黄金和比特币使用公开市场接口。主要指数通过实时行情组件展示。",
    loadingSections: "正在加载栏目...",
    feedsUnavailable: "新闻源暂时不可用",
    storiesAcross: (stories, sections) => `${sections} 个栏目，共 ${stories} 条新闻`,
    loadingSection: (label) => `正在加载${label}新闻...`,
    noHeadlines: (label) => `暂时没有${label}相关新闻。`,
    unavailable: "不可用",
    storiesCount: (count) => `${count} 条`,
    loadingMarketData: "正在加载财经数据...",
    marketLive: "财经数据已更新",
    marketUnavailable: "财经数据暂时不可用",
    refreshFailed: "刷新失败",
    readStory: "查看新闻",
    minAgo: (n) => `${n} 分钟前`,
    hrAgo: (n) => `${n} 小时前`,
    dayAgo: (n) => `${n} 天前`,
    sectionLabels: {
      world: "世界",
      ai: "AI",
      business: "商业",
      science: "科学",
    },
    sourceNames: {
      "BBC World": "BBC 世界",
      "Reuters World": "路透世界",
      "AP News": "美联社",
      "Al Jazeera": "半岛电视台",
      "Google News AI": "Google AI 新闻",
      "Google News LLM": "Google 大模型新闻",
      "Google News OpenAI": "Google OpenAI 新闻",
      "Reuters Business": "路透商业",
      "Google News Markets": "Google 市场新闻",
      "Google News Science": "Google 科学新闻",
      ScienceDaily: "每日科学",
    },
  },
};

const newsStatus = document.querySelector("#newsStatus");
const lastUpdated = document.querySelector("#lastUpdated");
const sceneryImage = document.querySelector("#sceneryImage");
const sceneryTitle = document.querySelector("#sceneryTitle");
const sceneryDescription = document.querySelector("#sceneryDescription");
const refreshButton = document.querySelector("#refreshButton");
const languageToggle = document.querySelector("#languageToggle");
const newsCardTemplate = document.querySelector("#newsCardTemplate");
const marketStatus = document.querySelector("#marketStatus");

const marketTickers = {
  usdCny: document.querySelector("#ticker-usd-cny"),
  usdCad: document.querySelector("#ticker-usd-cad"),
  cadCny: document.querySelector("#ticker-cad-cny"),
  gold: document.querySelector("#ticker-gold"),
  btc: document.querySelector("#ticker-btc"),
};

let currentLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";
let lastUpdatedDate = null;

function t(key) {
  return translations[currentLanguage][key];
}

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
    return t("minAgo")(Math.max(minutes, 1));
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return t("hrAgo")(hours);
  }

  const days = Math.round(hours / 24);
  return t("dayAgo")(days);
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

function setStaticTranslations() {
  document.documentElement.lang = t("htmlLang");
  document.title = t("pageTitle");
  languageToggle.textContent = t("toggleLabel");
  sceneryImage.alt = t("sceneryAlt");

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    const value = t(key);
    if (typeof value === "string") {
      node.textContent = value;
    }
  });
}

function translateSourceName(name) {
  return translations[currentLanguage].sourceNames[name] || name;
}

function renderSection(section, items) {
  const grid = getSectionGrid(section.key);
  grid.innerHTML = "";

  items.forEach((item) => {
    const node = newsCardTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector(".news-source").textContent = translateSourceName(item.source);
    node.querySelector(".news-title").textContent = item.title;
    node.querySelector(".news-snippet").textContent = item.description;
    node.querySelector(".news-time").textContent = relativeTime(item.pubDate);

    const link = node.querySelector(".news-link");
    link.href = item.link;
    link.textContent = t("readStory");

    grid.appendChild(node);
  });
}

function formatRate(value, digits = 4) {
  return Number(value).toFixed(digits);
}

function formatCurrency(value, fractionDigits = 2) {
  return new Intl.NumberFormat(currentLanguage === "zh" ? "zh-CN" : undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
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
  const sectionLabel = translations[currentLanguage].sectionLabels[section.key];

  grid.innerHTML = emptyMarkup(t("loadingSection")(sectionLabel));
  status.textContent = t("loadingSections");

  const results = await Promise.allSettled(section.feeds.map(fetchFeed));
  const stories = results
    .filter((result) => result.status === "fulfilled")
    .flatMap((result) => result.value)
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .slice(0, section.limit);

  const goodFeeds = results.filter((result) => result.status === "fulfilled").length;

  if (!stories.length) {
    grid.innerHTML = emptyMarkup(t("noHeadlines")(sectionLabel));
    status.textContent = t("unavailable");
    return { ok: false, stories: 0 };
  }

  renderSection(section, stories);
  status.textContent = t("storiesCount")(stories.length);
  return { ok: goodFeeds > 0, stories: stories.length };
}

async function loadNewsBoard() {
  newsStatus.textContent = t("loadingSections");

  const results = await Promise.all(NEWS_SECTIONS.map(loadSection));
  const activeSections = results.filter((result) => result.ok).length;
  const totalStories = results.reduce((sum, result) => sum + result.stories, 0);

  if (!totalStories) {
    newsStatus.textContent = t("feedsUnavailable");
    return;
  }

  newsStatus.textContent = t("storiesAcross")(totalStories, activeSections);
  lastUpdatedDate = new Date();
  lastUpdated.textContent = new Intl.DateTimeFormat(currentLanguage === "zh" ? "zh-CN" : undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(lastUpdatedDate);
}

async function loadMarketBoard() {
  marketStatus.textContent = t("loadingMarketData");

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
    marketTickers.gold.textContent = goldPrice ? formatCurrency(goldPrice, goldPrice >= 1000 ? 0 : 2) : "--";
    if (goldPrice) {
      successCount += 1;
    }
  } else {
    marketTickers.gold.textContent = "--";
  }

  if (btcResult.status === "fulfilled" && btcResult.value?.bitcoin?.usd) {
    marketTickers.btc.textContent = formatCurrency(btcResult.value.bitcoin.usd, 0);
    successCount += 1;
  } else {
    marketTickers.btc.textContent = "--";
  }

  marketStatus.textContent = successCount > 0 ? t("marketLive") : t("marketUnavailable");
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
    locale: currentLanguage === "zh" ? "zh_CN" : "en",
    colorTheme: "light",
    backgroundColor: "#fffdf8",
    showSymbolLogo: false,
    symbolsGroups: [
      {
        name: currentLanguage === "zh" ? "指数" : "Indexes",
        symbols: [
          { name: "FOREXCOM:SPXUSD", displayName: "S&P 500" },
          { name: "NASDAQ:IXIC", displayName: currentLanguage === "zh" ? "纳斯达克" : "Nasdaq" },
          { name: "FOREXCOM:DJI", displayName: currentLanguage === "zh" ? "道琼斯" : "Dow Jones" },
          { name: "HSI:HSI", displayName: currentLanguage === "zh" ? "恒生指数" : "Hang Seng" },
          {
            name: "SSE:000001",
            displayName: currentLanguage === "zh" ? "上证综指" : "Shanghai Composite",
          },
        ],
      },
    ],
  });
  widget.appendChild(script);
}

function buildSceneryState() {
  return {
    title: t("sceneryTitle"),
    description: t("sceneryDescription"),
    imageUrl: TORONTO_SCENERY_IMAGE,
  };
}

function loadScenery() {
  const state = buildSceneryState();
  sceneryTitle.textContent = state.title;
  sceneryDescription.textContent = state.description;
  sceneryImage.src = state.imageUrl;
}

sceneryImage.addEventListener("error", () => {
  sceneryImage.src = TORONTO_SCENERY_IMAGE;
  sceneryTitle.textContent = t("sceneryTitle");
  sceneryDescription.textContent = t("sceneryDescription");
});

function applyLanguage(refreshData = false) {
  setStaticTranslations();

  if (lastUpdatedDate) {
    lastUpdated.textContent = new Intl.DateTimeFormat(currentLanguage === "zh" ? "zh-CN" : undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(lastUpdatedDate);
  } else {
    lastUpdated.textContent = t("updatedLoading");
  }

  loadScenery();
  loadTradingViewWidget();

  if (refreshData) {
    loadNewsBoard().catch(() => {
      newsStatus.textContent = t("refreshFailed");
    });
    loadMarketBoard().catch(() => {
      marketStatus.textContent = t("refreshFailed");
    });
  }
}

refreshButton.addEventListener("click", () => {
  Promise.allSettled([loadNewsBoard(), loadMarketBoard()]).then((results) => {
    if (results[0].status === "rejected") {
      newsStatus.textContent = t("refreshFailed");
    }
    if (results[1].status === "rejected") {
      marketStatus.textContent = t("refreshFailed");
    }
  });
});

languageToggle.addEventListener("click", () => {
  currentLanguage = currentLanguage === "en" ? "zh" : "en";
  localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
  applyLanguage(true);
});

applyLanguage(false);
loadNewsBoard().catch(() => {
  newsStatus.textContent = t("refreshFailed");
});
loadMarketBoard().catch(() => {
  marketStatus.textContent = t("refreshFailed");
});
