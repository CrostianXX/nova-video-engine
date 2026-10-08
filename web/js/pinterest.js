const Pinterest = {
    modal: null,
    searchView: null,
    detailView: null,
    scrollContainer: null,
    grid: null,
    searchInput: null,
    searchBtn: null,
    closeBtn: null,
    loading: null,
    tagsBar: null,
    
    // Detail View Elements
    backBtn: null,
    detailCloseBtn: null,
    detailUrlText: null,
    detailImg: null,
    detailLikes: null,
    detailAuthor: null,
    authorAvatar: null,
    detailTitle: null,
    detailTags: null,
    detailPinLink: null,
    detailPinLinkText: null,
    detailSaveBtn: null,
    detailUseBtn: null,
    relatedLoading: null,
    relatedGrid: null,
    
    // Confirmation Modal
    confirmModal: null,
    confirmImg: null,
    confirmYes: null,
    confirmCancel: null,
    
    targetApp: null, // 'i2i' or 'i2v'
    selectedImageUrl: null,
    
    // Pagination & Search State
    currentQuery: '',
    currentPage: 1,
    currentBookmark: null,
    isLoading: false,
    hasMore: true,
    seenUrls: new Set(),
    
    // History & Visited Tracking (Persis Gambar 1 & Gambar 2)
    visitedPinUrls: new Set(),
    lastVisitedPinUrl: null,
    pinHistory: [],
    currentPin: null,
    
    init() {
        this.modal = document.getElementById('pinterestModal');
        this.searchView = document.getElementById('pinterestSearchView');
        this.detailView = document.getElementById('pinterestDetailView');
        this.scrollContainer = document.getElementById('pinterestScroll');
        this.grid = document.getElementById('pinterestGrid');
        this.searchInput = document.getElementById('pinterestSearchInput');
        this.searchBtn = document.getElementById('pinterestSearchBtn');
        this.closeBtn = document.getElementById('pinterestCloseBtn');
        this.loading = document.getElementById('pinterestLoading');
        this.tagsBar = document.getElementById('pinterestTagsBar');
        
        // Detail View
        this.backBtn = document.getElementById('pinterestBackBtn');
        this.detailCloseBtn = document.getElementById('pinterestDetailCloseBtn');
        this.detailUrlText = document.getElementById('pinterestDetailUrlText');
        this.detailImg = document.getElementById('pinterestDetailImg');
        this.detailLikes = document.getElementById('pinterestDetailLikes');
        this.detailAuthor = document.getElementById('pinterestDetailAuthor');
        this.authorAvatar = document.getElementById('pinterestAuthorAvatar');
        this.detailTitle = document.getElementById('pinterestDetailTitle');
        this.detailTags = document.getElementById('pinterestDetailTags');
        this.detailPinLink = document.getElementById('pinterestDetailPinLink');
        this.detailPinLinkText = document.getElementById('pinterestDetailPinLinkText');
        this.detailSaveBtn = document.getElementById('pinterestDetailSaveBtn');
        this.detailUseBtn = document.getElementById('pinterestDetailUseBtn');
        this.relatedLoading = document.getElementById('pinterestRelatedLoading');
        this.relatedGrid = document.getElementById('pinterestRelatedGrid');
        
        // Confirmation
        this.confirmModal = document.getElementById('pinterestConfirmModal');
        this.confirmImg = document.getElementById('pinterestConfirmImg');
        this.confirmYes = document.getElementById('pinterestConfirmYesBtn');
        this.confirmCancel = document.getElementById('pinterestConfirmCancelBtn');
        
        this.bindEvents();
    },
    
    bindEvents() {
        // Triggers from Dashboard
        const btnI2I = document.getElementById('pinterestSearchBtnI2I');
        const btnI2V = document.getElementById('pinterestSearchBtnI2V');
        
        if (btnI2I) btnI2I.addEventListener('click', () => this.openSearch('i2i'));
        if (btnI2V) btnI2V.addEventListener('click', () => this.openSearch('i2v'));
        
        // Modal Events
        if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.closeSearch());
        if (this.detailCloseBtn) this.detailCloseBtn.addEventListener('click', () => this.closeSearch());
        
        // Search button & Enter key
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => {
                this.switchToSearchView();
                this.performSearch(this.searchInput.value, false);
            });
        }
        if (this.searchInput) {
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.switchToSearchView();
                    this.performSearch(this.searchInput.value, false);
                }
            });
        }
        
        // Back Button (Gambar 2 -> Gambar 1)
        if (this.backBtn) {
            this.backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.goBack();
            });
        }
        
        // Tag Pills Click Events
        if (this.tagsBar) {
            this.tagsBar.addEventListener('click', (e) => {
                const pill = e.target.closest('.pinterest-tag-pill');
                if (!pill) return;
                const tag = pill.getAttribute('data-tag');
                if (!tag) return;
                
                // Set active class
                this.tagsBar.querySelectorAll('.pinterest-tag-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                
                // Formulate search query: if current query is non-empty, combine or search tag
                let newQuery = tag;
                if (this.currentQuery && !this.currentQuery.toLowerCase().includes(tag.toLowerCase())) {
                    newQuery = `${this.currentQuery} ${tag}`;
                }
                this.searchInput.value = newQuery;
                this.switchToSearchView();
                this.performSearch(newQuery, false);
            });
        }
        
        // Use Button in Detail View
        if (this.detailUseBtn) {
            this.detailUseBtn.addEventListener('click', () => {
                if (this.currentPin && this.currentPin.url) {
                    this.injectIntoApp(this.currentPin.url, this.targetApp);
                }
            });
        }
        if (this.detailSaveBtn) {
            this.detailSaveBtn.addEventListener('click', () => {
                if (this.currentPin && this.currentPin.url) {
                    this.injectIntoApp(this.currentPin.url, this.targetApp);
                }
            });
        }
        
        // Like button toggle
        const likeBtn = document.getElementById('pinterestLikeBtn');
        if (likeBtn) {
            likeBtn.addEventListener('click', () => {
                let count = parseInt(this.detailLikes.textContent || '3', 10);
                if (likeBtn.classList.contains('liked')) {
                    likeBtn.classList.remove('liked');
                    likeBtn.querySelector('svg').setAttribute('fill', 'none');
                    likeBtn.querySelector('svg').setAttribute('stroke', 'currentColor');
                    this.detailLikes.textContent = Math.max(0, count - 1);
                } else {
                    likeBtn.classList.add('liked');
                    likeBtn.querySelector('svg').setAttribute('fill', '#e60023');
                    likeBtn.querySelector('svg').setAttribute('stroke', '#e60023');
                    this.detailLikes.textContent = count + 1;
                }
            });
        }
        
        // Infinite Scroll on Scroll Container
        const scroller = this.scrollContainer || this.grid;
        if (scroller) {
            scroller.addEventListener('scroll', () => {
                if (this.isLoading || !this.hasMore || this.searchView.style.display === 'none') return;
                if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 400) {
                    this.loadMore();
                }
            });
        }
        
        // Confirm Dialog Events
        if (this.confirmCancel) {
            this.confirmCancel.addEventListener('click', () => {
                this.confirmModal.classList.remove('active');
            });
        }
        if (this.confirmYes) {
            this.confirmYes.addEventListener('click', () => {
                this.injectIntoApp(this.selectedImageUrl, this.targetApp);
            });
        }
    },
    
    openSearch(target) {
        this.targetApp = target;
        this.modal.classList.add('active');
        this.switchToSearchView();
        this.searchInput.focus();
        if (this.grid.innerHTML === '') {
            const initialQuery = (this.searchInput.value && this.searchInput.value.trim()) || 'zee';
            this.performSearch(initialQuery, false);
        }
    },
    
    closeSearch() {
        this.modal.classList.remove('active');
    },
    
    switchToSearchView() {
        if (this.detailView) this.detailView.style.display = 'none';
        if (this.searchView) this.searchView.style.display = 'flex';
        this.pinHistory = [];
        this.updateLastVisitedBadges();
    },
    
    async performSearch(query, isAppend = false) {
        if (!query || !query.trim()) return;
        let cleanQ = query.trim();
        // Pertajam algoritma indo
        if (!cleanQ.toLowerCase().includes('indo') && !cleanQ.toLowerCase().includes('jkt48')) {
            cleanQ += ' indonesia aesthetic';
        }
        
        if (!isAppend) {
            this.currentQuery = cleanQ;
            this.currentPage = 1;
            this.currentBookmark = null;
            this.hasMore = true;
            this.seenUrls.clear();
            this.grid.innerHTML = '';
            this.loading.classList.remove('hidden');
        } else {
            this.showLoadMoreSpinner(true);
        }
        
        this.isLoading = true;
        
        try {
            let images = [];
            
            // Direct web chat backup (bahas.crostia.my.id)
            if (!images || images.length === 0) {
                try {
                    const res2 = await fetch(`https://bahas.crostia.my.id/api/images/search?q=${encodeURIComponent(cleanQ)}`);
                    if (res2.ok) {
                        const data2 = await res2.json();
                        images = (data2.images || []).filter(item => !String(item.id).startsWith('flickr'));
                    }
                } catch (err2) {
                    console.error('Direct backup error:', err2);
                }
            }
            
            // Format gambar
            const newFormatted = [];
            if (images && images.length > 0) {
                images.forEach((item, idx) => {
                    let thumbUrl = item.thumb || item.url || '';
                    thumbUrl = thumbUrl.replace(/explicit\.bing\.net/g, 'mm.bing.net');
                    let hdUrl = item.url || thumbUrl;
                    if (hdUrl.includes('pinimg.com')) {
                        hdUrl = hdUrl.replace(/\/236x\//, '/736x/').replace(/\/474x\//, '/736x/');
                    }
                    
                    if (hdUrl && !this.seenUrls.has(hdUrl)) {
                        this.seenUrls.add(hdUrl);
                        
                        // Extract author & pin link
                        let pinLink = item.link || item.authorLink || '';
                        if (!pinLink && hdUrl.includes('pinimg.com')) {
                            pinLink = `https://id.pinterest.com/pin/58209032${Math.floor(Math.random() * 90000000 + 10000000)}/`;
                        }
                        
                        let author = item.author || 'calyx swartz';
                        if (author.includes('|')) author = author.split('|')[0].trim();
                        author = author.replace(/Pin oleh/i, '').replace(/di Simpan.*/i, '').trim() || 'calyx swartz';
                        
                        const rawText = ((item.title || '') + ' ' + (item.desc || '') + ' ' + (item.author || '')).toLowerCase();
                        if (rawText.includes('ad page') || rawText.includes('affiliate program')) return;

                        const rawTitle = (item.title && item.title !== 'None') ? item.title : (item.desc || item.author || cleanQ);
                        const displayTitle = this.cleanPinTitle(rawTitle, cleanQ);

                        newFormatted.push({
                            id: item.id || `pin_${this.currentPage}_${idx}`,
                            url: hdUrl,
                            thumb: thumbUrl,
                            title: displayTitle,
                            author: author,
                            link: pinLink,
                            desc: item.desc || displayTitle
                        });
                    }
                });
            }
            
            if (newFormatted.length > 0) {
                if (!isAppend) {
                    this.updateTagPills(cleanQ, newFormatted);
                }
                this.renderGrid(newFormatted, isAppend);
            } else {
                if (!isAppend) {
                    this.grid.innerHTML = '<div style="column-span: all; text-align: center; color: var(--text-muted); padding: 50px 20px;">Tidak ada gambar ditemukan. Coba kata kunci lain.</div>';
                }
                this.hasMore = false;
            }
        } catch (e) {
            console.error('Search error:', e);
            if (!isAppend) {
                this.grid.innerHTML = '<div style="column-span: all; text-align: center; padding: 40px; color: #94a3b8;">Gagal memuat gambar. Coba kata kunci lain.</div>';
            }
        } finally {
            this.isLoading = false;
            this.loading.classList.add('hidden');
            this.showLoadMoreSpinner(false);
        }
    },
    
    cleanPinTitle(rawTitle, defaultQ) {
        if (!rawTitle) return defaultQ;
        let t = rawTitle;
        t = t.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
        t = t.replace(/^(?:pinterest\s*(?:in\s*\d{4})?\s*\|\s*)/i, '');
        t = t.replace(/^best\s+\d+\+?\s+.*?ideas on pinterest\s*\|\s*/i, '');
        t = t.replace(/^(?:pin\s+(?:oleh|by|sur|auf|de)\s+.*?\|\s*)/i, '');
        t = t.replace(/^(?:pin\s+(?:oleh|by|sur|auf|de)\s+.*?(?:on|di|sur)\s+.*?)(?:\s*\|\s*|\s*:\s*)/i, '');
        t = t.replace(/^discover\s+\d+\+?\s+.*?board\s*\|\s*/i, '');
        t = t.replace(/\s*[-–—|]\s*(?:artofit|behance|pinterest).*$/i, '');
        t = t.replace(/\s*\.\.\.$/, '');
        
        if (t.includes('|')) {
            const parts = t.split('|').map(p => p.trim()).filter(p => p.length > 2);
            const queryMatch = parts.find(p => !p.toLowerCase().includes('pinterest') && !p.toLowerCase().startsWith('pin '));
            if (queryMatch) t = queryMatch;
            else if (parts.length > 0) t = parts[0];
        }
        t = t.trim();
        if (!t || t.length < 3) return defaultQ;
        return t.charAt(0).toUpperCase() + t.slice(1);
    },

    updateTagPills(query, images) {
        if (!this.tagsBar) return;
        
        const qClean = query.toLowerCase().trim();
        const curatedTags = {
            'spiderman': ['Comic Art', 'Wallpaper', 'Miles Morales', 'Tom Holland', 'Marvel', 'Artwork', 'Suit', 'Drawings', 'Aesthetic', 'Poster'],
            'spider-man': ['Comic Art', 'Wallpaper', 'Miles Morales', 'Tom Holland', 'Marvel', 'Artwork', 'Suit', 'Drawings', 'Aesthetic', 'Poster'],
            'batman': ['Dark Knight', 'Wallpaper', 'Comic', 'Arkham', 'Artwork', 'Aesthetic', 'Poster', 'Gotham'],
            'iron man': ['Marvel', 'Wallpaper', 'Suit', 'Avengers', 'Tony Stark', 'Artwork', '3D', 'Poster'],
            'naruto': ['Shippuden', 'Wallpaper', 'Sasuke', 'Kakashi', 'Itachi', 'Aesthetic', 'Artwork', 'Icon'],
            'anime': ['Wallpaper', 'Boy', 'Girl', 'Aesthetic', 'Icon', 'Artwork', 'Dark', 'Cute', 'Scenery'],
            'cat': ['Cute', 'Kitten', 'Meme', 'Aesthetic', 'Wallpaper', 'Drawing', 'Funny', 'Fluffy'],
            'kpop': ['Aesthetic', 'Photocard', 'Outfit', 'Wallpaper', 'Selca', 'Stage', 'Cute', 'Edits'],
            'zee': ['Crt', 'Crt wotabul', 'Crt muka', 'Crt video', 'Wotabul', 'Crt jkt48', 'Asadel', 'Jkt48', 'Wallpaper', 'Selca', 'Photoshoot', 'Cute']
        };
        
        let tags = curatedTags[qClean];
        if (!tags) {
            for (const key in curatedTags) {
                if (qClean.includes(key)) {
                    tags = curatedTags[key];
                    break;
                }
            }
        }
        
        if (!tags) {
            const wordFreq = {};
            const stopWords = new Set(['the', 'and', 'for', 'with', 'image', 'images', 'photo', 'pin', 'oleh', 'di', 'simpan', 'cepat', 'dari', 'yang', 'dan', 'pada', 'free', 'hd', 'wallpaper', 'art', 'pinterest', qClean]);
            
            (images || []).forEach(img => {
                const words = (img.title || '').replace(/[^a-zA-Z0-9\s]/g, ' ').toLowerCase().split(/\s+/);
                words.forEach(w => {
                    if (w.length > 2 && !stopWords.has(w) && !qClean.includes(w)) {
                        wordFreq[w] = (wordFreq[w] || 0) + 1;
                    }
                });
            });
            
            const sortedWords = Object.keys(wordFreq).sort((a, b) => wordFreq[b] - wordFreq[a]);
            const dynamicList = sortedWords.slice(0, 6).map(w => w.charAt(0).toUpperCase() + w.slice(1));
            const modifiers = ['Wallpaper', 'Artwork', 'Aesthetic', 'Photoshoot', 'Close Up', 'Poster', 'Illustration'];
            tags = [...new Set([...dynamicList, ...modifiers])].slice(0, 10);
        }
        
        this.tagsBar.innerHTML = tags.map(tag => `<button class="pinterest-tag-pill" data-tag="${tag}">${tag}</button>`).join('');
    },
    
    loadMore() {
        if (this.isLoading || !this.hasMore) return;
        this.currentPage++;
        this.performSearch(this.currentQuery, true);
    },
    
    showLoadMoreSpinner(show) {
        let loader = document.getElementById('pinterestGridLoader');
        if (show) {
            if (!loader) {
                loader = document.createElement('div');
                loader.id = 'pinterestGridLoader';
                loader.style.cssText = 'column-span: all; text-align: center; padding: 20px; color: var(--text-secondary); width: 100%;';
                loader.innerHTML = '<div class="spinner-ring" style="width: 24px; height: 24px; border: 2px solid var(--accent-blue-soft); border-top-color: var(--accent-blue); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 8px;"></div><span>Memuat lebih banyak foto...</span>';
                this.grid.appendChild(loader);
            }
            loader.style.display = 'block';
        } else if (loader) {
            loader.style.display = 'none';
        }
    },
    
    renderGrid(images, isAppend = false) {
        if (!isAppend) {
            this.grid.innerHTML = '';
        }
        
        const existingLoader = document.getElementById('pinterestGridLoader');
        if (existingLoader) existingLoader.remove();

        images.forEach(imgObj => {
            const div = document.createElement('div');
            div.className = 'pinterest-item';
            div.setAttribute('data-url', imgObj.url);
            
            const thumbUrl = imgObj.thumb || imgObj.url;
            const isLastVisited = (this.lastVisitedPinUrl === imgObj.url || this.visitedPinUrls.has(imgObj.url));
            
            div.innerHTML = `
                <div style="position: relative; overflow: hidden; border-radius: 16px;">
                    <img src="${thumbUrl}" alt="${imgObj.title}" loading="lazy" onerror="this.onerror=null; this.src='${imgObj.url}';">
                    
                    ${isLastVisited ? `<div class="pinterest-last-visited-badge">Last visited</div>` : ''}
                    
                    <div class="pinterest-overlay">
                        <div style="display: flex; justify-content: flex-end; align-items: center;">
                            <button class="pinterest-action-btn select-direct-btn" style="background: #e60023; padding: 8px 16px; border-radius: 20px; font-weight: 700; box-shadow: 0 4px 10px rgba(230,0,35,0.4);" title="Gunakan Langsung">Save</button>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: white; font-size: 0.8rem; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; max-width: 80%;" title="${imgObj.title}">${imgObj.title}</span>
                            <button class="pinterest-action-btn share-icon-btn" style="background: rgba(255,255,255,0.25); width: 30px; height: 30px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 50%;" title="Bagikan">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div style="padding: 8px 4px 4px 4px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 13px; font-weight: 600; color: var(--text-primary); text-overflow: ellipsis; white-space: nowrap; overflow: hidden;" title="${imgObj.title}">${imgObj.title}</span>
                    <button style="border: none; background: transparent; color: var(--text-secondary); cursor: pointer; padding: 2px;" title="Lainnya">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle><circle cx="5" cy="12" r="2"></circle></svg>
                    </button>
                </div>
            `;
            
            // Tombol langsung Save / Gunakan
            const selectBtn = div.querySelector('.select-direct-btn');
            if (selectBtn) {
                selectBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.openConfirm(imgObj.url);
                });
            }
            
            // KLIK PADA CARD: Langsung masuk ke Pin Detail View (Gambar 2)!
            div.addEventListener('click', (e) => {
                if (e.target.closest('.select-direct-btn') || e.target.closest('.share-icon-btn')) return;
                this.openPinDetail(imgObj);
            });
            
            this.grid.appendChild(div);
        });
    },
    
    updateLastVisitedBadges() {
        if (!this.grid) return;
        const items = this.grid.querySelectorAll('.pinterest-item');
        items.forEach(item => {
            const itemUrl = item.getAttribute('data-url');
            const wrap = item.querySelector('div');
            const existingBadge = item.querySelector('.pinterest-last-visited-badge');
            
            if (this.visitedPinUrls.has(itemUrl)) {
                if (!existingBadge && wrap) {
                    const badge = document.createElement('div');
                    badge.className = 'pinterest-last-visited-badge';
                    badge.textContent = 'Last visited';
                    wrap.appendChild(badge);
                }
            }
        });
    },
    
    // OPEN PIN DETAIL (Persis Gambar 2)
    openPinDetail(pinObj, isFromRelated = false) {
        if (!pinObj) return;
        
        // Track visited
        this.visitedPinUrls.add(pinObj.url);
        this.lastVisitedPinUrl = pinObj.url;
        this.currentPin = pinObj;
        
        if (!isFromRelated) {
            this.pinHistory = [pinObj];
        } else {
            this.pinHistory.push(pinObj);
        }
        
        // Switch Views
        if (this.searchView) this.searchView.style.display = 'none';
        if (this.detailView) this.detailView.style.display = 'flex';
        
        // Populate Detail Card
        if (this.detailImg) this.detailImg.src = pinObj.url;
        if (this.detailTitle) this.detailTitle.textContent = pinObj.title || 'Foto Pinterest';
        if (this.detailAuthor) this.detailAuthor.textContent = pinObj.author || 'calyx swartz';
        if (this.authorAvatar) {
            const initial = (pinObj.author ? pinObj.author.charAt(0).toUpperCase() : 'C');
            this.authorAvatar.textContent = initial;
        }
        if (this.detailLikes) {
            this.detailLikes.textContent = Math.floor(Math.random() * 20 + 3);
        }
        
        // Format simulated Pinterest URL (persis bar di Gambar 2)
        const pinIdMatch = pinObj.url.match(/pin\/(\d+)/);
        const pinId = pinIdMatch ? pinIdMatch[1] : (pinObj.id ? String(pinObj.id).replace(/\D/g, '') : '582090320621457629');
        const displayUrl = `id.pinterest.com/pin/${pinId.slice(0, 18) || '582090320621457629'}/`;
        if (this.detailUrlText) this.detailUrlText.textContent = displayUrl;
        
        // Pin link
        if (this.detailPinLink) {
            const fullLink = pinObj.link && pinObj.link.startsWith('http') ? pinObj.link : `https://${displayUrl}`;
            this.detailPinLink.href = fullLink;
        }
        if (this.detailPinLinkText) {
            this.detailPinLinkText.textContent = `Buka di ${displayUrl}`;
        }
        
        // Generate Hashtags persis Gambar 2 (#zeejkt48 #jkt48zee #aziziasadel #gen7 #jkt48)
        if (this.detailTags) {
            const rawWords = (pinObj.title + ' ' + (pinObj.desc || '') + ' ' + this.currentQuery)
                .toLowerCase()
                .replace(/[^a-zA-Z0-9\s]/g, '')
                .split(/\s+/)
                .filter(w => w.length > 2);
            
            const uniqueWords = [...new Set(rawWords)].slice(0, 6);
            if (uniqueWords.length === 0) uniqueWords.push('pinterest', 'aesthetic');
            
            this.detailTags.innerHTML = uniqueWords.map(w => `<span class="pinterest-hashtag-item" style="cursor: pointer;">#${w}</span>`).join(' ');
            
            // Klik hashtag untuk mencari
            this.detailTags.querySelectorAll('.pinterest-hashtag-item').forEach(span => {
                span.addEventListener('click', (e) => {
                    const tagWord = e.target.textContent.replace('#', '');
                    this.searchInput.value = tagWord;
                    this.switchToSearchView();
                    this.performSearch(tagWord, false);
                });
            });
        }
        
        // Scroll detail container to top
        const detailContainer = document.querySelector('.pinterest-detail-container');
        if (detailContainer) detailContainer.scrollTop = 0;
        
        // Fetch More Like This (Foto Terkait)
        this.fetchRelatedPins(pinObj);
    },
    
    // FETCH FOTO TERKAIT (More like this di Gambar 2)
    async fetchRelatedPins(pinObj) {
        if (!this.relatedGrid) return;
        this.relatedGrid.innerHTML = '';
        if (this.relatedLoading) this.relatedLoading.classList.remove('hidden');
        
        // Query untuk foto terkait: gunakan kata kunci judul atau nama author
        let relatedQ = this.currentQuery || 'zee jkt48';
        if (pinObj.title && pinObj.title.length > 3) {
            // Ambil 2-3 kata pertama dari judul pin
            const words = pinObj.title.replace(/[^a-zA-Z0-9\s]/g, '').trim().split(/\s+/).slice(0, 3).join(' ');
            if (words) relatedQ = words;
        }
        
        try {
            const res = await fetch(`/api/images/search?q=${encodeURIComponent(relatedQ)}&page=1`);
            let relatedImages = [];
            if (res.ok) {
                const data = await res.json();
                relatedImages = (data.images || []).filter(item => item.url !== pinObj.url);
            }
            
            if (relatedImages.length > 0) {
                this.renderRelatedGrid(relatedImages);
            } else {
                this.relatedGrid.innerHTML = '<div style="column-span: all; text-align: center; color: var(--text-secondary); padding: 30px 10px; font-size: 13px;">Tidak ada foto terkait lainnya.</div>';
            }
        } catch (err) {
            console.error('Error fetching related pins:', err);
            this.relatedGrid.innerHTML = '<div style="column-span: all; text-align: center; color: var(--text-secondary); padding: 30px 10px; font-size: 13px;">Gagal memuat foto terkait.</div>';
        } finally {
            if (this.relatedLoading) this.relatedLoading.classList.add('hidden');
        }
    },
    
    // RENDER RELATED GRID
    renderRelatedGrid(images) {
        if (!this.relatedGrid) return;
        this.relatedGrid.innerHTML = '';
        
        images.forEach(item => {
            const div = document.createElement('div');
            div.className = 'pinterest-item';
            div.style.marginBottom = '12px';
            div.style.borderRadius = '14px';
            
            const thumbUrl = item.thumb || item.url;
            
            div.innerHTML = `
                <div style="position: relative; overflow: hidden; border-radius: 14px;">
                    <img src="${thumbUrl}" alt="${item.title}" loading="lazy" onerror="this.onerror=null; this.src='${item.url}';">
                    <div class="pinterest-overlay">
                        <div style="display: flex; justify-content: flex-end;">
                            <button class="pinterest-action-btn rel-save-btn" style="background: #e60023; padding: 6px 12px; border-radius: 16px; font-weight: 700;" title="Gunakan Gambar">Save</button>
                        </div>
                    </div>
                </div>
                <div style="padding: 6px 2px 2px 2px;">
                    <span style="font-size: 12px; font-weight: 600; color: var(--text-primary); text-overflow: ellipsis; white-space: nowrap; overflow: hidden; display: block;" title="${item.title}">${item.title}</span>
                </div>
            `;
            
            // Tombol save di foto terkait
            const saveBtn = div.querySelector('.rel-save-btn');
            if (saveBtn) {
                saveBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.openConfirm(item.url);
                });
            }
            
            // Klik foto terkait: MAKIN KE DALAM! Buka pin tersebut di detail view!
            div.addEventListener('click', (e) => {
                if (e.target.closest('.rel-save-btn')) return;
                this.openPinDetail(item, true);
            });
            
            this.relatedGrid.appendChild(div);
        });
    },
    
    // BACK BUTTON
    goBack() {
        if (this.pinHistory.length > 1) {
            // Pop current pin, kembalikan ke pin sebelumnya di riwayat
            this.pinHistory.pop();
            const prevPin = this.pinHistory[this.pinHistory.length - 1];
            this.openPinDetail(prevPin, true);
        } else {
            // Kembali ke Search View (Gambar 1)
            this.switchToSearchView();
        }
    },
    
    openConfirm(url) {
        this.selectedImageUrl = url;
        this.confirmImg.src = url;
        this.confirmModal.classList.add('active');
    },
    
    async injectIntoApp(url, target) {
        if (this.confirmModal) this.confirmModal.classList.remove('active');
        this.modal.classList.remove('active');
        if (typeof Admin !== 'undefined') Admin.showToast('Mengunduh gambar dari Pinterest...', true);
        
        try {
            let blob = null;
            
            // Coba lewat proxy corsproxy.org yang baru
            try {
                const proxyUrl = `https://corsproxy.org/?${encodeURIComponent(url)}`;
                const response = await fetch(proxyUrl);
                if (response.ok) {
                    blob = await response.blob();
                }
            } catch (err) {
                console.warn('Proxy download failed, trying direct fetch...', err);
            }
            
            // Jika proxy gagal, coba fetch langsung
            if (!blob || blob.size === 0) {
                try {
                    const directRes = await fetch(url);
                    if (directRes.ok) {
                        blob = await directRes.blob();
                    }
                } catch (err2) {
                    console.error('Direct fetch failed:', err2);
                }
            }
            
            if (!blob || blob.size === 0) {
                throw new Error('Gagal mengunduh file gambar.');
            }
            
            // Buat objek File
            const filename = `pinterest_${Date.now()}.jpg`;
            const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });
            
            // Masukkan ke target editor
            if (target === 'i2i') {
                const dt = new DataTransfer();
                dt.items.add(file);
                const fileInput = document.getElementById('imageFileInput');
                if (fileInput) {
                    fileInput.files = dt.files;
                    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
                if (typeof ImageEditor !== 'undefined') {
                    if (typeof ImageEditor.handleFile === 'function') {
                        ImageEditor.handleFile(file);
                    } else {
                        ImageEditor.uploadedImageFile = file;
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                            ImageEditor.uploadedImageBase64 = ev.target.result;
                            const prev = document.getElementById('imagePreview');
                            const ph = document.getElementById('imagePlaceholder');
                            const chBtn = document.getElementById('changeImageBtn');
                            if (prev) { prev.src = ev.target.result; prev.classList.remove('hidden'); }
                            if (ph) ph.classList.add('hidden');
                            if (chBtn) chBtn.classList.remove('hidden');
                        };
                        reader.readAsDataURL(file);
                    }
                }
            } else if (target === 'i2v') {
                const dt = new DataTransfer();
                dt.items.add(file);
                const fileInput = document.getElementById('i2vFileInput');
                if (fileInput) {
                    fileInput.files = dt.files;
                    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
                if (typeof I2V !== 'undefined') {
                    if (typeof I2V.handleFile === 'function') {
                        I2V.handleFile(file);
                    } else {
                        I2V.uploadedImageFile = file;
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                            I2V.uploadedImage = ev.target.result;
                            const prev = document.getElementById('i2vImagePreview');
                            const ph = document.getElementById('i2vPlaceholder');
                            const genBtn = document.getElementById('i2vGenerateBtn');
                            if (prev) { prev.src = ev.target.result; prev.classList.remove('hidden'); }
                            if (ph) ph.classList.add('hidden');
                            if (genBtn) genBtn.disabled = false;
                        };
                        reader.readAsDataURL(file);
                    }
                }
            }
            
            if (typeof Admin !== 'undefined') Admin.showToast('Gambar Pinterest berhasil dimasukkan ke editor!', true);
            
        } catch (e) {
            console.error('Error fetching image:', e);
            if (typeof Admin !== 'undefined') Admin.showToast('Gagal memuat gambar: ' + e.message, false);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Pinterest.init();
});
