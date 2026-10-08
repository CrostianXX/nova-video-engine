/* ============================================================
   NOVA — AI Brain Network Animation
   ============================================================ */

class BrainAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this._lastScreenCategory = null; // Track screen size category to avoid unnecessary reinit
        this.mode = 'wander'; // 'wander' or 'star'
        this.isPaused = false;
        this.animFrameId = null;
        this.resize();

        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (this.isPaused) return;
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.resize(), 150);
        });
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isPaused) return;
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        this.initNodes();

        // Check if Lite Mode (Anti-Lag) is active on init
        if (localStorage.getItem('nova_lite_mode') === 'true') {
            this.pause();
        } else {
            this.animate();
        }
    }

    pause() {
        this.isPaused = true;
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.width, this.height);
        }
        if (this.canvas) {
            this.canvas.style.display = 'none';
        }
    }

    resume() {
        if (!this.isPaused) return;
        this.isPaused = false;
        if (this.canvas) {
            this.canvas.style.display = 'block';
        }
        this.resize();
        this._lastTimestamp = performance.now();
        this.animate();
    }

    resize() {
        this.width = this.canvas.parentElement.clientWidth;
        this.height = this.canvas.parentElement.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Determine screen category and mobile state
        this.isMobile = this.width <= 768;
        let category;
        if (this.width <= 480) {
            category = 'xs';
            this.numNodes = 55;
            this.connectionDistance = 75;
            this.mouse.radius = 80;
        } else if (this.width <= 768) {
            category = 'sm';
            this.numNodes = 90;
            this.connectionDistance = 85;
            this.mouse.radius = 100;
        } else if (this.width <= 1024) {
            category = 'md';
            this.numNodes = 160;
            this.connectionDistance = 95;
            this.mouse.radius = 130;
        } else {
            category = 'lg';
            this.numNodes = 280; // Full dense constellation & star
            this.connectionDistance = 110;
            this.mouse.radius = 160;
        }

        // Only reinitialize nodes if screen category changed (not every pixel resize)
        if (this._lastScreenCategory !== category) {
            this._lastScreenCategory = category;
            this.nodes = [];
            this.initNodes();
        } else {
            if (this.mode === 'star') {
                // If it's a star, recalculate the exact symmetrical positions based on new width/height
                this.formStarShape();
                // Snap them immediately so it doesn't look weird during fast resizes
                for (let node of this.nodes) {
                    node.x = node.baseX;
                    node.y = node.baseY;
                }
            } else {
                // Just clamp existing nodes to new bounds
                for (let node of this.nodes) {
                    node.baseX = Math.min(node.baseX, this.width);
                    node.baseY = Math.min(node.baseY, this.height);
                    node.x = Math.min(node.x, this.width);
                    node.y = Math.min(node.y, this.height);
                }
            }
        }
    }

    initNodes() {
        for (let i = 0; i < this.numNodes; i++) {
            this.nodes.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 2 + 1.5,
                baseX: Math.random() * this.width,
                baseY: Math.random() * this.height
            });
        }
        
        if (this.mode === 'star') {
            this.formStarShape();
        }
    }

    setMode(mode) {
        if (this.mode === mode) return;
        this.mode = mode;
        if (mode === 'star') {
            this.formStarShape();
        } else {
            // Scatter them back randomly
            for (let node of this.nodes) {
                node.baseX = Math.random() * this.width;
                node.baseY = Math.random() * this.height;
            }
        }
    }

    formStarShape() {
        let cx = this.width / 2;
        const cy = this.height / 2;
        
        // Shift center right by 120px on desktop to perfectly align with the main content area (sidebar is 240px)
        if (this.width > 768) {
            cx += 120;
        }

        // Make star size scale with screen
        const outerRadius = Math.min(this.width, this.height) * 0.38;
        // Standard 5-pointed star proportions
        const innerRadius = outerRadius * 0.45; 
        
        // Generate points for a 5-pointed star (10 points total)
        const starPoints = [];
        const pointsCount = 10;
        for (let i = 0; i < pointsCount; i++) {
            let radius = i % 2 === 0 ? outerRadius : innerRadius;
            let angle = (i * Math.PI / 5) - (Math.PI / 2);
            starPoints.push({
                x: cx + Math.cos(angle) * radius,
                y: cy + Math.sin(angle) * radius
            });
        }
        
        // Distribute nodes evenly along the lines connecting star points for a perfect shape
        let nodesPerEdge = Math.max(1, Math.floor(this.numNodes / pointsCount));
        
        for (let i = 0; i < this.numNodes; i++) {
            let edgeIndex = i % pointsCount;
            let nextIndex = (edgeIndex + 1) % pointsCount;
            let p1 = starPoints[edgeIndex];
            let p2 = starPoints[nextIndex];
            
            // Even distribution, perfectly crisp
            let nodeIndexOnEdge = Math.floor(i / pointsCount);
            let t = nodeIndexOnEdge / nodesPerEdge;
            
            this.nodes[i].baseX = p1.x + (p2.x - p1.x) * t;
            this.nodes[i].baseY = p1.y + (p2.y - p1.y) * t;
        }
    }

    update(dt = 1) {
        // Clamp dt to avoid physics exploding after tab switch
        const timeScale = Math.min(dt, 2.5);

        for (let i = 0; i < this.numNodes; i++) {
            let node = this.nodes[i];
            
            const dx = node.baseX - node.x;
            const dy = node.baseY - node.y;
            
            if (this.mode === 'star') {
                // Fly smoothly to star position and stay stable
                node.vx += dx * 0.08 * timeScale;
                node.vy += dy * 0.08 * timeScale;
                node.vx *= Math.pow(0.75, timeScale);
                node.vy *= Math.pow(0.75, timeScale);
                
                // Snap to exact position if very close to prevent jitter
                if (Math.abs(dx) < 0.6 && Math.abs(dy) < 0.6) {
                    node.x = node.baseX;
                    node.y = node.baseY;
                    node.vx = 0;
                    node.vy = 0;
                }
            } else {
                // Organic wandering
                node.vx += dx * 0.0008 * timeScale;
                node.vy += dy * 0.0008 * timeScale;
                
                node.vx += (Math.random() - 0.5) * 0.5 * timeScale;
                node.vy += (Math.random() - 0.5) * 0.5 * timeScale;
                
                node.vx *= Math.pow(0.95, timeScale);
                node.vy *= Math.pow(0.95, timeScale);
                
                // Slowly change target point
                if (Math.random() < 0.015 * timeScale) {
                    node.baseX = Math.random() * this.width;
                    node.baseY = Math.random() * this.height;
                }
            }

            // Speed limit
            const speedSq = node.vx * node.vx + node.vy * node.vy;
            if (speedSq > 9) {
                const speed = Math.sqrt(speedSq);
                node.vx = (node.vx / speed) * 3;
                node.vy = (node.vy / speed) * 3;
            }

            // Apply velocity with timeScale
            node.x += node.vx * timeScale;
            node.y += node.vy * timeScale;

            // Bounce off boundaries
            if (node.x < 0) { node.x = 0; node.vx = Math.abs(node.vx); }
            else if (node.x > this.width) { node.x = this.width; node.vx = -Math.abs(node.vx); }
            if (node.y < 0) { node.y = 0; node.vy = Math.abs(node.vy); }
            else if (node.y > this.height) { node.y = this.height; node.vy = -Math.abs(node.vy); }

            // Mouse interaction (repel)
            if (this.mouse.x !== null) {
                let mdx = this.mouse.x - node.x;
                let mdy = this.mouse.y - node.y;
                let mDistSq = mdx * mdx + mdy * mdy;
                let mRadSq = this.mouse.radius * this.mouse.radius;
                if (mDistSq < mRadSq && mDistSq > 0.01) {
                    let distance = Math.sqrt(mDistSq);
                    let force = (this.mouse.radius - distance) / this.mouse.radius;
                    node.x -= (mdx / distance) * force * 4 * timeScale;
                    node.y -= (mdy / distance) * force * 4 * timeScale;
                }
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        const connDist = this.connectionDistance;
        const connDistSq = connDist * connDist;

        // Group connections into single path batches to maximize Canvas 2D GPU pipeline
        this.ctx.beginPath();
        for (let i = 0; i < this.numNodes; i++) {
            const n1 = this.nodes[i];
            for (let j = i + 1; j < this.numNodes; j++) {
                const n2 = this.nodes[j];
                const dx = n1.x - n2.x;
                if (dx > connDist || dx < -connDist) continue;
                const dy = n1.y - n2.y;
                if (dy > connDist || dy < -connDist) continue;

                if (dx * dx + dy * dy < connDistSq) {
                    this.ctx.moveTo(n1.x, n1.y);
                    this.ctx.lineTo(n2.x, n2.y);
                }
            }
        }
        this.ctx.strokeStyle = 'rgba(37, 99, 235, 0.28)';
        this.ctx.lineWidth = this.isMobile ? 1.0 : 1.4;
        this.ctx.stroke();

        // Draw nodes by color batches (no shadowBlur to ensure 60fps in Chrome)
        // Batch 1: Primary Slate Nodes
        this.ctx.beginPath();
        for (let i = 0; i < this.numNodes; i++) {
            if (i % 5 === 0) {
                const n = this.nodes[i];
                this.ctx.moveTo(n.x + n.radius * 1.5, n.y);
                this.ctx.arc(n.x, n.y, n.radius * 1.5, 0, Math.PI * 2);
            }
        }
        this.ctx.fillStyle = '#0f172a';
        this.ctx.fill();

        // Batch 2: Blue Glow Nodes
        this.ctx.beginPath();
        for (let i = 0; i < this.numNodes; i++) {
            if (i % 5 === 2) {
                const n = this.nodes[i];
                this.ctx.moveTo(n.x + n.radius * 1.6, n.y);
                this.ctx.arc(n.x, n.y, n.radius * 1.6, 0, Math.PI * 2);
            }
        }
        this.ctx.fillStyle = '#1d4ed8';
        this.ctx.fill();

        // Batch 3: Subtle Gray Nodes
        this.ctx.beginPath();
        for (let i = 0; i < this.numNodes; i++) {
            if (i % 5 !== 0 && i % 5 !== 2) {
                const n = this.nodes[i];
                this.ctx.moveTo(n.x + n.radius * 1.2, n.y);
                this.ctx.arc(n.x, n.y, n.radius * 1.2, 0, Math.PI * 2);
            }
        }
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.fill();
    }

    animate(timestamp) {
        if (this.isPaused) return;
        if (!this._lastTimestamp) this._lastTimestamp = timestamp || performance.now();
        const delta = ((timestamp || performance.now()) - this._lastTimestamp) / 16.666; // 1.0 = 60fps
        this._lastTimestamp = timestamp || performance.now();

        // Mobile throttle to ~30fps
        if (this.isMobile) {
            if (!this._lastMobileFrame) this._lastMobileFrame = timestamp || 0;
            if ((timestamp || 0) - this._lastMobileFrame < 32) {
                this.animFrameId = requestAnimationFrame((t) => this.animate(t));
                return;
            }
            this._lastMobileFrame = timestamp || 0;
        }

        this.update(delta);
        this.draw();
        if (!this.isPaused) {
            this.animFrameId = requestAnimationFrame((t) => this.animate(t));
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Inject the canvas element into the background
    const container = document.getElementById('bgParticles');
    if (container) {
        container.innerHTML = '<canvas id="aiBrainCanvas" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;transform:translate3d(0,0,0);"></canvas>';
        container.style.display = 'block'; // Make sure it's visible
        window.brainAnimation = new BrainAnimation('aiBrainCanvas');
    }
});
