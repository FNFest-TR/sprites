// Fortnite Sprites Manager Logic
let spritesData = [];
let userState = {
    owned: new Set(),
    mastered: new Set()
};

// Language Dictionary (Turkish & English)
const I18N = {
    tr: {
        appTitle: "Fortnite Sprites Tracker",
        appSubtitle: "OBS Widget & Koleksiyon Takip Sistemi",
        btnObs: "📺 OBS Widget Linki",
        btnRefresh: "🔄 Fortnite.GG'den Güncelle",
        btnBackup: "💾 Yedekle",
        btnImport: "📥 İçe Aktar",
        btnReset: "🗑️ Sıfırla",
        
        // Stats
        statTotal: "Toplam Sprite",
        statOwned: "Bende Olanlar (Owned)",
        statMastered: "Ustalaşılan (Mastered)",
        statMissing: "Eksikler (Missing)",
        
        // Seasons
        seasonAll: "All Seasons",
        seasonC7S3: "C7 S3",
        seasonC7S4: "C7 S4",
        
        // Search & Filter
        searchPlaceholder: "Sprite veya Varyant ara (örn: Jackrabbit, Shadow, Gold)...",
        tabAll: "Tümü",
        tabMissing: "❌ Eksikler",
        tabOwned: "✔ Bende Olanlar",
        tabMastered: "⭐ Mastered",
        tabUnreleased: "🔒 Unreleased",
        
        allRarities: "Tüm Nadirlikler",
        allVariants: "Tüm Varyantlar",
        sortId: "Sırala: Varsayılan (ID)",
        sortName: "Sırala: İsim (A-Z)",
        sortRarity: "Sırala: Nadirlik (Yüksek-Düşük)",
        sortMissing: "Sırala: Önce Eksikler",
        btnSelectFiltered: "Seçilenleri 'Owned' Yap",
        
        // Modal
        modalTitle: "📺 OBS Browser Source Linki Al",
        modalDesc: "OBS Studio'da <b>Kaynaklar (Sources) -> Ekle (+) -> Tarayıcı (Browser)</b> seçin ve aşağıdaki URL'yi yapıştırın.",
        modeBanner: "📊 Banner / İlerleme Çubuğu",
        modeTicker: "🎞️ Kayan Eksikler (Ticker)",
        modeGrid: "🃏 Eksikler Kart Izgarası",
        copyBtn: "Kopyala",
        modalTip: "💡 <b>İpucu:</b> Bu yönetim panelinde herhangi bir kutuyu (Owned / Mastered) işaretlediğinizde OBS'deki widget <b>anında ve gecikmesiz</b> güncellenir!",
        
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
        toastRefreshSuccess: "✅ Tüm veriler ve görseller başarıyla güncellendi!",
        toastRefreshError: "❌ Güncelleme sırasında hata oluştu."
    },
    en: {
        appTitle: "Fortnite Sprites Tracker",
        appSubtitle: "OBS Widget & Collection Tracker",
        btnObs: "📺 OBS Widget Link",
        btnRefresh: "🔄 Update from Fortnite.GG",
        btnBackup: "💾 Backup",
        btnImport: "📥 Import",
        btnReset: "🗑️ Reset",
        
        // Stats
        statTotal: "Total Sprites",
        statOwned: "Owned",
        statMastered: "Mastered",
        statMissing: "Missing",
        
        // Seasons
        seasonAll: "All Seasons",
        seasonC7S3: "C7 S3",
        seasonC7S4: "C7 S4",
        
        // Search & Filter
        searchPlaceholder: "Search sprite or variant (e.g. Jackrabbit, Shadow, Gold)...",
        tabAll: "All",
        tabMissing: "❌ Missing",
        tabOwned: "✔ Owned",
        tabMastered: "⭐ Mastered",
        tabUnreleased: "🔒 Unreleased",
        
        allRarities: "All Rarities",
        allVariants: "All Variants",
        sortId: "Sort: Default (ID)",
        sortName: "Sort: Name (A-Z)",
        sortRarity: "Sort: Rarity (High-Low)",
        sortMissing: "Sort: Missing First",
        btnSelectFiltered: "Mark Filtered as Owned",
        
        // Modal
        modalTitle: "📺 Get OBS Browser Source Link",
        modalDesc: "In OBS Studio, add a <b>Browser Source</b> and paste the URL below.",
        modeBanner: "📊 Banner / Progress Bar",
        modeTicker: "🎞️ Missing Sprites Ticker",
        modeGrid: "🃏 Missing Sprites Grid",
        copyBtn: "Copy",
        modalTip: "💡 <b>Tip:</b> When you check/uncheck any box here, the OBS widget updates <b>instantly without delay</b>!",
        
        // Card
        ownedLabel: "Owned",
        masteredLabel: "Mastered",
        unreleasedBadge: "UNRELEASED",
        noMatchTitle: "No matching sprites found",
        noMatchSubtitle: "Try changing your filters or search keywords.",
        
        // Toasts
        toastCopied: "📋 OBS Browser Source URL copied!",
        toastMarked: "sprites marked as Owned.",
        toastReset: "All progress reset.",
        toastConfirmReset: "Are you sure you want to reset all tracked sprites?",
        toastBackupDownloaded: "Backup file downloaded.",
        toastBackupLoaded: "Backup loaded successfully!",
        toastInvalidJson: "Invalid JSON file!",
        toastRefreshing: "Fetching latest sprites from Fortnite.GG...",
        toastRefreshSuccess: "✅ All sprites and icons updated successfully!",
        toastRefreshError: "❌ Failed to update from Fortnite.GG."
    }
};

let currentLang = localStorage.getItem("fn_sprites_lang") || "tr";
const syncChannel = new BroadcastChannel("fortnite_sprites_sync");

// Default filter state: Season 42 (C7 S4)
const filterState = {
    search: "",
    status: "all", // "all", "missing", "owned", "mastered", "unreleased"
    rarity: "all",
    variant: "all",
    season: "42",
    sortBy: "id"
};

document.addEventListener("DOMContentLoaded", async () => {
    initEventListeners();
    applyLanguage(currentLang);
    await loadInitialData();
    renderApp();
});

function initEventListeners() {
    document.getElementById("searchInput")?.addEventListener("input", (e) => {
        filterState.search = e.target.value.toLowerCase().trim();
        renderGrid();
    });

    document.getElementById("rarityFilter")?.addEventListener("change", (e) => {
        filterState.rarity = e.target.value;
        renderGrid();
    });

    document.getElementById("variantFilter")?.addEventListener("change", (e) => {
        filterState.variant = e.target.value;
        renderGrid();
    });

    document.getElementById("sortFilter")?.addEventListener("change", (e) => {
        filterState.sortBy = e.target.value;
        renderGrid();
    });

    document.querySelectorAll(".season-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".season-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            filterState.season = btn.dataset.season;
            populateVariantFilterOptions();
            updateStatsUI();
            renderGrid();
            updateObsUrlPreview();
        });
    });

    document.querySelectorAll(".tab-pill").forEach(pill => {
        pill.addEventListener("click", () => {
            document.querySelectorAll(".tab-pill").forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            filterState.status = pill.dataset.status;
            renderGrid();
        });
    });

    syncChannel.onmessage = (event) => {
        if (event.data?.type === "STATE_UPDATED") {
            userState.owned = new Set(event.data.owned || []);
            userState.mastered = new Set(event.data.mastered || []);
            updateStatsUI();
            updateCardVisuals();
        }
    };
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("fn_sprites_lang", lang);
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
    });
    applyLanguage(lang);
    renderApp();
    updateObsUrlPreview();
}

function applyLanguage(lang) {
    const t = I18N[lang] || I18N.tr;

    const setElemText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = text;
    };

    setElemText("txtAppTitle", t.appTitle);
    setElemText("txtAppSubtitle", t.appSubtitle);
    setElemText("txtBtnObs", t.btnObs);
    setElemText("txtBtnRefresh", t.btnRefresh);
    setElemText("txtBtnBackup", t.btnBackup);
    setElemText("txtBtnImport", t.btnImport);
    setElemText("txtBtnReset", t.btnReset);

    setElemText("txtStatTotal", t.statTotal);
    setElemText("txtStatOwned", t.statOwned);
    setElemText("txtStatMastered", t.statMastered);
    setElemText("txtStatMissing", t.statMissing);

    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.placeholder = t.searchPlaceholder;

    setElemText("tabAll", t.tabAll);
    setElemText("tabMissing", t.tabMissing);
    setElemText("tabOwned", t.tabOwned);
    setElemText("tabMastered", t.tabMastered);
    setElemText("tabUnreleased", t.tabUnreleased);

    setElemText("btnSeasonAll", t.seasonAll);
    setElemText("btnSeasonC7S3", t.seasonC7S3);
    setElemText("btnSeasonC7S4", t.seasonC7S4);

    setElemText("optRarityAll", t.allRarities);
    setElemText("optSortId", t.sortId);
    setElemText("optSortName", t.sortName);
    setElemText("optSortRarity", t.sortRarity);
    setElemText("optSortMissing", t.sortMissing);
    setElemText("txtSelectFiltered", t.btnSelectFiltered);

    setElemText("modalTitle", t.modalTitle);
    setElemText("modalDesc", t.modalDesc);
    setElemText("modeBtnBanner", t.modeBanner);
    setElemText("modeBtnTicker", t.modeTicker);
    setElemText("modeBtnGrid", t.modeGrid);
    setElemText("copyBtnText", t.copyBtn);
    setElemText("modalTip", t.modalTip);
}

async function loadInitialData() {
    try {
        const spritesResp = await fetch("/api/sprites");
        if (spritesResp.ok) {
            spritesData = await spritesResp.json();
            populateVariantFilterOptions();
        }
    } catch (err) {
        console.error("Failed to load /api/sprites:", err);
    }

    try {
        const stateResp = await fetch("/api/state");
        if (stateResp.ok) {
            const data = await stateResp.json();
            userState.owned = new Set(data.owned || []);
            userState.mastered = new Set(data.mastered || []);
        }
    } catch (err) {
        const localOwned = localStorage.getItem("fn_sprites_owned");
        const localMastered = localStorage.getItem("fn_sprites_mastered");
        if (localOwned) userState.owned = new Set(JSON.parse(localOwned));
        if (localMastered) userState.mastered = new Set(JSON.parse(localMastered));
    }
}

function populateVariantFilterOptions() {
    const variantSelect = document.getElementById("variantFilter");
    if (!variantSelect) return;
    
    const variants = new Set();
    spritesData.forEach(s => {
        if (filterState.season === "all" || s.season === filterState.season) {
            if (s.variant) variants.add(s.variant);
        }
    });

    const t = I18N[currentLang] || I18N.tr;
    variantSelect.innerHTML = `<option value="all">${t.allVariants} (${variants.size})</option>`;
    
    Array.from(variants).sort().forEach(v => {
        const opt = document.createElement("option");
        opt.value = v;
        opt.textContent = v.charAt(0).toUpperCase() + v.slice(1);
        variantSelect.appendChild(opt);
    });
}

async function persistState() {
    const payload = {
        owned: Array.from(userState.owned),
        mastered: Array.from(userState.mastered),
        updated_at: new Date().toISOString()
    };

    localStorage.setItem("fn_sprites_owned", JSON.stringify(payload.owned));
    localStorage.setItem("fn_sprites_mastered", JSON.stringify(payload.mastered));

    syncChannel.postMessage({
        type: "STATE_UPDATED",
        owned: payload.owned,
        mastered: payload.mastered
    });

    updateStatsUI();

    try {
        await fetch("/api/state", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    } catch (err) {
        console.error("Failed to persist state:", err);
    }
}

function toggleOwned(spriteId, event) {
    if (event) event.stopPropagation();
    if (userState.owned.has(spriteId)) {
        userState.owned.delete(spriteId);
    } else {
        userState.owned.add(spriteId);
    }
    updateCardElementState(spriteId);
    persistState();
}

function toggleMastered(spriteId, event) {
    if (event) event.stopPropagation();
    if (userState.mastered.has(spriteId)) {
        userState.mastered.delete(spriteId);
    } else {
        userState.mastered.add(spriteId);
        userState.owned.add(spriteId);
    }
    updateCardElementState(spriteId);
    persistState();
}

function updateCardElementState(spriteId) {
    const card = document.getElementById(`sprite-card-${spriteId}`);
    if (!card) return;
    
    const isOwned = userState.owned.has(spriteId);
    const isMastered = userState.mastered.has(spriteId);

    const cbOwned = card.querySelector(".cb-owned input");
    const cbMastered = card.querySelector(".cb-mastered input");

    if (cbOwned) cbOwned.checked = isOwned;
    if (cbMastered) cbMastered.checked = isMastered;

    card.classList.toggle("is-owned", isOwned);
    card.classList.toggle("is-mastered", isMastered);
}

function updateCardVisuals() {
    spritesData.forEach(s => updateCardElementState(s.id));
}

function getSeasonSprites() {
    if (filterState.season === "all") return spritesData;
    return spritesData.filter(s => s.season === filterState.season);
}

function updateStatsUI() {
    const activeSeasonSprites = getSeasonSprites();
    const total = activeSeasonSprites.length;
    
    let ownedCount = 0;
    let masteredCount = 0;

    activeSeasonSprites.forEach(s => {
        if (userState.owned.has(s.id)) ownedCount++;
        if (userState.mastered.has(s.id)) masteredCount++;
    });

    const missingCount = Math.max(0, total - ownedCount);
    const ownedPct = total > 0 ? Math.round((ownedCount / total) * 100) : 0;
    const masteredPct = total > 0 ? Math.round((masteredCount / total) * 100) : 0;
    const missingPct = total > 0 ? Math.round((missingCount / total) * 100) : 0;

    const elTotal = document.getElementById("statTotal");
    const elOwned = document.getElementById("statOwned");
    const elOwnedPct = document.getElementById("statOwnedPct");
    const elMastered = document.getElementById("statMastered");
    const elMasteredPct = document.getElementById("statMasteredPct");
    const elMissing = document.getElementById("statMissing");
    const elMissingPct = document.getElementById("statMissingPct");
    const elProgressBar = document.getElementById("statProgressBar");

    if (elTotal) elTotal.textContent = total;
    if (elOwned) elOwned.textContent = ownedCount;
    if (elOwnedPct) elOwnedPct.textContent = `(${ownedPct}%)`;
    if (elMastered) elMastered.textContent = masteredCount;
    if (elMasteredPct) elMasteredPct.textContent = `(${masteredPct}%)`;
    if (elMissing) elMissing.textContent = missingCount;
    if (elMissingPct) elMissingPct.textContent = `(${missingPct}%)`;
    if (elProgressBar) elProgressBar.style.width = `${ownedPct}%`;
}

function getFilteredSprites() {
    return spritesData.filter(s => {
        if (filterState.season !== "all" && s.season !== filterState.season) {
            return false;
        }

        if (filterState.search && !s.name.toLowerCase().includes(filterState.search) && !s.variant.includes(filterState.search)) {
            return false;
        }

        if (filterState.rarity !== "all" && s.rarity !== filterState.rarity) {
            return false;
        }

        if (filterState.variant !== "all" && s.variant !== filterState.variant) {
            return false;
        }

        const isOwned = userState.owned.has(s.id);
        const isMastered = userState.mastered.has(s.id);

        if (filterState.status === "missing" && isOwned) return false;
        if (filterState.status === "owned" && !isOwned) return false;
        if (filterState.status === "mastered" && !isMastered) return false;
        if (filterState.status === "unreleased" && !s.unreleased) return false;

        return true;
    }).sort((a, b) => {
        if (filterState.sortBy === "name") {
            return a.name.localeCompare(b.name);
        }
        if (filterState.sortBy === "rarity") {
            const rarityOrder = { "mythic": 6, "special": 5, "legendary": 4, "epic": 3, "rare": 2, "uncommon": 1, "common": 0 };
            return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
        }
        if (filterState.sortBy === "missing_first") {
            const aOwned = userState.owned.has(a.id) ? 1 : 0;
            const bOwned = userState.owned.has(b.id) ? 1 : 0;
            return aOwned - bOwned;
        }
        return parseInt(a.id) - parseInt(b.id);
    });
}

function renderGrid() {
    const gridEl = document.getElementById("spritesGrid");
    if (!gridEl) return;

    const filtered = getFilteredSprites();
    const t = I18N[currentLang] || I18N.tr;

    if (filtered.length === 0) {
        gridEl.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
                <div style="font-size: 32px; margin-bottom: 8px;">🔍</div>
                <div style="font-size: 16px; font-weight: 600;">${t.noMatchTitle}</div>
                <div style="font-size: 13px; margin-top: 4px;">${t.noMatchSubtitle}</div>
            </div>
        `;
        return;
    }

    gridEl.innerHTML = filtered.map(sprite => {
        const isOwned = userState.owned.has(sprite.id);
        const isMastered = userState.mastered.has(sprite.id);
        const imgSrc = `/static/${sprite.image_local}`;

        return `
            <div class="sprite-card ${isOwned ? 'is-owned' : ''} ${isMastered ? 'is-mastered' : ''}" 
                 id="sprite-card-${sprite.id}"
                 onclick="toggleOwned('${sprite.id}', event)">
                
                <div class="card-art-wrap">
                    ${sprite.unreleased ? `<span class="unreleased-tag">${t.unreleasedBadge}</span>` : ''}
                    ${sprite.variant && sprite.variant !== 'base' && !sprite.unreleased ? `<span class="variant-tag">${sprite.variant}</span>` : ''}
                    <img class="sprite-img" 
                         src="${imgSrc}" 
                         alt="${sprite.name}" 
                         loading="lazy" 
                         onerror="this.onerror=null; this.src='${sprite.image_url}';">
                </div>

                <div class="card-body">
                    <div class="card-title" title="${sprite.name}">${sprite.name}</div>
                    
                    <div class="card-meta-row">
                        <span class="rarity-badge badge-${sprite.rarity}">${sprite.rarity}</span>
                        ${sprite.drop_chance ? `<span class="chance-badge">${sprite.drop_chance}</span>` : ''}
                    </div>

                    <div class="card-actions" onclick="event.stopPropagation()">
                        <label class="custom-checkbox cb-owned">
                            <input type="checkbox" ${isOwned ? 'checked' : ''} onchange="toggleOwned('${sprite.id}', event)">
                            <span>${t.ownedLabel}</span>
                        </label>
                        <label class="custom-checkbox cb-mastered">
                            <input type="checkbox" ${isMastered ? 'checked' : ''} onchange="toggleMastered('${sprite.id}', event)">
                            <span>${t.masteredLabel}</span>
                        </label>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

function renderApp() {
    updateStatsUI();
    renderGrid();
}

function selectAllFiltered() {
    const filtered = getFilteredSprites();
    const t = I18N[currentLang] || I18N.tr;
    filtered.forEach(s => userState.owned.add(s.id));
    persistState();
    renderApp();
    showToast(`${filtered.length} ${t.toastMarked}`);
}

function clearAllProgress() {
    const t = I18N[currentLang] || I18N.tr;
    if (confirm(t.toastConfirmReset)) {
        userState.owned.clear();
        userState.mastered.clear();
        persistState();
        renderApp();
        showToast(t.toastReset);
    }
}

function exportProgressJSON() {
    const t = I18N[currentLang] || I18N.tr;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
        owned: Array.from(userState.owned),
        mastered: Array.from(userState.mastered),
        exported_at: new Date().toISOString()
    }, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `fortnite_sprites_backup_${new Date().toISOString().slice(0,10)}.json`);
    dlAnchor.click();
    showToast(t.toastBackupDownloaded);
}

function importProgressJSON() {
    const t = I18N[currentLang] || I18N.tr;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (Array.isArray(data.owned)) userState.owned = new Set(data.owned);
                if (Array.isArray(data.mastered)) userState.mastered = new Set(data.mastered);
                persistState();
                renderApp();
                showToast(t.toastBackupLoaded);
            } catch (err) {
                alert(t.toastInvalidJson);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

async function triggerScraperRefresh() {
    const t = I18N[currentLang] || I18N.tr;
    const btn = document.getElementById("btnRefreshScraper");
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = "⏳ ...";
    }
    showToast(t.toastRefreshing);

    try {
        const resp = await fetch("/api/refresh", { method: "POST" });
        const res = await resp.json();
        if (res.status === "success") {
            await loadInitialData();
            renderApp();
            showToast(t.toastRefreshSuccess);
        } else {
            showToast(t.toastRefreshError);
        }
    } catch (err) {
        showToast(t.toastRefreshError);
    } finally {
        if (btn) {
            btn.disabled = false;
            applyLanguage(currentLang);
        }
    }
}

let currentObsMode = "banner";
function openObsModal() {
    updateObsUrlPreview();
    document.getElementById("obsModal").classList.add("open");
}

function closeObsModal() {
    document.getElementById("obsModal").classList.remove("open");
}

function setObsMode(mode, btn) {
    currentObsMode = mode;
    document.querySelectorAll(".obs-mode-btn").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    updateObsUrlPreview();
}

function updateObsUrlPreview() {
    const seasonParam = filterState.season === "all" ? "all" : filterState.season;
    const url = `http://127.0.0.1:8765/obs?mode=${currentObsMode}&season=${seasonParam}&lang=${currentLang}`;
    const input = document.getElementById("obsUrlInput");
    if (input) input.value = url;
}

function copyObsUrl() {
    const t = I18N[currentLang] || I18N.tr;
    const input = document.getElementById("obsUrlInput");
    if (!input) return;
    input.select();
    navigator.clipboard.writeText(input.value).then(() => {
        showToast(t.toastCopied);
    });
}

function showToast(msg) {
    let toast = document.getElementById("toastNotification");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toastNotification";
        toast.className = "toast";
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}
