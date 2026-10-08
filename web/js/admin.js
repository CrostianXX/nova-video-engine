/* ============================================================
   NOVA — Admin Mode Logic
   ============================================================ */

const Admin = {
    isLoggedIn: false,
    isCaptchaSolved: false,
    
    init() {
        this.overlay = document.getElementById('adminLoginModal');
        this.userInp = document.getElementById('adminUser');
        this.pinInp = document.getElementById('adminPin');
        this.submitBtn = document.getElementById('adminSubmitBtn');
        this.cancelBtn = document.getElementById('adminCancelBtn');
        this.toast = document.getElementById('adminToast');
        this.toastText = document.getElementById('adminToastText');
        
        // Captcha elements
        this.captchaTrack = document.getElementById('captchaTrack');
        this.captchaThumb = document.getElementById('captchaThumb');
        this.captchaText = document.getElementById('captchaText');
        this.captchaContainer = document.getElementById('captchaContainer');
        this.captchaIcon = document.getElementById('captchaIcon');

        this.bindEvents();
        this.initCaptcha();
        this.checkSavedSession();
    },

    bindEvents() {
        if (!this.overlay) return;
        
        this.cancelBtn.addEventListener('click', () => this.closeLoginModal());
        this.submitBtn.addEventListener('click', () => this.attemptLogin());
        
        // Enter key
        this.pinInp.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.submitBtn.disabled) {
                this.attemptLogin();
            }
        });
        
        // Input validation
        this.userInp.addEventListener('input', () => this.validateForm());
        this.pinInp.addEventListener('input', () => this.validateForm());
    },

    initCaptcha() {
        if (!this.captchaThumb) return;
        
        let isDragging = false;
        let startX = 0;
        let thumbLeft = 0;
        let maxDrag = 0;

        const onStart = (e) => {
            if (this.isCaptchaSolved) return;
            isDragging = true;
            startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            maxDrag = this.captchaContainer.offsetWidth - this.captchaThumb.offsetWidth - 8; // 4px padding
        };

        const onMove = (e) => {
            if (!isDragging || this.isCaptchaSolved) return;
            const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            let diff = currentX - startX;
            
            if (diff < 0) diff = 0;
            if (diff > maxDrag) diff = maxDrag;
            
            this.captchaThumb.style.left = (diff + 4) + 'px';
            this.captchaTrack.style.width = (diff + 24) + 'px';
            
            if (diff >= maxDrag * 0.95) {
                this.solveCaptcha();
                isDragging = false;
            }
        };

        const onEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            if (!this.isCaptchaSolved) {
                this.captchaThumb.style.transition = 'left 0.3s ease';
                this.captchaTrack.style.transition = 'width 0.3s ease';
                this.captchaThumb.style.left = '4px';
                this.captchaTrack.style.width = '0px';
                
                setTimeout(() => {
                    this.captchaThumb.style.transition = 'left 0s';
                    this.captchaTrack.style.transition = 'width 0s';
                }, 300);
            }
        };

        this.captchaThumb.addEventListener('mousedown', onStart);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);
        
        this.captchaThumb.addEventListener('touchstart', onStart, {passive: true});
        document.addEventListener('touchmove', onMove, {passive: false});
        document.addEventListener('touchend', onEnd);
    },

    solveCaptcha() {
        this.isCaptchaSolved = true;
        this.captchaThumb.classList.add('success');
        this.captchaTrack.classList.add('success');
        this.captchaText.classList.add('success');
        this.captchaText.textContent = 'Verified';
        this.captchaIcon.innerHTML = '<path d="M20 6L9 17l-5-5"/>'; // Checkmark
        this.validateForm();
    },

    resetCaptcha() {
        this.isCaptchaSolved = false;
        if(this.captchaThumb) {
            this.captchaThumb.classList.remove('success');
            this.captchaTrack.classList.remove('success');
            this.captchaText.classList.remove('success');
            this.captchaThumb.style.left = '4px';
            this.captchaTrack.style.width = '0px';
            this.captchaText.textContent = 'Slide to Verify';
            this.captchaIcon.innerHTML = '<path d="M9 18l6-6-6-6"/>'; // Arrows
        }
    },

    validateForm() {
        const u = this.userInp.value.trim();
        const p = this.pinInp.value.trim();
        if (u.length > 0 && p.length >= 6 && this.isCaptchaSolved) {
            this.submitBtn.disabled = false;
        } else {
            this.submitBtn.disabled = true;
        }
    },

    showLoginModal() {
        if (this.isLoggedIn) {
            this.showToast("Admin mode is already active!");
            return;
        }
        this.userInp.value = '';
        this.pinInp.value = '';
        this.resetCaptcha();
        this.validateForm();
        this.overlay.classList.add('active');
        setTimeout(() => this.userInp.focus(), 100);
    },

    closeLoginModal() {
        this.overlay.classList.remove('active');
    },

    attemptLogin() {
        const u = this.userInp.value.trim();
        const p = this.pinInp.value.trim();
        
        // Hardcoded credential check as requested
        if (u === 'anonim' && p === '123458') {
            this.loginSuccess();
        } else {
            // Visual error shake
            const box = document.querySelector('.admin-login-box');
            box.style.transform = 'translateY(0) scale(1) translateX(10px)';
            setTimeout(() => box.style.transform = 'translateY(0) scale(1) translateX(-10px)', 50);
            setTimeout(() => box.style.transform = 'translateY(0) scale(1) translateX(10px)', 100);
            setTimeout(() => box.style.transform = 'translateY(0) scale(1) translateX(0)', 150);
            this.pinInp.value = '';
            this.resetCaptcha();
            this.validateForm();
            this.showToast("Invalid Credentials", false);
        }
    },

    loginSuccess() {
        this.isLoggedIn = true;
        localStorage.setItem('nova_admin_mode', 'true');
        this.closeLoginModal();
        this.enableAdminTheme();
        if (window.AdminPrompts) {
            AdminPrompts.renderPresets('i2i');
            AdminPrompts.renderPresets('i2v');
            AdminPrompts.fetchServerPresets();
        }
        if (window.QuotaManager) {
            QuotaManager.updateUI();
        }
        this.showToast("Admin mode activated!");
    },

    logout() {
        if (!this.isLoggedIn) return;
        this.isLoggedIn = false;
        localStorage.removeItem('nova_admin_mode');
        this.disableAdminTheme();
        if (window.QuotaManager) {
            QuotaManager.updateUI();
        }
        this.showToast("Admin mode deactivated", false);
    },

    enableAdminTheme() {
        document.body.classList.add('admin-mode');
    },

    disableAdminTheme() {
        document.body.classList.remove('admin-mode');
    },

    checkSavedSession() {
        if (localStorage.getItem('nova_admin_mode') === 'true') {
            this.isLoggedIn = true;
            this.enableAdminTheme();
            if (window.QuotaManager) {
                QuotaManager.updateUI();
            }
        }
    },

    showToast(msg, isSuccess = true) {
        if (!this.toast) return;
        
        // Update icon based on success or error/logout
        const iconSvg = this.toast.querySelector('svg');
        if (iconSvg) {
            if (isSuccess) {
                iconSvg.innerHTML = '<path d="M20 6L9 17l-5-5"/>';
                iconSvg.style.color = 'var(--success)';
            } else {
                iconSvg.innerHTML = '<path d="M18 6L6 18M6 6l12 12"/>'; // X icon
                iconSvg.style.color = 'var(--accent-indigo)';
            }
        }

        this.toastText.textContent = msg;
        this.toast.classList.add('show');
        
        if (this.toastTimeout) clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }
};

/* ============================================================
   ADMIN PROMPT SAVER & PRESETS MANAGER (I2I & I2V)
   ============================================================ */
const AdminPrompts = {
    activeTarget: 'i2i', // 'i2i' or 'i2v'

    getCustomPresets(type) {
        try {
            const data = localStorage.getItem(`nova_admin_prompts_${type}`);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    saveCustomPresets(type, list) {
        localStorage.setItem(`nova_admin_prompts_${type}`, JSON.stringify(list));
    },

    async fetchServerPresets() {
        try {
            const res = await fetch('/api/admin/prompts');
            if (!res.ok) return;
            const data = await res.json();
            if (data && data.success) {
                let updated = false;

                // Sync server data to local
                if (Array.isArray(data.i2i) && data.i2i.length > 0) {
                    this.saveCustomPresets('i2i', data.i2i);
                    updated = true;
                }
                if (Array.isArray(data.i2v) && data.i2v.length > 0) {
                    this.saveCustomPresets('i2v', data.i2v);
                    updated = true;
                }

                // If local had data but server was empty, push local to server!
                const localI2I = this.getCustomPresets('i2i');
                const localI2V = this.getCustomPresets('i2v');
                if ((!data.i2i || data.i2i.length === 0) && localI2I.length > 0) {
                    this.pushServerPreset('i2i', { action: 'sync', prompts: localI2I });
                }
                if ((!data.i2v || data.i2v.length === 0) && localI2V.length > 0) {
                    this.pushServerPreset('i2v', { action: 'sync', prompts: localI2V });
                }

                if (updated) {
                    this.renderPresets('i2i');
                    this.renderPresets('i2v');
                }
            }
        } catch (e) {
            console.warn('Could not sync admin prompts with server:', e);
        }
    },

    async pushServerPreset(type, payload) {
        try {
            await fetch('/api/admin/prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, ...payload })
            });
        } catch (e) {
            console.warn('Failed to push prompt to server:', e);
        }
    },

    init() {
        this.initElements();
        this.renderPresets('i2i');
        this.renderPresets('i2v');
        this.bindEvents();
        this.fetchServerPresets();
    },

    initElements() {
        this.selectI2I = document.getElementById('adminPromptSelectI2I');
        this.selectI2V = document.getElementById('adminPromptSelectI2V');
        this.saveBtnI2I = document.getElementById('adminSavePromptBtnI2I');
        this.saveBtnI2V = document.getElementById('adminSavePromptBtnI2V');
        this.delBtnI2I = document.getElementById('adminDelPromptBtnI2I');
        this.delBtnI2V = document.getElementById('adminDelPromptBtnI2V');
        
        this.modal = document.getElementById('adminSavePromptModal');
        this.modalSubtitle = document.getElementById('adminSavePromptSubtitle');
        this.inputTitle = document.getElementById('adminSavePromptTitleInput');
        this.inputContent = document.getElementById('adminSavePromptContentInput');
        this.confirmBtn = document.getElementById('adminSavePromptConfirmBtn');
        this.cancelBtn = document.getElementById('adminSavePromptCancelBtn');
    },

    renderPresets(type) {
        const select = type === 'i2i' ? this.selectI2I : this.selectI2V;
        if (!select) return;

        const customs = this.getCustomPresets(type);

        let html = `<option value="">📂 Pilih Prompt Tersimpan (${type.toUpperCase()})...</option>`;

        if (customs.length > 0) {
            html += `<optgroup label="⭐ Prompt Tersimpan Admin (${customs.length})">`;
            customs.forEach(item => {
                html += `<option value="custom:${item.id}">${item.name}</option>`;
            });
            html += `</optgroup>`;
        } else {
            html += `<option value="" disabled>(Belum ada prompt tersimpan)</option>`;
        }

        select.innerHTML = html;
        this.updateDelBtnVisibility(type);
    },

    updateDelBtnVisibility(type) {
        const select = type === 'i2i' ? this.selectI2I : this.selectI2V;
        const delBtn = type === 'i2i' ? this.delBtnI2I : this.delBtnI2V;
        if (!select || !delBtn) return;

        if (select.value && select.value.startsWith('custom:')) {
            delBtn.style.display = 'inline-flex';
        } else {
            delBtn.style.display = 'none';
        }
    },

    applyPreset(type) {
        const select = type === 'i2i' ? this.selectI2I : this.selectI2V;
        const textarea = document.getElementById(type === 'i2i' ? 'imagePrompt' : 'i2vPrompt');
        if (!select || !textarea) return;

        const val = select.value;
        this.updateDelBtnVisibility(type);

        if (!val) return;

        let selectedPrompt = '';
        let selectedName = '';

        if (val.startsWith('custom:')) {
            const id = val.replace('custom:', '');
            const customs = this.getCustomPresets(type);
            const found = customs.find(c => c.id === id);
            if (found) {
                selectedPrompt = found.prompt;
                selectedName = found.name;
            }
        }

        if (selectedPrompt) {
            textarea.value = selectedPrompt;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Visual pulse glow
            textarea.classList.remove('prompt-pulse-active');
            void textarea.offsetWidth; // trigger reflow
            textarea.classList.add('prompt-pulse-active');
            setTimeout(() => textarea.classList.remove('prompt-pulse-active'), 1100);

            if (window.Admin && Admin.showToast) {
                Admin.showToast(`Preset "${selectedName}" diterapkan! ✨`);
            }
        }
    },

    openSaveModal(type) {
        this.activeTarget = type;
        const textarea = document.getElementById(type === 'i2i' ? 'imagePrompt' : 'i2vPrompt');
        const promptText = textarea ? textarea.value.trim() : '';

        if (!promptText) {
            if (window.Admin && Admin.showToast) {
                Admin.showToast('Ketik prompt terlebih dahulu sebelum menyimpan!', false);
            }
            if (textarea) textarea.focus();
            return;
        }

        if (this.modalSubtitle) {
            this.modalSubtitle.textContent = `Simpan prompt untuk workspace ${type.toUpperCase()}`;
        }
        if (this.inputContent) {
            this.inputContent.value = promptText;
        }
        if (this.inputTitle) {
            this.inputTitle.value = '';
        }

        if (this.modal) {
            this.modal.classList.add('active');
            setTimeout(() => {
                if (this.inputTitle) this.inputTitle.focus();
            }, 100);
        }
    },

    closeSaveModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
        }
    },

    confirmSave() {
        const type = this.activeTarget;
        const title = this.inputTitle ? this.inputTitle.value.trim() : '';
        const content = this.inputContent ? this.inputContent.value.trim() : '';

        if (!content) {
            if (window.Admin && Admin.showToast) {
                Admin.showToast('Isi prompt tidak boleh kosong!', false);
            }
            return;
        }

        const now = new Date();
        const finalTitle = title || `Preset ${now.toLocaleDateString('id-ID')} ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
        const customs = this.getCustomPresets(type);
        const newId = 'c_' + Date.now();

        const newPrompt = {
            id: newId,
            name: finalTitle,
            prompt: content,
            date: Date.now()
        };

        customs.unshift(newPrompt);

        this.saveCustomPresets(type, customs);
        this.renderPresets(type);

        const select = type === 'i2i' ? this.selectI2I : this.selectI2V;
        if (select) {
            select.value = `custom:${newId}`;
            this.updateDelBtnVisibility(type);
        }

        this.closeSaveModal();

        // Sync to Server Data Admin (Cloudflare KV PROMPTS_DB)
        this.pushServerPreset(type, { action: 'save', prompt: newPrompt });

        if (window.Admin && Admin.showToast) {
            Admin.showToast(`Preset "${finalTitle}" tersimpan di Data Admin! 💾`);
        }
    },

    deleteSelectedPreset(type) {
        const select = type === 'i2i' ? this.selectI2I : this.selectI2V;
        if (!select || !select.value.startsWith('custom:')) return;

        const id = select.value.replace('custom:', '');
        const customs = this.getCustomPresets(type);
        const target = customs.find(c => c.id === id);
        const name = target ? target.name : 'Preset';

        if (!confirm(`Hapus preset "${name}"?`)) return;

        const filtered = customs.filter(c => c.id !== id);
        this.saveCustomPresets(type, filtered);
        this.renderPresets(type);

        select.value = '';
        this.updateDelBtnVisibility(type);

        // Delete from Server Data Admin (Cloudflare KV PROMPTS_DB)
        this.pushServerPreset(type, { action: 'delete', id });

        if (window.Admin && Admin.showToast) {
            Admin.showToast(`Preset "${name}" telah dihapus dari Data Admin! 🗑️`, false);
        }
    },

    bindEvents() {
        // I2I events
        if (this.selectI2I) {
            this.selectI2I.addEventListener('change', () => this.applyPreset('i2i'));
        }
        if (this.saveBtnI2I) {
            this.saveBtnI2I.addEventListener('click', () => this.openSaveModal('i2i'));
        }
        if (this.delBtnI2I) {
            this.delBtnI2I.addEventListener('click', () => this.deleteSelectedPreset('i2i'));
        }

        // I2V events
        if (this.selectI2V) {
            this.selectI2V.addEventListener('change', () => this.applyPreset('i2v'));
        }
        if (this.saveBtnI2V) {
            this.saveBtnI2V.addEventListener('click', () => this.openSaveModal('i2v'));
        }
        if (this.delBtnI2V) {
            this.delBtnI2V.addEventListener('click', () => this.deleteSelectedPreset('i2v'));
        }

        // Modal events
        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', () => this.closeSaveModal());
        }
        if (this.confirmBtn) {
            this.confirmBtn.addEventListener('click', () => this.confirmSave());
        }
        if (this.inputTitle) {
            this.inputTitle.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.confirmSave();
            });
        }
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.closeSaveModal();
            });
        }
    }
};

/* ============================================================
   TOKEN HEALTH INSPECTOR LOGIC
   ============================================================ */
const TokenHealth = {
    tokens: [],
    results: [], // { token, status: 'active'|'limited'|'dead'|'untested', username: '', rawError: '' }
    isChecking: false,
    activeFilter: 'all',
    searchQuery: '',
    pendingDeleteToken: null,

    init() {
        this.gatherTokens();
        this.bindEvents();
        this.renderStats();
        this.renderList();
    },

    gatherTokens() {
        const tokenSet = new Set();
        if (typeof I2I_TOKENS !== 'undefined' && Array.isArray(I2I_TOKENS)) {
            I2I_TOKENS.forEach(t => { if (t && t.trim()) tokenSet.add(t.trim()); });
        }
        if (typeof I2V_TOKENS !== 'undefined' && Array.isArray(I2V_TOKENS)) {
            I2V_TOKENS.forEach(t => { if (t && t.trim()) tokenSet.add(t.trim()); });
        }
        this.tokens = Array.from(tokenSet);

        // Load cached results if any
        try {
            const cached = localStorage.getItem('nova_token_health_cache');
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    this.results = parsed;
                    return;
                }
            }
        } catch (e) {}

        // Default initial state
        this.results = this.tokens.map(token => ({
            token,
            status: 'untested',
            username: '-',
            rawError: ''
        }));
    },

    bindEvents() {
        const btnCheck = document.getElementById('btnCheckAllTokens');
        btnCheck?.addEventListener('click', () => {
            if (!this.isChecking) this.checkAllTokens();
        });

        // Filter tabs
        document.querySelectorAll('.token-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.token-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeFilter = btn.dataset.filter || 'all';
                this.renderList();
            });
        });

        // Search input
        const searchInput = document.getElementById('tokenSearchInput');
        searchInput?.addEventListener('input', (e) => {
            this.searchQuery = (e.target.value || '').trim().toLowerCase();
            this.renderList();
        });

        // Delete confirmation modal events
        const modalDelete = document.getElementById('adminDeleteTokenModal');
        const btnCancel = document.getElementById('btnCancelDeleteToken');
        const btnConfirm = document.getElementById('btnConfirmDeleteToken');

        btnCancel?.addEventListener('click', () => this.closeDeleteModal());
        btnConfirm?.addEventListener('click', () => this.executeDeleteToken());

        modalDelete?.addEventListener('click', (e) => {
            if (e.target === modalDelete) this.closeDeleteModal();
        });
    },

    async checkSingleToken(token) {
        try {
            const res = await fetch('https://huggingface.co/api/whoami-v2', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.status === 200) {
                const data = await res.json();
                const name = data.name || (data.user && data.user.name) || data.id || 'Active User';
                return {
                    token,
                    status: 'active',
                    username: name,
                    rawError: ''
                };
            } else if (res.status === 429) {
                return {
                    token,
                    status: 'limited',
                    username: 'Rate Limited (429)',
                    rawError: 'Rate limit tercapai'
                };
            } else if (res.status === 401 || res.status === 403) {
                return {
                    token,
                    status: 'dead',
                    username: 'Invalid (401/403)',
                    rawError: 'Token invalid / expired'
                };
            } else {
                return {
                    token,
                    status: 'dead',
                    username: `Error ${res.status}`,
                    rawError: `HTTP Status ${res.status}`
                };
            }
        } catch (err) {
            return {
                token,
                status: 'dead',
                username: 'Network Error',
                rawError: err.message
            };
        }
    },

    async checkAllTokens() {
        if (this.isChecking) return;
        this.isChecking = true;

        const btnCheck = document.getElementById('btnCheckAllTokens');
        const btnText = document.getElementById('btnCheckText');
        const progressContainer = document.getElementById('tokenCheckProgress');
        const progressBar = document.getElementById('tokenProgressBar');
        const progressText = document.getElementById('tokenProgressText');

        if (btnCheck) btnCheck.disabled = true;
        if (btnText) btnText.textContent = 'Sedang Memeriksa...';
        if (progressContainer) progressContainer.classList.remove('hidden');

        const total = this.tokens.length;
        let checkedCount = 0;
        const newResults = [];

        // Concurrency pool (batch 10 at a time for fast & non-blocking network)
        const batchSize = 10;
        for (let i = 0; i < total; i += batchSize) {
            const chunk = this.tokens.slice(i, i + batchSize);
            const chunkPromises = chunk.map(token => this.checkSingleToken(token));
            const chunkResults = await Promise.all(chunkPromises);

            chunkResults.forEach(res => {
                newResults.push(res);
                checkedCount++;
            });

            // Update progress
            const pct = Math.round((checkedCount / total) * 100);
            if (progressBar) progressBar.style.width = `${pct}%`;
            if (progressText) progressText.textContent = `Memeriksa token (${checkedCount}/${total})... ${pct}%`;

            this.results = [...newResults];
            this.renderStats();
            this.renderList();
        }

        this.results = newResults;
        this.isChecking = false;

        // Save cache
        try {
            localStorage.setItem('nova_token_health_cache', JSON.stringify(newResults));
        } catch (e) {}

        if (btnCheck) btnCheck.disabled = false;
        if (btnText) btnText.textContent = 'Cek Ulang Token';
        if (progressContainer) {
            progressText.textContent = `Pemeriksaan selesai! Total ${total} token diperiksa.`;
            setTimeout(() => progressContainer.classList.add('hidden'), 2500);
        }

        if (window.Admin && Admin.showToast) {
            Admin.showToast(`Pemeriksaan ${total} token selesai! ✨`);
        }
    },

    renderStats() {
        const total = this.tokens.length;
        let active = 0;
        let limited = 0;
        let dead = 0;

        this.results.forEach(r => {
            if (r.status === 'active') active++;
            else if (r.status === 'limited') limited++;
            else if (r.status === 'dead') dead++;
        });

        const elTotal = document.getElementById('statTotalTokens');
        const elActive = document.getElementById('statActiveTokens');
        const elLimited = document.getElementById('statLimitedTokens');
        const elDead = document.getElementById('statDeadTokens');

        if (elTotal) elTotal.textContent = total;
        if (elActive) elActive.textContent = active;
        if (elLimited) elLimited.textContent = limited;
        if (elDead) elDead.textContent = dead;

        // Tab counters
        const tabAll = document.getElementById('countTabAll');
        const tabActive = document.getElementById('countTabActive');
        const tabLimited = document.getElementById('countTabLimited');
        const tabDead = document.getElementById('countTabDead');

        if (tabAll) tabAll.textContent = total;
        if (tabActive) tabActive.textContent = active;
        if (tabLimited) tabLimited.textContent = limited;
        if (tabDead) tabDead.textContent = dead;
    },

    renderList() {
        const container = document.getElementById('tokenListItems');
        if (!container) return;

        let filtered = this.results;

        // Filter status
        if (this.activeFilter !== 'all') {
            filtered = filtered.filter(item => item.status === this.activeFilter);
        }

        // Search
        if (this.searchQuery) {
            filtered = filtered.filter(item => 
                item.token.toLowerCase().includes(this.searchQuery) ||
                item.username.toLowerCase().includes(this.searchQuery)
            );
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="token-empty-state">
                    <p>Tidak ada token yang cocok dengan filter atau pencarian ini.</p>
                </div>
            `;
            return;
        }

        const badgeMap = {
            active: '<span class="status-badge active"><svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg> Aktif</span>',
            limited: '<span class="status-badge limited"><svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg> Rate Limit</span>',
            dead: '<span class="status-badge dead"><svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg> Mati / Invalid</span>',
            untested: '<span class="status-badge untested"><svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg> Belum Dicek</span>'
        };

        let html = '';
        filtered.forEach((item, index) => {
            const masked = item.token.length > 16 
                ? item.token.substring(0, 7) + '••••••••' + item.token.substring(item.token.length - 6)
                : item.token;

            html += `
                <div class="token-row">
                    <span class="col-index">${index + 1}</span>
                    <span class="col-token" title="${item.token}">${masked}</span>
                    <div class="col-status">${badgeMap[item.status] || badgeMap.untested}</div>
                    <span class="col-user" title="${item.username}">${item.username}</span>
                    <div class="col-action">
                        <button class="btn-del-token" data-token="${item.token}" title="Hapus token ini">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            <span>Hapus</span>
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // Attach delete events
        container.querySelectorAll('.btn-del-token').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const token = btn.dataset.token;
                this.promptDeleteToken(token);
            });
        });
    },

    promptDeleteToken(token) {
        const found = this.results.find(r => r.token === token);
        this.pendingDeleteToken = token;

        const modal = document.getElementById('adminDeleteTokenModal');
        const targetId = document.getElementById('deleteTokenTargetId');
        const targetInfo = document.getElementById('deleteTokenTargetInfo');

        if (targetId) targetId.textContent = token;
        if (targetInfo) {
            const statusText = found ? (
                found.status === 'active' ? '🟢 Aktif' :
                found.status === 'limited' ? '🟡 Rate Limit' :
                found.status === 'dead' ? '🔴 Mati / Invalid' : '⚪ Belum Dicek'
            ) : '';
            targetInfo.textContent = `Status: ${statusText} ${found && found.username ? '(' + found.username + ')' : ''}`;
        }

        if (modal) modal.classList.add('active');
    },

    closeDeleteModal() {
        this.pendingDeleteToken = null;
        const modal = document.getElementById('adminDeleteTokenModal');
        if (modal) modal.classList.remove('active');
    },

    executeDeleteToken() {
        if (!this.pendingDeleteToken) return;
        const tokenToDelete = this.pendingDeleteToken;

        // 1. Remove from local token list
        this.tokens = this.tokens.filter(t => t !== tokenToDelete);
        this.results = this.results.filter(r => r.token !== tokenToDelete);

        // 2. Remove from runtime arrays if available
        if (typeof I2I_TOKENS !== 'undefined') {
            const idx1 = I2I_TOKENS.indexOf(tokenToDelete);
            if (idx1 > -1) I2I_TOKENS.splice(idx1, 1);
        }
        if (typeof I2V_TOKENS !== 'undefined') {
            const idx2 = I2V_TOKENS.indexOf(tokenToDelete);
            if (idx2 > -1) I2V_TOKENS.splice(idx2, 1);
        }

        // 3. Update localStorage cache
        try {
            localStorage.setItem('nova_token_health_cache', JSON.stringify(this.results));
        } catch (e) {}

        this.closeDeleteModal();
        this.renderStats();
        this.renderList();

        if (window.Admin && Admin.showToast) {
            Admin.showToast(`Token telah dihapus permanen! 🗑️`, false);
        }
    }
};

/* ============================================================
   USER MANAGEMENT LOGIC
   ============================================================ */
const UserManager = {
    users: [],
    searchQuery: '',
    isLoading: false,

    init() {
        this.bindEvents();
        this.fetchUsers();
    },

    bindEvents() {
        // Section Navigation Tabs (Token Health, Pengguna, Translator, CCTV)
        const tabTokens = document.getElementById('adminTabTokens');
        const tabUsers = document.getElementById('adminTabUsers');
        const tabTranslate = document.getElementById('adminTabTranslate');
        const tabLogs = document.getElementById('adminTabLogs');
        const tabAnnounce = document.getElementById('adminTabAnnouncements');
        const sectionTokens = document.getElementById('adminSectionTokens');
        const sectionUsers = document.getElementById('adminSectionUsers');
        const sectionTranslate = document.getElementById('adminSectionTranslate');
        const sectionLogs = document.getElementById('adminSectionLogs');
        const sectionAnnounce = document.getElementById('adminSectionAnnouncements');

        const switchSection = (target) => {
            tabTokens?.classList.toggle('active', target === 'tokens');
            tabUsers?.classList.toggle('active', target === 'users');
            tabTranslate?.classList.toggle('active', target === 'translate');
            tabLogs?.classList.toggle('active', target === 'logs');
            tabAnnounce?.classList.toggle('active', target === 'announcements');

            sectionTokens?.classList.toggle('hidden', target !== 'tokens');
            sectionUsers?.classList.toggle('hidden', target !== 'users');
            sectionTranslate?.classList.toggle('hidden', target !== 'translate');
            sectionLogs?.classList.toggle('hidden', target !== 'logs');
            sectionAnnounce?.classList.toggle('hidden', target !== 'announcements');

            if (target === 'logs') {
                if (window.AdminCCTV) AdminCCTV.startLivePolling();
            } else {
                if (window.AdminCCTV) AdminCCTV.stopLivePolling();
            }

            if (target === 'announcements') {
                if (window.AdminAnnouncements) AdminAnnouncements.fetchAnnouncements();
            }
        };

        tabTokens?.addEventListener('click', () => switchSection('tokens'));

        tabUsers?.addEventListener('click', () => {
            switchSection('users');
            this.fetchUsers();
        });

        tabTranslate?.addEventListener('click', () => {
            switchSection('translate');
            const sourceInput = document.getElementById('transSourceText');
            if (sourceInput) sourceInput.focus();
        });

        tabLogs?.addEventListener('click', () => {
            switchSection('logs');
        });

        tabAnnounce?.addEventListener('click', () => {
            switchSection('announcements');
        });

        // Refresh users button
        const btnRefresh = document.getElementById('btnRefreshUsers');
        btnRefresh?.addEventListener('click', () => {
            const svgIcon = btnRefresh.querySelector('svg');
            if (svgIcon) svgIcon.style.animation = 'spin 0.8s linear infinite';
            this.fetchUsers(true).finally(() => {
                if (svgIcon) svgIcon.style.animation = '';
            });
        });

        // Search users
        const searchInput = document.getElementById('userSearchInput');
        searchInput?.addEventListener('input', (e) => {
            this.searchQuery = (e.target.value || '').trim().toLowerCase();
            this.renderList();
        });

        // User Filter Tabs (Semua, Aktif, Temp Ban, Perm Ban)
        document.querySelectorAll('#userFilterTabs .token-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#userFilterTabs .token-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.userFilter = btn.getAttribute('data-user-filter') || 'all';
                this.renderList();
            });
        });

        this.initBanModal();
    },

    userFilter: 'all',
    selectedBanEmail: null,
    selectedBanType: 'temp',
    selectedBanHours: 24,

    initBanModal() {
        this.banModal = document.getElementById('adminBanModal');
        this.banEmailEl = document.getElementById('banTargetUserEmail');
        this.banDurationSection = document.getElementById('banDurationSection');
        this.banCustomHours = document.getElementById('banCustomHoursInput');
        this.banReasonInput = document.getElementById('banReasonInput');

        // Cancel button
        document.getElementById('btnCancelBanModal')?.addEventListener('click', () => {
            this.closeBanModal();
        });

        // Type switcher buttons (Temp vs Perm)
        const btnTemp = document.getElementById('btnBanTypeTemp');
        const btnPerm = document.getElementById('btnBanTypePerm');

        btnTemp?.addEventListener('click', () => {
            this.selectedBanType = 'temp';
            btnTemp.classList.add('active');
            btnPerm?.classList.remove('active');
            if (this.banDurationSection) this.banDurationSection.style.display = 'block';
        });

        btnPerm?.addEventListener('click', () => {
            this.selectedBanType = 'perm';
            btnPerm.classList.add('active');
            btnTemp?.classList.remove('active');
            if (this.banDurationSection) this.banDurationSection.style.display = 'none';
        });

        // Duration chips
        document.querySelectorAll('.ban-duration-chips .duration-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('.ban-duration-chips .duration-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.selectedBanHours = Number(chip.getAttribute('data-hours')) || 24;
                if (this.banCustomHours) this.banCustomHours.value = '';
            });
        });

        // Custom hours input
        this.banCustomHours?.addEventListener('input', (e) => {
            const val = Number(e.target.value);
            if (val > 0) {
                document.querySelectorAll('.ban-duration-chips .duration-chip').forEach(c => c.classList.remove('active'));
                this.selectedBanHours = val;
            }
        });

        // Reason preset chips
        document.querySelectorAll('.ban-reason-presets .reason-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const r = chip.getAttribute('data-reason');
                if (r && this.banReasonInput) {
                    this.banReasonInput.value = r;
                }
            });
        });

        // Confirm Execute Ban Button
        document.getElementById('btnConfirmExecuteBan')?.addEventListener('click', () => {
            this.executeBan();
        });
    },

    openBanModal(email, defaultType = 'temp') {
        this.selectedBanEmail = email;
        this.selectedBanType = defaultType;
        if (this.banEmailEl) this.banEmailEl.textContent = email;
        if (this.banReasonInput) this.banReasonInput.value = '';

        const btnTemp = document.getElementById('btnBanTypeTemp');
        const btnPerm = document.getElementById('btnBanTypePerm');

        if (defaultType === 'perm') {
            btnPerm?.classList.add('active');
            btnTemp?.classList.remove('active');
            if (this.banDurationSection) this.banDurationSection.style.display = 'none';
        } else {
            btnTemp?.classList.add('active');
            btnPerm?.classList.remove('active');
            if (this.banDurationSection) this.banDurationSection.style.display = 'block';
        }

        if (this.banModal) this.banModal.classList.add('active');
    },

    closeBanModal() {
        if (this.banModal) this.banModal.classList.remove('active');
        this.selectedBanEmail = null;
    },

    async executeBan() {
        if (!this.selectedBanEmail) return;
        const email = this.selectedBanEmail;
        const type = this.selectedBanType;
        const hours = this.selectedBanHours || 24;
        const reason = this.banReasonInput ? this.banReasonInput.value.trim() : '';

        const action = type === 'perm' ? 'ban_perm' : 'ban_temp';
        const body = {
            action: action,
            email: email,
            durationHours: hours,
            reason: reason || (type === 'perm' ? 'Pelanggaran permanen aturan studio' : `Ban sementara ${hours} jam`)
        };

        const confirmBtn = document.getElementById('btnConfirmExecuteBan');
        if (confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.textContent = 'Memproses...';
        }

        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success && Array.isArray(data.users)) {
                    this.users = data.users;
                }
                this.closeBanModal();
                this.renderStats();
                this.renderList();
                if (window.Admin && Admin.showToast) {
                    Admin.showToast(`Pengguna ${email} berhasil di-${type === 'perm' ? 'Ban Permanen' : `Ban (${hours} Jam)`}! ⛔`);
                }
            } else {
                throw new Error('Gagal menerapkan ban');
            }
        } catch (e) {
            alert('Error menerapkan ban: ' + e.message);
        } finally {
            if (confirmBtn) {
                confirmBtn.disabled = false;
                confirmBtn.textContent = 'Terapkan Ban';
            }
        }
    },

    async promptUnban(email) {
        if (!email) return;
        const cleanEmail = email.trim().toLowerCase();
        const confirmUnban = confirm(`Buka pemblokiran (Unban) untuk pengguna ${cleanEmail}?`);
        if (!confirmUnban) return;

        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'unban', email: cleanEmail })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success && Array.isArray(data.users)) {
                    this.users = data.users;
                } else {
                    const u = this.users.find(x => (x.email || '').toLowerCase() === cleanEmail);
                    if (u) {
                        u.ban = null;
                        delete u.ban;
                    }
                }
                this.renderStats();
                this.renderList();
                if (window.Admin && Admin.showToast) {
                    Admin.showToast(`Pengguna ${cleanEmail} telah di-Unban! 🔓✨`);
                }
            }
        } catch (e) {
            alert('Gagal unban: ' + e.message);
        }
    },

    getUserBanStatus(user) {
        if (!user || !user.ban || user.ban.status !== 'banned') {
            return { isBanned: false, statusType: 'active' };
        }
        if (user.ban.type === 'temp') {
            const expDate = new Date(user.ban.expiresAt);
            if (expDate.getTime() <= Date.now()) {
                return { isBanned: false, statusType: 'active', expired: true };
            }
            return {
                isBanned: true,
                statusType: 'temp',
                expiresAt: user.ban.expiresAt,
                reason: user.ban.reason,
                durationHours: user.ban.durationHours
            };
        }
        if (user.ban.type === 'perm') {
            return {
                isBanned: true,
                statusType: 'perm',
                reason: user.ban.reason
            };
        }
        return { isBanned: false, statusType: 'active' };
    },

    async fetchUsers(showToastNotify = false) {
        if (this.isLoading) return;
        this.isLoading = true;

        const container = document.getElementById('userListItems');
        if (container && this.users.length === 0) {
            container.innerHTML = `
                <div class="token-empty-state">
                    <div class="spinner-ring" style="width: 22px; height: 22px; border: 2px solid var(--accent-blue-soft); border-top-color: var(--accent-blue); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px;"></div>
                    <p>Memuat daftar pengguna...</p>
                </div>
            `;
        }

        try {
            // Add timestamp and no-cache to bypass any Cloudflare/browser edge caching
            const res = await fetch(`/api/users?_t=${Date.now()}`, {
                cache: 'no-store',
                headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success && Array.isArray(data.users)) {
                    this.users = data.users;
                }
            }
        } catch (e) {
            console.warn("Fetch users error:", e);
        } finally {
            this.isLoading = false;
            this.renderStats();
            this.renderList();

            // Also update top nav count badge
            const countNav = document.getElementById('adminNavUserCount');
            if (countNav) countNav.textContent = this.users.length;

            if (showToastNotify && window.Admin && Admin.showToast) {
                Admin.showToast(`Daftar pengguna diperbarui (${this.users.length} akun) ✨`);
            }
        }
    },

    renderStats() {
        const total = this.users.length;
        let googleCount = 0;
        let emailCount = 0;
        let activeCount = 0;
        let tempBanCount = 0;
        let permBanCount = 0;

        this.users.forEach(u => {
            if (u.authProvider === 'google' || (u.picture && u.picture.includes('googleusercontent'))) {
                googleCount++;
            } else {
                emailCount++;
            }

            const banInfo = this.getUserBanStatus(u);
            if (!banInfo.isBanned) {
                activeCount++;
            } else if (banInfo.statusType === 'temp') {
                tempBanCount++;
            } else if (banInfo.statusType === 'perm') {
                permBanCount++;
            }
        });

        const bannedTotal = tempBanCount + permBanCount;

        const elTotal = document.getElementById('statTotalUsers');
        const elGoogle = document.getElementById('statGoogleUsers');
        const elEmail = document.getElementById('statEmailUsers');
        const elBanned = document.getElementById('statBannedUsers');
        const navCount = document.getElementById('adminNavUserCount');

        if (elTotal) elTotal.textContent = total;
        if (elGoogle) elGoogle.textContent = googleCount;
        if (elEmail) elEmail.textContent = emailCount;
        if (elBanned) elBanned.textContent = bannedTotal;
        if (navCount) navCount.textContent = total;

        // Update counts on filter tabs
        const tabAll = document.getElementById('countUserTabAll');
        const tabActive = document.getElementById('countUserTabActive');
        const tabTemp = document.getElementById('countUserTabTemp');
        const tabPerm = document.getElementById('countUserTabPerm');

        if (tabAll) tabAll.textContent = total;
        if (tabActive) tabActive.textContent = activeCount;
        if (tabTemp) tabTemp.textContent = tempBanCount;
        if (tabPerm) tabPerm.textContent = permBanCount;
    },

    renderList() {
        const container = document.getElementById('userListItems');
        if (!container) return;

        let filtered = this.users;

        // Apply status filter
        if (this.userFilter === 'active') {
            filtered = filtered.filter(u => !this.getUserBanStatus(u).isBanned);
        } else if (this.userFilter === 'temp') {
            filtered = filtered.filter(u => this.getUserBanStatus(u).statusType === 'temp');
        } else if (this.userFilter === 'perm') {
            filtered = filtered.filter(u => this.getUserBanStatus(u).statusType === 'perm');
        }

        // Apply search query
        if (this.searchQuery) {
            filtered = filtered.filter(u => 
                (u.name && u.name.toLowerCase().includes(this.searchQuery)) ||
                (u.email && u.email.toLowerCase().includes(this.searchQuery)) ||
                (u.ban?.reason && u.ban.reason.toLowerCase().includes(this.searchQuery))
            );
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="token-empty-state">
                    <p>${this.searchQuery ? 'Tidak ada pengguna yang cocok dengan pencarian.' : 'Belum ada pengguna dalam kategori ini.'}</p>
                </div>
            `;
            return;
        }

        let html = '';
        filtered.forEach((user, idx) => {
            const isGoogle = user.authProvider === 'google' || (user.picture && user.picture.includes('googleusercontent'));
            const dateStr = user.lastLogin ? this.formatDate(user.lastLogin) : (user.firstJoined ? this.formatDate(user.firstJoined) : 'Baru saja');
            const avatarHtml = user.picture ? 
                `<img src="${user.picture}" class="user-avatar-img" alt="${user.name || 'User'}" onerror="this.outerHTML='<div class=\\'user-avatar-initials\\'>${(user.name||'U').charAt(0).toUpperCase()}</div>'">` :
                `<div class="user-avatar-initials">${(user.name || 'U').charAt(0).toUpperCase()}</div>`;

            const banInfo = this.getUserBanStatus(user);

            // Status Badge
            let statusBadgeHtml = '<span class="status-pill active">🟢 Aktif</span>';
            if (banInfo.isBanned) {
                if (banInfo.statusType === 'temp') {
                    const remainingStr = this.formatRemainingTime(banInfo.expiresAt);
                    statusBadgeHtml = `<span class="status-pill temp" title="Alasan: ${banInfo.reason || '-'} (Berakhir: ${remainingStr})">🟡 Temp (${remainingStr})</span>`;
                } else if (banInfo.statusType === 'perm') {
                    statusBadgeHtml = `<span class="status-pill perm" title="Alasan: ${banInfo.reason || '-'}">🔴 Perm Ban</span>`;
                }
            }

            // Action Buttons
            let actionButtonsHtml = '';
            if (banInfo.isBanned) {
                actionButtonsHtml = `
                    <button class="btn-user-act unban-btn" onclick="UserManager.promptUnban('${user.email}')" title="Buka Blokir">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 11V7a5 5 0 0 1 10 0v4"/><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/></svg>
                        Unban
                    </button>
                    <button class="btn-del-token" data-email="${user.email}" onclick="UserManager.promptDeleteUser('${user.email}')" title="Hapus pengguna">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                `;
            } else {
                actionButtonsHtml = `
                    <button class="btn-user-act ban-btn" onclick="UserManager.openBanModal('${user.email}', 'temp')" title="Ban Sementara">
                        ⏱️ Temp
                    </button>
                    <button class="btn-user-act ban-btn" style="color: #dc2626; border-color: rgba(239, 68, 68, 0.3);" onclick="UserManager.openBanModal('${user.email}', 'perm')" title="Ban Permanen">
                        ⛔ Perm
                    </button>
                    <button class="btn-del-token" data-email="${user.email}" onclick="UserManager.promptDeleteUser('${user.email}')" title="Hapus pengguna">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                `;
            }

            html += `
                <div class="user-row">
                    <span class="col-user-idx">${idx + 1}</span>
                    <div class="col-user-profile user-profile-cell">
                        ${avatarHtml}
                        <span class="user-name-text" title="${user.name || 'User'}">${user.name || 'User'}</span>
                    </div>
                    <span class="col-user-email user-email-text" title="${user.email}">${user.email || '-'}</span>
                    <div class="col-user-provider">
                        <span class="provider-badge ${isGoogle ? 'google' : 'email'}">
                            ${isGoogle ? '<svg width="12" height="12" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg> Google' : '✉️ Email'}
                        </span>
                    </div>
                    <div class="col-user-status">
                        ${statusBadgeHtml}
                    </div>
                    <span class="col-user-date user-date-text" title="${user.lastLogin || ''}">${dateStr}</span>
                    <div class="col-user-act user-action-cell">
                        ${actionButtonsHtml}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    formatRemainingTime(expiresIsoStr) {
        try {
            const exp = new Date(expiresIsoStr);
            const now = new Date();
            const diffMs = exp - now;
            if (diffMs <= 0) return 'Selesai';
            const diffMin = Math.floor(diffMs / 60000);
            if (diffMin < 60) return `${diffMin}m lagi`;
            const diffHours = Math.floor(diffMin / 60);
            if (diffHours < 24) return `${diffHours}j lagi`;
            const diffDays = Math.floor(diffHours / 24);
            return `${diffDays} hari`;
        } catch (e) {
            return 'Aktif';
        }
    },

    formatDate(isoStr) {
        try {
            const d = new Date(isoStr);
            const now = new Date();
            const diffMin = Math.floor((now - d) / 60000);
            if (diffMin < 2) return 'Baru saja';
            if (diffMin < 60) return `${diffMin} mnt lalu`;
            const diffHour = Math.floor(diffMin / 60);
            if (diffHour < 24) return `${diffHour} jam lalu`;
            const diffDay = Math.floor(diffHour / 24);
            if (diffDay < 7) return `${diffDay} hari lalu`;
            return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch (e) {
            return isoStr;
        }
    },

    async promptDeleteUser(email) {
        if (!email) return;
        const confirmDel = confirm(`Hapus pengguna ${email} dari database?`);
        if (!confirmDel) return;

        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', email: email })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success && Array.isArray(data.users)) {
                    this.users = data.users;
                } else {
                    this.users = this.users.filter(u => u.email !== email);
                }
                this.renderStats();
                this.renderList();
                if (window.Admin && Admin.showToast) {
                    Admin.showToast(`Pengguna ${email} telah dihapus. 🗑️`);
                }
            }
        } catch (e) {
            alert('Gagal menghapus pengguna: ' + e.message);
        }
    }
};

/* ============================================================
   NOVA — Admin Prompt & Text Translator (ID <-> EN)
   ============================================================ */
const AdminTranslator = {
    sourceLang: 'id',
    targetLang: 'en',
    debounceTimer: null,
    isTranslating: false,

    init() {
        this.sourceInput = document.getElementById('transSourceText');
        this.resultOutput = document.getElementById('transResultText');
        this.sourceCount = document.getElementById('transSourceCharCount');
        this.targetCount = document.getElementById('transTargetCharCount');
        this.swapBtn = document.getElementById('btnSwapTranslateLang');
        this.translateBtn = document.getElementById('btnAdminTranslateNow');
        this.clearBtn = document.getElementById('btnClearTransSource');
        this.copyBtn = document.getElementById('btnCopyTranslated');
        this.loadingSpinner = document.getElementById('transLoadingSpinner');
        this.btnSendI2I = document.getElementById('btnSendToI2I');
        this.btnSendI2V = document.getElementById('btnSendToI2V');

        // Direction labels & flags
        this.sourceFlag = document.getElementById('transSourceFlag');
        this.sourceLangName = document.getElementById('transSourceLangName');
        this.targetFlag = document.getElementById('transTargetFlag');
        this.targetLangName = document.getElementById('transTargetLangName');
        this.sourceTag = document.getElementById('transSourceTag');
        this.targetTag = document.getElementById('transTargetTag');

        this.bindEvents();
    },

    bindEvents() {
        if (!this.sourceInput) return;

        // Auto-translate with debounce on input typing
        this.sourceInput.addEventListener('input', () => {
            const val = this.sourceInput.value;
            if (this.sourceCount) {
                this.sourceCount.textContent = `${val.length} karakter`;
            }

            clearTimeout(this.debounceTimer);
            if (!val.trim()) {
                if (this.resultOutput) this.resultOutput.value = '';
                if (this.targetCount) this.targetCount.textContent = '0 karakter';
                return;
            }

            this.debounceTimer = setTimeout(() => {
                this.doTranslate();
            }, 600);
        });

        // Translate Now button
        this.translateBtn?.addEventListener('click', () => {
            this.doTranslate();
        });

        // Swap Languages button
        this.swapBtn?.addEventListener('click', () => {
            this.swapDirection();
        });

        // Clear input button
        this.clearBtn?.addEventListener('click', () => {
            this.sourceInput.value = '';
            if (this.resultOutput) this.resultOutput.value = '';
            if (this.sourceCount) this.sourceCount.textContent = '0 karakter';
            if (this.targetCount) this.targetCount.textContent = '0 karakter';
            this.sourceInput.focus();
        });

        // Copy translated text button
        this.copyBtn?.addEventListener('click', () => {
            const res = this.resultOutput ? this.resultOutput.value.trim() : '';
            if (!res) {
                if (window.Admin && Admin.showToast) {
                    Admin.showToast('Tidak ada teks untuk disalin.');
                }
                return;
            }
            navigator.clipboard.writeText(res).then(() => {
                if (window.Admin && Admin.showToast) {
                    Admin.showToast('Hasil terjemahan berhasil disalin ke clipboard! 📋✨');
                }
                const copyBtnText = document.getElementById('btnCopyTranslatedText');
                if (copyBtnText) {
                    const original = copyBtnText.textContent;
                    copyBtnText.textContent = 'Tersalin!';
                    setTimeout(() => { copyBtnText.textContent = original; }, 1800);
                }
            }).catch(err => {
                alert('Gagal menyalin: ' + err.message);
            });
        });

        // Prompt Preset Chips
        document.querySelectorAll('.trans-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const text = chip.getAttribute('data-text');
                if (text && this.sourceInput) {
                    this.sourceInput.value = text;
                    if (this.sourceCount) {
                        this.sourceCount.textContent = `${text.length} karakter`;
                    }
                    this.doTranslate();
                }
            });
        });

        // Use in Image Generator
        this.btnSendI2I?.addEventListener('click', () => {
            const promptText = this.resultOutput?.value.trim() || this.sourceInput?.value.trim();
            if (!promptText) {
                if (window.Admin && Admin.showToast) {
                    Admin.showToast('Terjemahkan atau ketik teks prompt terlebih dahulu.');
                }
                return;
            }
            this.injectPrompt('i2i', promptText);
        });

        // Use in Video Generator
        this.btnSendI2V?.addEventListener('click', () => {
            const promptText = this.resultOutput?.value.trim() || this.sourceInput?.value.trim();
            if (!promptText) {
                if (window.Admin && Admin.showToast) {
                    Admin.showToast('Terjemahkan atau ketik teks prompt terlebih dahulu.');
                }
                return;
            }
            this.injectPrompt('i2v', promptText);
        });
    },

    swapDirection() {
        // Swap lang codes
        const tempLang = this.sourceLang;
        this.sourceLang = this.targetLang;
        this.targetLang = tempLang;

        // Swap texts
        const currentSource = this.sourceInput ? this.sourceInput.value : '';
        const currentResult = this.resultOutput ? this.resultOutput.value : '';

        if (this.sourceInput) this.sourceInput.value = currentResult;
        if (this.resultOutput) this.resultOutput.value = currentSource;

        if (this.sourceCount) this.sourceCount.textContent = `${(this.sourceInput?.value || '').length} karakter`;
        if (this.targetCount) this.targetCount.textContent = `${(this.resultOutput?.value || '').length} karakter`;

        // Update UI Labels and Flags
        const isIdToEn = (this.sourceLang === 'id');
        if (this.sourceFlag) this.sourceFlag.textContent = isIdToEn ? '🇮🇩' : '🇬🇧';
        if (this.sourceLangName) this.sourceLangName.textContent = isIdToEn ? 'Indonesia (ID)' : 'English (EN)';
        if (this.targetFlag) this.targetFlag.textContent = isIdToEn ? '🇬🇧' : '🇮🇩';
        if (this.targetLangName) this.targetLangName.textContent = isIdToEn ? 'English (EN)' : 'Indonesia (ID)';

        if (this.sourceTag) this.sourceTag.textContent = isIdToEn ? 'Input Teks Asli (ID)' : 'Input Teks Asli (EN)';
        if (this.targetTag) this.targetTag.textContent = isIdToEn ? 'Hasil Terjemahan (EN)' : 'Hasil Terjemahan (ID)';
        
        if (this.sourceInput) {
            this.sourceInput.placeholder = isIdToEn ? 
                'Ketik atau tempel prompt / kalimat bahasa Indonesia di sini...' : 
                'Type or paste English prompt / sentence here...';
        }

        if (this.sourceInput && this.sourceInput.value.trim()) {
            this.doTranslate();
        }
    },

    async doTranslate() {
        if (!this.sourceInput) return;
        const text = this.sourceInput.value.trim();
        if (!text) {
            if (this.resultOutput) this.resultOutput.value = '';
            if (this.targetCount) this.targetCount.textContent = '0 karakter';
            return;
        }

        if (this.isTranslating) return;
        this.isTranslating = true;

        if (this.loadingSpinner) {
            this.loadingSpinner.classList.remove('hidden');
        }

        const translateBtnText = document.getElementById('btnAdminTranslateText');
        if (translateBtnText) translateBtnText.textContent = 'Menerjemahkan...';

        try {
            const res = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: text,
                    source: this.sourceLang,
                    target: this.targetLang
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success && data.translated) {
                    if (this.resultOutput) {
                        this.resultOutput.value = data.translated;
                    }
                    if (this.targetCount) {
                        this.targetCount.textContent = `${data.translated.length} karakter`;
                    }
                } else {
                    throw new Error(data.error || 'Gagal menerjemahkan teks');
                }
            } else {
                throw new Error('Server error (' + res.status + ')');
            }
        } catch (err) {
            console.error('Translation error:', err);
            if (window.Admin && Admin.showToast) {
                Admin.showToast('Gagal menerjemahkan: ' + err.message);
            }
        } finally {
            this.isTranslating = false;
            if (this.loadingSpinner) {
                this.loadingSpinner.classList.add('hidden');
            }
            if (translateBtnText) translateBtnText.textContent = 'Terjemahkan';
        }
    },

    injectPrompt(mode, text) {
        if (mode === 'i2i') {
            const input = document.getElementById('imagePromptInput') || document.querySelector('textarea#promptInput') || document.querySelector('#promptInput');
            if (input) {
                input.value = text;
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
            // Navigate to Image page
            const navBtn = document.querySelector('.nav-item[data-page="i2i"]') || document.querySelector('#nav-i2i');
            if (navBtn) navBtn.click();
            if (window.Admin && Admin.showToast) {
                Admin.showToast('Prompt berhasil dipasang di Image Generator! 🎨✨');
            }
        } else if (mode === 'i2v') {
            const input = document.getElementById('i2vPrompt') || document.querySelector('#i2vPrompt');
            if (input) {
                input.value = text;
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
            // Navigate to Video page
            const navBtn = document.querySelector('.nav-item[data-page="i2v"]') || document.querySelector('#nav-i2v');
            if (navBtn) navBtn.click();
            if (window.Admin && Admin.showToast) {
                Admin.showToast('Prompt berhasil dipasang di Video Generator! 🎬✨');
            }
        }
    }
};

/* ============================================================
   NOVA — Admin CCTV & User Activity Logger (Live CCTV)
   ============================================================ */
const AdminCCTV = {
    logs: [],
    filter: 'all',
    searchQuery: '',
    isLoading: false,
    pollTimer: null,

    init() {
        this.container = document.getElementById('cctvFeedList');
        this.btnRefresh = document.getElementById('btnRefreshLogs');
        this.btnClear = document.getElementById('btnClearLogs');
        this.searchInput = document.getElementById('logSearchInput');
        
        this.bindEvents();
    },

    bindEvents() {
        this.btnRefresh?.addEventListener('click', () => {
            const svg = this.btnRefresh.querySelector('svg');
            if (svg) svg.style.animation = 'spin 0.8s linear infinite';
            this.fetchLogs(true).finally(() => {
                if (svg) svg.style.animation = '';
            });
        });

        this.btnClear?.addEventListener('click', () => {
            this.promptClearLogs();
        });

        this.searchInput?.addEventListener('input', (e) => {
            this.searchQuery = (e.target.value || '').trim().toLowerCase();
            this.renderList();
        });

        // Filter Tabs (Semua, Chat, Image, Video, Login)
        document.querySelectorAll('#logFilterTabs .token-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#logFilterTabs .token-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filter = btn.getAttribute('data-log-filter') || 'all';
                this.renderList();
            });
        });
    },

    startLivePolling() {
        this.fetchLogs();
        if (this.pollTimer) clearInterval(this.pollTimer);
        this.pollTimer = setInterval(() => {
            this.fetchLogs(false);
        }, 4000);
    },

    stopLivePolling() {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }
    },

    async fetchLogs(showToastNotify = false) {
        if (this.isLoading) return;
        this.isLoading = true;

        try {
            const res = await fetch(`/api/activity?_t=${Date.now()}`, {
                cache: 'no-store',
                headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success && Array.isArray(data.logs)) {
                    this.logs = data.logs;
                }
            }
        } catch (e) {
            console.warn("Fetch CCTV logs error:", e);
        } finally {
            this.isLoading = false;
            this.renderStats();
            this.renderList();

            const badgeNav = document.getElementById('adminNavLogCount');
            if (badgeNav) badgeNav.textContent = this.logs.length;

            if (showToastNotify && window.Admin && Admin.showToast) {
                Admin.showToast(`Riwayat CCTV diperbarui (${this.logs.length} aktivitas) 📹✨`);
            }
        }
    },

    async promptClearLogs() {
        if (this.logs.length === 0) return;
        const confirmClear = confirm("Apakah Anda yakin ingin menghapus seluruh riwayat CCTV aktivitas pengguna?");
        if (!confirmClear) return;

        try {
            const res = await fetch('/api/activity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'clear' })
            });
            if (res.ok) {
                this.logs = [];
                this.renderStats();
                this.renderList();
                if (window.Admin && Admin.showToast) {
                    Admin.showToast("Seluruh riwayat CCTV telah dibersihkan! 🗑️");
                }
            }
        } catch (e) {
            alert('Gagal membersihkan riwayat: ' + e.message);
        }
    },

    renderStats() {
        const total = this.logs.length;
        let chatCount = 0;
        let imageCount = 0;
        let videoCount = 0;
        let loginCount = 0;

        this.logs.forEach(l => {
            if (l.type === 'chat') chatCount++;
            else if (l.type === 'image_gen') imageCount++;
            else if (l.type === 'video_gen') videoCount++;
            else if (l.type === 'login') loginCount++;
        });

        const elTotal = document.getElementById('statTotalLogs');
        const elChat = document.getElementById('statChatLogs');
        const elImage = document.getElementById('statImageLogs');
        const elVideo = document.getElementById('statVideoLogs');

        if (elTotal) elTotal.textContent = total;
        if (elChat) elChat.textContent = chatCount;
        if (elImage) elImage.textContent = imageCount;
        if (elVideo) elVideo.textContent = videoCount;

        // Update counts on filter tabs
        const tabAll = document.getElementById('countLogTabAll');
        const tabChat = document.getElementById('countLogTabChat');
        const tabImage = document.getElementById('countLogTabImage');
        const tabVideo = document.getElementById('countLogTabVideo');
        const tabLogin = document.getElementById('countLogTabLogin');

        if (tabAll) tabAll.textContent = total;
        if (tabChat) tabChat.textContent = chatCount;
        if (tabImage) tabImage.textContent = imageCount;
        if (tabVideo) tabVideo.textContent = videoCount;
        if (tabLogin) tabLogin.textContent = loginCount;
    },

    renderList() {
        if (!this.container) return;

        let filtered = this.logs;

        // Apply type filter
        if (this.filter !== 'all') {
            filtered = filtered.filter(l => l.type === this.filter);
        }

        // Apply search query
        if (this.searchQuery) {
            filtered = filtered.filter(l => 
                (l.userName && l.userName.toLowerCase().includes(this.searchQuery)) ||
                (l.userEmail && l.userEmail.toLowerCase().includes(this.searchQuery)) ||
                (l.prompt && l.prompt.toLowerCase().includes(this.searchQuery)) ||
                (l.details && l.details.toLowerCase().includes(this.searchQuery)) ||
                (l.model && l.model.toLowerCase().includes(this.searchQuery))
            );
        }

        if (filtered.length === 0) {
            this.container.innerHTML = `
                <div class="token-empty-state">
                    <div style="font-size: 2rem; margin-bottom: 8px;">📹</div>
                    <p>${this.searchQuery ? 'Tidak ada riwayat aktivitas yang cocok dengan pencarian.' : 'Belum ada rekaman aktivitas pengguna.'}</p>
                </div>
            `;
            return;
        }

        let html = '';
        filtered.forEach(log => {
            const timeFormatted = this.formatFullDateTime(log.timestamp);
            const timeAgo = this.formatTimeAgo(log.timestamp);

            let typeBadge = '';
            if (log.type === 'chat') {
                typeBadge = `<span class="cctv-type-badge chat">💬 Chat Prompt</span>`;
            } else if (log.type === 'image_gen') {
                typeBadge = `<span class="cctv-type-badge image">🎨 Generate Gambar</span>`;
            } else if (log.type === 'video_gen') {
                typeBadge = `<span class="cctv-type-badge video">🎬 Generate Video</span>`;
            } else if (log.type === 'login') {
                typeBadge = `<span class="cctv-type-badge login">🔑 Login Masuk</span>`;
            }

            const avatarHtml = log.userPicture ?
                `<img src="${log.userPicture}" class="cctv-user-avatar" alt="${this.escapeHtml(log.userName || 'User')}" onerror="this.outerHTML='<div class=\\'cctv-user-avatar-initials\\'>${(log.userName||'U').charAt(0).toUpperCase()}</div>'">` :
                `<div class="cctv-user-avatar-initials">${(log.userName || 'U').charAt(0).toUpperCase()}</div>`;

            const promptEscaped = this.escapeHtml(log.prompt || '-');

            html += `
                <div class="cctv-item-card" data-type="${log.type}">
                    <div class="cctv-card-header">
                        <div class="cctv-user-meta">
                            ${avatarHtml}
                            <div class="cctv-user-text">
                                <div class="cctv-user-top">
                                    <span class="cctv-user-name">${this.escapeHtml(log.userName || 'User')}</span>
                                    <span class="cctv-user-email">${this.escapeHtml(log.userEmail || '-')}</span>
                                </div>
                                <div class="cctv-user-provider-tag">${log.authProvider === 'google' ? 'Google' : 'Email'}</div>
                            </div>
                        </div>

                        <div class="cctv-meta-right">
                            ${typeBadge}
                            <div class="cctv-time-badge" title="${timeFormatted}">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                <span>${timeAgo}</span>
                            </div>
                        </div>
                    </div>

                    <div class="cctv-prompt-box">
                        <div class="cctv-prompt-header">
                            <span class="cctv-prompt-label">${log.type === 'login' ? 'Status Aktivitas:' : 'Isi Prompt / Pesan User:'}</span>
                            <div class="cctv-prompt-actions">
                                <button type="button" class="btn-copy-cctv-prompt" onclick="AdminCCTV.copyPrompt(this, '${this.escapeForAttribute(log.prompt || '')}')" title="Salin Prompt">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                    <span>Salin</span>
                                </button>
                                ${log.userEmail ? `
                                    <button type="button" class="btn-ban-cctv-user" onclick="UserManager.openBanModal('${this.escapeForAttribute(log.userEmail)}', 'temp')" title="Ban Pengguna Ini">
                                        ⛔ Ban User
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                        <div class="cctv-prompt-content">${promptEscaped}</div>
                    </div>

                    <div class="cctv-card-footer">
                        <div class="cctv-footer-details">
                            ${log.model ? `<span class="cctv-chip-detail">🤖 Model: ${this.escapeHtml(log.model)}</span>` : ''}
                            ${log.details ? `<span class="cctv-chip-detail">⚙️ ${this.escapeHtml(log.details)}</span>` : ''}
                        </div>
                        <span class="cctv-exact-time">${timeFormatted}</span>
                    </div>
                </div>
            `;
        });

        this.container.innerHTML = html;
    },

    copyPrompt(btn, text) {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            const span = btn.querySelector('span');
            if (span) {
                const original = span.textContent;
                span.textContent = 'Tersalin!';
                setTimeout(() => { span.textContent = original; }, 1500);
            }
            if (window.Admin && Admin.showToast) {
                Admin.showToast('Prompt berhasil disalin! 📋✨');
            }
        });
    },

    formatFullDateTime(isoStr) {
        try {
            const d = new Date(isoStr);
            return d.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }) + ' WIB';
        } catch (e) {
            return isoStr;
        }
    },

    formatTimeAgo(isoStr) {
        try {
            const d = new Date(isoStr);
            const now = new Date();
            const diffSec = Math.floor((now - d) / 1000);
            if (diffSec < 10) return 'Baru saja';
            if (diffSec < 60) return `${diffSec} detik lalu`;
            const diffMin = Math.floor(diffSec / 60);
            if (diffMin < 60) return `${diffMin} mnt lalu`;
            const diffHour = Math.floor(diffMin / 60);
            if (diffHour < 24) return `${diffHour} jam lalu`;
            const diffDay = Math.floor(diffHour / 24);
            return `${diffDay} hari lalu`;
        } catch (e) {
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
    },

    escapeForAttribute(str) {
        if (!str) return '';
        return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    }
};

const AdminAnnouncements = {
    list: [],
    
    init() {
        this.btnPublish = document.getElementById('btnPublishAnnounce');
        this.btnRefresh = document.getElementById('btnRefreshAnnounce');
        this.inputMessage = document.getElementById('announceMessageInput');
        this.historyList = document.getElementById('announceHistoryList');
        this.countLabel = document.getElementById('announceHistoryCount');
        this.navBadge = document.getElementById('adminNavAnnounceCount');

        if (this.btnPublish) {
            this.btnPublish.addEventListener('click', () => this.publish());
        }

        if (this.btnRefresh) {
            this.btnRefresh.addEventListener('click', () => this.fetchAnnouncements());
        }

        this.fetchAnnouncements();
    },

    async fetchAnnouncements() {
        try {
            const res = await fetch('/api/announcements?_t=' + Date.now(), { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                if (data && Array.isArray(data.list)) {
                    this.list = data.list;
                    this.renderList();
                    if (this.navBadge) this.navBadge.textContent = this.list.length;
                    if (this.countLabel) this.countLabel.textContent = `${this.list.length} pengumuman`;
                }
            }
        } catch(e) {
            console.warn("AdminAnnouncements fetch failed:", e);
        }
    },

    async publish() {
        const message = (this.inputMessage?.value || '').trim();

        if (!message) {
            Utils.toast('Tulis pesan pengumuman terlebih dahulu', 'error');
            if (this.inputMessage) this.inputMessage.focus();
            return;
        }

        if (this.btnPublish) {
            this.btnPublish.disabled = true;
            this.btnPublish.innerHTML = 'Mengirim...';
        }

        try {
            const res = await fetch('/api/announcements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'create',
                    message: message
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data && Array.isArray(data.list)) {
                    this.list = data.list;
                    this.renderList();
                    if (this.navBadge) this.navBadge.textContent = this.list.length;
                    if (this.countLabel) this.countLabel.textContent = `${this.list.length} pengumuman`;
                    
                    if (this.inputMessage) this.inputMessage.value = '';

                    Utils.toast('📢 Pengumuman berhasil dikirim ke semua user!', 'success');

                    if (window.Notifications) Notifications.fetchAnnouncements();
                }
            } else {
                throw new Error("Gagal mengirim pengumuman");
            }
        } catch(e) {
            Utils.toast('Gagal mengirim: ' + e.message, 'error');
        } finally {
            if (this.btnPublish) {
                this.btnPublish.disabled = false;
                this.btnPublish.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    <span>Kirim Pengumuman</span>
                `;
            }
        }
    },

    async deleteAnnouncement(id) {
        if (!confirm('Yakin ingin menghapus pengumuman ini?')) return;

        try {
            const res = await fetch('/api/announcements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', id: id })
            });

            if (res.ok) {
                const data = await res.json();
                if (data && Array.isArray(data.list)) {
                    this.list = data.list;
                    this.renderList();
                    if (this.navBadge) this.navBadge.textContent = this.list.length;
                    if (this.countLabel) this.countLabel.textContent = `${this.list.length} pengumuman`;
                    Utils.toast('Pengumuman telah dihapus', 'info');
                    if (window.Notifications) Notifications.fetchAnnouncements();
                }
            }
        } catch(e) {
            Utils.toast('Gagal menghapus pengumuman', 'error');
        }
    },

    renderList() {
        if (!this.historyList) return;

        if (!this.list || this.list.length === 0) {
            this.historyList.innerHTML = `
                <div class="token-empty-state">
                    <p>Belum ada pengumuman yang dikirim.</p>
                </div>
            `;
            return;
        }

        this.historyList.innerHTML = this.list.map(item => {
            const timeStr = item.createdAt ? this.formatRelativeTime(item.createdAt) : 'Baru saja';

            return `
                <div class="announce-card-item" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 14px 16px; margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 0.75rem; color: var(--text-tertiary); font-weight: 600;">🕒 ${timeStr}</span>
                        <button class="btn-delete-announce" onclick="AdminAnnouncements.deleteAnnouncement('${item.id}')" title="Hapus Pengumuman" style="background: rgba(239, 68, 68, 0.08); color: #dc2626; border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 6px; padding: 3px 8px; font-size: 0.72rem; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            <span>Hapus</span>
                        </button>
                    </div>
                    <p style="margin: 0; font-size: 0.88rem; color: var(--text-primary); line-height: 1.5; white-space: pre-wrap;">${this.escapeHtml(item.message)}</p>
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

window.AdminPrompts = AdminPrompts;
window.TokenHealth = TokenHealth;
window.UserManager = UserManager;
window.AdminTranslator = AdminTranslator;
window.AdminCCTV = AdminCCTV;
window.AdminAnnouncements = AdminAnnouncements;

document.addEventListener('DOMContentLoaded', () => {
    Admin.init();
    AdminPrompts.init();
    TokenHealth.init();
    UserManager.init();
    AdminTranslator.init();
    AdminCCTV.init();
    AdminAnnouncements.init();

    // Set Token count in top nav
    const tokenCountNav = document.getElementById('adminNavTokenCount');
    if (tokenCountNav && TokenHealth.tokens) {
        tokenCountNav.textContent = TokenHealth.tokens.length;
    }
});


