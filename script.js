// Global state
let config = {};
let currentLanguage = 'en';
let languageData = {};
let updateFiles = {};
let preLaunchInterval = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadConfig();
    await loadLanguages();
    setupLanguageSelection();
    setupEventListeners();
    checkLaunchDate();
    setupVideoBackground();
    setupHistoryNavigation();
});

// Load configuration
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        config = await response.json();
    } catch (error) {
        console.error('Error loading config:', error);
    }
}

// Load available languages
async function loadLanguages() {
    try {
        const response = await fetch('locales/en.json');
        languageData['en'] = await response.json();
        
        const responseFr = await fetch('locales/fr.json');
        languageData['fr'] = await responseFr.json();
    } catch (error) {
        console.error('Error loading languages:', error);
    }
}

// Setup language selection
function setupLanguageSelection() {
    const select = document.getElementById('languageSelect');
    
    // Check for saved language preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && languageData[savedLang]) {
        currentLanguage = savedLang;
    }
    
    // Populate language options
    Object.keys(languageData).forEach(langCode => {
        const option = document.createElement('option');
        option.value = langCode;
        option.textContent = languageData[langCode].name;
        option.selected = langCode === currentLanguage;
        select.appendChild(option);
    });
    
    // Update UI with current language
    updateLanguageUI();
}

// Update UI with selected language
function updateLanguageUI() {
    const lang = languageData[currentLanguage];
    
    // Language modal
    document.getElementById('langTitle').textContent = lang.languageSelection.title;
    document.getElementById('langSubtitle').textContent = lang.languageSelection.subtitle;
    document.getElementById('langOkBtn').textContent = lang.languageSelection.button;
    
    // Language button on main page
    const langNames = { 'en': 'English', 'fr': 'Français' };
    const langFlags = { 'en': '🇬🇧', 'fr': '🇫🇷' };
    document.getElementById('currentLangText').textContent = `${langFlags[currentLanguage]} ${langNames[currentLanguage]}`;
    
    // EULA modal
    document.getElementById('eulaTitle').textContent = lang.eula.title;
    document.getElementById('eulaAccept').textContent = lang.eula.accept;
    document.getElementById('eulaDecline').textContent = lang.eula.decline;
    
    // Update modal
    document.getElementById('updateTitle').textContent = lang.updateNotes.title;
    document.getElementById('updateClose').parentElement.querySelector('button').textContent = '×';
    
    // Main page
    document.getElementById('mainTitle').textContent = lang.main.title;
    document.getElementById('nextUpdateLabel').textContent = lang.main.nextUpdate;
    document.getElementById('downloadText').textContent = lang.main.download;
    document.getElementById('exeText').textContent = lang.main.exe;
    document.getElementById('msiText').textContent = lang.main.msi;
    document.getElementById('sourceText').textContent = lang.main.sourceCode;
    document.getElementById('devText').textContent = lang.main.devVersion;
    document.getElementById('viewUpdateText').textContent = lang.main.viewUpdateNotes;
    document.getElementById('viewEulaText').textContent = lang.main.viewEula;
    document.getElementById('viewLicenseText').textContent = lang.main.viewLicense;
    document.getElementById('viewCreditsText').textContent = lang.main.credits;
    
    // Credits page
    document.getElementById('creditsTitle').textContent = lang.credits.title;
    document.getElementById('authorLabel').textContent = lang.credits.author;
    document.getElementById('creatorRole').textContent = lang.credits.creator;
    document.getElementById('linksLabel').textContent = lang.credits.links;
    document.getElementById('githubText').textContent = lang.credits.github;
    document.getElementById('githubDesc').textContent = lang.credits.githubDesc;
    document.getElementById('discordText').textContent = lang.credits.discord;
    document.getElementById('discordDesc').textContent = lang.credits.discordDesc;
    document.getElementById('forumsText').textContent = lang.credits.forums;
    document.getElementById('forumsDesc').textContent = lang.credits.forumsDesc;
    document.getElementById('creditsLicenseText').textContent = lang.credits.license;
    document.getElementById('creditsLicenseDesc').textContent = lang.credits.licenseDesc;
    document.getElementById('creditsEulaText').textContent = lang.credits.eula;
    document.getElementById('creditsEulaDesc').textContent = lang.credits.eulaDesc;
    document.getElementById('copyrightText').textContent = lang.credits.copyright.replace('{year}', config.credits?.year || new Date().getFullYear());
}

// Setup event listeners
function setupEventListeners() {
    // Language selection
    document.getElementById('languageSelect').addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        localStorage.setItem('preferredLanguage', currentLanguage);
        updateLanguageUI();
    });
    
    document.getElementById('langOkBtn').addEventListener('click', async () => {
        closeModal('languageModal');
        await showEULA();
    });
    
    // EULA
    document.getElementById('eulaAccept').addEventListener('click', () => {
        closeModal('eulaModal');
        showUpdateNotes();
    });
    
    document.getElementById('eulaDecline').addEventListener('click', () => {
        // Redirect or show message
        alert('You must accept the EULA to continue.');
    });
    
    // Update modal
    document.getElementById('updateClose').addEventListener('click', () => {
        closeModal('updateModal');
        showMainContent();
    });
    
    // Download dropdown
    document.getElementById('downloadBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        const menu = document.getElementById('downloadMenu');
        const btn = document.getElementById('downloadBtn');
        menu.classList.toggle('hidden');
        btn.classList.toggle('active');
    });
    
    // Language dropdown
    document.getElementById('languageBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        const menu = document.getElementById('languageMenu');
        const btn = document.getElementById('languageBtn');
        menu.classList.toggle('hidden');
        btn.classList.toggle('active');
    });
    
    // Language menu items
    document.querySelectorAll('#languageMenu .dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const langCode = item.getAttribute('data-lang');
            currentLanguage = langCode;
            localStorage.setItem('preferredLanguage', currentLanguage);
            updateLanguageUI();
            document.getElementById('languageMenu').classList.add('hidden');
            document.getElementById('languageBtn').classList.remove('active');
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        document.getElementById('downloadMenu').classList.add('hidden');
        document.getElementById('downloadBtn').classList.remove('active');
        document.getElementById('languageMenu').classList.add('hidden');
        document.getElementById('languageBtn').classList.remove('active');
    });
    
    // Info buttons
    document.getElementById('viewUpdateNotes').addEventListener('click', showUpdateNotes);
    document.getElementById('viewEula').addEventListener('click', showEULA);
    document.getElementById('viewLicense').addEventListener('click', showLicense);
    document.getElementById('viewCredits').addEventListener('click', showCredits);
    
    // Credits page buttons
    document.getElementById('backToMain').addEventListener('click', () => {
        document.getElementById('creditsPage').classList.add('hidden');
        const fromPreLaunch = document.getElementById('creditsPage').dataset.fromPreLaunch === 'true';
        
        if (fromPreLaunch) {
            document.getElementById('preLaunchPage').classList.remove('hidden');
        } else {
            document.getElementById('mainPage').classList.remove('hidden');
        }
    });
    
    document.getElementById('creditsLicenseBtn').addEventListener('click', showLicense);
    document.getElementById('creditsEulaBtn').addEventListener('click', showEULA);
    
    // Pre-launch page buttons
    document.getElementById('preLaunchSkip').addEventListener('click', () => {
        // Clear the countdown interval
        if (preLaunchInterval) {
            clearInterval(preLaunchInterval);
            preLaunchInterval = null;
        }
        document.getElementById('preLaunchPage').classList.add('hidden');
        document.body.classList.remove('pre-launch-active');
        showMainContent();
    });
    
    document.getElementById('preLaunchCredits').addEventListener('click', () => {
        document.getElementById('preLaunchPage').classList.add('hidden');
        showCredits();
    });
    
    document.getElementById('preLaunchEula').addEventListener('click', showEULA);
    document.getElementById('preLaunchLicense').addEventListener('click', showLicense);
    
    // Setup download links
    if (config.downloads) {
        document.getElementById('downloadExe').href = config.downloads.exe;
        document.getElementById('downloadMsi').href = config.downloads.msi;
        document.getElementById('downloadSource').href = config.downloads.sourceCode;
        document.getElementById('devVersionBtn').href = config.downloads.devVersion;
    }
    
    // Setup credits links
    if (config.links) {
        document.getElementById('githubLink').href = config.links.github;
        document.getElementById('discordLink').href = config.links.discord;
        document.getElementById('forumsLink').href = config.links.forums;
    }
}

// Setup video background
function setupVideoBackground() {
    const video = document.getElementById('bgVideo');
    if (config.video && config.video.path) {
        video.querySelector('source').src = config.video.path;
        video.load();
    }
}

// Setup history navigation to prevent browser back button from accessing main page
function setupHistoryNavigation() {
    // Push initial state to history
    history.pushState({ page: 'initial' }, '', location.href);
    
    // Handle popstate (back/forward button)
    window.addEventListener('popstate', (e) => {
        const preLaunchPage = document.getElementById('preLaunchPage');
        const mainPage = document.getElementById('mainPage');
        const creditsPage = document.getElementById('creditsPage');
        
        // If on pre-launch page and user tries to go back, prevent it
        if (!preLaunchPage.classList.contains('hidden')) {
            // Push state back to prevent navigation
            history.pushState({ page: 'preLaunch' }, '', location.href);
            return;
        }
        
        // If on credits page from pre-launch, go back to pre-launch
        if (!creditsPage.classList.contains('hidden') && creditsPage.dataset.fromPreLaunch === 'true') {
            creditsPage.classList.add('hidden');
            preLaunchPage.classList.remove('hidden');
            history.pushState({ page: 'preLaunch' }, '', location.href);
            return;
        }
    });
}

// Check launch date
function checkLaunchDate() {
    if (!config.launchDate) {
        showMainContent();
        return;
    }
    
    const launchDate = new Date(config.launchDate);
    const now = new Date();
    
    if (now >= launchDate) {
        showMainContent();
    } else {
        showPreLaunchCountdown(launchDate);
    }
}

// Show pre-launch countdown
function showPreLaunchCountdown(launchDate) {
    document.getElementById('preLaunchPage').classList.remove('hidden');
    document.body.classList.add('pre-launch-active');
    
    // Clear any existing interval
    if (preLaunchInterval) {
        clearInterval(preLaunchInterval);
    }
    
    function updateCountdown() {
        const now = new Date();
        const diff = launchDate - now;
        
        if (diff <= 0) {
            document.getElementById('preLaunchPage').classList.add('hidden');
            document.body.classList.remove('pre-launch-active');
            clearInterval(preLaunchInterval);
            preLaunchInterval = null;
            showMainContent();
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('preDays').textContent = String(days).padStart(2, '0');
        document.getElementById('preHours').textContent = String(hours).padStart(2, '0');
        document.getElementById('preMinutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('preSeconds').textContent = String(seconds).padStart(2, '0');
    }
    
    updateCountdown();
    preLaunchInterval = setInterval(updateCountdown, 1000);
}

// Show EULA modal
async function showEULA() {
    const lang = languageData[currentLanguage];
    const eulaFile = config.files?.eula?.[currentLanguage] || config.files?.eula?.en;
    
    try {
        const response = await fetch(eulaFile);
        const markdown = await response.text();
        document.getElementById('eulaContent').innerHTML = parseCustomMarkdown(markdown);
    } catch (error) {
        console.error('Error loading EULA:', error);
        document.getElementById('eulaContent').textContent = 'Error loading EULA';
    }
    
    openModal('eulaModal');
}

// Show update notes modal
async function showUpdateNotes() {
    await loadUpdateFiles();
    renderFileExplorer();
    
    // Load latest update for current language
    const latestUpdate = config.files?.latestUpdate?.[currentLanguage] || config.files?.latestUpdate?.en;
    if (latestUpdate) {
        await loadMarkdownFile(latestUpdate);
    }
    
    openModal('updateModal');
}

// Load update files structure
async function loadUpdateFiles() {
    // For static GitHub Pages, we need to define the structure manually
    // This is a simplified version - in production, you might want to use a GitHub API
    updateFiles = {
        'Documentation': {
            'App_Features_EN.md': 'Update/Documentation/App_Features_EN.md',
            'App_Features_FR.md': 'Update/Documentation/App_Features_FR.md',
            'Badges_EN.md': 'Update/Documentation/Badges_EN.md',
            'Badges_FR.md': 'Update/Documentation/Badges_FR.md'
        },
        'Guides': {
            'Badges_Guide_EN.md': 'Update/Guides/Badges_Guide_EN.md',
            'Badges_Guide_FR.md': 'Update/Guides/Badges_Guide_FR.md',
            'EulaTranslationGuide_EN.md': 'Update/Guides/EulaTranslationGuide_EN.md',
            'EulaTranslationGuide_FR.md': 'Update/Guides/EulaTranslationGuide_FR.md'
        },
        'Old': {
            'Update_v0.9.7_PTB_EN.md': 'Update/Old/Update_v0.9.7_PTB_EN.md',
            'Update_v0.9.7_PTB_FR.md': 'Update/Old/Update_v0.9.7_PTB_FR.md'
        },
        'Updates': {
            'changelog_since_7e839e_EN.md': 'Update/Updates/changelog_since_7e839e_EN.md',
            'changelog_since_7e839e_FR.md': 'Update/Updates/changelog_since_7e839e_FR.md'
        },
        'changelog_v0.9.9_EN.md': 'Update/changelog_v0.9.9_EN.md',
        'changelog_v0.9.9_FR.md': 'Update/changelog_v0.9.9_FR.md'
    };
}

// Render file explorer
function renderFileExplorer() {
    const explorer = document.getElementById('fileExplorer');
    explorer.innerHTML = '<ul class="file-tree"></ul>';
    const tree = explorer.querySelector('.file-tree');
    
    // Add folders first
    Object.keys(updateFiles).forEach(key => {
        if (typeof updateFiles[key] === 'object') {
            const li = document.createElement('li');
            li.className = 'folder';
            li.innerHTML = `<span>📁 ${key.toUpperCase()}</span>`;
            li.addEventListener('click', () => toggleFolder(li, key));
            tree.appendChild(li);
        }
    });
    
    // Add files in root
    Object.keys(updateFiles).forEach(key => {
        if (typeof updateFiles[key] === 'string') {
            const li = document.createElement('li');
            li.className = 'file';
            li.innerHTML = `<span>📄 ${key}</span>`;
            li.addEventListener('click', () => {
                document.querySelectorAll('.file-tree li').forEach(l => l.classList.remove('active'));
                li.classList.add('active');
                loadMarkdownFile(updateFiles[key]);
            });
            tree.appendChild(li);
        }
    });
}

// Toggle folder
function toggleFolder(element, folderName) {
    const existingSubtree = element.querySelector('.file-tree');
    const iconSpan = element.querySelector('span');
    
    if (existingSubtree) {
        existingSubtree.remove();
        element.classList.remove('open');
        iconSpan.textContent = `📁 ${folderName.toUpperCase()}`;
        return;
    }
    
    const subtree = document.createElement('ul');
    subtree.className = 'file-tree folder-contents';
    
    Object.keys(updateFiles[folderName]).forEach(fileName => {
        const li = document.createElement('li');
        li.className = 'file';
        li.innerHTML = `<span>📄 ${fileName}</span>`;
        li.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.file-tree li').forEach(l => l.classList.remove('active'));
            li.classList.add('active');
            loadMarkdownFile(updateFiles[folderName][fileName]);
        });
        subtree.appendChild(li);
    });
    
    element.appendChild(subtree);
    element.classList.add('open');
    iconSpan.textContent = `📂 ${folderName.toUpperCase()}`;
}

// Custom markdown renderer for badges
function parseCustomMarkdown(markdown) {
    // Replace badge patterns with styled spans
    let html = markdown
        // NEW / NOUVEAU - Green
        .replace(/\[NEW\]/gi, '<span class="badge badge-new">NEW</span>')
        .replace(/\[NOUVEAU\]/gi, '<span class="badge badge-new">NOUVEAU</span>')
        // REFINE / RAFFINEMENT - Blue
        .replace(/\[REFINE\]/gi, '<span class="badge badge-refine">REFINE</span>')
        .replace(/\[RAFFINEMENT\]/gi, '<span class="badge badge-refine">RAFFINEMENT</span>')
        // IMPROVED / AMÉLIORÉ - Orange
        .replace(/\[IMPROVED\]/gi, '<span class="badge badge-improved">IMPROVED</span>')
        .replace(/\[AMÉLIORÉ\]/gi, '<span class="badge badge-improved">AMÉLIORÉ</span>')
        // FIXED / FIXÉ - Red
        .replace(/\[FIXED\]/gi, '<span class="badge badge-fixed">FIXED</span>')
        .replace(/\[FIXÉ\]/gi, '<span class="badge badge-fixed">FIXÉ</span>')
        .replace(/\[FIXES?\]/gi, '<span class="badge badge-fixed">FIX</span>')
        .replace(/\[CORRECTIONS?\]/gi, '<span class="badge badge-fixed">CORRECTION</span>')
        // VISUAL / VISUEL - Purple
        .replace(/\[VISUAL\]/gi, '<span class="badge badge-visual">VISUAL</span>')
        .replace(/\[VISUEL\]/gi, '<span class="badge badge-visual">VISUEL</span>')
        // SYSTEM / SYSTÈME - Gray
        .replace(/\[SYSTEM\]/gi, '<span class="badge badge-system">SYSTEM</span>')
        .replace(/\[SYSTÈME\]/gi, '<span class="badge badge-system">SYSTÈME</span>')
        // UPDATE / MISE À JOUR - Orange (fallback)
        .replace(/\[UPDATE?S?\]/gi, '<span class="badge badge-improved">UPDATE</span>')
        .replace(/\[MISE À JOUR\]/gi, '<span class="badge badge-improved">MISE À JOUR</span>')
        // REMOVED / SUPPRIMÉ - Red (fallback)
        .replace(/\[REMOVED?\]/gi, '<span class="badge badge-fixed">REMOVED</span>')
        .replace(/\[SUPPRIMÉ\]/gi, '<span class="badge badge-fixed">SUPPRIMÉ</span>');
    
    // Parse the rest with marked
    return marked.parse(html);
}

// Load markdown file
async function loadMarkdownFile(filePath) {
    try {
        const response = await fetch(filePath);
        const markdown = await response.text();
        document.getElementById('updateContent').innerHTML = parseCustomMarkdown(markdown);
    } catch (error) {
        console.error('Error loading markdown:', error);
        document.getElementById('updateContent').textContent = 'Error loading file';
    }
}

// Show license modal
async function showLicense() {
    const licenseFile = config.files?.license || 'LICENSE.md';
    
    try {
        const response = await fetch(licenseFile);
        const markdown = await response.text();
        document.getElementById('licenseContent').innerHTML = parseCustomMarkdown(markdown);
    } catch (error) {
        console.error('Error loading license:', error);
        document.getElementById('licenseContent').textContent = 'Error loading license';
    }
    
    openModal('licenseModal');
}

// Show main content
function showMainContent() {
    document.getElementById('mainPage').classList.remove('hidden');
    
    // Update version text
    if (config.currentVersion) {
        document.getElementById('currentVersion').textContent = config.currentVersion;
    }
    
    // Setup countdowns
    setupMainCountdowns();
}

// Setup main page countdowns
function setupMainCountdowns() {
    if (!config.nextUpdate) return;
    
    const nextUpdateDate = new Date(config.nextUpdate.date);
    const currentVersionDate = config.currentVersionDate ? new Date(config.currentVersionDate) : null;
    
    // Check if we only have a year
    if (config.nextUpdate.date.match(/^\d{4}$/)) {
        // Only year provided
        const year = parseInt(config.nextUpdate.date);
        document.getElementById('nextUpdateCountdown').innerHTML = 
            `<div style="font-size: 2rem; color: var(--primary-color);">${languageData[currentLanguage].main.nextUpdateComing} ${year}</div>`;
    } else {
        // Full date provided
        function updateNextCountdown() {
            const now = new Date();
            const diff = nextUpdateDate - now;
            
            if (diff <= 0) {
                document.getElementById('nextUpdateCountdown').innerHTML = 
                    '<div style="font-size: 2rem; color: var(--success-color);">Update Available!</div>';
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            document.getElementById('nextDays').textContent = String(days).padStart(2, '0');
            document.getElementById('nextHours').textContent = String(hours).padStart(2, '0');
            document.getElementById('nextMinutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('nextSeconds').textContent = String(seconds).padStart(2, '0');
        }
        
        updateNextCountdown();
        setInterval(updateNextCountdown, 1000);
    }
    
    // Time since current update
    if (currentVersionDate) {
        function updateSinceCountdown() {
            const now = new Date();
            const diff = now - currentVersionDate;
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            document.getElementById('sinceText').textContent = 
                `${days}d ${hours}h ${minutes}m ${languageData[currentLanguage].main.timeSinceUpdate}`;
        }
        
        updateSinceCountdown();
        setInterval(updateSinceCountdown, 60000); // Update every minute
    }
}

// Show credits page
function showCredits() {
    const fromPreLaunch = !document.getElementById('preLaunchPage').classList.contains('hidden');
    
    if (fromPreLaunch) {
        document.getElementById('preLaunchPage').classList.add('hidden');
    } else {
        document.getElementById('mainPage').classList.add('hidden');
    }
    
    document.getElementById('creditsPage').classList.remove('hidden');
    
    // Update credits info
    if (config.credits) {
        document.getElementById('creatorName').textContent = config.credits.creator;
    }
    
    // Update version
    if (config.nextUpdate) {
        document.getElementById('creditsVersion').textContent = config.nextUpdate.version + '-FAB';
    }
    
    // Store source page for back button
    document.getElementById('creditsPage').dataset.fromPreLaunch = fromPreLaunch;
}

// Modal helpers
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.classList.add('modal-active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    // Only remove modal-active if no other modals are open
    const anyModalOpen = document.querySelectorAll('.modal.active').length > 0;
    if (!anyModalOpen) {
        document.body.classList.remove('modal-active');
    }
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

// Close modal on backdrop click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});
