/* ============================================================
   NOVA — Chat AI
   ============================================================ */

const Chat = {
    messages: [],
    currentChatId: null,
    chatHistories: [],
    
    init() {
        this.messagesEl = document.getElementById('chatMessages');
        this.inputEl = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('chatSendBtn');
        this.attachBtn = document.getElementById('chatAttachBtn');
        this.attachmentsEl = document.getElementById('chatAttachments');
        this.promptChips = document.querySelectorAll('.prompt-chip');
        this.attachedFiles = [];

        this.bindEvents();
        Utils.autoResize(this.inputEl);
        
        // Auto-load history
        this.loadChatHistories();
        this.renderChatHistoryList();
    },

    bindEvents() {
        // Send
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Auto-detect admin commands on type
        this.inputEl.addEventListener('input', () => {
            const val = this.inputEl.value.trim();
            if (val === '--login') {
                this.inputEl.value = '';
                this.inputEl.style.height = 'auto';
                if (typeof Admin !== 'undefined') Admin.showLoginModal();
            } else if (val === '--logout') {
                this.inputEl.value = '';
                this.inputEl.style.height = 'auto';
                if (typeof Admin !== 'undefined') Admin.logout();
            }
        });

        // Attach
        this.attachBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) this.addAttachment(file);
            };
            input.click();
        });

        // Prompt chips
        this.promptChips.forEach(chip => {
            chip.addEventListener('click', () => {
                this.inputEl.value = chip.textContent.trim();
                Utils.autoResize(this.inputEl);
                this.inputEl.focus();
            });
        });

        // Sidebar New Chat button
        const newChatBtn = document.getElementById('newChatSidebarBtn');
        if (newChatBtn) {
            newChatBtn.addEventListener('click', () => this.startNewChat());
        }

        // Header New Chat button (Directly accessible on mobile and desktop)
        const headerNewChatBtn = document.getElementById('newChatHeaderBtn');
        if (headerNewChatBtn) {
            headerNewChatBtn.addEventListener('click', () => {
                this.startNewChat();
                Utils.showToast('Chat baru dimulai', 'info');
            });
        }
    },

    // --- Chat History System ---
    loadChatHistories() {
        try {
            const stored = localStorage.getItem('nova_chats');
            if (stored) {
                let parsed = JSON.parse(stored);
                // Expiry: 3 days (3 * 24 * 60 * 60 * 1000 = 259200000 ms)
                const now = Date.now();
                parsed = parsed.filter(chat => (now - chat.updatedAt) < 259200000);
                
                // Limit to 2
                if (parsed.length > 2) {
                    parsed.sort((a, b) => b.updatedAt - a.updatedAt);
                    parsed = parsed.slice(0, 2);
                }
                
                this.chatHistories = parsed;
                localStorage.setItem('nova_chats', JSON.stringify(this.chatHistories));
            }
        } catch (e) {
            console.error('Failed to load chat history', e);
            this.chatHistories = [];
        }

        if (this.chatHistories.length > 0) {
            this.chatHistories.sort((a, b) => b.updatedAt - a.updatedAt);
            this.loadChat(this.chatHistories[0].id);
        } else {
            this.startNewChat();
        }
    },

    saveChat() {
        if (!this.currentChatId) return;
        
        let title = "New Chat";
        if (this.messages.length > 0) {
            const firstMsg = this.messages.find(m => m.role === 'user');
            if (firstMsg && firstMsg.text) {
                title = firstMsg.text.substring(0, 30);
                if (firstMsg.text.length > 30) title += "...";
            }
        }

        // Clean messages: do not store massive base64 in local history to avoid QuotaExceededError
        const safeMessages = this.messages.map(m => ({
            role: m.role,
            text: m.text,
            // Keep small thumbnails if any, else omit
            images: (m.images || []).map(img => img.length > 50000 ? '' : img).filter(Boolean)
        }));

        const chatData = {
            id: this.currentChatId,
            title: title,
            updatedAt: Date.now(),
            messages: safeMessages
        };

        const existingIndex = this.chatHistories.findIndex(c => c.id === this.currentChatId);
        if (existingIndex >= 0) {
            this.chatHistories[existingIndex] = chatData;
        } else {
            this.chatHistories.unshift(chatData);
        }

        if (this.chatHistories.length > 2) {
            this.chatHistories.sort((a, b) => b.updatedAt - a.updatedAt);
            this.chatHistories = this.chatHistories.slice(0, 2);
        }

        try {
            localStorage.setItem('nova_chats', JSON.stringify(this.chatHistories));
        } catch (e) {
            console.warn('localStorage quota exceeded, trimming old chat cache', e);
            try {
                // Keep only current chat minimal
                localStorage.setItem('nova_chats', JSON.stringify([chatData]));
            } catch (err) {
                console.error('Failed to save chat to storage', err);
            }
        }
        this.renderChatHistoryList();
    },

    renderChatHistoryList() {
        const historySection = document.getElementById('chatHistorySection');
        const historyList = document.getElementById('chatHistoryList');
        if (!historySection || !historyList) return;

        if (this.chatHistories.length === 0) {
            historySection.style.display = 'none';
            return;
        }

        historySection.style.display = 'block';
        historyList.innerHTML = '';

        this.chatHistories.forEach(chat => {
            const item = document.createElement('div');
            item.className = 'history-item' + (chat.id === this.currentChatId ? ' active' : '');
            item.textContent = chat.title || 'New Chat';
            item.title = chat.title;
            item.onclick = () => this.loadChat(chat.id);
            historyList.appendChild(item);
        });
    },

    loadChat(chatId) {
        const chat = this.chatHistories.find(c => c.id === chatId);
        if (!chat) return;

        this.currentChatId = chatId;
        this.messages = [];
        this.messagesEl.innerHTML = '';
        
        const msgsToLoad = chat.messages || [];
        if (msgsToLoad.length === 0) {
            this.messagesEl.innerHTML = `
                <div class="chat-welcome">
                    <div class="chat-welcome-icon">
                        <svg width="48" height="48" viewBox="0 0 28 28" fill="none">
                            <path d="M14 2L16.5 11.5L26 14L16.5 16.5L14 26L11.5 16.5L2 14L11.5 11.5L14 2Z" fill="url(#chatLogoGrad)" />
                            <defs>
                                <linearGradient id="chatLogoGrad" x1="2" y1="2" x2="26" y2="26">
                                    <stop stop-color="#60a5fa"/><stop offset="1" stop-color="#a78bfa"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <h2 class="welcome-title">Halo! Ada yang bisa saya bantu?</h2>
                    <p class="welcome-desc">NOVA siap menjawab pertanyaan, menulis kode, atau berbincang dengan Anda.</p>
                </div>
            `;
        } else {
            msgsToLoad.forEach(m => {
                this.renderMessageElement(m.role, m.text, m.images || []);
                this.messages.push(m);
            });
        }

        this.scrollToBottom();
        this.renderChatHistoryList();
    },

    renderMessageElement(role, text, images = []) {
        const msg = document.createElement('div');
        msg.className = `chat-message ${role}`;
        
        const savedAvatar = Utils.storage.get('userAvatar') || 'assets/cat_portrait.jpg';
        const avatarHTML = role === 'user' 
            ? `<div class="msg-avatar"><img src="${savedAvatar}" alt="You"></div>`
            : `<div class="msg-avatar ai-avatar">
                <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
                    <path d="M14 2L16.5 11.5L26 14L16.5 16.5L14 26L11.5 16.5L2 14L11.5 11.5L14 2Z" fill="url(#msgGrad${Date.now()})"/>
                    <defs><linearGradient id="msgGrad${Date.now()}" x1="2" y1="2" x2="26" y2="26"><stop stop-color="#60a5fa"/><stop offset="1" stop-color="#a78bfa"/></linearGradient></defs>
                </svg>
               </div>`;
        
        let imagesHTML = '';
        if (images && images.length > 0) {
            imagesHTML = images.map(src => `<img src="${src}" class="msg-image" alt="Attached">`).join('');
        }

        msg.innerHTML = `
            ${avatarHTML}
            <div class="msg-content" style="text-align: ${role === 'user' ? 'right' : 'left'}; max-width: 85%;">
                ${text ? `<div class="msg-bubble" style="display: inline-block; text-align: left;">${this.formatText(text)}</div>` : ''}
                ${imagesHTML ? `<div style="margin-top: 6px;">${imagesHTML}</div>` : ''}
            </div>
        `;

        this.messagesEl.appendChild(msg);
    },

    startNewChat() {
        this.currentChatId = 'chat_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        this.messages = [];
        this.messagesEl.innerHTML = `
            <div class="chat-welcome">
                <div class="chat-welcome-icon">
                    <svg width="48" height="48" viewBox="0 0 28 28" fill="none">
                        <path d="M14 2L16.5 11.5L26 14L16.5 16.5L14 26L11.5 16.5L2 14L11.5 11.5L14 2Z" fill="url(#chatLogoGrad)" />
                    </svg>
                </div>
                <h2 class="welcome-title">Halo! Ada yang bisa saya bantu?</h2>
                <p class="welcome-desc">NOVA siap menjawab pertanyaan, menulis kode, atau berbincang dengan Anda.</p>
            </div>
        `;
        this.saveChat();
    },

    addAttachment(file) {
        if (!file.type.startsWith('image/')) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const id = Date.now();
            this.attachedFiles.push({ id, data: e.target.result, file });
            
            const el = document.createElement('div');
            el.className = 'chat-attachment';
            el.dataset.id = id;
            el.innerHTML = `
                <img src="${e.target.result}" alt="Attachment">
                <button class="remove-attachment" data-id="${id}">✕</button>
            `;
            el.querySelector('.remove-attachment').addEventListener('click', () => {
                this.attachedFiles = this.attachedFiles.filter(f => f.id !== id);
                el.remove();
            });
            this.attachmentsEl.appendChild(el);
        };
        reader.readAsDataURL(file);
    },

    async sendMessage() {
        if (window.isCurrentUserBanned) {
            const overlay = document.getElementById('userBannedOverlay');
            if (overlay) overlay.classList.remove('hidden');
            return;
        }

        if (this.isGenerating) {
            Utils.showToast('Tunggu NOVA selesai menjawab...', 'info');
            return;
        }

        const text = this.inputEl.value.trim();
        if (!text && this.attachedFiles.length === 0) return;

        // Quota Check
        if (window.QuotaManager) {
            const isVision = this.attachedFiles.length > 0;
            const quotaType = isVision ? 'vision' : 'chat';
            if (!QuotaManager.canUse(quotaType)) {
                QuotaManager.showUpgradeModal(isVision ? 'Vision / Analisis Gambar Chat' : 'Chat AI & Coding');
                return;
            }
        }

        // Admin Command Interception
        if (text === '--login') {
            this.inputEl.value = '';
            this.inputEl.style.height = 'auto';
            if (typeof Admin !== 'undefined') Admin.showLoginModal();
            return;
        }
        if (text === '--logout') {
            this.inputEl.value = '';
            this.inputEl.style.height = 'auto';
            if (typeof Admin !== 'undefined') Admin.logout();
            return;
        }

        // Hide welcome
        const welcome = this.messagesEl.querySelector('.chat-welcome');
        if (welcome) welcome.remove();

        // Add user message
        const currentAttachments = this.attachedFiles.map(f => f.data);
        this.addMessage('user', text, currentAttachments);

        // Clear input
        this.inputEl.value = '';
        this.inputEl.style.height = 'auto';
        this.attachedFiles = [];
        this.attachmentsEl.innerHTML = '';

        // Record CCTV Activity Log
        if (window.logUserActivity) {
            window.logUserActivity('chat', text || '[Media File]', { model: 'DeepSeek AI', details: currentAttachments.length > 0 ? `${currentAttachments.length} lampiran gambar` : 'Teks Chat' });
        }

        // Call API
        this.callAPI(text);
    },

    setGenerating(state) {
        this.isGenerating = state;
        if (this.sendBtn) {
            this.sendBtn.disabled = state;
            this.sendBtn.style.opacity = state ? '0.5' : '1';
            this.sendBtn.style.cursor = state ? 'not-allowed' : 'pointer';
        }
    },

    addMessage(role, text, images = []) {
        const msg = document.createElement('div');
        msg.className = `chat-message ${role}`;
        
        const savedAvatar = Utils.storage.get('userAvatar') || 'assets/cat_portrait.jpg';
        const avatarHTML = role === 'user' 
            ? `<div class="msg-avatar"><img src="${savedAvatar}" alt="You"></div>`
            : `<div class="msg-avatar ai-avatar">
                <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
                    <path d="M14 2L16.5 11.5L26 14L16.5 16.5L14 26L11.5 16.5L2 14L11.5 11.5L14 2Z" fill="url(#msgGrad${Date.now()})"/>
                    <defs><linearGradient id="msgGrad${Date.now()}" x1="2" y1="2" x2="26" y2="26"><stop stop-color="#60a5fa"/><stop offset="1" stop-color="#a78bfa"/></linearGradient></defs>
                </svg>
               </div>`;
        
        let imagesHTML = '';
        if (images && images.length > 0) {
            imagesHTML = images.map(src => `<img src="${src}" class="msg-image" alt="Attached">`).join('');
        }

        msg.innerHTML = `
            ${avatarHTML}
            <div class="msg-content" style="text-align: ${role === 'user' ? 'right' : 'left'}; max-width: 85%;">
                ${text ? `<div class="msg-bubble" style="display: inline-block; text-align: left;">${this.formatText(text)}</div>` : ''}
                ${imagesHTML ? `<div style="margin-top: 6px;">${imagesHTML}</div>` : ''}
            </div>
        `;

        this.messagesEl.appendChild(msg);
        this.scrollToBottom();
        this.messages.push({ role, text, images });
        this.saveChat();
    },

    formatText(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code style="background:rgba(99,102,241,0.15);padding:2px 6px;border-radius:4px;font-size:0.85em">$1</code>');
    },

    showTyping() {
        this.hideTyping();
        const typing = document.createElement('div');
        typing.className = 'chat-message ai';
        typing.id = 'typingIndicator';
        typing.innerHTML = `
            <div class="msg-avatar ai-avatar">
                <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
                    <path d="M14 2L16.5 11.5L26 14L16.5 16.5L14 26L11.5 16.5L2 14L11.5 11.5L14 2Z" fill="url(#typGrad)"/>
                    <defs><linearGradient id="typGrad" x1="2" y1="2" x2="26" y2="26"><stop stop-color="#60a5fa"/><stop offset="1" stop-color="#a78bfa"/></linearGradient></defs>
                </svg>
            </div>
            <div class="msg-content" style="text-align: left; max-width: 85%;">
                <div class="msg-bubble" style="display: inline-block; text-align: left;"><div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div></div>
            </div>
        `;
        this.messagesEl.appendChild(typing);
        this.scrollToBottom();
    },

    hideTyping() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    },

    scrollToBottom() {
        setTimeout(() => {
            this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
        }, 50);
    },

    async callAPI(text) {
        if (this.isGenerating) return;
        this.setGenerating(true);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, 50000); // 50 seconds safety timeout

        try {
            this.showTyping();
            
            // Build conversation history
            const conversationHistory = [
                { role: 'system', content: 'You are NOVA, a highly intelligent AI assistant powered by DeepSeek. Answer the user concisely in Indonesian.' },
                ...this.messages.slice(-10).map(m => {
                    if (m.images && m.images.length > 0) {
                        return {
                            role: m.role === 'ai' ? 'assistant' : 'user',
                            content: [
                                { type: "text", text: m.text || "Lihat gambar yang saya lampirkan." },
                                ...m.images.map(img => ({ type: "image_url", image_url: { url: img } }))
                            ]
                        };
                    }
                    return {
                        role: m.role === 'ai' ? 'assistant' : 'user',
                        content: m.text
                    };
                }).filter(m => m.content)
            ];

            let fullResponse = "";
            let aiBubble = null;

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: conversationHistory }),
                signal: controller.signal
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({error: "Unknown error from server"}));
                throw new Error(errorData.error || `Server merespon dengan status ${response.status}`);
            }

            this.hideTyping();
            
            // Create empty bubble for streaming
            aiBubble = document.createElement('div');
            aiBubble.className = 'chat-message ai';
            aiBubble.innerHTML = `
                <div class="msg-avatar ai-avatar">
                    <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
                        <path d="M14 2L16.5 11.5L26 14L16.5 16.5L14 26L11.5 16.5L2 14L11.5 11.5L14 2Z" fill="url(#typGrad)"/>
                    </svg>
                </div>
                <div class="msg-content" style="text-align: left; max-width: 85%;">
                    <div class="msg-bubble streaming-text" style="display: inline-block; text-align: left;"></div>
                </div>
            `;
            this.messagesEl.appendChild(aiBubble);
            const textContainer = aiBubble.querySelector('.streaming-text');
            
            // Handle SSE Stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer = "";
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop(); // Keep the last incomplete line in the buffer
                
                for (let line of lines) {
                    line = line.trim();
                    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                        try {
                            const data = JSON.parse(line.slice(6));
                            
                            if (!data || !Array.isArray(data.choices) || data.choices.length === 0) {
                                continue;
                            }
                            
                            const delta = data.choices[0]?.delta;
                            if (!delta) {
                                continue;
                            }
                            
                            if (typeof delta.content === "string") {
                                fullResponse += delta.content;
                                textContainer.innerHTML = this.formatText(fullResponse);
                                this.scrollToBottom();
                            }
                        } catch (e) {
                            console.error("JSON parse error:", e, "Line:", line);
                        }
                    }
                }
            }
            
            if (!fullResponse.trim()) {
                fullResponse = "Maaf, server tidak mengirimkan jawaban. Silakan coba kembali.";
                textContainer.innerHTML = this.formatText(fullResponse);
            }

            this.messages.push({ role: 'ai', text: fullResponse });
            this.saveChat();

            // Deduct Quota Only on 100% Success
            if (window.QuotaManager) {
                const hadVision = this.messages[this.messages.length - 2]?.images?.length > 0;
                QuotaManager.consume(hadVision ? 'vision' : 'chat');
            }

        } catch (error) {
            console.error("API call failed:", error);
            this.hideTyping();
            
            let userErrMsg = error.name === 'AbortError' 
                ? 'Koneksi timeout. Jaringan di HP lambat atau server sedang sibuk, silakan coba kirim ulang.' 
                : (error.message || 'Gagal menghubungi server.');
                
            this.addMessage('ai', `⚠️ ${userErrMsg}`);
        } finally {
            clearTimeout(timeoutId);
            this.hideTyping();
            this.setGenerating(false);
        }
    },

    getDemoResponse(text) {
        const lower = text.toLowerCase();
        
        if (lower.includes('image') || lower.includes('generate') || lower.includes('create')) {
            return "I'd love to help you create that! 🎨\n\nTo generate images, you can:\n1. Go to the **Image** tab for I2I editing\n2. Go to the **I2V** tab to animate an image\n\nOr describe what you want here and I'll help craft the perfect prompt!";
        }
        if (lower.includes('video') || lower.includes('animate') || lower.includes('motion')) {
            return "Great idea! 🎬\n\nFor video generation, head to the **I2V** tab where you can:\n- Upload a source image\n- Set motion direction (pan, zoom, orbit)\n- Choose FPS and duration\n- Add a descriptive prompt\n\nWould you like tips on creating cinematic motion?";
        }
        if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
            return "Hello! 👋 Welcome to NOVA AI Creative Studio!\n\nI can help you with:\n- 💬 Creative brainstorming\n- 🖼️ Image generation & editing\n- 🎬 Image-to-video animation\n- ✨ Style transfer & enhancement\n\nWhat would you like to create today?";
        }
        if (lower.includes('style') || lower.includes('watercolor') || lower.includes('anime')) {
            return "Style transfer is one of my favorite features! ✨\n\nYou can change styles in the **Image** tab using the LoRA models:\n- **Anime Style v2** — Japanese animation look\n- **Watercolor Art** — Soft painted effect\n- **Oil Painting** — Classic artistic feel\n- **Studio Ghibli** — Dreamy Ghibli aesthetic\n\nUpload an image and select a LoRA to get started!";
        }

        const responses = [
            "That's a great idea! Let me help you think through this. 🤔\n\nI can assist with creative direction, prompt engineering, or technical guidance. What aspect would you like to explore first?",
            "Interesting! Here are some ways I can help:\n\n1. **Brainstorm** creative concepts\n2. **Refine** your prompts for better results\n3. **Suggest** styles and techniques\n4. **Guide** you through the tools\n\nJust let me know what you need! ✨",
            "I'm here to help! 🚀\n\nNOVA can handle a variety of creative tasks. Would you like me to:\n- Help craft a detailed prompt?\n- Suggest artistic styles?\n- Walk you through the I2I or I2V workflow?\n\nTell me more about what you're envisioning!"
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }
};

