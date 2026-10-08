/* ============================================================
   NOVA — System Notifications & Broadcast Announcements
   ============================================================ */

const Notifications = {
    list: [],
    unreadCount: 0,
    STORAGE_KEY: 'nova_read_announcements',
    inited: false,

    init() {
        if (this.inited) return;
        this.inited = true;

        this.btn = document.getElementById('notificationBtn');
        this.badge = document.getElementById('notificationBadge');
        this.dropdown = document.getElementById('notificationDropdown');
        this.listContainer = document.getElementById('notifListContainer');
        this.btnMarkRead = document.getElementById('btnMarkAllNotifsRead');

        if (this.btn) {
            this.btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown();
            });
        }

        if (this.btnMarkRead) {
            this.btnMarkRead.addEventListener('click', (e) => {
                e.stopPropagation();
                this.markAllAsRead();
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (this.dropdown && !this.dropdown.classList.contains('hidden')) {
                if (!this.dropdown.contains(e.target) && this.btn && !this.btn.contains(e.target)) {
                    this.closeDropdown();
                }
            }
        });

        // Initial fetch & fast live polling (every 5 seconds)
        this.fetchAnnouncements();
        setInterval(() => this.fetchAnnouncements(), 5000);
    },

    getReadIds() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch(e) {
            return [];
        }
    },

    setReadIds(ids) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ids));
        } catch(e) {}
    },

    async fetchAnnouncements() {
        try {
            const res = await fetch('/api/announcements?_t=' + Date.now(), { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                if (data && Array.isArray(data.list)) {
                    this.list = data.list;
                    this.updateBadge();
                    if (this.dropdown && !this.dropdown.classList.contains('hidden')) {
                        this.renderList();
                    }
                }
            }
        } catch(e) {
            console.warn("Could not fetch announcements", e);
        }
    },

    updateBadge() {
        if (!this.badge) this.badge = document.getElementById('notificationBadge');
        if (!this.badge) return;

        const readIds = this.getReadIds();
        const unread = this.list.filter(item => !readIds.includes(item.id));
        this.unreadCount = unread.length;

        if (this.unreadCount > 0) {
            this.badge.textContent = this.unreadCount > 9 ? '9+' : this.unreadCount;
            this.badge.classList.remove('hidden');
            this.badge.style.display = 'flex';
        } else {
            this.badge.classList.add('hidden');
            this.badge.style.display = 'none';
        }
    },

    toggleDropdown() {
        if (!this.dropdown) this.dropdown = document.getElementById('notificationDropdown');
        if (!this.dropdown) return;

        const isHidden = this.dropdown.classList.contains('hidden');
        if (isHidden) {
            this.dropdown.classList.remove('hidden');
            // Render immediately with current cache
            this.renderList();
            // And fetch fresh in background
            this.fetchAnnouncements();
        } else {
            this.dropdown.classList.add('hidden');
        }
    },

    closeDropdown() {
        if (!this.dropdown) this.dropdown = document.getElementById('notificationDropdown');
        if (this.dropdown) this.dropdown.classList.add('hidden');
    },

    markAllAsRead() {
        const allIds = this.list.map(item => item.id);
        this.setReadIds(allIds);
        this.updateBadge();
        this.renderList();
        if (window.Utils && Utils.toast) {
            Utils.toast('Pemberitahuan telah ditandai dibaca', 'info');
        }
    },

    markSingleAsRead(id) {
        const readIds = this.getReadIds();
        if (!readIds.includes(id)) {
            readIds.push(id);
            this.setReadIds(readIds);
            this.updateBadge();
            this.renderList();
        }
    },

    renderList() {
        if (!this.listContainer) this.listContainer = document.getElementById('notifListContainer');
        if (!this.listContainer) return;

        if (!this.list || this.list.length === 0) {
            this.listContainer.innerHTML = `
                <div class="notif-empty-state" style="padding: 30px 20px; text-align: center; color: var(--text-tertiary, #94a3b8); font-size: 0.85rem;">
                    <p style="margin: 0;">Belum ada pengumuman / update baru.</p>
                </div>
            `;
            return;
        }

        const readIds = this.getReadIds();

        this.listContainer.innerHTML = this.list.map(item => {
            const isRead = readIds.includes(item.id);
            const timeStr = item.createdAt ? this.formatRelativeTime(item.createdAt) : 'Baru saja';
            const msg = (item.message || item.title || '').trim();

            return `
                <div class="notif-item ${isRead ? 'read' : 'unread'}" onclick="Notifications.markSingleAsRead('${item.id}')" style="padding: 14px 18px; border-bottom: 1px solid var(--border-color, #f1f5f9); cursor: pointer; transition: background 0.15s; position: relative; background: ${isRead ? 'transparent' : 'rgba(59, 130, 246, 0.06)'}; display: flex; flex-direction: column; gap: 4px;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span style="font-size: 0.72rem; font-weight: 700; color: #8b5cf6; text-transform: uppercase; letter-spacing: 0.5px;">📢 Pengumuman</span>
                        <span style="font-size: 0.72rem; color: var(--text-tertiary, #94a3b8);">${timeStr}</span>
                    </div>
                    <p style="margin: 0; font-size: 0.86rem; color: var(--text-primary, #0f172a); line-height: 1.45; white-space: pre-wrap; font-weight: ${isRead ? '400' : '600'}; padding-right: 12px;">${this.escapeHtml(msg)}</p>
                    ${!isRead ? '<span style="position: absolute; top: 16px; right: 14px; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; box-shadow: 0 0 6px #ef4444;"></span>' : ''}
                </div>
            `;
        }).join('');
    },

    formatRelativeTime(iso) {
        try {
            const date = new Date(iso);
            const now = new Date();
            const diffSec = Math.floor((now - date) / 1000);
            if (diffSec < 60) return 'Baru saja';
            const diffMin = Math.floor(diffSec / 60);
            if (diffMin < 60) return `${diffMin} mnt lalu`;
            const diffHour = Math.floor(diffMin / 60);
            if (diffHour < 24) return `${diffHour} jam lalu`;
            const diffDay = Math.floor(diffHour / 24);
            return `${diffDay} hari lalu`;
        } catch(e) {
            return 'Baru saja';
        }
    },

    escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
};

window.Notifications = Notifications;

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Notifications.init());
} else {
    Notifications.init();
}


