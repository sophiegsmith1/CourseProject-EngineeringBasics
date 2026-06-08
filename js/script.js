// ===============================
// 1. CONFIG & STARTUP
// ===============================
const BASE = "/BEHS-Engineering-Hub";

document.addEventListener("DOMContentLoaded", () => {
    // We launch everything at once
    initSidebarToggle();
    loadSidebar();
    loadResources();
    initResponsive();
});

// ===============================
// 2. SIDEBAR & NAVIGATION
// ===============================
async function loadSidebar() {
    const container = document.getElementById("sidebar-container");
    if (!container) return;

    try {
        const res = await fetch(`${BASE}/components/sidebar.html`);
        if (!res.ok) throw new Error(`Sidebar Status: ${res.status}`);
        const html = await res.text();
        container.innerHTML = html;

        // Initialize Accordions (Dropdowns)
        document.querySelectorAll(".menu-title").forEach(title => {
            title.onclick = () => {
                const submenu = title.nextElementSibling;
                if (submenu) submenu.classList.toggle("open");
            };
        });

        // Highlight Active Link
        const currentPath = window.location.pathname;
        document.querySelectorAll(".submenu a").forEach(link => {
            if (currentPath.endsWith(link.getAttribute("href"))) {
                link.classList.add("active");
                link.parentElement.classList.add("open");
            }
        });

    } catch (err) {
        console.error("Sidebar Load Error:", err);
    }
}

function initSidebarToggle() {
    const btn = document.getElementById("menu-toggle");
    if (!btn) return;

    btn.onclick = () => {
        const sidebar = document.getElementById("sidebar");
        const main = document.querySelector(".main");
        if (sidebar && main) {
            sidebar.classList.toggle("closed");
            main.classList.toggle("expanded");
        }
    };
}

// ===============================
// 3. RESOURCE DATABASE LOGIC
// ===============================
async function loadResources() {
    const grid = document.getElementById('resource-grid');
    if (!grid) return; 

    try {
        const response = await fetch(`${BASE}/articles.json`);
        if (!response.ok) throw new Error("articles.json not found");
        const articles = await response.json();
      
        grid.innerHTML = articles.map(item => `
            <div class="media-card" data-tags="${item.tags || ''}">
                <div class="category-label">${item.category || ''}</div>
                
                <div class="card-image">
                    <img src="${BASE}/images/icons/${item.icon || 'default-icon.png'}" 
                         class="card-icon" 
                         onerror="this.src='${BASE}/images/icons/default-icon.png';">
                </div>

                <h3>${item.title}</h3>

                <div class="media-links">
                    <a href="${item.articleUrl}" target="_blank" class="media-btn article">View Article</a>
                    ${item.podcastUrl && item.podcastUrl !== '#' ? 
                        `<button class="media-btn podcast" onclick="togglePlayer('audio-${item.id}')">Listen to Podcast</button>` : ''}
                    ${item.videoUrl && item.videoUrl !== '#' ? 
                        `<a href="${item.videoUrl}" target="_blank" class="media-btn video">Watch Video</a>` : ''}
                </div>

                <div id="audio-${item.id}" class="player-container" style="display:none; margin-top:15px;">
                    <audio controls style="width:100%"><source src="${item.podcastUrl}" type="audio/mpeg"></audio>
                </div>
            </div>
        `).join('');
        
        console.log("Resources loaded successfully!");
    } catch (err) {
        console.error("Resource Error:", err);
        grid.innerHTML = `<div style="color:red; padding:20px;"><h3>Database Error</h3><p>${err.message}</p></div>`;
    }
}

// ===============================
// 4. SEARCH & MEDIA HELPERS
// ===============================
function filterResources() {
    const input = document.getElementById('resourceSearch').value.toLowerCase();
    const cards = document.getElementsByClassName('media-card');
    
    for (let card of cards) {
        const title = card.querySelector('h3').innerText.toLowerCase();
        const tags = card.getAttribute('data-tags').toLowerCase();
        const category = card.querySelector('.category-label').innerText.toLowerCase();
        
        if (title.includes(input) || tags.includes(input) || category.includes(input)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    }
}

function togglePlayer(id) {
    const player = document.getElementById(id);
    if (player) {
        const isHidden = player.style.display === 'none' || player.style.display === '';
        // Close other players
        document.querySelectorAll('.player-container').forEach(p => p.style.display = 'none');
        // Open this one
        player.style.display = isHidden ? 'block' : 'none';
    }
}

// ===============================
// 5. RESPONSIVE LOGIC
// ===============================
function initResponsive() {
    const checkWidth = () => {
        const sidebar = document.getElementById("sidebar");
        const main = document.querySelector(".main");
        if (!sidebar || !main) return;

        if (window.innerWidth <= 768) {
            sidebar.classList.add("closed");
            main.classList.add("expanded");
        } else {
            sidebar.classList.remove("closed");
            main.classList.remove("expanded");
        }
    };
    
    window.addEventListener("resize", checkWidth);
    checkWidth(); // Run on load
}

// ===============================
// COURSE HUB: LESSON TOGGLE
// ===============================
function toggleLessons(id) {
    const list = document.getElementById(id);
    const btn = list ? list.previousElementSibling : null;

    if (!list || !btn) return;

    // Check if it's already open
    const isOpen = list.classList.contains("show");

    // Close all other open activity lists (Optional: Accordion style)
    // document.querySelectorAll('.activity-list').forEach(el => el.classList.remove('show'));
    // document.querySelectorAll('.lesson-btn').forEach(el => el.classList.remove('active'));

    // Toggle this specific list
    if (isOpen) {
        list.classList.remove("show");
        btn.classList.remove("active");
    } else {
        list.classList.add("show");
        btn.classList.add("active");
    }
}
