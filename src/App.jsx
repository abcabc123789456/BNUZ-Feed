import { useState, useEffect, useCallback, useRef, useMemo } from "react";

const SOURCES = [
  { id: "tzgs", name: "通知公示", short: "校区通知", url: "https://www.bnuzh.edu.cn/tzgs/index.htm", base: "https://www.bnuzh.edu.cn", color: "#0066FF", tone: 40 },
  { id: "jwb", name: "教务部", short: "教务", url: "https://jwb.bnuzh.edu.cn/tzgg/index.htm", base: "https://jwb.bnuzh.edu.cn", color: "#00C853", tone: 40 },
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

/* ═══════ Material You Components ═══════ */

function TopAppBar({ lastRefresh, refreshing, autoRefresh, onAutoRefreshToggle, onRefresh }) {
  return (
    <header className="top-app-bar">
      <div className="top-app-bar-container">
        <div className="top-app-bar-content">
          <div className="brand">
            <div className="brand-logo">
              <span>B</span>
            </div>
            <div className="brand-text">
              <h1 className="headline-small">BNUZ 通知</h1>
              <p className="body-medium">北京师范大学珠海校区</p>
            </div>
          </div>
          
          <div className="top-app-bar-actions">
            <button 
              className={`icon-button ${autoRefresh ? "selected" : ""}`}
              onClick={onAutoRefreshToggle}
              title={autoRefresh ? "自动刷新开启中" : "自动刷新已关闭"}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
              </svg>
            </button>
            <button 
              className="icon-button"
              onClick={onRefresh}
              disabled={refreshing}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={refreshing ? "spin" : ""}>
                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="refresh-status">
          {refreshing ? (
            <span className="label-large">
              <span className="loading-dot"></span>
              正在更新数据...
            </span>
          ) : lastRefresh ? (
            <span className="label-large">
              <span className="status-indicator"></span>
              更新于 {lastRefresh.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
              {autoRefresh && " · 自动刷新"}
            </span>
          ) : (
            <span className="label-large">准备就绪</span>
          )}
        </div>
      </div>
    </header>
  );
}

function SourceChips({ sources, activeFilter, onFilterChange, notifications }) {
  const allCount = Object.values(notifications).flat().length;
  
  return (
    <div className="source-chips-container">
      <div className="source-chips-scroll">
        <button 
          className={`chip ${activeFilter === "all" ? "chip-filled" : "chip-outlined"}`}
          onClick={() => onFilterChange("all")}
        >
          <span className="chip-text">全部</span>
          {allCount > 0 && <span className="chip-badge">{allCount}</span>}
        </button>
        
        {sources.map(source => {
          const count = notifications[source.id]?.length || 0;
          const isActive = activeFilter === source.id;
          
          return (
            <button
              key={source.id}
              className={`chip ${isActive ? "chip-filled" : "chip-outlined"}`}
              style={isActive ? { 
                background: source.color,
                color: 'white',
                borderColor: source.color 
              } : { 
                borderColor: `${source.color}40`,
                color: source.color 
              }}
              onClick={() => onFilterChange(isActive ? "all" : source.id)}
            >
              <span className="chip-dot" style={{ background: isActive ? 'white' : source.color }}></span>
              <span className="chip-text">{source.short}</span>
              {count > 0 && (
                <span className="chip-badge" style={{ 
                  background: isActive ? 'rgba(255,255,255,0.3)' : `${source.color}20`,
                  color: isActive ? 'white' : source.color 
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
          <div key={source.id} className={`source-card ${isLoading ? "loading" : ""} ${isError ? "error" : ""}`}>
            <div className="source-icon" style={{ 
              background: `${source.color}15`,
              color: source.color 
            }}>
              {source.short[0]}
            </div>
            <div className="source-info">
              <span className="source-name label-medium">{source.short}</span>
              <span className="source-count headline-small" style={{ color: count > 0 ? source.color : 'inherit' }}>
                {isLoading ? "···" : isError ? "×" : count}
              </span>
            </div>
            <div className="source-indicator" style={{ 
              background: isError ? '#EF4444' : count > 0 ? source.color : '#CBD5E1' 
            }}></div>
          </div>
        );
      })}
    </div>
  );
}

function NotificationCard({ item, source, index }) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <a 
      href={item.url || source.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`notification-card ${isPressed ? "pressed" : ""} ${isHovered ? "hovered" : ""}`}
      style={{ animationDelay: `${Math.min(index, 20) * 0.05}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      <div className="card-ripple-container">
        <div className="card-content">
          <div className="card-leading">
            <div className="source-avatar" style={{ 
              background: `${source.color}15`,
              color: source.color 
            }}>
              {source.short[0]}
            </div>
          </div>
          
          <div className="card-body">
            <div className="card-header">
              <span className="source-label label-large" style={{ color: source.color }}>
                {source.short}
              </span>
              {item.date && (
                <>
                  <span className="divider-dot">·</span>
                  <time className="date-label label-large">{item.date}</time>
                </>
              )}
            </div>
            <h3 className="card-title body-large">{item.title}</h3>
          </div>
          
          <div className="card-trailing">
            <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>
      </div>
      
      <div className="card-state-layer"></div>
    </a>
  );
}

function LoadingCard({ index }) {
  return (
    <div className="notification-card skeleton" style={{ animationDelay: `${index * 0.05}s` }}>
      <div className="card-content">
        <div className="card-leading">
          <div className="skeleton-avatar"></div>
        </div>
        <div className="card-body">
          <div className="skeleton-header">
            <div className="skeleton-chip"></div>
            <div className="skeleton-date"></div>
          </div>
          <div className="skeleton-title"></div>
          <div className="skeleton-title" style={{ width: '70%' }}></div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onRetry }) {
  return (
    <div className="empty-state">
      <div className="empty-illustration">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="4"/>
          <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
        </svg>
      </div>
      <h3 className="headline-small">暂无通知</h3>
      <p className="body-medium">数据源暂时不可用或站点结构发生变化</p>
      <button className="button-filled" onClick={onRetry}>
        <span className="button-text label-large">重新加载</span>
      </button>
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
        /* ═══════ Material You Design Tokens ═══════ */
        :root {
          /* Primary Palette */
          --md-sys-color-primary: ${THEME.primary[40]};
          --md-sys-color-on-primary: #FFFFFF;
          --md-sys-color-primary-container: ${THEME.primary[90]};
          --md-sys-color-on-primary-container: ${THEME.primary[10]};
          
          /* Secondary Palette */
          --md-sys-color-secondary: ${THEME.secondary[40]};
          --md-sys-color-on-secondary: #FFFFFF;
          --md-sys-color-secondary-container: ${THEME.secondary[90]};
          --md-sys-color-on-secondary-container: ${THEME.secondary[10]};
          
          /* Tertiary Palette */
          --md-sys-color-tertiary: ${THEME.tertiary[40]};
          --md-sys-color-on-tertiary: #FFFFFF;
          --md-sys-color-tertiary-container: ${THEME.tertiary[90]};
          --md-sys-color-on-tertiary-container: ${THEME.tertiary[10]};
          
          /* Surface Colors */
          --md-sys-color-surface: #FFFBFE;
          --md-sys-color-surface-variant: #E7E0EC;
          --md-sys-color-on-surface: #1C1B1F;
          --md-sys-color-on-surface-variant: #49454F;
          --md-sys-color-background: #FFFBFE;
          --md-sys-color-on-background: #1C1B1F;
          
          /* Outline */
          --md-sys-color-outline: #79747E;
          --md-sys-color-outline-variant: #CAC4D0;
          
          /* Elevation */
          --md-sys-elevation-level0: 0 0 0 0 rgba(0,0,0,0);
          --md-sys-elevation-level1: 0 1px 2px 0 rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15);
          --md-sys-elevation-level2: 0 1px 2px 0 rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15);
          --md-sys-elevation-level3: 0 1px 3px 0 rgba(0,0,0,0.3), 0 4px 8px 3px rgba(0,0,0,0.15);
          
          /* Shapes */
          --md-sys-shape-corner-none: 0px;
          --md-sys-shape-corner-extra-small: 4px;
          --md-sys-shape-corner-small: 8px;
          --md-sys-shape-corner-medium: 12px;
          --md-sys-shape-corner-large: 16px;
          --md-sys-shape-corner-extra-large: 28px;
          --md-sys-shape-corner-full: 50%;
          
          /* Motion */
          --md-sys-motion-duration-short1: 50ms;
          --md-sys-motion-duration-short2: 100ms;
          --md-sys-motion-duration-short3: 150ms;
          --md-sys-motion-duration-short4: 200ms;
          --md-sys-motion-duration-medium1: 250ms;
          --md-sys-motion-duration-medium2: 300ms;
          --md-sys-motion-duration-medium4: 400ms;
          --md-sys-motion-easing-standard: cubic-bezier(0.2, 0.0, 0.0, 1.0);
          --md-sys-motion-easing-emphasized: cubic-bezier(0.2, 0.0, 0.0, 1.0);
          --md-sys-motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1.0);
          --md-sys-motion-easing-emphasized-accelerate: cubic-bezier(0.3, 0.0, 0.8, 0.15);
        }

        /* ═══════ Typography ═══════ */
        .display-large {
          font-family: "Google Sans", "Roboto", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 57px;
          font-weight: 400;
          line-height: 64px;
          letter-spacing: -0.25px;
        }
        .display-medium {
          font-family: "Google Sans", "Roboto", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 45px;
          font-weight: 400;
          line-height: 52px;
        }
        .display-small {
          font-family: "Google Sans", "Roboto", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 36px;
          font-weight: 400;
          line-height: 44px;
        }
        .headline-large {
          font-family: "Google Sans", "Roboto", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 32px;
          font-weight: 400;
          line-height: 40px;
        }
        .headline-medium {
          font-family: "Google Sans", "Roboto", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 28px;
          font-weight: 400;
          line-height: 36px;
        }
        .headline-small {
          font-family: "Google Sans", "Roboto", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 24px;
          font-weight: 400;
          line-height: 32px;
        }
        .title-large {
          font-family: "Roboto", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 22px;
          font-weight: 400;
          line-height: 28px;
        }
        .title-medium {
          font-family: "Roboto", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 16px;
          font-weight: 500;
          line-height: 24px;
          letter-spacing: 0.15px;
        }
        .title-small {
          font-family: "Roboto", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 14px;
          font-weight: 500;
          line-height: 20px;
          letter-spacing: 0.1px;
        }
        .body-large {
          font-family: "Roboto", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 24px;
          letter-spacing: 0.5px;
        }
        .body-medium {
          font-family: "Roboto", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          letter-spacing: 0.25px;
        }
        .label-large {
          font-family: "Roboto", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 14px;
          font-weight: 500;
          line-height: 20px;
          letter-spacing: 0.1px;
        }
        .label-medium {
          font-family: "Roboto", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 12px;
          font-weight: 500;
          line-height: 16px;
          letter-spacing: 0.5px;
        }

        /* ═══════ Reset & Base ═══════ */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: var(--md-sys-color-background);
          color: var(--md-sys-color-on-surface);
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--md-sys-color-background);
        }

        /* ═══════ Top App Bar ═══════ */
        .top-app-bar {
          background: var(--md-sys-color-surface);
          box-shadow: var(--md-sys-elevation-level2);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .top-app-bar-container {
          max-width: 840px;
          margin: 0 auto;
          padding: 20px 16px 16px;
        }

        @media (min-width: 600px) {
          .top-app-bar-container {
            padding: 24px 24px 16px;
          }
        }

        .top-app-bar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .brand-logo {
          width: 48px;
          height: 48px;
          background: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
          border-radius: var(--md-sys-shape-corner-large);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Google Sans", sans-serif;
          font-size: 24px;
          font-weight: 500;
          box-shadow: var(--md-sys-elevation-level1);
        }

        .brand-text h1 {
          color: var(--md-sys-color-on-surface);
        }

        .brand-text p {
          color: var(--md-sys-color-on-surface-variant);
          margin-top: 2px;
        }

        .top-app-bar-actions {
          display: flex;
          gap: 8px;
        }

        .icon-button {
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          border-radius: var(--md-sys-shape-corner-full);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--md-sys-color-on-surface-variant);
          cursor: pointer;
          transition: all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
          position: relative;
          overflow: hidden;
        }

        .icon-button:hover {
          background: rgba(28, 27, 31, 0.08);
        }

        .icon-button:active {
          background: rgba(28, 27, 31, 0.12);
        }

        .icon-button.selected {
          background: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
        }

        .icon-button svg {
          width: 24px;
          height: 24px;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .refresh-status {
          margin-top: 12px;
          padding-left: 64px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--md-sys-color-on-surface-variant);
        }

        .loading-dot {
          width: 6px;
          height: 6px;
          background: var(--md-sys-color-primary);
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          background: #22C55E;
          border-radius: 50%;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        /* ═══════ Source Grid ═══════ */
        .source-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          padding: 12px 16px;
          background: var(--md-sys-color-surface-variant);
          border-bottom: 1px solid var(--md-sys-color-outline-variant);
        }

        @media (min-width: 600px) {
          .source-grid {
            grid-template-columns: repeat(8, 1fr);
            gap: 12px;
            padding: 16px 24px;
          }
        }

        .source-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 12px 8px;
          background: var(--md-sys-color-surface);
          border-radius: var(--md-sys-shape-corner-large);
          box-shadow: var(--md-sys-elevation-level1);
          transition: all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
          position: relative;
          overflow: hidden;
        }

        .source-card:hover {
          box-shadow: var(--md-sys-elevation-level2);
          transform: translateY(-1px);
        }

        .source-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--md-sys-shape-corner-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 500;
        }

        .source-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .source-name {
          color: var(--md-sys-color-on-surface-variant);
        }

        .source-count {
          color: var(--md-sys-color-on-surface);
        }

        .source-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          transition: background var(--md-sys-motion-duration-short2);
        }

        /* ═══════ Source Chips ═══════ */
        .source-chips-container {
          background: var(--md-sys-color-surface);
          border-bottom: 1px solid var(--md-sys-color-outline-variant);
          padding: 12px 0;
        }

        .source-chips-scroll {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 4px 16px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .source-chips-scroll::-webkit-scrollbar {
          display: none;
        }

        @media (min-width: 600px) {
          .source-chips-scroll {
            padding: 4px 24px;
            flex-wrap: wrap;
          }
        }

        .chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 1px solid var(--md-sys-color-outline);
          background: var(--md-sys-color-surface);
          border-radius: var(--md-sys-shape-corner-small);
          cursor: pointer;
          transition: all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
          white-space: nowrap;
          height: 36px;
        }

        .chip:hover {
          background: rgba(28, 27, 31, 0.05);
        }

        .chip-outlined {
          background: transparent;
          color: var(--md-sys-color-on-surface-variant);
        }

        .chip-filled {
          background: var(--md-sys-color-primary);
          color: var(--md-sys-color-on-primary);
          border-color: var(--md-sys-color-primary);
        }

        .chip-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .chip-badge {
          padding: 2px 8px;
          border-radius: var(--md-sys-shape-corner-small);
          font-size: 12px;
          font-weight: 500;
        }

        /* ═══════ Notification Cards ═══════ */
        .notifications-list {
          max-width: 840px;
          margin: 0 auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        @media (min-width: 600px) {
          .notifications-list {
            padding: 24px;
            gap: 16px;
          }
        }

        .notification-card {
          display: block;
          background: var(--md-sys-color-surface);
          border-radius: var(--md-sys-shape-corner-extra-large);
          box-shadow: var(--md-sys-elevation-level1);
          text-decoration: none;
          color: inherit;
          position: relative;
          overflow: hidden;
          transition: all var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-emphasized);
          animation: enter-card 0.4s var(--md-sys-motion-easing-emphasized-decelerate) both;
          opacity: 0;
        }

        @keyframes enter-card {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .notification-card:hover {
          box-shadow: var(--md-sys-elevation-level2);
          transform: translateY(-2px);
        }

        .notification-card.hovered .card-state-layer {
          opacity: 0.08;
        }

        .notification-card.pressed .card-state-layer {
          opacity: 0.12;
        }

        .notification-card.pressed {
          transform: scale(0.98);
        }

        .card-ripple-container {
          position: relative;
          z-index: 1;
        }

        .card-content {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px;
        }

        .card-leading {
          flex-shrink: 0;
        }

        .source-avatar {
          width: 48px;
          height: 48px;
          border-radius: var(--md-sys-shape-corner-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 500;
        }

        .card-body {
          flex: 1;
          min-width: 0;
          padding-top: 4px;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .source-label {
          font-weight: 600;
        }

        .divider-dot {
          color: var(--md-sys-color-outline);
        }

        .date-label {
          color: var(--md-sys-color-on-surface-variant);
        }

        .card-title {
          color: var(--md-sys-color-on-surface);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.5;
        }

        .card-trailing {
          flex-shrink: 0;
          padding-top: 12px;
        }

        .chevron {
          width: 24px;
          height: 24px;
          color: var(--md-sys-color-outline);
          transition: transform var(--md-sys-motion-duration-short2);
        }

        .notification-card:hover .chevron {
          transform: translateX(4px);
          color: var(--md-sys-color-on-surface-variant);
        }

        .card-state-layer {
          position: absolute;
          inset: 0;
          background: var(--md-sys-color-on-surface);
          opacity: 0;
          transition: opacity var(--md-sys-motion-duration-short2);
          pointer-events: none;
        }

        /* ═══════ Skeleton Loading ═══════ */
        .skeleton {
          pointer-events: none;
        }

        .skeleton-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(90deg, var(--md-sys-color-surface-variant) 25%, rgba(255,255,255,0.5) 50%, var(--md-sys-color-surface-variant) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .skeleton-chip {
          width: 60px;
          height: 20px;
          border-radius: var(--md-sys-shape-corner-small);
          background: linear-gradient(90deg, var(--md-sys-color-surface-variant) 25%, rgba(255,255,255,0.5) 50%, var(--md-sys-color-surface-variant) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-date {
          width: 80px;
          height: 16px;
          border-radius: 4px;
          background: linear-gradient(90deg, var(--md-sys-color-surface-variant) 25%, rgba(255,255,255,0.5) 50%, var(--md-sys-color-surface-variant) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          animation-delay: 0.1s;
        }

        .skeleton-title {
          height: 20px;
          border-radius: 4px;
          background: linear-gradient(90deg, var(--md-sys-color-surface-variant) 25%, rgba(255,255,255,0.5) 50%, var(--md-sys-color-surface-variant) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          animation-delay: 0.2s;
          margin-bottom: 8px;
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
          animation: fade-in 0.5s var(--md-sys-motion-easing-emphasized-decelerate);
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .empty-illustration {
          width: 120px;
          height: 120px;
          color: var(--md-sys-color-outline);
          margin-bottom: 24px;
        }

        .empty-illustration svg {
          width: 100%;
          height: 100%;
        }

        .empty-state h3 {
          color: var(--md-sys-color-on-surface);
          margin-bottom: 8px;
        }

        .empty-state p {
          color: var(--md-sys-color-on-surface-variant);
          margin-bottom: 24px;
          max-width: 280px;
        }

        .button-filled {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 24px;
          background: var(--md-sys-color-primary);
          color: var(--md-sys-color-on-primary);
          border: none;
          border-radius: var(--md-sys-shape-corner-full);
          cursor: pointer;
          transition: all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
          box-shadow: var(--md-sys-elevation-level1);
        }

        .button-filled:hover {
          box-shadow: var(--md-sys-elevation-level2);
        }

        .button-filled:active {
          transform: scale(0.98);
        }

        /* ═══════ Footer ═══════ */
        footer {
          margin-top: auto;
          padding: 24px;
          text-align: center;
          color: var(--md-sys-color-on-surface-variant);
          border-top: 1px solid var(--md-sys-color-outline-variant);
        }

        footer p {
          font-size: 12px;
          letter-spacing: 0.4px;
        }
      `}</style>

      <TopAppBar 
        lastRefresh={lastRefresh}
        refreshing={refreshing}
        autoRefresh={autoRefresh}
        onAutoRefreshToggle={() => setAutoRefresh(!autoRefresh)}
        onRefresh={() => fetchAll(false)}
      />

      <SourceGrid sources={SOURCES} status={sourceStatus} />

      <SourceChips 
        sources={SOURCES}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        notifications={notifications}
      />

      <main style={{ flex: 1 }}>
        <div className="notifications-list">
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

      <footer>
        <p className="label-medium">数据直接来自各站点 HTML · 纯前端解析</p>
      </footer>
    </div>
  );
}
