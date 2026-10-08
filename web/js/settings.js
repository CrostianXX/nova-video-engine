/* ============================================================
   NOVA — Settings & API Configuration
   ============================================================ */

const Settings = {
    init() {
        this.modal = document.getElementById('settingsModal');
        this.openBtn = document.getElementById('settingsBtn');
        this.closeBtn = document.getElementById('settingsClose');
        this.cancelBtn = document.getElementById('settingsCancelBtn');
        this.saveBtn = document.getElementById('settingsSaveBtn');
        this.toggleBtns = document.querySelectorAll('.toggle-visibility');

        this.bindEvents();
        this.loadSettings(); 
    },

    bindEvents() {
        this.openBtn?.addEventListener('click', () => this.openModal());
        this.closeBtn?.addEventListener('click', () => this.closeModal());
        this.cancelBtn?.addEventListener('click', () => this.closeModal());
        this.saveBtn?.addEventListener('click', () => this.saveSettings());

        // Click overlay to close
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        // Escape to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    },

    openModal() {
        this.modal.classList.remove('hidden');
        if (window.QuotaManager) {
            QuotaManager.updateUI();
        }
    },

    closeModal() {
        this.modal.classList.add('hidden');
    },

    loadSettings() {
        // Setup profile image upload
        const avatarContainer = document.getElementById('profileAvatarContainer');
        const fileInput = document.getElementById('profileImageInput');
        const settingsAvatar = document.getElementById('settingsAvatar');
        const headerAvatar = document.getElementById('headerAvatarImg');

        if (avatarContainer && fileInput) {
            // Hover effects
            const overlay = avatarContainer.querySelector('.avatar-hover-overlay');
            if (overlay) {
                avatarContainer.addEventListener('mouseenter', () => overlay.style.opacity = '1');
                avatarContainer.addEventListener('mouseleave', () => overlay.style.opacity = '0');
            }

            // Click to upload
            avatarContainer.addEventListener('click', () => fileInput.click());

            // Handle file selection
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const newSrc = event.target.result;
                        if (settingsAvatar) settingsAvatar.src = newSrc;
                        if (headerAvatar) headerAvatar.src = newSrc;
                        
                        Utils.storage.set('userAvatar', newSrc);
                        Utils.toast('Profile picture updated!', 'success');
                        
                        // Update chat avatars if any exist currently
                        document.querySelectorAll('.msg-avatar img[alt="You"]').forEach(img => {
                            img.src = newSrc;
                        });
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            // Load saved avatar on init
            const savedAvatar = Utils.storage.get('userAvatar');
            if (savedAvatar) {
                if (settingsAvatar) settingsAvatar.src = savedAvatar;
                if (headerAvatar) headerAvatar.src = savedAvatar;
            }
        }
    },

    saveSettings() {
        this.closeModal();
    }
};
