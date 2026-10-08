/* ============================================================
   NOVA — Sidebar Navigation
   ============================================================ */

const Sidebar = {
    init() {
        this.sidebar = document.getElementById('sidebar');
        this.overlay = document.getElementById('sidebarOverlay');
        this.toggleBtn = document.getElementById('sidebarToggle');
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.navItems = document.querySelectorAll('.nav-item[data-page]');
        this.mobileNavItems = document.querySelectorAll('.mobile-nav-item[data-page]');
        this.featureCards = document.querySelectorAll('.feature-card[data-page]');
        this.closePageBtns = document.querySelectorAll('.close-page-btn[data-page]');

        this.bindEvents();

        // Restore last active page if saved (e.g. user was in i2v or image when refreshing)
        const savedPage = localStorage.getItem('nova_active_page');
        if (savedPage && document.getElementById(`page-${savedPage}`)) {
            this.navigateTo(savedPage, false);
        }
    },

    bindEvents() {
        // Sidebar toggle (desktop)
        this.toggleBtn?.addEventListener('click', () => this.toggleSidebar());

        // Mobile menu
        this.mobileMenuBtn?.addEventListener('click', () => this.openMobile());
        this.overlay?.addEventListener('click', () => this.closeMobile());

        // Nav items
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigateTo(page);
                this.closeMobile();
            });
        });

        // Mobile nav items
        this.mobileNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                if (page === 'settings-mobile') {
                    Settings.openModal();
                } else {
                    this.navigateTo(page);
                }
            });
        });

        // Feature cards
        this.featureCards.forEach(card => {
            card.addEventListener('click', () => {
                this.navigateTo(card.dataset.page);
            });

            // 3D tilt effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--mouse-x', x + '%');
                card.style.setProperty('--mouse-y', y + '%');
            });
        });

        // Close page buttons
        this.closePageBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.navigateTo(btn.dataset.page);
            });
        });
    },

    navigateTo(pageId, save = true) {
        // Update pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        const targetPage = document.getElementById(`page-${pageId}`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        if (save) {
            try {
                localStorage.setItem('nova_active_page', pageId);
            } catch (e) {}
        }

        // Update sidebar nav
        this.navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.page === pageId);
        });

        if (pageId === 'chat' && typeof Chat !== 'undefined') {
            Chat.scrollToBottom();
        }

        // Update mobile nav
        this.mobileNavItems.forEach(item => {
            item.classList.toggle('active', item.dataset.page === pageId);
        });

        // Scroll to top
        const container = document.getElementById('pageContainer');
        if (container) container.scrollTop = 0;
        
        // Handle Brain Animation mode
        if (window.brainAnimation) {
            if (pageId === 'home') {
                window.brainAnimation.setMode('wander');
            } else {
                window.brainAnimation.setMode('star');
            }
        }
    },

    toggleSidebar() {
        document.getElementById('app').classList.toggle('sidebar-collapsed');
    },

    openMobile() {
        this.sidebar.classList.add('mobile-open');
        this.overlay.classList.add('active');
    },

    closeMobile() {
        this.sidebar.classList.remove('mobile-open');
        this.overlay.classList.remove('active');
    }
};
