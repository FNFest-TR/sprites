// Fortnite Sprites Manager Logic v2.0
let spritesData = [];
let userState = {
    owned: new Set(),
    mastered: new Set()
};

let currentLang = localStorage.getItem("fn_sprites_lang") || "tr";
let currentTheme = localStorage.getItem("fn_sprites_theme") || "glitch";
let activeSeason = "42"; // C7 S4 by default
let activeStatusTab = "all";
let activeRarityFilter = "all";
let activeParentFilter = "all";
let activeVariantFilter = "all";
let activeChanceFilter = "all";
let activeSortFilter = "id";

// Live Widget Customizer State
let custState = {
    mode: "grid",
    theme: "glitch",
    cols: "3",
    rows: "3",
    bg: "solid",
    interval: "7000",
    scale: "md"
};

// Language Dictionary (Turkish & English)
const I18N = {
    tr: {
        appTitle: "OVERRIDE TRACKER",
        appSubtitle: "GLITCH SEZONU ■ SPRITES SİSTEMİ",
        btnObs: "🎛️ CANLI WIDGET AYARLA",
        btnRefresh: "🔄 FORTNITE.GG GÜNCELLE",
        btnBackup: "💾 YEDEKLE",
        btnImport: "📥 İÇE AKTAR",
        btnReset: "🗑️ SIFIRLA",
        
        // Stats
        statTotal: "TOPLAM SPRITE",
        statOwned: "BENDE OLANLAR (OWNED)",
        statMastered: "USTALAŞILAN (MASTERED)",
        statMissing: "EKSİKLER (MISSING)",
        
        // Seasons
        seasonAll: "ALL SEASONS",
        seasonC7S3: "C7 S3",
        seasonC7S4: "C7 S4",
        
        // Search & Filter
        searchPlaceholder: "Sprite, varyant veya aile ara...",
        tabAll: "TÜMÜ",
        tabMissing: "❌ EKSİKLER",
        tabOwned: "✔ BENDE OLANLAR",
        tabMastered: "⭐ MASTERED",
        tabUnreleased: "🔒 UNRELEASED",
        tabReleasedMissing: "✨ ÇIKMIŞ EKSİKLER",
        
        optParentAll: "👥 Tüm Karakter Aileleri",
        optVariantAll: "🎨 Tüm Varyantlar",
        optRarityAll: "💎 Tüm Nadirlikler",
        optChanceAll: "🎲 Tüm Düşme Oranları",
        optChanceUltra: "Çok Nadir (< %5)",
        optChanceRare: "Nadir (%5 - %15)",
        optChanceCommon: "Yaygın (> %15)",
        
        sortId: "Sırala: Varsayılan (ID)",
        sortName: "Sırala: İsim (A-Z)",
        sortRarity: "Sırala: Nadirlik (Yüksek-Düşük)",
        sortChance: "Sırala: Düşme Oranı (En Nadir)",
        sortMissing: "Sırala: Önce Eksikler",
        btnSelectFiltered: "SEÇİLENLERİ 'OWNED' YAP",
        
        // Customizer Modal
        modalCustomizerTitle: "🎛️ CANLI OBS WIDGET ÖZELLEŞTİRİCİ",
        lblCustMode: "Görünüm Modu",
        lblCustTheme: "Widget Teması",
        lblCustLayout: "Izgara Boyutu (Sütun x Satır)",
        lblCustBg: "Arka Plan Tarzı",
        lblCustInterval: "Sayfa Geçiş Hızı",
        lblCustScale: "Karakter & Kart Ölçeği",
        lblLivePreviewBadge: "🔴 CANLI ÖNİZLEME (LIVE PREVIEW)",
        btnCopyCustomUrl: "KOPYALA",
        lblCustTip: "💡 OBS Studio'da <b>Tarayıcı (Browser Source)</b> kaynağına yukarıdaki linki yapıştırın.",
        
        // Card
        ownedLabel: "Owned",
        masteredLabel: "Mastered",
        unreleasedBadge: "UNRELEASED",
        noMatchTitle: "Eşleşen sprite bulunamadı",
        noMatchSubtitle: "Filtrelerinizi veya arama kelimenizi kontrol edin.",
        
        // Toasts
        toastCopied: "📋 OBS Browser Source linki kopyalandı!",
        toastMarked: "sprite 'Owned' olarak işaretlendi.",
        toastReset: "Tüm işaretlemeler sıfırlandı.",
        toastConfirmReset: "Tüm işaretlemeleri sıfırlamak istediğinize emin misiniz?",
        toastBackupDownloaded: "Yedek dosyası indirildi.",
        toastBackupLoaded: "Yedek başarıyla yüklendi!",
        toastInvalidJson: "Geçersiz JSON dosyası!",
        toastRefreshing: "Fortnite.GG'den yeni sprite verileri çekiliyor...",
        toastRefreshed: "Fortnite.GG verileri başarıyla güncellendi!"
    },
    en: {
        appTitle: "OVERRIDE TRACKER",
        appSubtitle: "GLITCH SEASON ■ SPRITES SYSTEM",
        btnObs: "🎛️ LIVE WIDGET STYLER",
        btnRefresh: "🔄 REFRESH FORTNITE.GG",
        btnBackup: "💾 BACKUP",
        btnImport: "📥 IMPORT",
        btnReset: "🗑️ RESET ALL",
        
        // Stats
        statTotal: "TOTAL SPRITES",
        statOwned: "COLLECTED (OWNED)",
        statMastered: "MASTERED (GOLD)",
        statMissing: "MISSING SPRITES",
        
        // Seasons
        seasonAll: "ALL SEASONS",
        seasonC7S3: "C7 S3",
        seasonC7S4: "C7 S4",
        
        // Search & Filter
        searchPlaceholder: "Search sprite, variant, or family...",
        tabAll: "ALL",
        tabMissing: "❌ MISSING",
        tabOwned: "✔ OWNED",
        tabMastered: "⭐ MASTERED",
        tabUnreleased: "🔒 UNRELEASED",
        tabReleasedMissing: "✨ RELEASED MISSING",
        
        optParentAll: "👥 All Character Families",
        optVariantAll: "🎨 All Variants",
        optRarityAll: "💎 All Rarities",
        optChanceAll: "🎲 All Drop Chances",
        optChanceUltra: "Ultra Rare (< 5%)",
        optChanceRare: "Rare (5% - 15%)",
        optChanceCommon: "Common (> 15%)",
        
        sortId: "Sort: Default (ID)",
        sortName: "Sort: Name (A-Z)",
        sortRarity: "Sort: Rarity (High-Low)",
        sortChance: "Sort: Drop Chance (Rarest)",
        sortMissing: "Sort: Missing First",
        btnSelectFiltered: "MARK FILTERED AS OWNED",
        
        // Customizer Modal
        modalCustomizerTitle: "🎛️ LIVE OBS WIDGET CUSTOMIZER",
        lblCustMode: "Widget Display Mode",
        lblCustTheme: "Widget Visual Theme",
        lblCustLayout: "Grid Size (Cols x Rows)",
        lblCustBg: "Background Style",
        lblCustInterval: "Cycle Speed",
        lblCustScale: "Model & Card Scale",
        lblLivePreviewBadge: "🔴 LIVE PREVIEW",
        btnCopyCustomUrl: "COPY URL",
        lblCustTip: "💡 In OBS Studio, add a <b>Browser Source</b> and paste the URL above.",
        
        // Card
        ownedLabel: "Owned",
        masteredLabel: "Mastered",
        unreleasedBadge: "UNRELEASED",
        noMatchTitle: "No matching sprites found",
        noMatchSubtitle: "Try adjusting your filters or search keywords.",
        
        // Toasts
        toastCopied: "📋 OBS Browser Source link copied!",
        toastMarked: "sprites marked as 'Owned'.",
        toastReset: "All sprite progress has been reset.",
        toastConfirmReset: "Are you sure you want to reset all tracked progress?",
        toastBackupDownloaded: "Backup JSON file downloaded.",
        toastBackupLoaded: "Backup progress loaded successfully!",
        toastInvalidJson: "Invalid JSON backup file!",
        toastRefreshing: "Fetching latest sprite data from Fortnite.GG...",
        toastRefreshed: "Fortnite.GG sprites data updated successfully!"
    }
};

const syncChannel = new BroadcastChannel("fortnite_sprites_sync");

document.addEventListener("DOMContentLoaded", async () => {
    applyTheme(currentTheme);
    applyLanguage(currentLang);
    setupEventListeners();
    await loadInitialData();
});

// Theme Logic
function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem("fn_sprites_theme", theme);
    applyTheme(theme);
    custState.theme = theme;
    updateCustomizerPreview();
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.querySelectorAll(".theme-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.theme === theme);
    });
}

// Language Logic
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("fn_sprites_lang", lang);
    applyLanguage(lang);
    updateCustomizerPreview();
}

function applyLanguage(lang) {
    const t = I18N[lang] || I18N.tr;
    document.documentElement.lang = lang;

    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    const setTxt = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = text;
    };

    setTxt("txtAppTitle", t.appTitle);
    setTxt("txtAppSubtitle", t.appSubtitle);
    setTxt("txtBtnObs", t.btnObs);
    setTxt("txtBtnRefresh", t.btnRefresh);
    setTxt("txtBtnBackup", t.btnBackup);
    setTxt("txtBtnImport", t.btnImport);
    setTxt("txtBtnReset", t.btnReset);

    setTxt("txtStatTotal", t.statTotal);
    setTxt("txtStatOwned", t.statOwned);
    setTxt("txtStatMastered", t.statMastered);
    setTxt("txtStatMissing", t.statMissing);

    setTxt("btnSeasonAll", t.seasonAll);
    setTxt("btnSeasonC7S3", t.seasonC7S3);
    setTxt("btnSeasonC7S4", t.seasonC7S4);

    const searchInp = document.getElementById("searchInput");
    if (searchInp) searchInp.placeholder = t.searchPlaceholder;

    setTxt("tabAll", t.tabAll);
    setTxt("tabMissing", t.tabMissing);
    setTxt("tabOwned", t.tabOwned);
    setTxt("tabMastered", t.tabMastered);
    setTxt("tabUnreleased", t.tabUnreleased);
    setTxt("tabReleasedMissing", t.tabReleasedMissing);

    setTxt("optParentAll", t.optParentAll);
    setTxt("optVariantAll", t.optVariantAll);
    setTxt("optRarityAll", t.optRarityAll);
    setTxt("optChanceAll", t.optChanceAll);
    setTxt("optChanceUltra", t.optChanceUltra);
    setTxt("optChanceRare", t.optChanceRare);
    setTxt("optChanceCommon", t.optChanceCommon);

    setTxt("optSortId", t.sortId);
    setTxt("optSortName", t.sortName);
    setTxt("optSortRarity", t.sortRarity);
    setTxt("optSortChance", t.sortChance);
    setTxt("optSortMissing", t.sortMissing);
    setTxt("txtSelectFiltered", t.btnSelectFiltered);

    // Customizer strings
    setTxt("modalCustomizerTitle", t.modalCustomizerTitle);
    setTxt("lblCustMode", t.lblCustMode);
    setTxt("lblCustTheme", t.lblCustTheme);
    setTxt("lblCustLayout", t.lblCustLayout);
    setTxt("lblCustBg", t.lblCustBg);
    setTxt("lblCustInterval", t.lblCustInterval);
    setTxt("lblCustScale", t.lblCustScale);
    setTxt("lblLivePreviewBadge", t.lblLivePreviewBadge);
    setTxt("btnCopyCustomUrl", t.btnCopyCustomUrl);
    setTxt("lblCustTip", t.lblCustTip);

    renderStats();
    renderSprites();
}

async function loadInitialData() {
    try {
        const spritesResp = await fetch("/api/sprites");
        if (spritesResp.ok) {
            spritesData = await spritesResp.json();
            populateFilterDropdowns();
        }
    } catch (e) {
        console.error("Failed to load sprites:", e);
    }

    try {
        const stateResp = await fetch("/api/state");
        if (stateResp.ok) {
            const data = await stateResp.json();
            userState.owned = new Set(data.owned || []);
            userState.mastered = new Set(data.mastered || []);
        }
    } catch (e) {
        const localOwned = localStorage.getItem("fn_sprites_owned");
        const localMastered = localStorage.getItem("fn_sprites_mastered");
        if (localOwned) userState.owned = new Set(JSON.parse(localOwned));
        if (localMastered) userState.mastered = new Set(JSON.parse(localMastered));
    }

    renderStats();
    renderSprites();
}

// Populate Parent & Variant dropdowns dynamically from dataset
function populateFilterDropdowns() {
    const parentSelect = document.getElementById("parentFilter");
    const variantSelect = document.getElementById("variantFilter");

    const parents = new Set();
    const variants = new Set();

    spritesData.forEach(s => {
        if (s.parent && s.parent.trim()) parents.add(s.parent.trim());
        if (s.variant && s.variant.trim() && s.variant !== "base") variants.add(s.variant.trim());
    });

    const t = I18N[currentLang] || I18N.tr;

    if (parentSelect) {
        parentSelect.innerHTML = `<option value="all">${t.optParentAll}</option>` + 
            Array.from(parents).sort().map(p => `<option value="${p}">${p}</option>`).join("");
    }

    if (variantSelect) {
        variantSelect.innerHTML = `<option value="all">${t.optVariantAll}</option>` + 
            Array.from(variants).sort().map(v => `<option value="${v}">${v.toUpperCase()}</option>`).join("");
    }
}

// Event Listeners
function setupEventListeners() {
    // Season buttons
    document.querySelectorAll(".season-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".season-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeSeason = btn.dataset.season;
            renderStats();
            renderSprites();
            updateCustomizerPreview();
        });
    });

    // Search input
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", () => renderSprites());
    }

    // Status tabs
    document.querySelectorAll(".tab-pill").forEach(tab => {
        tab.addEventListener("click", () => {
            document.querySelectorAll(".tab-pill").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            activeStatusTab = tab.dataset.status;
            renderSprites();
        });
    });

    // Dropdown filters
    ["parentFilter", "variantFilter", "rarityFilter", "chanceFilter", "sortFilter"].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("change", (e) => {
                if (id === "parentFilter") activeParentFilter = e.target.value;
                if (id === "variantFilter") activeVariantFilter = e.target.value;
                if (id === "rarityFilter") {
                    activeRarityFilter = e.target.value;
                    highlightRarityCapsule(activeRarityFilter);
                }
                if (id === "chanceFilter") activeChanceFilter = e.target.value;
                if (id === "sortFilter") activeSortFilter = e.target.value;
                renderSprites();
            });
        }
    });
}

function resetAllFilters() {
    activeStatusTab = "all";
    activeRarityFilter = "all";
    activeParentFilter = "all";
    activeVariantFilter = "all";
    activeChanceFilter = "all";
    activeSortFilter = "id";

    document.querySelectorAll(".tab-pill").forEach(t => t.classList.toggle("active", t.dataset.status === "all"));
    
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
    };

    setVal("parentFilter", "all");
    setVal("variantFilter", "all");
    setVal("rarityFilter", "all");
    setVal("chanceFilter", "all");
    setVal("sortFilter", "id");

    const searchInp = document.getElementById("searchInput");
    if (searchInp) searchInp.value = "";

    highlightRarityCapsule("all");
    renderSprites();
    showToast("Filtreler sıfırlandı.");
}

// Click on Rarity Capsule to filter
function filterByRarityCapsule(rarity) {
    const raritySelect = document.getElementById("rarityFilter");
    if (activeRarityFilter === rarity) {
        activeRarityFilter = "all";
        if (raritySelect) raritySelect.value = "all";
    } else {
        activeRarityFilter = rarity;
        if (raritySelect) raritySelect.value = rarity;
    }
    highlightRarityCapsule(activeRarityFilter);
    renderSprites();
}

function highlightRarityCapsule(rarity) {
    document.querySelectorAll(".rarity-capsule").forEach(cap => {
        cap.classList.toggle("active-filter", cap.dataset.rarity === rarity);
    });
}

// Stats & Rarity Breakdown Rendering
function renderStats() {
    let activeList = spritesData;
    if (activeSeason !== "all") {
        activeList = spritesData.filter(s => s.season === activeSeason);
    }

    const total = activeList.length;
    let owned = 0;
    let mastered = 0;

    const rarityCounts = {
        mythic: { total: 0, owned: 0 },
        legendary: { total: 0, owned: 0 },
        epic: { total: 0, owned: 0 },
        rare: { total: 0, owned: 0 },
        uncommon: { total: 0, owned: 0 },
        special: { total: 0, owned: 0 }
    };

    activeList.forEach(s => {
        const isOwned = userState.owned.has(s.id);
        const isMastered = userState.mastered.has(s.id);
        if (isOwned) owned++;
        if (isMastered) mastered++;

        const r = (s.rarity || "common").toLowerCase();
        if (rarityCounts[r]) {
            rarityCounts[r].total++;
            if (isOwned) rarityCounts[r].owned++;
        }
    });

    const missing = Math.max(0, total - owned);
    const ownedPct = total > 0 ? Math.round((owned / total) * 100) : 0;
    const masteredPct = total > 0 ? Math.round((mastered / total) * 100) : 0;
    const missingPct = total > 0 ? Math.round((missing / total) * 100) : 0;

    const setTxt = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };

    setTxt("statTotal", total);
    setTxt("statOwned", owned);
    setTxt("statOwnedPct", `(${ownedPct}%)`);
    setTxt("statMastered", mastered);
    setTxt("statMasteredPct", `(${masteredPct}%)`);
    setTxt("statMissing", missing);
    setTxt("statMissingPct", `(${missingPct}%)`);

    const pBar = document.getElementById("statProgressBar");
    if (pBar) pBar.style.width = `${ownedPct}%`;

    // Render Rarity Capsules
    const rarityRow = document.getElementById("rarityBreakdownRow");
    if (rarityRow) {
        const rarities = ["mythic", "legendary", "epic", "rare", "uncommon", "special"];
        rarityRow.innerHTML = rarities.map(r => {
            const data = rarityCounts[r];
            if (!data || data.total === 0) return "";
            const pct = Math.round((data.owned / data.total) * 100);
            return `
                <div class="rarity-capsule cap-${r} ${activeRarityFilter === r ? 'active-filter' : ''}" data-rarity="${r}" onclick="filterByRarityCapsule('${r}')">
                    <div class="capsule-header">
                        <span class="capsule-name">${r}</span>
                        <span class="capsule-count">${data.owned}/${data.total} (${pct}%)</span>
                    </div>
                    <div class="capsule-bar">
                        <div class="capsule-fill" style="width: ${pct}%"></div>
                    </div>
                </div>
            `;
        }).join("");
    }
}

// Filter and Sort Sprites
function getFilteredSprites() {
    const searchVal = (document.getElementById("searchInput")?.value || "").toLowerCase().trim();

    return spritesData.filter(s => {
        // 1. Season filter
        if (activeSeason !== "all" && s.season !== activeSeason) return false;

        // 2. Status filter
        const isOwned = userState.owned.has(s.id);
        const isMastered = userState.mastered.has(s.id);
        if (activeStatusTab === "missing" && isOwned) return false;
        if (activeStatusTab === "owned" && !isOwned) return false;
        if (activeStatusTab === "mastered" && !isMastered) return false;
        if (activeStatusTab === "unreleased" && !s.unreleased) return false;
        if (activeStatusTab === "released_missing" && (isOwned || s.unreleased)) return false;

        // 3. Parent Family filter
        if (activeParentFilter !== "all" && s.parent !== activeParentFilter) return false;

        // 4. Variant filter
        if (activeVariantFilter !== "all" && s.variant !== activeVariantFilter) return false;

        // 5. Rarity filter
        if (activeRarityFilter !== "all" && (s.rarity || "").toLowerCase() !== activeRarityFilter) return false;

        // 6. Drop Chance filter
        if (activeChanceFilter !== "all") {
            const pctMatch = (s.drop_chance || "").match(/([\d.]+)%/);
            const numPct = pctMatch ? parseFloat(pctMatch[1]) : 0;
            if (activeChanceFilter === "ultra_rare" && (numPct >= 5 || numPct === 0)) return false;
            if (activeChanceFilter === "rare" && (numPct < 5 || numPct > 15)) return false;
            if (activeChanceFilter === "common" && numPct <= 15) return false;
        }

        // 7. Search text
        if (searchVal) {
            const nameMatch = (s.name || "").toLowerCase().includes(searchVal);
            const parentMatch = (s.parent || "").toLowerCase().includes(searchVal);
            const variantMatch = (s.variant || "").toLowerCase().includes(searchVal);
            const idMatch = (s.id || "").toString().includes(searchVal);
            if (!nameMatch && !parentMatch && !variantMatch && !idMatch) return false;
        }

        return true;
    }).sort((a, b) => {
        if (activeSortFilter === "name") return (a.name || "").localeCompare(b.name || "");
        if (activeSortFilter === "rarity") {
            const ranks = { mythic: 6, special: 5, legendary: 4, epic: 3, rare: 2, uncommon: 1, common: 0 };
            return (ranks[b.rarity] || 0) - (ranks[a.rarity] || 0);
        }
        if (activeSortFilter === "chance") {
            const getPct = s => parseFloat((s.drop_chance || "").replace("%", "")) || 999;
            return getPct(a) - getPct(b);
        }
        if (activeSortFilter === "missing_first") {
            const aOwned = userState.owned.has(a.id) ? 1 : 0;
            const bOwned = userState.owned.has(b.id) ? 1 : 0;
            return aOwned - bOwned;
        }
        return parseInt(a.id || 0) - parseInt(b.id || 0);
    });
}

// Render Sprite Cards into Grid
function renderSprites() {
    const grid = document.getElementById("spritesGrid");
    if (!grid) return;

    const filtered = getFilteredSprites();
    const t = I18N[currentLang] || I18N.tr;

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
                <div style="font-size: 40px; margin-bottom: 10px;">🔍</div>
                <h3 style="font-family: 'Orbitron', sans-serif; font-size: 16px; color: #fff; margin-bottom: 6px;">${t.noMatchTitle}</h3>
                <p style="font-size: 14px;">${t.noMatchSubtitle}</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(s => {
        const isOwned = userState.owned.has(s.id);
        const isMastered = userState.mastered.has(s.id);

        let variantBadgeText = "";
        if (s.variant && s.variant !== "base") {
            variantBadgeText = s.variant.toUpperCase();
        }

        return `
            <div class="sprite-card ${isOwned ? 'is-owned' : ''} ${isMastered ? 'is-mastered' : ''}" id="card-${s.id}" onclick="handleCardClick(event, '${s.id}')">
                <div class="card-art-wrap">
                    ${s.unreleased ? `<span class="unreleased-tag">${t.unreleasedBadge}</span>` : ''}
                    ${variantBadgeText ? `<span class="variant-tag">${variantBadgeText}</span>` : ''}
                    <img class="sprite-img" src="/static/${s.image_local}" onerror="this.src='${s.image_url}'" alt="${s.name}" loading="lazy">
                </div>
                <div class="card-body">
                    <div class="card-title" title="${s.name}">${s.name}</div>
                    <div class="card-meta-row">
                        <span class="rarity-badge badge-${s.rarity}">${s.rarity}</span>
                        ${s.drop_chance ? `<span class="chance-badge">${s.drop_chance}</span>` : ''}
                    </div>
                    <div class="card-actions">
                        <label class="custom-checkbox" onclick="event.stopPropagation()">
                            <input type="checkbox" ${isOwned ? 'checked' : ''} onchange="toggleOwned('${s.id}', this.checked)">
                            <span>${t.ownedLabel}</span>
                        </label>
                        <label class="custom-checkbox cb-mastered" onclick="event.stopPropagation()">
                            <input type="checkbox" ${isMastered ? 'checked' : ''} onchange="toggleMastered('${s.id}', this.checked)">
                            <span>${t.masteredLabel}</span>
                        </label>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

// Card Click Shortcut: toggle owned
function handleCardClick(event, id) {
    if (event.target.tagName === "INPUT" || event.target.tagName === "LABEL") return;
    const isOwned = userState.owned.has(id);
    toggleOwned(id, !isOwned);
}

// State Modifications
function toggleOwned(id, isChecked) {
    if (isChecked) {
        userState.owned.add(id);
    } else {
        userState.owned.delete(id);
    }
    saveState();
    updateCardUI(id);
    renderStats();
}

function toggleMastered(id, isChecked) {
    if (isChecked) {
        userState.mastered.add(id);
        userState.owned.add(id); // Mastering implies owned
    } else {
        userState.mastered.delete(id);
    }
    saveState();
    updateCardUI(id);
    renderStats();
}

function updateCardUI(id) {
    const card = document.getElementById(`card-${id}`);
    if (card) {
        const isOwned = userState.owned.has(id);
        const isMastered = userState.mastered.has(id);
        card.classList.toggle("is-owned", isOwned);
        card.classList.toggle("is-mastered", isMastered);

        const cbOwned = card.querySelector(".custom-checkbox:not(.cb-mastered) input");
        const cbMastered = card.querySelector(".custom-checkbox.cb-mastered input");
        if (cbOwned) cbOwned.checked = isOwned;
        if (cbMastered) cbMastered.checked = isMastered;
    }
}

async function saveState() {
    const ownedArr = Array.from(userState.owned);
    const masteredArr = Array.from(userState.mastered);

    localStorage.setItem("fn_sprites_owned", JSON.stringify(ownedArr));
    localStorage.setItem("fn_sprites_mastered", JSON.stringify(masteredArr));

    syncChannel.postMessage({
        type: "STATE_UPDATED",
        owned: ownedArr,
        mastered: masteredArr
    });

    try {
        await fetch("/api/state", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                owned: ownedArr,
                mastered: masteredArr,
                updated_at: new Date().toISOString()
            })
        });
    } catch (e) {
        console.warn("Could not sync state to local backend:", e);
    }
}

function selectAllFiltered() {
    const filtered = getFilteredSprites();
    filtered.forEach(s => userState.owned.add(s.id));
    saveState();
    renderStats();
    renderSprites();
    const t = I18N[currentLang] || I18N.tr;
    showToast(`${filtered.length} ${t.toastMarked}`);
}

function clearAllProgress() {
    const t = I18N[currentLang] || I18N.tr;
    if (confirm(t.toastConfirmReset)) {
        userState.owned.clear();
        userState.mastered.clear();
        saveState();
        renderStats();
        renderSprites();
        showToast(t.toastReset);
    }
}

function exportProgressJSON() {
    const data = {
        owned: Array.from(userState.owned),
        mastered: Array.from(userState.mastered),
        exported_at: new Date().toISOString(),
        version: "2.0"
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fortnite_sprites_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(I18N[currentLang].toastBackupDownloaded);
}

function importProgressJSON() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const text = await file.text();
            const json = JSON.parse(text);
            if (Array.isArray(json.owned)) {
                userState.owned = new Set(json.owned);
                userState.mastered = new Set(json.mastered || []);
                await saveState();
                renderStats();
                renderSprites();
                showToast(I18N[currentLang].toastBackupLoaded);
            } else {
                showToast(I18N[currentLang].toastInvalidJson);
            }
        } catch (err) {
            showToast(I18N[currentLang].toastInvalidJson);
        }
    };
    input.click();
}

async function triggerScraperRefresh() {
    const btn = document.getElementById("btnRefreshScraper");
    if (btn) btn.disabled = true;
    showToast(I18N[currentLang].toastRefreshing);

    try {
        const resp = await fetch("/api/refresh", { method: "POST" });
        const data = await resp.json();
        if (data.status === "success") {
            showToast(I18N[currentLang].toastRefreshed);
            await loadInitialData();
        } else {
            showToast("Hata: " + (data.message || "Güncelleme yapılamadı"));
        }
    } catch (e) {
        showToast("Sunucu bağlantı hatası!");
    } finally {
        if (btn) btn.disabled = false;
    }
}

// ========================================================
// LIVE WIDGET CUSTOMIZER MODAL LOGIC
// ========================================================
function openObsCustomizerModal() {
    custState.theme = currentTheme;
    const modal = document.getElementById("obsCustomizerModal");
    if (modal) modal.classList.add("open");
    updateCustomizerPreview();
}

function closeObsCustomizerModal() {
    const modal = document.getElementById("obsCustomizerModal");
    if (modal) modal.classList.remove("open");
}

function setCustOption(key, val, btnEl) {
    custState[key] = val;
    if (btnEl) {
        const parentGroup = btnEl.closest(".control-pills");
        if (parentGroup) {
            parentGroup.querySelectorAll(".ctrl-btn").forEach(b => b.classList.remove("active"));
            btnEl.classList.add("active");
        }
    }

    // Hide/show grid dimensions row if not grid
    const dimRow = document.getElementById("grpGridDimensions");
    const intervalRow = document.getElementById("grpInterval");
    if (dimRow) dimRow.style.display = custState.mode === "grid" ? "flex" : "none";
    if (intervalRow) intervalRow.style.display = custState.mode === "grid" ? "flex" : "none";

    updateCustomizerPreview();
}

function setCustLayout(cols, rows, btnEl) {
    custState.cols = cols;
    custState.rows = rows;
    if (btnEl) {
        const parentGroup = btnEl.closest(".control-pills");
        if (parentGroup) {
            parentGroup.querySelectorAll(".ctrl-btn").forEach(b => b.classList.remove("active"));
            btnEl.classList.add("active");
        }
    }
    updateCustomizerPreview();
}

function buildCustomObsUrl(relative = false) {
    const base = relative ? "/obs" : "http://127.0.0.1:8765/obs";
    const params = new URLSearchParams();

    params.set("mode", custState.mode);
    params.set("theme", custState.theme);
    params.set("season", activeSeason);
    params.set("lang", currentLang);

    if (custState.mode === "grid") {
        params.set("cols", custState.cols);
        params.set("rows", custState.rows);
        params.set("interval", custState.interval);
    }

    if (custState.bg !== "solid") {
        params.set("bg", custState.bg);
    }

    if (custState.scale !== "md") {
        params.set("scale", custState.scale);
    }

    return `${base}?${params.toString()}`;
}

function updateCustomizerPreview() {
    const iframe = document.getElementById("widgetPreviewIframe");
    const input = document.getElementById("customObsUrlInput");

    const fullUrl = buildCustomObsUrl(false);
    const relUrl = buildCustomObsUrl(true);

    if (iframe) iframe.src = relUrl;
    if (input) input.value = fullUrl;
}

function copyCustomObsUrl() {
    const input = document.getElementById("customObsUrlInput");
    if (input) {
        input.select();
        navigator.clipboard.writeText(input.value);
        const t = I18N[currentLang] || I18N.tr;
        showToast(t.toastCopied);
    }
}

// Toast helper
function showToast(msg) {
    let toast = document.querySelector(".toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3200);
}
