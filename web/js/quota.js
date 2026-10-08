/* ============================================================
   NOVA — Usage & Daily Quota Manager
   Free vs NOVA PRO ($2/bulan)
   ============================================================ */

const QuotaManager = {
    // Limits definition
    LIMITS: {
        free: {
            chat: 200,
            image: 10,
            video: 7,
            vision: 15
        },
        pro: {
            chat: 999999, // Unlimited
            image: 150,
            video: 50,
            vision: 999999 // Unlimited
        }
    },

    getTodayKey() {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    },

    getUserTier() {
        try {
            // Prioritas/PRO hanya aktif jika Admin Mode sedang login aktif
            if (typeof Admin !== 'undefined' && Admin.isLoggedIn) {
                return 'pro';
            }
            const rawUser = localStorage.getItem('novaUser');
            if (rawUser) {
                const u = JSON.parse(rawUser);
                if (u.tier === 'pro' || u.isPro === true) {
                    return 'pro';
                }
            }
        } catch(e) {}
        return 'free';
    },

    getUsageData() {
        const today = this.getTodayKey();
        let data = Utils.storage.get('daily_usage', null);
        if (!data || data.date !== today) {
            data = {
                date: today,
                chat: 0,
                image: 0,
                video: 0,
                vision: 0
            };
            Utils.storage.set('daily_usage', data);
        }
        return data;
    },

    getRemaining(type) {
        const tier = this.getUserTier();
        const max = this.LIMITS[tier][type] || 0;
        const usage = this.getUsageData()[type] || 0;
        return Math.max(0, max - usage);
    },

    canUse(type) {
        const tier = this.getUserTier();
        if (tier === 'pro') return true;
        const remaining = this.getRemaining(type);
        return remaining > 0;
    },

    // ONLY DEDUCT ON 100% SUCCESS
    consume(type) {
        const today = this.getTodayKey();
        let data = this.getUsageData();
        if (data.date !== today) {
            data = { date: today, chat: 0, image: 0, video: 0, vision: 0 };
        }
        data[type] = (data[type] || 0) + 1;
        Utils.storage.set('daily_usage', data);
        this.updateUI();
    },

    showUpgradeModal(featureName) {
        let modal = document.getElementById('novaProUpgradeModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'novaProUpgradeModal';
            modal.className = 'nova-pro-modal-overlay';
            modal.innerHTML = `
                <div class="nova-pro-modal-card">
                    <button class="nova-pro-modal-close" onclick="QuotaManager.closeUpgradeModal()" aria-label="Tutup">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                    
                    <div class="pro-modal-hero">
                        <div class="pro-modal-img-wrapper">
                            <img src="assets/nova_pro_badge.jpg" alt="NOVA PRO VIP" class="pro-hero-badge-img">
                            <div class="pro-img-glow"></div>
                        </div>
                        <div class="pro-modal-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            <span>🚀 NOVA PRO — SEGERA HADIR</span>
                        </div>
                        <h2 class="pro-modal-title">Limit Harian Tercapai</h2>
                        <p class="pro-modal-desc" id="proModalFeatureDesc">
                            Kuota gratis kamu untuk <strong>${featureName || 'fitur ini'}</strong> telah habis untuk hari ini (Reset otomatis setiap pukul 00:00 WIB).
                        </p>
                    </div>

                    <div class="pro-benefits-grid">
                        <div class="benefit-card">
                            <div class="benefit-icon icon-chat">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            </div>
                            <div class="benefit-text">
                                <strong>Unlimited Chat AI</strong>
                                <span>Akses DeepSeek Chat & Coding tanpa batas</span>
                            </div>
                        </div>

                        <div class="benefit-card">
                            <div class="benefit-icon icon-img">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            </div>
                            <div class="benefit-text">
                                <strong>150 Gambar AI / Hari</strong>
                                <span>Generate & Edit foto kualitas Ultra-HD</span>
                            </div>
                        </div>

                        <div class="benefit-card">
                            <div class="benefit-icon icon-vid">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                            </div>
                            <div class="benefit-text">
                                <strong>50 Video Animasi / Hari</strong>
                                <span>Wan 2.1 I2V dengan antrean prioritas kilat</span>
                            </div>
                        </div>

                        <div class="benefit-card">
                            <div class="benefit-icon icon-vip">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            </div>
                            <div class="benefit-text">
                                <strong>NOVA PRO Glow Badge</strong>
                                <span>Status eksklusif VIP & Jalur Server Cepat</span>
                            </div>
                        </div>
                    </div>

                    <div class="pro-pricing-box">
                        <div class="price-left">
                            <span class="price-tag">$2</span>
                            <span class="price-sub">/ bulan (Rp 32.000)</span>
                        </div>
                        <div class="price-guarantee" style="color: #6366f1;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            <span>Tahap Pengembangan</span>
                        </div>
                    </div>

                    <button class="pro-upgrade-btn" onclick="QuotaManager.notifyInterest()">
                        <span>🔔 Beritahu Saya Saat Rilis (Coming Soon)</span>
                    </button>
                    <p class="pro-guarantee-note">Fitur NOVA PRO saat ini sedang dalam tahap uji coba akhir & akan segera dibuka!</p>
                </div>
            `;
            document.body.appendChild(modal);
        } else {
            const desc = document.getElementById('proModalFeatureDesc');
            if (desc) {
                desc.innerHTML = `Kuota gratis harian kamu untuk <strong>${featureName || 'fitur ini'}</strong> telah habis untuk hari ini (Reset otomatis setiap pukul 00:00 WIB).`;
            }
        }
        setTimeout(() => modal.classList.add('active'), 10);
    },

    closeUpgradeModal() {
        const modal = document.getElementById('novaProUpgradeModal');
        if (modal) modal.classList.remove('active');
    },

    notifyInterest() {
        this.closeUpgradeModal();
        Utils.toast('🎉 Terima kasih! Kamu masuk ke daftar antrean VIP saat NOVA PRO resmi rilis!', 'success');
    },

    updateUI() {
        const tier = this.getUserTier();
        const usage = this.getUsageData();

        const remChat = this.getRemaining('chat');
        const remImg = this.getRemaining('image');
        const remVid = this.getRemaining('video');
        const remVision = this.getRemaining('vision');

        const pctChat = Math.min(100, Math.round((remChat / 200) * 100));
        const pctImg = Math.min(100, Math.round((remImg / 10) * 100));
        const pctVid = Math.min(100, Math.round((remVid / 7) * 100));
        const pctVision = Math.min(100, Math.round((remVision / 15) * 100));

        // 1. Render Compact Minimal Widget in Sidebar (Gambar 2)
        const sidebarIndicator = document.getElementById('quotaSidebarWidget');
        if (sidebarIndicator) {
            if (tier === 'pro') {
                sidebarIndicator.innerHTML = `
                    <div class="quota-widget-pro-compact">
                        <div class="pro-widget-badge">
                            <img src="assets/nova_pro_badge.jpg" alt="Pro" class="pro-mini-avatar">
                            <div class="pro-badge-info">
                                <span class="pro-badge-name">NOVA PRO VIP</span>
                                <span class="pro-badge-status">Prioritas Aktif</span>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                sidebarIndicator.innerHTML = `
                    <div class="quota-widget-free-compact">
                        <div class="quota-header-compact">
                            <div class="quota-tier-info" onclick="document.getElementById('settingsBtn') && document.getElementById('settingsBtn').click()" style="cursor: pointer;" title="Klik untuk lihat detail kuota">
                                <span class="quota-tier-dot"></span>
                                <span class="quota-tier-title">Free Plan</span>
                            </div>
                            <button class="btn-upgrade-pill" onclick="QuotaManager.showUpgradeModal('Semua Fitur')">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                <span>PRO (Soon)</span>
                            </button>
                        </div>
                    </div>
                `;
            }
        }

        // 2. Render Full Detailed Quota & Progress Bars inside Account Modal (Gambar 1)
        const accountQuotaEl = document.getElementById('accountQuotaContainer');
        if (accountQuotaEl) {
            if (tier === 'pro') {
                accountQuotaEl.innerHTML = `
                    <div class="account-quota-box pro-account-box">
                        <div class="account-quota-header">
                            <div class="account-quota-title" style="color: #ec4899;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                <span>NOVA PRO VIP MEMBERSHIP</span>
                            </div>
                            <span class="account-reset-badge" style="background: rgba(236, 72, 153, 0.15); color: #ec4899;">Akses Tanpa Batas</span>
                        </div>
                        <p style="font-size: 0.78rem; color: #64748b; margin: 8px 0 0 0;">Akun kamu memiliki prioritas antrean kilat & limit VIP aktif.</p>
                    </div>
                `;
            } else {
                accountQuotaEl.innerHTML = `
                    <div class="account-quota-box">
                        <div class="account-quota-header">
                            <div class="account-quota-title">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                <span>STATUS KUOTA HARIAN</span>
                            </div>
                            <span class="account-reset-badge">Reset 00:00 WIB</span>
                        </div>
                        
                        <div class="quota-items-list" style="margin-top: 10px;">
                            <div class="quota-row" title="Sisa Chat AI hari ini">
                                <div class="q-icon-wrap q-chat">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                </div>
                                <div class="q-progress-box">
                                    <div class="q-labels">
                                        <span class="q-name">Chat AI & Coding</span>
                                        <span class="q-val">${remChat}/200</span>
                                    </div>
                                    <div class="q-bar-track">
                                        <div class="q-bar-fill fill-chat" style="width: ${pctChat}%;"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="quota-row" title="Sisa Image AI hari ini">
                                <div class="q-icon-wrap q-img">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                </div>
                                <div class="q-progress-box">
                                    <div class="q-labels">
                                        <span class="q-name">Image AI (I2I)</span>
                                        <span class="q-val">${remImg}/10</span>
                                    </div>
                                    <div class="q-bar-track">
                                        <div class="q-bar-fill fill-img" style="width: ${pctImg}%;"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="quota-row" title="Sisa Video AI hari ini">
                                <div class="q-icon-wrap q-vid">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                                </div>
                                <div class="q-progress-box">
                                    <div class="q-labels">
                                        <span class="q-name">Video I2V (Wan 2.1)</span>
                                        <span class="q-val">${remVid}/7</span>
                                    </div>
                                    <div class="q-bar-track">
                                        <div class="q-bar-fill fill-vid" style="width: ${pctVid}%;"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="quota-row" title="Sisa Foto Lampiran di Chat hari ini">
                                <div class="q-icon-wrap" style="background: rgba(16, 185, 129, 0.12); color: #059669;">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                </div>
                                <div class="q-progress-box">
                                    <div class="q-labels">
                                        <span class="q-name">Vision (Kirim Gambar)</span>
                                        <span class="q-val">${remVision}/15</span>
                                    </div>
                                    <div class="q-bar-track">
                                        <div class="q-bar-fill" style="background: linear-gradient(90deg, #10b981, #34d399); width: ${pctVision}%;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button class="account-upgrade-btn" onclick="document.getElementById('settingsClose') && document.getElementById('settingsClose').click(); QuotaManager.showUpgradeModal('Semua Fitur')">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            <span>Lihat Detail NOVA PRO (Segera Hadir)</span>
                        </button>
                    </div>
                `;
            }
        }
    }
};

window.QuotaManager = QuotaManager;

// Auto-initialize Quota UI immediately on script execution and on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        try { QuotaManager.updateUI(); } catch(e){}
    });
} else {
    try { QuotaManager.updateUI(); } catch(e){}
}
