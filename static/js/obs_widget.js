// OBS Widget Controller with 3x3 Rotating Grid & Large Character Focus
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get("mode") || "banner"; // banner | ticker | grid
const season = urlParams.get("season") || "42"; // '42' (C7 S4) by default, or 'all', '41'
const lang = urlParams.get("lang") || "tr";
const filterType = urlParams.get("filter") || "missing"; // 'missing', 'all', 'owned'
const cycleInterval = parseInt(urlParams.get("interval")) || 7000; // 7 seconds per page

let spritesData = [];
let userState = {
    owned: new Set(),
    mastered: new Set()
};

let current3x3Page = 0;
let cycleTimer = null;

const OBS_I18N = {
    tr: {
        trackerTitle: "Sprites Tracker",
        completed: "Tamamlandı",
        mastered: "Mastered",
        missing: "Eksik",
        allDoneHeader: "🎉 TEBRİKLER!",
        allDoneSub: "Tüm Sprite'lar toplandı!"
    },
    en: {
        trackerTitle: "Sprites Tracker",
        completed: "Completed",
        mastered: "Mastered",
        missing: "Missing",
        allDoneHeader: "🎉 CONGRATULATIONS!",
        allDoneSub: "All Sprites Collected!"
    }
};

const t = OBS_I18N[lang] || OBS_I18N.tr;
const syncChannel = new BroadcastChannel("fortnite_sprites_sync");

document.addEventListener("DOMContentLoaded", async () => {
    await loadInitialData();
    renderWidget();
    initSync();
});

async function loadInitialData() {
    try {
        const spritesResp = await fetch("/api/sprites");
        if (spritesResp.ok) {
            spritesData = await spritesResp.json();
        }
    } catch (e) {
        console.error("Failed to load sprites metadata:", e);
    }

    await fetchStateFromServer();
}

async function fetchStateFromServer() {
    try {
        const stateResp = await fetch("/api/state");
        if (stateResp.ok) {
            const data = await stateResp.json();
            const prevOwnedCount = userState.owned.size;
            userState.owned = new Set(data.owned || []);
            userState.mastered = new Set(data.mastered || []);
            
            if (prevOwnedCount !== userState.owned.size) {
                renderWidget();
            }
        }
    } catch (e) {
        const localOwned = localStorage.getItem("fn_sprites_owned");
        if (localOwned) userState.owned = new Set(JSON.parse(localOwned));
    }
}

function initSync() {
    syncChannel.onmessage = (event) => {
        if (event.data?.type === "STATE_UPDATED") {
            userState.owned = new Set(event.data.owned || []);
            userState.mastered = new Set(event.data.mastered || []);
            renderWidget();
        }
    };

    setInterval(fetchStateFromServer, 2000);
}

function getActiveSprites() {
    let list = spritesData;
    if (season !== "all") {
        list = list.filter(s => s.season === season);
    }
    return list;
}

function renderWidget() {
    const root = document.getElementById("widgetRoot");
    if (!root) return;

    const activeSprites = getActiveSprites();
    const total = activeSprites.length;

    let ownedCount = 0;
    let masteredCount = 0;

    activeSprites.forEach(s => {
        if (userState.owned.has(s.id)) ownedCount++;
        if (userState.mastered.has(s.id)) masteredCount++;
    });

    const missingCount = Math.max(0, total - ownedCount);
    const ownedPct = total > 0 ? Math.round((ownedCount / total) * 100) : 0;
    const missingSprites = activeSprites.filter(s => !userState.owned.has(s.id));

    if (mode === "ticker") {
        renderTicker(root, missingSprites, activeSprites, total);
    } else if (mode === "grid") {
        render3x3Grid(root, activeSprites, missingSprites);
    } else {
        renderBanner(root, ownedCount, masteredCount, missingCount, total, ownedPct);
    }
}

// 1. BANNER MODE
function renderBanner(root, owned, mastered, missing, total, pct) {
    const seasonTag = season === "42" ? "C7 S4" : (season === "41" ? "C7 S3" : "");

    root.innerHTML = `
        <div class="obs-banner-container">
            <div class="banner-header">
                <div class="banner-brand">
                    <div class="banner-icon">⚡</div>
                    <div>
                        <div class="banner-title">${t.trackerTitle}</div>
                        ${seasonTag ? `<div style="font-size:10px; font-weight:800; color:#00e5ff;">${seasonTag}</div>` : ''}
                    </div>
                </div>
                <div class="banner-count">${owned} / ${total}</div>
            </div>

            <div class="banner-progress-bar">
                <div class="banner-progress-fill" style="width: ${pct}%"></div>
            </div>

            <div class="banner-stats-row">
                <span class="stat-highlight-owned">✔ ${pct}% ${t.completed}</span>
                <span>⭐ ${mastered} ${t.mastered}</span>
                <span class="stat-highlight-missing">❌ ${missing} ${t.missing}</span>
            </div>
        </div>
    `;
}

// 2. TICKER MODE
function renderTicker(root, missingSprites, allActive, total) {
    let list = missingSprites;
    if (filterType === "all") {
        list = allActive;
    } else if (filterType === "owned") {
        list = allActive.filter(s => userState.owned.has(s.id));
    }

    if (list.length === 0) {
        root.innerHTML = `
            <div class="obs-banner-container">
                <div style="font-weight:800; color:#2ecc71; font-size:14px;">${t.allDoneHeader} ${t.allDoneSub}</div>
            </div>
        `;
        return;
    }

    const duration = Math.max(15, list.length * 3.5);
    const displayList = [...list, ...list];

    const cardsHtml = displayList.map(s => {
        const isOwned = userState.owned.has(s.id);
        const isMastered = userState.mastered.has(s.id);

        let variantBadgeText = "";
        if (s.variant && s.variant !== "base") {
            variantBadgeText = s.variant.toUpperCase();
        } else if (s.unreleased) {
            variantBadgeText = "NEW";
        }

        return `
            <div class="ticker-card ${isOwned ? 'is-owned' : ''} ${isMastered ? 'is-mastered' : ''}">
                <div class="ticker-card-art">
                    ${variantBadgeText ? `<span class="ticker-variant-badge">${variantBadgeText}</span>` : ''}
                    <img class="ticker-card-img" src="/static/${s.image_local}" onerror="this.src='${s.image_url}'" alt="${s.name}">
                </div>
                <div class="ticker-card-info">
                    <div class="ticker-card-title" title="${s.name}">${s.name}</div>
                    <div class="ticker-card-meta">
                        <span class="ticker-pill-rarity pill-${s.rarity}">${s.rarity}</span>
                        ${s.drop_chance ? `<span class="ticker-pill-chance">${s.drop_chance}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join("");

    root.innerHTML = `
        <div class="obs-ticker-viewport">
            <div class="obs-ticker-track" style="animation-duration: ${duration}s;">
                ${cardsHtml}
            </div>
        </div>
    `;
}

// 3. 3x3 DYNAMIC ROTATING GRID WITH HUGE CHARACTER FOCUS
function render3x3Grid(root, activeSprites, missingSprites) {
    let list = missingSprites;
    if (filterType === "all") {
        list = activeSprites;
    } else if (filterType === "owned") {
        list = activeSprites.filter(s => userState.owned.has(s.id));
    }

    if (list.length === 0) {
        root.innerHTML = `
            <div class="obs-banner-container">
                <div style="font-weight:800; color:#2ecc71; font-size:14px;">${t.allDoneHeader} ${t.allDoneSub}</div>
            </div>
        `;
        if (cycleTimer) clearInterval(cycleTimer);
        return;
    }

    const pageSize = 9;
    const totalPages = Math.ceil(list.length / pageSize);

    // Keep current page within bounds
    if (current3x3Page >= totalPages) current3x3Page = 0;

    const startIdx = current3x3Page * pageSize;
    const pageItems = list.slice(startIdx, startIdx + pageSize);

    const cardsHtml = pageItems.map(s => {
        const isOwned = userState.owned.has(s.id);
        const isMastered = userState.mastered.has(s.id);

        return `
            <div class="obs-3x3-card ${isOwned ? 'is-owned' : ''} ${isMastered ? 'is-mastered' : ''}" id="card-3x3-${s.id}">
                <div class="obs-3x3-img-wrap">
                    <img class="obs-3x3-img" src="/static/${s.image_local}" onerror="this.src='${s.image_url}'" alt="${s.name}">
                </div>
                <div class="obs-3x3-meta">
                    <div class="obs-3x3-name" title="${s.name}">${s.name}</div>
                    <span class="obs-3x3-badge pill-${s.rarity}">${s.rarity}</span>
                </div>
            </div>
        `;
    }).join("");

    // Generate pagination dots if more than 1 page
    let dotsHtml = "";
    if (totalPages > 1) {
        dotsHtml = `
            <div class="obs-3x3-pagination">
                ${Array.from({ length: totalPages }).map((_, idx) => `
                    <div class="obs-page-dot ${idx === current3x3Page ? 'active' : ''}"></div>
                `).join("")}
            </div>
        `;
    }

    root.innerHTML = `
        <div class="obs-3x3-wrapper">
            <div class="obs-3x3-grid fade-in" id="grid3x3Container">
                ${cardsHtml}
            </div>
            ${dotsHtml}
        </div>
    `;

    // Setup auto-cycling if > 1 page
    if (cycleTimer) clearInterval(cycleTimer);
    
    if (totalPages > 1) {
        cycleTimer = setInterval(() => {
            const gridEl = document.getElementById("grid3x3Container");
            if (gridEl) {
                gridEl.classList.add("fade-out");
                setTimeout(() => {
                    current3x3Page = (current3x3Page + 1) % totalPages;
                    render3x3Grid(root, activeSprites, missingSprites);
                }, 400);
            } else {
                current3x3Page = (current3x3Page + 1) % totalPages;
                render3x3Grid(root, activeSprites, missingSprites);
            }
        }, cycleInterval);
    }
}
