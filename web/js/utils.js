/* ============================================================
   NOVA — Utility Functions
   ============================================================ */

const Utils = {
    // LocalStorage
    storage: {
        get(key, defaultVal = null) {
            try {
                const val = localStorage.getItem(`nova_${key}`);
                return val ? JSON.parse(val) : defaultVal;
            } catch { return defaultVal; }
        },
        set(key, value) {
            try { localStorage.setItem(`nova_${key}`, JSON.stringify(value)); }
            catch (e) { console.warn('Storage error:', e); }
        },
        remove(key) {
            localStorage.removeItem(`nova_${key}`);
        }
    },

    // Toast Notifications
    toast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icons = {
            success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
            error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
        };

        toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-out');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    // File Upload Handler
    handleFileUpload(inputEl, previewEl, placeholderEl, callback) {
        const processFile = (file) => {
            if (!file || !file.type.startsWith('image/')) {
                Utils.toast('Please upload an image file', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                previewEl.src = e.target.result;
                previewEl.classList.remove('hidden');
                if (placeholderEl) placeholderEl.classList.add('hidden');
                if (callback) callback(file, e.target.result);
            };
            reader.readAsDataURL(file);
        };

        // Click to upload
        inputEl.addEventListener('change', (e) => {
            processFile(e.target.files[0]);
        });

        return processFile;
    },

    // Setup Drag & Drop
    setupDragDrop(zoneEl, inputEl, processFile) {
        ['dragenter', 'dragover'].forEach(evt => {
            zoneEl.addEventListener(evt, (e) => {
                e.preventDefault();
                zoneEl.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(evt => {
            zoneEl.addEventListener(evt, (e) => {
                e.preventDefault();
                zoneEl.classList.remove('drag-over');
            });
        });

        zoneEl.addEventListener('drop', (e) => {
            const file = e.dataTransfer.files[0];
            processFile(file);
        });

        zoneEl.addEventListener('click', () => inputEl.click());
    },

    // Debounce
    debounce(fn, delay = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(null, args), delay);
        };
    },

    // Auto-resize textarea
    autoResize(textarea) {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
        });
    },

    // Get greeting based on time
    getGreeting() {
        const hour = new Date().getHours();
        if (hour < 6) return 'Good night';
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        if (hour < 21) return 'Good evening';
        return 'Good night';
    },

    // Generate particles
    generateParticles(container, count = 30) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.width = (Math.random() * 3 + 1) + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDuration = (Math.random() * 20 + 15) + 's';
            particle.style.animationDelay = (Math.random() * 15) + 's';
            particle.style.opacity = Math.random() * 0.5 + 0.1;

            const colors = [
                'rgba(99, 102, 241, 0.4)',
                'rgba(59, 130, 246, 0.3)',
                'rgba(139, 92, 246, 0.3)',
                'rgba(236, 72, 153, 0.2)'
            ];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];

            container.appendChild(particle);
        }
    },

    // Loading overlay
    showLoading(text = 'Generating...') {
        const overlay = document.getElementById('loadingOverlay');
        const loadingText = document.getElementById('loadingText');
        loadingText.textContent = text;
        overlay.classList.remove('hidden');
    },

    hideLoading() {
        document.getElementById('loadingOverlay').classList.add('hidden');
    },

    // Simulate generation (for demo)
    async simulateGeneration(ms = 3000) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Media Lightbox Zoom Modal
    openMediaLightbox(type, mediaUrl) {
        if (!mediaUrl) return;
        const modal = document.getElementById('mediaLightboxModal');
        const imgEl = document.getElementById('mediaLightboxImage');
        const vidEl = document.getElementById('mediaLightboxVideo');
        const closeBtn = document.getElementById('mediaLightboxClose');
        const downloadBtn = document.getElementById('mediaLightboxDownload');

        if (!modal || !imgEl || !vidEl) return;

        if (type === 'image') {
            imgEl.src = mediaUrl;
            imgEl.classList.remove('hidden');
            vidEl.classList.add('hidden');
            vidEl.pause();
        } else if (type === 'video') {
            vidEl.src = mediaUrl;
            vidEl.classList.remove('hidden');
            imgEl.classList.add('hidden');
            vidEl.play().catch(() => {});
        }

        modal.classList.remove('hidden');

        // Close handlers
        const closeModal = () => {
            modal.classList.add('hidden');
            vidEl.pause();
            imgEl.src = '';
            vidEl.src = '';
        };

        closeBtn.onclick = closeModal;
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };

        // Download handler
        if (downloadBtn) {
            downloadBtn.onclick = async (e) => {
                e.stopPropagation();
                try {
                    const res = await fetch(mediaUrl);
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    const ext = type === 'video' ? 'mp4' : 'png';
                    a.download = `nova-${type}-${Date.now()}.${ext}`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    Utils.toast('Download berhasil!', 'success');
                } catch (err) {
                    window.open(mediaUrl, '_blank');
                }
            };
        }
    },

    // Automatic Background Version Checker & Seamless Hot-Updater
    initAutoUpdater() {
        let isUpdating = false;
        const currentVersion = window.NOVA_BUILD_VERSION || '';

        const checkVersion = async () => {
            if (isUpdating) return;
            try {
                const res = await fetch('/api/version?_t=' + Date.now(), { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.version && currentVersion && data.version !== currentVersion) {
                        isUpdating = true;
                        console.log("[Auto-Updater] New studio version detected:", data.version);

                        // Clear ServiceWorker & browser Cache API in background
                        if ('caches' in window) {
                            try {
                                const keys = await caches.keys();
                                await Promise.all(keys.map(k => caches.delete(k)));
                            } catch(e) {}
                        }
                        if ('serviceWorker' in navigator) {
                            try {
                                const regs = await navigator.serviceWorker.getRegistrations();
                                for (let r of regs) await r.unregister();
                            } catch(e) {}
                        }

                        this.showUpdateBanner(data.version);
                    }
                }
            } catch(e) {}
        };

        // Check every 20 seconds
        setInterval(checkVersion, 20000);
        // Check when user refocuses the tab / unlocks phone
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') checkVersion();
        });
        window.addEventListener('focus', checkVersion);
        // Initial check 3 seconds after load
        setTimeout(checkVersion, 3000);
    },

    showUpdateBanner(newVersion) {
        if (document.getElementById('novaAutoUpdateBanner')) return;
        const banner = document.createElement('div');
        banner.id = 'novaAutoUpdateBanner';
        banner.style.cssText = `
            position: fixed;
            top: 18px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100000;
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.96));
            border: 1px solid rgba(236, 72, 153, 0.5);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(236, 72, 153, 0.35);
            color: white;
            padding: 8px 16px;
            border-radius: 30px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 0.8rem;
            font-weight: 600;
            backdrop-filter: blur(12px);
            animation: slideDown 0.4s ease;
        `;
        banner.innerHTML = `
            <div style="display: flex; align-items: center; gap: 6px;">
                <span style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px #10b981; display: inline-block;"></span>
                <span>✨ Pembaruan Studio Baru Siap!</span>
            </div>
            <button id="btnApplyUpdateNow" style="background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; border: none; padding: 5px 14px; border-radius: 20px; font-size: 0.74rem; font-weight: 700; cursor: pointer; transition: transform 0.2s; box-shadow: 0 2px 8px rgba(236, 72, 153, 0.4);">
                Perbarui Sekarang
            </button>
        `;
        document.body.appendChild(banner);

        const reloadApp = () => {
            const cleanUrl = window.location.pathname + '?_v=' + Date.now();
            window.location.replace(cleanUrl);
        };

        const btn = document.getElementById('btnApplyUpdateNow');
        if (btn) btn.onclick = reloadApp;

        // If user is idle, auto-apply after 8 seconds
        setTimeout(() => {
            const isBusy = window.isGenerating || (typeof I2V !== 'undefined' && I2V.isGenerating);
            if (!isBusy) {
                reloadApp();
            }
        }, 8000);
    }
};
