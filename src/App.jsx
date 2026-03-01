import { useState, useEffect, useCallback, useRef, useMemo } from "react";

const SOURCES = [
  { id: "tzgs", name: "通知公示", short: "校区通知", url: "https://www.bnuzh.edu.cn/tzgs/index.htm", base: "https://www.bnuzh.edu.cn", color: "#0066FF", tone: 40 },
  { id: "jwb", name: "教务部", short: "教务", url: "https://jwb.bnuzh.edu.cn/tzgg/index.htm", base: "https://jwb.bnuzh.edu.cn", color: "#00C853", tone: 40 },
  { id: "sjjx", name: "实践教学", short: "实践", url: "https://jwb.bnuzh.edu.cn/sjjx/index.htm", base: "https://jwb.bnuzh.edu.cn/sjjx", color: "#FF9800", tone: 40 },
  { id: "youth", name: "共青团委员会", short: "团委", url: "https://youth.bnuzh.edu.cn/tzgg/index.htm", base: "https://youth.bnuzh.edu.cn", color: "#FF6D00", tone: 40 },
  { id: "ht", name: "会同书院", short: "书院", url: "https://ht.bnuzh.edu.cn/tzgg/index.htm", base: "https://ht.bnuzh.edu.cn", color: "#AA00FF", tone: 40 },
  { id: "io", name: "国际交流与合作办公室", short: "国际处", url: "https://io.bnuzh.edu.cn/xxgg/index.htm", base: "https://io.bnuzh.edu.cn", color: "#FF1744", tone: 40 },
  { id: "hqb", name: "后勤办公室", short: "后勤", url: "https://hqb.bnuzh.edu.cn/xwgg/tzgg/index.htm", base: "https://hqb.bnuzh.edu.cn", color: "#5E35B1", tone: 40 },
  { id: "kyb", name: "科研办公室", short: "科研", url: "https://kyb.bnuzh.edu.cn/tzgg/kyhd/index.htm", base: "https://kyb.bnuzh.edu.cn", color: "#FF4081", tone: 40 },
  { id: "nic", name: "信息化办公室", short: "信息化", url: "https://nic.bnuzh.edu.cn/tzgg/index.htm", base: "https://nic.bnuzh.edu.cn", color: "#00BCD4", tone: 40 },
];

/* ═══════ Material You Color System ═══════ */
const generateTonalPalette = (hex) => {
  // Generate Material You tonal palette from seed color
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  const adjust = (factor) => {
    const nr = Math.min(255, Math.round(r + (255 - r) * factor));
    const ng = Math.min(255, Math.round(g + (255 - g) * factor));
    const nb = Math.min(255, Math.round(b + (255 - b) * factor));
    return `rgb(${nr}, ${ng}, ${nb})`;
  };
  
  return {
    0: '#000000',
    10: adjust(0.1),
    20: adjust(0.2),
    30: adjust(0.3),
    40: hex,
    50: adjust(0.5),
    60: adjust(0.6),
    70: adjust(0.7),
    80: adjust(0.8),
    90: adjust(0.9),
    95: adjust(0.95),
    99: adjust(0.99),
    100: '#FFFFFF',
  };
};

const PRIMARY_SEED = '#6750A4';
const SECONDARY_SEED = '#625B71';
const TERTIARY_SEED = '#7D5260';

const THEME = {
  primary: generateTonalPalette(PRIMARY_SEED),
  secondary: generateTonalPalette(SECONDARY_SEED),
  tertiary: generateTonalPalette(TERTIARY_SEED),
  neutral: {
    0: '#000000',
    10: '#1C1B1F',
    20: '#313033',
    30: '#484649',
    40: '#605D62',
    50: '#787579',
    60: '#939094',
    70: '#AEAAAE',
    80: '#C9C5CA',
    90: '#E6E1E5',
    95: '#F4EFF4',
    99: '#FFFBFE',
    100: '#FFFFFF',
  },
  surface: {
    base: '#FFFBFE',
    elevated: '#F4EFF4',
    overlay: 'rgba(28, 27, 31, 0.08)',
  },
  elevation: {
    0: '0 0 0 0 rgba(0,0,0,0)',
    1: '0 1px 2px 0 rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)',
    2: '0 1px 2px 0 rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15)',
    3: '0 1px 3px 0 rgba(0,0,0,0.3), 0 4px 8px 3px rgba(0,0,0,0.15)',
    4: '0 2px 3px 0 rgba(0,0,0,0.3), 0 6px 10px 4px rgba(0,0,0,0.15)',
  },
  shapes: {
    none: '0px',
    extraSmall: '4px',
    small: '8px',
    medium: '12px',
    large: '16px',
    extraLarge: '28px',
    full: '50%',
  },
  motion: {
    duration: {
      short1: '50ms',
      short2: '100ms',
      short3: '150ms',
      short4: '200ms',
      medium1: '250ms',
      medium2: '300ms',
      medium3: '350ms',
      medium4: '400ms',
      long1: '450ms',
      long2: '500ms',
    },
    easing: {
      standard: 'cubic-bezier(0.2, 0.0, 0.0, 1.0)',
      decelerate: 'cubic-bezier(0.0, 0.0, 0.0, 1.0)',
      accelerate: 'cubic-bezier(0.3, 0.0, 1.0, 1.0)',
      emphasized: 'cubic-bezier(0.2, 0.0, 0.0, 1.0)',
    },
  },
};

/* ═══════ Utility Functions ═══════ */
function resolveUrl(href, pageUrl, baseOrigin) {
  if (!href) return pageUrl;
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href.startsWith("//")) return "https:" + href;
  if (href.startsWith("/")) return baseOrigin + href;
  const dir = pageUrl.substring(0, pageUrl.lastIndexOf("/") + 1);
  let resolved = dir, h = href;
  while (h.startsWith("../")) {
    resolved = resolved.substring(0, resolved.slice(0, -1).lastIndexOf("/") + 1);
    h = h.substring(3);
  }
  if (h.startsWith("./")) h = h.substring(2);
  return resolved + h;
}

const DATE_RE = /(\d{4}[-/.]\d{1,2}[-/.]\d{1,2})/;
function extractDate(text) {
  const m = text.match(DATE_RE);
  return m ? m[1].replace(/[/.]/g, "-") : null;
}

async function decodeHtml(arrayBuffer, sourceId) {
  // 优先尝试 UTF-8 解码
  try {
    const htmlUtf8 = new TextDecoder("utf-8").decode(arrayBuffer);
    // 检查是否有明显的乱码特征（UTF-8字节被错误解码为GBK时产生的特殊字符）
    const garbledPattern = /[銆愰€氭姤琛ㄦ壃锛�]/;
    const hasGarbledChars = garbledPattern.test(htmlUtf8);
    
    // 如果 UTF-8 解码结果没有乱码特征，则使用 UTF-8
    if (!hasGarbledChars) {
      return htmlUtf8;
    }
  } catch {}
  
  // 回退到 GBK
  try {
    return new TextDecoder("gbk").decode(arrayBuffer);
  } catch {
    // 最后尝试 UTF-8
    return new TextDecoder("utf-8").decode(arrayBuffer);
  }
}

const SOURCE_SELECTORS = {
  tzgs: { listSelector: ".bnuh-list20 li, .bnuh-list21 li", titleFrom: "a", dateFrom: "span" },
  jwb: { listSelector: "li.line", titleFrom: "a", dateFrom: "span.text-muted, .fr.text-muted", useTitleAttr: true },
  sjjx: { listSelector: ".article-list .boxlist li", titleFrom: "a span", dateFrom: ".fr.text-muted" },
  youth: { listSelector: "li.item", titleFrom: ".title", dateFrom: "a", dateRegex: /(\d{4}\/\d{2}\/\d{2})/, useTitleAttr: true },
  ht: { listSelector: ".article-list li", titleFrom: "a .title", dateFrom: "a", dateRegex: /(\d{4}\/\d{2}\/\d{2})/ },
  io: { listSelector: "li", titleFrom: ".title", dateFrom: ".time", useTitleAttr: true },
  hqb: { listSelector: ".common-article-list li", titleFrom: ".title", dateFrom: ".common-list-date", useTitleAttr: true },
  kyb: { listSelector: ".article-list li", titleFrom: "a .title", dateFrom: "a", dateRegex: /(\d{4}\/\d{2}\/\d{2})/ },
  nic: { listSelector: ".BNUlist01 li", titleFrom: ".listTitle", dateFrom: ".listDate", useTitleAttr: true },
};

function parseNotifications(html, source) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const results = [];
  const seen = new Set();

  function addItem(title, href, dateText) {
    title = (title || "").trim();
    if (!title || title.length < 4 || title.length > 200) return;
    const navPatterns = /^(首页|上一页|下一页|末页|更多|more|\d+|>>|<<|\.{3}|学校首页|珠海校区首页|数字京师|教师邮箱|师大云盘|学生邮箱|首页|机构设置)$/i;
    if (navPatterns.test(title)) return;
    if (!href || href === "#" || href.startsWith("javascript:")) href = null;
    const url = href ? resolveUrl(href, source.url, source.base) : source.url;
    const date = dateText ? extractDate(dateText) : null;
    const key = title + "|" + url;
    if (seen.has(key)) return;
    seen.add(key);
    results.push({ title, date, url, sourceId: source.id });
  }

  const config = SOURCE_SELECTORS[source.id] || {};
  const listSelector = config.listSelector || "li";
  
  const items = doc.querySelectorAll(listSelector);
  for (const item of items) {
    let titleEl, dateText, href;
    
    if (config.titleFrom) {
      const el = item.querySelector(config.titleFrom);
      titleEl = el;
      const anchor = el?.closest("a") || item.querySelector("a");
      href = anchor?.getAttribute("href");
    } else {
      const a = item.querySelector("a");
      if (a) {
        titleEl = a;
        href = a.getAttribute("href");
      }
    }
    
    if (!titleEl) continue;
    
    let title;
    const anchorEl = titleEl.closest?.("a") || item.querySelector("a");
    if (config.useTitleAttr && anchorEl?.getAttribute("title")) {
      title = anchorEl.getAttribute("title");
    } else {
      title = titleEl.getAttribute("title") || titleEl.textContent;
    }
    
    if (config.dateFrom) {
      const dateEl = item.querySelector(config.dateFrom);
      if (config.dateExtract && dateEl) {
        dateText = config.dateExtract(dateEl);
      } else {
        dateText = dateEl?.textContent || item.textContent;
      }
    } else {
      dateText = item.textContent;
    }
    
    if (config.dateRegex && dateText) {
      const match = dateText.match(config.dateRegex);
      if (match) dateText = match[1];
    }
    
    addItem(title, href, dateText);
  }

  if (results.length < 3) {
    for (const li of doc.querySelectorAll("li")) {
      const a = li.querySelector("a");
      if (!a) continue;
      const title = a.getAttribute("title") || a.textContent;
      addItem(title, a.getAttribute("href"), li.textContent);
    }
  }

  if (results.length < 3) {
    for (const row of doc.querySelectorAll("tr")) {
      const a = row.querySelector("a");
      if (!a) continue;
      addItem(a.getAttribute("title") || a.textContent, a.getAttribute("href"), row.textContent);
    }
  }

  return results.slice(0, 30);
}

// 代理配置：本地开发用第三方，生产环境建议用自建（Vercel/Netlify Functions）
const PROXIES = [
  // 生产环境自建代理（如果你部署到 Vercel，取消注释下面这行）
  // (u) => `/api/proxy?url=${encodeURIComponent(u)}`,
  
  // 第三方代理（免费，小规模使用足够）
  (u) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
  (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
];

async function fetchSource(source) {
  for (const mkProxy of PROXIES) {
    try {
      const resp = await fetch(mkProxy(source.url), { signal: AbortSignal.timeout(15000) });
      if (!resp.ok) continue;
      const buf = await resp.arrayBuffer();
      const html = await decodeHtml(buf, source.id);
      const items = parseNotifications(html, source);
      if (items.length > 0) return items;
    } catch (e) {
      console.warn(`Proxy failed for ${source.id}:`, e.message);
    }
  }
  return [];
}

/* ═══════ UI Components ═══════ */

function TopAppBar({ lastRefresh, refreshing, autoRefresh, onAutoRefreshToggle, onRefresh, themeMode, onThemeToggle }) {
  const themeTitles = { system: '跟随系统 — 点击切换到浅色', light: '浅色模式 — 点击切换到深色', dark: '深色模式 — 点击切换为跟随系统' };
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-top">
          <h1 className="header-title">BNUZ 通知</h1>
          <div className="header-actions">
            <button
              className="icon-btn"
              onClick={onThemeToggle}
              title={themeTitles[themeMode]}
            >
              {themeMode === 'system' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <path d="M8 21h8M12 17v4"/>
                </svg>
              ) : themeMode === 'dark' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
              )}
            </button>
            <button
              className={`icon-btn ${autoRefresh ? "icon-btn-active" : ""}`}
              onClick={onAutoRefreshToggle}
              title={autoRefresh ? "自动刷新开启中" : "自动刷新已关闭"}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
              </svg>
            </button>
            <button
              className="icon-btn"
              onClick={onRefresh}
              disabled={refreshing}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={refreshing ? "spin" : ""}>
                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="header-sub">
          <span>北京师范大学珠海校区</span>
          {refreshing ? (
            <>
              <span className="dot-sep">·</span>
              <span className="status-loading"><span className="pulse-dot"></span>正在更新</span>
            </>
          ) : lastRefresh ? (
            <>
              <span className="dot-sep">·</span>
              <span>更新于 {lastRefresh.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}</span>
              {autoRefresh && <><span className="dot-sep">·</span><span>自动刷新</span></>}
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function SourceChips({ sources, activeFilter, onFilterChange, notifications }) {
  const allCount = Object.values(notifications).flat().length;

  return (
    <div className="chips-bar">
      <div className="chips-scroll">
        <button
          className={`chip ${activeFilter === "all" ? "chip-active" : ""}`}
          onClick={() => onFilterChange("all")}
        >
          <span>全部</span>
          {allCount > 0 && <span className="chip-count">{allCount}</span>}
        </button>

        {sources.map(source => {
          const count = notifications[source.id]?.length || 0;
          const isActive = activeFilter === source.id;

          return (
            <button
              key={source.id}
              className={`chip ${isActive ? "chip-active" : ""}`}
              style={isActive ? {
                background: source.color,
                color: '#fff',
                borderColor: source.color
              } : {
                borderColor: `${source.color}40`,
                color: source.color
              }}
              onClick={() => onFilterChange(isActive ? "all" : source.id)}
            >
              <span className="chip-dot" style={{ background: isActive ? '#fff' : source.color }}></span>
              <span>{source.short}</span>
              {count > 0 && (
                <span className="chip-count" style={{
                  background: isActive ? 'rgba(255,255,255,0.25)' : `${source.color}18`,
                  color: isActive ? '#fff' : source.color
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SourceGrid({ sources, status }) {
  return (
    <div className="source-grid">
      {sources.map(source => {
        const s = status[source.id];
        const isLoading = s === "loading";
        const isError = s === "error";
        const count = typeof s === "number" ? s : 0;

        return (
          <div key={source.id} className="source-card">
            <div className="source-bar" style={{
              background: isError ? '#ef4444' : isLoading ? 'var(--border-default)' : count > 0 ? source.color : 'var(--border-subtle)'
            }}></div>
            <span className="source-name">{source.short}</span>
            <span className="source-count" style={{ color: count > 0 ? source.color : 'var(--text-tertiary)' }}>
              {isLoading ? "···" : isError ? "×" : count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function NotificationCard({ item, source, index }) {
  return (
    <a
      href={item.url || source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="notif-card"
      style={{ animationDelay: `${Math.min(index, 20) * 0.03}s` }}
    >
      <div className="notif-accent" style={{ background: source.color }}></div>
      <div className="notif-body">
        <div className="notif-meta">
          <span className="notif-source" style={{ color: source.color }}>{source.short}</span>
          {item.date && (
            <>
              <span className="dot-sep">·</span>
              <time className="notif-date">{item.date}</time>
            </>
          )}
        </div>
        <h3 className="notif-title">{item.title}</h3>
      </div>
      <div className="notif-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </div>
    </a>
  );
}

function LoadingCard({ index }) {
  return (
    <div className="notif-card skeleton" style={{ animationDelay: `${index * 0.05}s` }}>
      <div className="notif-accent skeleton-bar"></div>
      <div className="notif-body">
        <div className="notif-meta">
          <div className="skel skel-chip"></div>
          <div className="skel skel-date"></div>
        </div>
        <div className="skel skel-title"></div>
        <div className="skel skel-title skel-short"></div>
      </div>
    </div>
  );
}

function EmptyState({ onRetry }) {
  return (
    <div className="empty-state">
      <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="4"/>
        <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
      </svg>
      <p className="empty-title">暂无通知</p>
      <p className="empty-desc">数据源暂时不可用或站点结构发生变化</p>
      <button className="ghost-btn" onClick={onRetry}>重新加载</button>
    </div>
  );
}

/* ═══════ Main App ═══════ */

export default function BNUZFeed() {
  const [notifications, setNotifications] = useState({});
  const [sourceStatus, setSourceStatus] = useState({});
  const [activeFilter, setActiveFilter] = useState("all");
  const [lastRefresh, setLastRefresh] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const timerRef = useRef(null);

  // themeMode: 'system' | 'light' | 'dark'
  const getInitialMode = () => {
    const saved = localStorage.getItem('bnuz-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'system';
  };
  const [themeMode, setThemeMode] = useState(getInitialMode);
  const [systemDark, setSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Resolved theme: what actually gets applied to the page
  const theme = themeMode === 'system' ? (systemDark ? 'dark' : 'light') : themeMode;

  // Listen for OS color scheme changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handle = (e) => setSystemDark(e.matches);
    mq.addEventListener('change', handle);
    return () => mq.removeEventListener('change', handle);
  }, []);

  // Apply resolved theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
  }, [theme]);

  // Persist mode preference
  useEffect(() => {
    if (themeMode === 'system') {
      localStorage.removeItem('bnuz-theme');
    } else {
      localStorage.setItem('bnuz-theme', themeMode);
    }
  }, [themeMode]);

  // Cycle: system → light → dark → system
  const toggleTheme = useCallback(() => {
    document.documentElement.classList.add('theme-transitioning');
    setThemeMode(prev => prev === 'system' ? 'light' : prev === 'light' ? 'dark' : 'system');
    setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 350);
  }, []);

  const fetchAll = useCallback(async (silent = false) => {
    if (!silent) setInitialLoad(true);
    setRefreshing(true);
    const initStatus = {};
    SOURCES.forEach(s => { initStatus[s.id] = "loading"; });
    setSourceStatus(initStatus);

    const promises = SOURCES.map(async (src) => {
      try {
        const items = await fetchSource(src);
        setNotifications(prev => ({ ...prev, [src.id]: items }));
        setSourceStatus(prev => ({ ...prev, [src.id]: items.length }));
      } catch {
        setSourceStatus(prev => ({ ...prev, [src.id]: "error" }));
      }
    });
    await Promise.all(promises);
    setLastRefresh(new Date());
    setRefreshing(false);
    setInitialLoad(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    if (autoRefresh) timerRef.current = setInterval(() => fetchAll(true), 5 * 60 * 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [autoRefresh, fetchAll]);

  const allItems = Object.values(notifications).flat();
  const filtered = activeFilter === "all" ? allItems : allItems.filter(it => it.sourceId === activeFilter);
  const sorted = [...filtered].sort((a, b) => {
    if (a.date && b.date) return b.date.localeCompare(a.date);
    if (a.date) return -1;
    if (b.date) return 1;
    return 0;
  });

  return (
    <div className="app">
      <style>{`
        /* ═══════ Design Tokens ═══════ */
        :root {
          --bg-base: #09090b;
          --bg-card: #111113;
          --bg-elevated: #18181b;
          --bg-hover: #1f1f23;
          --bg-active: #27272a;

          --border-subtle: #1f1f23;
          --border-default: #27272a;
          --border-strong: #3f3f46;

          --text-primary: #fafafa;
          --text-secondary: #a1a1aa;
          --text-tertiary: #71717a;
          --text-muted: #52525b;

          --chip-count-bg: rgba(255,255,255,0.1);

          --radius-sm: 6px;
          --radius-md: 8px;
          --radius-lg: 12px;
          --radius-xl: 16px;

          --transition-fast: 150ms ease;
          --transition-base: 200ms ease;
        }

        /* ═══════ Light Theme ═══════ */
        [data-theme="light"] {
          --bg-base: #fafafa;
          --bg-card: #ffffff;
          --bg-elevated: #f4f4f5;
          --bg-hover: #e4e4e7;
          --bg-active: #d4d4d8;

          --border-subtle: #e4e4e7;
          --border-default: #d4d4d8;
          --border-strong: #a1a1aa;

          --text-primary: #18181b;
          --text-secondary: #3f3f46;
          --text-tertiary: #71717a;
          --text-muted: #a1a1aa;

          --chip-count-bg: rgba(0,0,0,0.06);
        }

        html.theme-transitioning,
        html.theme-transitioning *,
        html.theme-transitioning *::before,
        html.theme-transitioning *::after {
          transition: background-color 0.3s ease, color 0.3s ease,
                      border-color 0.3s ease !important;
        }

        /* ═══════ Reset & Base ═══════ */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: var(--bg-base);
          color: var(--text-primary);
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* ═══════ Header ═══════ */
        .header {
          background: var(--bg-elevated);
          border-bottom: 1px solid var(--border-subtle);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-inner {
          max-width: 840px;
          margin: 0 auto;
          padding: 16px;
        }

        @media (min-width: 600px) {
          .header-inner { padding: 20px 24px; }
        }

        .header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-title {
          font-size: 22px;
          font-weight: 600;
          line-height: 30px;
          color: var(--text-primary);
          letter-spacing: -0.3px;
        }

        .header-actions {
          display: flex;
          gap: 4px;
        }

        .header-sub {
          margin-top: 6px;
          font-size: 13px;
          line-height: 20px;
          color: var(--text-tertiary);
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0;
        }

        .dot-sep {
          margin: 0 6px;
          color: var(--text-muted);
        }

        .status-loading {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--text-secondary);
          animation: pulse 1.5s ease-in-out infinite;
        }

        /* ═══════ Icon Buttons ═══════ */
        .icon-btn {
          width: 36px;
          height: 36px;
          border: 1px solid var(--border-default);
          background: transparent;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .icon-btn:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
          border-color: var(--border-strong);
        }

        .icon-btn:active {
          background: var(--bg-active);
        }

        .icon-btn:disabled {
          opacity: 0.4;
          cursor: default;
        }

        .icon-btn-active {
          background: var(--bg-active);
          color: var(--text-primary);
          border-color: var(--border-strong);
        }

        .icon-btn svg {
          width: 18px;
          height: 18px;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.75); }
        }

        /* ═══════ Source Grid ═══════ */
        .source-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 6px;
          padding: 12px 16px;
          max-width: 840px;
          margin: 0 auto;
          width: 100%;
        }

        @media (min-width: 600px) {
          .source-grid {
            grid-template-columns: repeat(9, 1fr);
            gap: 8px;
            padding: 16px 24px;
          }
        }

        .source-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 10px 4px 8px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          position: relative;
          overflow: hidden;
          transition: border-color var(--transition-fast);
        }

        .source-card:hover {
          border-color: var(--border-default);
        }

        .source-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
        }

        .source-name {
          font-size: 11px;
          font-weight: 500;
          color: var(--text-tertiary);
          line-height: 16px;
        }

        .source-count {
          font-size: 18px;
          font-weight: 600;
          line-height: 24px;
        }

        /* ═══════ Chips ═══════ */
        .chips-bar {
          border-bottom: 1px solid var(--border-subtle);
          padding: 10px 0;
        }

        .chips-scroll {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding: 2px 16px;
          scrollbar-width: none;
          -ms-overflow-style: none;
          max-width: 840px;
          margin: 0 auto;
        }

        .chips-scroll::-webkit-scrollbar {
          display: none;
        }

        @media (min-width: 600px) {
          .chips-scroll {
            padding: 2px 24px;
            flex-wrap: wrap;
          }
        }

        .chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border: 1px solid var(--border-default);
          background: transparent;
          border-radius: var(--radius-xl);
          cursor: pointer;
          transition: all var(--transition-fast);
          white-space: nowrap;
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          line-height: 20px;
        }

        .chip:hover {
          background: var(--bg-hover);
          border-color: var(--border-strong);
        }

        .chip-active {
          background: var(--text-primary);
          color: var(--bg-base);
          border-color: var(--text-primary);
        }

        .chip-active:hover {
          opacity: 0.9;
        }

        .chip-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .chip-count {
          padding: 1px 7px;
          border-radius: var(--radius-sm);
          font-size: 11px;
          font-weight: 600;
          background: var(--chip-count-bg);
          color: var(--text-secondary);
        }

        /* ═══════ Notifications ═══════ */
        .notif-list {
          max-width: 840px;
          margin: 0 auto;
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
        }

        @media (min-width: 600px) {
          .notif-list {
            padding: 16px 24px;
            gap: 8px;
          }
        }

        .notif-card {
          display: flex;
          align-items: stretch;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          text-decoration: none;
          color: inherit;
          overflow: hidden;
          transition: background var(--transition-fast), border-color var(--transition-fast);
          animation: enter-card 0.3s ease both;
          opacity: 0;
        }

        @keyframes enter-card {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .notif-card:hover {
          background: var(--bg-hover);
          border-color: var(--border-default);
        }

        .notif-accent {
          width: 3px;
          flex-shrink: 0;
        }

        .notif-body {
          flex: 1;
          min-width: 0;
          padding: 12px 12px 12px 14px;
        }

        .notif-meta {
          display: flex;
          align-items: center;
          gap: 0;
          margin-bottom: 4px;
          font-size: 13px;
          line-height: 20px;
        }

        .notif-source {
          font-weight: 600;
        }

        .notif-date {
          color: var(--text-tertiary);
          font-variant-numeric: tabular-nums;
        }

        .notif-title {
          font-size: 15px;
          font-weight: 400;
          line-height: 22px;
          color: var(--text-primary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .notif-arrow {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          padding: 0 12px;
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }

        .notif-arrow svg {
          width: 16px;
          height: 16px;
          transition: transform var(--transition-fast);
        }

        .notif-card:hover .notif-arrow {
          color: var(--text-tertiary);
        }

        .notif-card:hover .notif-arrow svg {
          transform: translateX(3px);
        }

        /* ═══════ Skeleton ═══════ */
        .skeleton {
          pointer-events: none;
        }

        .skeleton-bar {
          background: var(--bg-hover) !important;
        }

        .skel {
          border-radius: 4px;
          background: linear-gradient(90deg, var(--bg-hover) 25%, var(--bg-active) 50%, var(--bg-hover) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .skel-chip {
          width: 52px;
          height: 16px;
        }

        .skel-date {
          width: 72px;
          height: 16px;
          animation-delay: 0.1s;
        }

        .skel-title {
          height: 18px;
          margin-top: 8px;
          width: 100%;
        }

        .skel-short {
          width: 65%;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ═══════ Empty State ═══════ */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 64px 24px;
          text-align: center;
          animation: fade-in 0.4s ease;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .empty-icon {
          width: 56px;
          height: 56px;
          color: var(--text-muted);
          margin-bottom: 20px;
        }

        .empty-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .empty-desc {
          font-size: 13px;
          color: var(--text-tertiary);
          margin-bottom: 20px;
          max-width: 260px;
        }

        .ghost-btn {
          padding: 8px 20px;
          border: 1px solid var(--border-default);
          background: transparent;
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .ghost-btn:hover {
          background: var(--bg-hover);
          border-color: var(--border-strong);
          color: var(--text-primary);
        }

        .ghost-btn:active {
          background: var(--bg-active);
        }

        /* ═══════ Footer ═══════ */
        .app-footer {
          margin-top: auto;
          padding: 20px 16px;
          text-align: center;
          border-top: 1px solid var(--border-subtle);
        }

        .app-footer p {
          font-size: 12px;
          color: var(--text-muted);
          letter-spacing: 0.3px;
        }
      `}</style>

      <TopAppBar
        lastRefresh={lastRefresh}
        refreshing={refreshing}
        autoRefresh={autoRefresh}
        onAutoRefreshToggle={() => setAutoRefresh(!autoRefresh)}
        onRefresh={() => fetchAll(false)}
        themeMode={themeMode}
        onThemeToggle={toggleTheme}
      />

      <SourceGrid sources={SOURCES} status={sourceStatus} />

      <SourceChips
        sources={SOURCES}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        notifications={notifications}
      />

      <main style={{ flex: 1 }}>
        <div className="notif-list">
          {initialLoad && sorted.length === 0 ? (
            [0, 1, 2, 3, 4, 5].map(i => <LoadingCard key={i} index={i} />)
          ) : sorted.length === 0 ? (
            <EmptyState onRetry={() => fetchAll(false)} />
          ) : (
            sorted.map((item, idx) => {
              const src = SOURCES.find(s => s.id === item.sourceId);
              return <NotificationCard key={`${item.sourceId}-${idx}`} item={item} source={src} index={idx} />;
            })
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>数据直接来自各站点 HTML · 纯前端解析</p>
      </footer>
    </div>
  );
}
