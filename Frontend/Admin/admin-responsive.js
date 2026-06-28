(function() {
    // 1. Inject Styles
    const style = document.createElement('style');
    style.innerHTML = `
        /* Transitions for sidebar */
        aside {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        @media (max-width: 1024px) {
            aside {
                transform: translateX(-100%) !important;
                width: 260px !important;
                z-index: 9999 !important;
                box-shadow: 10px 0 30px rgba(15, 23, 42, 0.15) !important;
            }
            aside.sidebar-open {
                transform: translateX(0) !important;
            }
            main {
                margin-left: 0 !important;
                padding: 16px !important;
                width: 100% !important;
                max-width: 100vw !important;
                overflow-x: hidden !important;
            }
            
            /* Responsive headers */
            .flex-responsive {
                flex-direction: column !important;
                align-items: flex-start !important;
                gap: 16px !important;
            }
            .header-actions {
                width: 100% !important;
                display: flex !important;
                flex-wrap: wrap !important;
                gap: 12px !important;
                justify-content: flex-start !important;
            }
            .header-actions > .relative {
                width: 100% !important; /* Full width search bar on mobile */
                max-width: 100% !important;
            }
        }
    `;
    document.head.appendChild(style);

    // 2. Setup DOM Manipulation on Load
    function initResponsive() {
        const aside = document.querySelector("aside");
        const main = document.querySelector("main");
        
        if (!aside || !main) return;

        // Find header
        const header = main.querySelector("header") || main.querySelector("div.flex.justify-between");
        if (header) {
            header.classList.add("flex-responsive");
            
            const headerActions = header.querySelector("div.flex.items-center") || header.querySelector("button")?.parentElement;
            if (headerActions) {
                headerActions.classList.add("header-actions");
            }
            
            const titleEl = header.querySelector("h2") || header.firstElementChild;
            if (titleEl && !document.getElementById("sidebarToggle")) {
                const titleWrap = document.createElement("div");
                titleWrap.className = "flex items-center gap-3 w-full md:w-auto justify-between md:justify-start";
                
                const toggleBtn = document.createElement("button");
                toggleBtn.id = "sidebarToggle";
                toggleBtn.className = "p-2 -ml-2 text-slate-600 hover:text-slate-900 focus:outline-none md:hidden";
                toggleBtn.setAttribute("aria-label", "Toggle Sidebar");
                toggleBtn.innerHTML = '<i class="fa-solid fa-bars text-lg"></i>';
                
                titleEl.parentNode.replaceChild(titleWrap, titleEl);
                titleWrap.appendChild(toggleBtn);
                titleWrap.appendChild(titleEl);
            }
        }

        // Add close button to sidebar
        const logoContainer = aside.querySelector(".p-6.border-b") || aside.firstElementChild;
        if (logoContainer && !document.getElementById("sidebarClose")) {
            logoContainer.style.display = "flex";
            logoContainer.style.justifyContent = "space-between";
            logoContainer.style.alignItems = "center";
            logoContainer.style.width = "100%";
            
            const closeBtn = document.createElement("button");
            closeBtn.id = "sidebarClose";
            closeBtn.className = "p-2 text-slate-400 hover:text-slate-600 focus:outline-none md:hidden";
            closeBtn.setAttribute("aria-label", "Close Sidebar");
            closeBtn.innerHTML = '<i class="fa-solid fa-xmark text-lg"></i>';
            
            logoContainer.appendChild(closeBtn);
        }

        // Add overlay backdrop
        if (!document.getElementById("sidebarBackdrop")) {
            const backdrop = document.createElement("div");
            backdrop.id = "sidebarBackdrop";
            backdrop.className = "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9990] opacity-0 pointer-events-none transition-opacity duration-300 md:hidden";
            document.body.appendChild(backdrop);

            const openSidebar = () => {
                aside.classList.add("sidebar-open");
                backdrop.classList.remove("opacity-0", "pointer-events-none");
                backdrop.classList.add("opacity-100");
            };

            const closeSidebar = () => {
                aside.classList.remove("sidebar-open");
                backdrop.classList.add("opacity-0", "pointer-events-none");
                backdrop.classList.remove("opacity-100");
            };

            const toggleBtn = document.getElementById("sidebarToggle");
            const closeBtn = document.getElementById("sidebarClose");

            if (toggleBtn) toggleBtn.addEventListener("click", openSidebar);
            if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
            backdrop.addEventListener("click", closeSidebar);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initResponsive);
    } else {
        initResponsive();
    }
})();
