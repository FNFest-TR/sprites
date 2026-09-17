// OBS Widget Controller v2.0 with Dynamic NxM Grid, Themes, Cassette Mode & Unreleased Toggle
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get("mode") || "grid"; // grid | ticker | banner | cassette | disk
const season = urlParams.get("season") || "42"; // '42' (C7 S4) by default, or 'all', '41'
const lang = urlParams.get("lang") || "tr";
const filterType = urlParams.get("filter") || "missing"; // 'missing', 'all', 'owned'
const theme = urlParams.get("theme") || "glitch"; // 'glitch', 'classic', 'gold', 'stealth'
const cols = parseInt(urlParams.get("cols")) || 3; // 2, 3, 4
const rows = parseInt(urlParams.get("rows")) || 3; // 1, 2, 3
const bgStyle = urlParams.get("bg") || "solid"; // 'solid', 'glass', 'transparent'
const scale = urlParams.get("scale") || "md"; // 'sm', 'md', 'lg'
const cycleInterval = parseInt(urlParams.get("interval")) || 7000; // ms
const showUnreleased = (urlParams.get("unreleased") !== "0" && urlParams.get("unreleased") !== "false");

let spritesData = [];
let userState = {
    owned: new Set(),
    mastered: new Set()
};

let currentGridPage = 0;
let cycleTimer = null;
let cassetteSpawnTimer = null;

const OBS_I18N = {
    tr: {
        trackerTitle: "Sprites Tracker",
        completed: "Tamamlandı",
        mastered: "Mastered",
        missing: "Eksik",
        allDoneHeader: "🎉 TEBRİKLER!",
        allDoneSub: "Tüm Sprite'lar toplandı!",
        cassetteTitle: "SPRITES OVERRIDE",
        cassetteMissingLabel: "KALAN EKSİK"
    },
    en: {
        trackerTitle: "Sprites Tracker",
        completed: "Completed",
        mastered: "Mastered",
        missing: "Missing",
        allDoneHeader: "🎉 CONGRATULATIONS!",
        allDoneSub: "All Sprites Collected!",
        cassetteTitle: "SPRITES OVERRIDE",
        cassetteMissingLabel: "REMAINING MISSING"
    }
};

const t = OBS_I18N[lang] || OBS_I18N.tr;
const syncChannel = new BroadcastChannel("fortnite_sprites_sync");

document.addEventListener("DOMContentLoaded", async () => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.className = `theme-${theme} scale-${scale}`;

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
    // Filter unreleased if unreleased=0
    if (!showUnreleased) {
        list = list.filter(s => !s.unreleased);
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
    } else if (mode === "banner") {
        renderBanner(root, ownedCount, masteredCount, missingCount, total, ownedPct);
    } else if (mode === "cassette" || mode === "disk") {
        renderCassette(root, ownedCount, masteredCount, missingCount, total, missingSprites, activeSprites);
    } else {
        renderDynamicGrid(root, activeSprites, missingSprites);
    }
}

// 1. BANNER MODE
function renderBanner(root, owned, mastered, missing, total, pct) {
    const seasonTag = season === "42" ? "C7 S4" : (season === "41" ? "C7 S3" : "");

    root.innerHTML = `
        <div class="obs-banner-container bg-${bgStyle}">
            <div class="banner-header">
                <div class="banner-brand">
                    <div class="banner-icon">⚡</div>
                    <div>
                        <div class="banner-title">${t.trackerTitle}</div>
                        ${seasonTag ? `<div style="font-size:10px; font-weight:800; color:var(--neon-cyan);">${seasonTag}</div>` : ''}
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
            <div class="obs-banner-container bg-${bgStyle}">
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
            <div class="ticker-card bg-${bgStyle} ${isOwned ? 'is-owned' : ''} ${isMastered ? 'is-mastered' : ''}">
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

// 3. DYNAMIC ROTATING GRID (NxM Layout)
function renderDynamicGrid(root, activeSprites, missingSprites) {
    let list = missingSprites;
    if (filterType === "all") {
        list = activeSprites;
    } else if (filterType === "owned") {
        list = activeSprites.filter(s => userState.owned.has(s.id));
    }

    if (list.length === 0) {
        root.innerHTML = `
            <div class="obs-banner-container bg-${bgStyle}">
                <div style="font-weight:800; color:#2ecc71; font-size:14px;">${t.allDoneHeader} ${t.allDoneSub}</div>
            </div>
        `;
        if (cycleTimer) clearInterval(cycleTimer);
        return;
    }

    const pageSize = Math.max(1, cols * rows);
    const totalPages = Math.ceil(list.length / pageSize);

    if (currentGridPage >= totalPages) currentGridPage = 0;

    const startIdx = currentGridPage * pageSize;
    const pageItems = list.slice(startIdx, startIdx + pageSize);

    const cardsHtml = pageItems.map(s => {
        const isOwned = userState.owned.has(s.id);
        const isMastered = userState.mastered.has(s.id);

        return `
            <div class="obs-dyn-card ${isOwned ? 'is-owned' : ''} ${isMastered ? 'is-mastered' : ''}" id="card-dyn-${s.id}">
                <div class="obs-dyn-img-wrap">
                    <img class="obs-dyn-img" src="/static/${s.image_local}" onerror="this.src='${s.image_url}'" alt="${s.name}">
                </div>
                <div class="obs-dyn-meta">
                    <div class="obs-dyn-name" title="${s.name}">${s.name}</div>
                    <span class="obs-dyn-badge pill-${s.rarity}">${s.rarity}</span>
                </div>
            </div>
        `;
    }).join("");

    let dotsHtml = "";
    if (totalPages > 1) {
        dotsHtml = `
            <div class="obs-dyn-pagination">
                ${Array.from({ length: totalPages }).map((_, idx) => `
                    <div class="obs-page-dot ${idx === currentGridPage ? 'active' : ''}"></div>
                `).join("")}
            </div>
        `;
    }

    root.innerHTML = `
        <div class="obs-grid-wrapper">
            <div class="obs-dyn-grid grid-cols-${cols} grid-rows-${rows} bg-${bgStyle} fade-in" id="gridDynContainer">
                ${cardsHtml}
            </div>
            ${dotsHtml}
        </div>
    `;

    if (cycleTimer) clearInterval(cycleTimer);
    
    if (totalPages > 1) {
        cycleTimer = setInterval(() => {
            const gridEl = document.getElementById("gridDynContainer");
            if (gridEl) {
                gridEl.classList.add("fade-out");
                setTimeout(() => {
                    currentGridPage = (currentGridPage + 1) % totalPages;
                    renderDynamicGrid(root, activeSprites, missingSprites);
                }, 400);
            } else {
                currentGridPage = (currentGridPage + 1) % totalPages;
                renderDynamicGrid(root, activeSprites, missingSprites);
            }
        }, cycleInterval);
    }
}

// 4. CASSETTE / DISK WIDGET MODE
function renderCassette(root, ownedCount, masteredCount, missingCount, total, missingSprites, activeSprites) {
    if (cycleTimer) clearInterval(cycleTimer);
    if (cassetteSpawnTimer) clearInterval(cassetteSpawnTimer);

    root.innerHTML = `
        <div class="kaset-widget">
            <img class="kaset-bg-image" src="/static/img/kaset.png" alt="Cassette Frame">
            <div class="kaset-bar-mask"></div>
            <div class="kaset-screen">
                <div class="kaset-scanlines"></div>
                <div class="kaset-top-glitch">${t.cassetteTitle}</div>
                <div id="kasetParticles"></div>
                <div class="kaset-center-hud">
                    <div class="kaset-counter-text" id="kasetMissingCount">${missingCount}</div>
                    <div class="kaset-counter-label">${t.cassetteMissingLabel} (${ownedCount}/${total})</div>
                </div>
            </div>
        </div>
    `;

    // Floating sprite glide logic
    const pContainer = document.getElementById("kasetParticles");
    const spritePool = missingSprites.length > 0 ? missingSprites : activeSprites;

    if (!pContainer || spritePool.length === 0) return;

    function spawnFloatingSprite() {
        if (!document.getElementById("kasetParticles")) return;
        const randomSprite = spritePool[Math.floor(Math.random() * spritePool.length)];
        const img = document.createElement("img");
        img.src = `/static/${randomSprite.image_local}`;
        img.onerror = () => { img.src = randomSprite.image_url; };
        img.className = "floating-kaset-sprite";

        // Random starting position on the left/bottom
        const startX = -15 + Math.random() * 20; // -15% to 5%
        const startY = 15 + Math.random() * 55; // 15% to 70%
        img.style.left = startX + "%";
        img.style.top = startY + "%";
        img.style.opacity = "0";
        img.style.transition = "opacity 1.5s ease-in-out, left 12s linear, top 12s ease-in-out";

        pContainer.appendChild(img);

        // Glide across the screen to the right
        setTimeout(() => {
            img.style.opacity = "0.85";
            const endX = 85 + Math.random() * 25; // glide across to right
            const endY = 15 + Math.random() * 55;
            img.style.left = endX + "%";
            img.style.top = endY + "%";
        }, 100);

        // Fade out and remove
        setTimeout(() => {
            img.style.opacity = "0";
            setTimeout(() => { img.remove(); }, 1800);
        }, 10500);
    }

    // Spawn 3-4 initial sprites with staggered intervals
    for (let i = 0; i < 4; i++) {
        setTimeout(spawnFloatingSprite, i * 2200);
    }

    cassetteSpawnTimer = setInterval(spawnFloatingSprite, 3000);
}
