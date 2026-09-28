/* ============================================================
   Elliptic Curve Arithmetic — Presentation Logic
   LIGHT THEME CLASSROOM PROJECTOR EDITION
   ============================================================ */

(function () {
    'use strict';

    // ---- State ----
    let currentSlide = 0;
    let slides;
    let totalSlides;
    let isTransitioning = false;
    let animFrameId = null;
    let animTime = 0;

    // Interactive Cursor Particles
    const cursorParticles = [];

    // ---- Elements ----
    let progressFill, slideCounter, prevBtn, nextBtn, dotsContainer, keyboardHint;

    // Background Canvas State
    const slideCanvases = {};

    // ---- Initialize ----
    function init() {
        slides = document.querySelectorAll('.slide');
        totalSlides = slides.length;
        progressFill = document.getElementById('progressFill');
        slideCounter = document.getElementById('slideCounter');
        prevBtn = document.getElementById('prevBtn');
        nextBtn = document.getElementById('nextBtn');
        dotsContainer = document.getElementById('slideDots');
        keyboardHint = document.getElementById('keyboardHint');

        if (!slides.length) return;

        createBackgroundCanvases();
        createDots();
        updateUI();
        
        // Animate elements of current slide
        setTimeout(() => animateSlideElements(0), 150);
        setupEventListeners();

        // Draw interactive visual canvases
        setTimeout(drawAllCanvases, 300);

        // Start global background animation loop
        startAnimationLoop();

        // Hide keyboard hint after 5 seconds
        if (keyboardHint) {
            setTimeout(() => {
                keyboardHint.classList.add('hidden');
            }, 5000);
        }

        // Add mouse tilt effect & ripple effect to glass cards
        setupCardEffects();
        setupCursorTrail();
    }

    // ---- Dynamically create distinct background canvas for EACH slide ----
    function createBackgroundCanvases() {
        slides.forEach((slide, index) => {
            let bgDeco = slide.querySelector('.slide-bg-decoration');
            if (!bgDeco) {
                bgDeco = document.createElement('div');
                bgDeco.className = 'slide-bg-decoration';
                slide.insertBefore(bgDeco, slide.firstChild);
            }

            let canvas = bgDeco.querySelector('.ai-slide-bg-canvas');
            if (!canvas) {
                canvas = document.createElement('canvas');
                canvas.className = 'ai-slide-bg-canvas';
                canvas.style.position = 'absolute';
                canvas.style.top = '0';
                canvas.style.left = '0';
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                canvas.style.zIndex = '0';
                canvas.style.pointerEvents = 'none';
                bgDeco.appendChild(canvas);
            }
            slideCanvases[index] = canvas;
        });
    }

    // ---- Navigation Dots ----
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    // ---- Slide Navigation ----
    function goToSlide(index) {
        if (isTransitioning || index === currentSlide || index < 0 || index >= totalSlides) return;
        isTransitioning = true;

        const direction = index > currentSlide ? 1 : -1;
        const oldSlide = slides[currentSlide];
        const newSlide = slides[index];

        resetSlideAnimations(index);

        oldSlide.classList.remove('slide-active');
        oldSlide.classList.add('slide-exit-left');
        oldSlide.style.transform = direction > 0 ? 'translateX(-30px)' : 'translateX(30px)';
        oldSlide.style.opacity = '0';

        newSlide.style.transform = direction > 0 ? 'translateX(30px)' : 'translateX(-30px)';
        newSlide.style.opacity = '0';
        newSlide.style.visibility = 'visible';
        newSlide.classList.add('slide-active');
        newSlide.classList.remove('slide-exit-left');

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                newSlide.style.transform = 'translateX(0)';
                newSlide.style.opacity = '1';
            });
        });

        currentSlide = index;
        updateUI();
        animateSlideElements(index);

        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise();
        }
        setTimeout(drawAllCanvases, 100);

        setTimeout(() => {
            oldSlide.classList.remove('slide-exit-left');
            oldSlide.style.visibility = 'hidden';
            isTransitioning = false;
        }, 220);
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        if (currentSlide > 0) goToSlide(currentSlide - 1);
    }

    // ---- UI Updates ----
    function updateUI() {
        if (progressFill) {
            progressFill.style.width = ((currentSlide + 1) / totalSlides * 100) + '%';
        }
        if (slideCounter) {
            slideCounter.textContent = (currentSlide + 1) + ' / ' + totalSlides;
        }
        if (dotsContainer) {
            dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }
        if (prevBtn) {
            prevBtn.style.opacity = currentSlide === 0 ? '0.3' : '1';
            prevBtn.style.pointerEvents = currentSlide === 0 ? 'none' : 'auto';
        }
        if (nextBtn) {
            nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.3' : '1';
            nextBtn.style.pointerEvents = currentSlide === totalSlides - 1 ? 'none' : 'auto';
        }
    }

    // ---- Animations ----
    function animateSlideElements(slideIndex) {
        const slide = slides[slideIndex];
        if (!slide) return;
        const elements = slide.querySelectorAll('.animate-in');
        elements.forEach((el) => {
            el.classList.remove('visible');
            const delay = parseInt(el.dataset.delay) || 0;
            setTimeout(() => {
                el.classList.add('visible');
            }, delay + 100);
        });
    }

    function resetSlideAnimations(slideIndex) {
        const slide = slides[slideIndex];
        if (!slide) return;
        const elements = slide.querySelectorAll('.animate-in');
        elements.forEach(el => {
            el.classList.remove('visible');
        });
    }

    // ---- Event Listeners ----
    function setupEventListeners() {
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                nextSlide();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            } else if (e.key === 'Home') {
                e.preventDefault();
                goToSlide(0);
            } else if (e.key === 'End') {
                e.preventDefault();
                goToSlide(totalSlides - 1);
            }
        });

        // Touch swipe
        let touchStartX = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
        }, { passive: true });
        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 60) {
                diff > 0 ? nextSlide() : prevSlide();
            }
        }, { passive: true });
    }

    // ---- Interactive Cursor Particle Trail (Light Mode Saturated Colors) ----
    function setupCursorTrail() {
        window.addEventListener('mousemove', (e) => {
            if (Math.random() < 0.7) {
                cursorParticles.push({
                    x: e.clientX,
                    y: e.clientY,
                    vx: (Math.random() - 0.5) * 2.5,
                    vy: (Math.random() - 0.5) * 2.5 - 0.8,
                    size: Math.random() * 5 + 2.5,
                    alpha: 0.9,
                    color: ['#1d4ed8', '#6d28d9', '#dc2626', '#047857', '#b45309'][Math.floor(Math.random() * 5)]
                });
            }
        });
    }

    // ---- 3D Card Hover Tilt Effect ----
    function setupCardEffects() {
        document.querySelectorAll('.glass-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            });
        });
    }

    // ============================================================
    // DYNAMIC LIGHT-MODE ANIMATED BACKGROUNDS (16 UNIQUE SLIDES)
    // ============================================================

    function startAnimationLoop() {
        function loop() {
            animTime += 0.02;
            renderCurrentSlideBackground(currentSlide, animTime);
            animFrameId = requestAnimationFrame(loop);
        }
        loop();
    }

    function renderCurrentSlideBackground(index, t) {
        const canvas = slideCanvases[index];
        if (!canvas) return;

        const w = canvas.clientWidth || window.innerWidth;
        const h = canvas.clientHeight || window.innerHeight;
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
        }

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, w, h);

        switch (index) {
            case 0: drawTitleNetwork(ctx, w, h, t); break;
            case 1: drawCyberGrid(ctx, w, h, t); break;
            case 2: drawSecurityWaves(ctx, w, h, t); break;
            case 3: drawLatticeGrid(ctx, w, h, t); break;
            case 4: drawWeierstrassCurveBg(ctx, w, h, t); break;
            case 5: drawSecantIntersectBg(ctx, w, h, t); break;
            case 6: drawTangentVectorBg(ctx, w, h, t); break;
            case 7: drawMatrixMathRain(ctx, w, h, t); break;
            case 8: drawDiscreteGridBg(ctx, w, h, t); break;
            case 9: drawReflectionSymmetryBg(ctx, w, h, t); break;
            case 10: drawLatticeGrid(ctx, w, h, t); break;
            case 11: drawTangentVectorBg(ctx, w, h, t); break;
            case 12: drawBinaryBitstreamBg(ctx, w, h, t); break;
            case 13: drawCircuitBoardBg(ctx, w, h, t); break;
            case 14: drawCyberGrid(ctx, w, h, t); break;
            case 15: drawMatrixMathRain(ctx, w, h, t); break;
            case 16: drawSecurityShieldBg(ctx, w, h, t); break;
            case 17: drawKeyExchangeFlowBg(ctx, w, h, t); break;
            case 18: drawWorldCyberMapBg(ctx, w, h, t); break;
            case 19: drawCyberCortexBg(ctx, w, h, t); break;
            default: drawTitleNetwork(ctx, w, h, t); break;
        }

        // Draw cursor trail particles
        for (let i = cursorParticles.length - 1; i >= 0; i--) {
            const p = cursorParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.03;
            if (p.alpha <= 0) {
                cursorParticles.splice(i, 1);
            } else {
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }
    }

    // 1. Slide 1: Light AI Network Node Mesh
    function drawTitleNetwork(ctx, w, h, t) {
        const numNodes = 40;
        const nodes = [];
        for (let i = 0; i < numNodes; i++) {
            const x = (Math.sin(i * 99 + t * 0.4) * 0.5 + 0.5) * w;
            const y = (Math.cos(i * 33 + t * 0.5) * 0.5 + 0.5) * h;
            nodes.push({ x, y });
        }
        ctx.strokeStyle = 'rgba(29, 78, 216, 0.12)';
        ctx.lineWidth = 1.2;
        for (let i = 0; i < numNodes; i++) {
            for (let j = i + 1; j < numNodes; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 180) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }
        nodes.forEach(n => {
            ctx.fillStyle = '#1d4ed8';
            ctx.beginPath(); ctx.arc(n.x, n.y, 3.5, 0, Math.PI * 2); ctx.fill();
        });
    }

    // 2. Slide 2: Light Cyber Grid
    function drawCyberGrid(ctx, w, h, t) {
        const step = 50;
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += step) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 0; y < h; y += step) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
        for (let i = 0; i < 18; i++) {
            const px = ((t * 160 + i * 140) % w);
            const py = (Math.floor(i * 70) % h);
            ctx.fillStyle = '#1d4ed8';
            ctx.fillRect(px, py - 2, 18, 4);
        }
    }

    // 3. Slide 3: Light Waves
    function drawSecurityWaves(ctx, w, h, t) {
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = 'rgba(4, 120, 87, 0.25)';
        ctx.beginPath();
        for (let x = 0; x < w; x += 4) {
            const y = h * 0.5 + Math.sin(x * 0.012 + t * 2.5) * 50 + Math.cos(x * 0.025) * 25;
            if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.strokeStyle = 'rgba(190, 24, 93, 0.25)';
        ctx.beginPath();
        for (let x = 0; x < w; x += 4) {
            const y = h * 0.5 + Math.cos(x * 0.018 - t * 2.0) * 70;
            if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    // 4. Slide 4: Light Hex Lattice
    function drawLatticeGrid(ctx, w, h, t) {
        const r = 45;
        ctx.strokeStyle = 'rgba(109, 40, 217, 0.12)';
        ctx.lineWidth = 1.2;
        for (let y = -r; y < h + r; y += r * 1.5) {
            for (let x = -r; x < w + r; x += r * Math.sqrt(3)) {
                ctx.beginPath();
                for (let k = 0; k < 6; k++) {
                    const angle = k * Math.PI / 3 + t * 0.15;
                    const hx = x + r * Math.cos(angle);
                    const hy = y + r * Math.sin(angle);
                    if (k === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
                }
                ctx.closePath();
                ctx.stroke();
            }
        }
    }

    // 5. Slide 5: Curve Field
    function drawWeierstrassCurveBg(ctx, w, h, t) {
        ctx.strokeStyle = 'rgba(2, 132, 199, 0.25)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        const scale = 50; const cx = w * 0.5; const cy = h * 0.5;
        for (let px = -320; px <= 320; px += 2) {
            const x = px / scale;
            const y2 = x * x * x - 2 * x + 2 + Math.sin(t * 1.5) * 0.6;
            if (y2 >= 0) {
                const y = Math.sqrt(y2);
                ctx.lineTo(cx + px, cy - y * scale);
            }
        }
        ctx.stroke();
    }

    // 6. Slide 6: Secant Ray
    function drawSecantIntersectBg(ctx, w, h, t) {
        ctx.strokeStyle = 'rgba(180, 83, 9, 0.25)';
        ctx.lineWidth = 2;
        const slope = Math.sin(t * 1.2) * 0.45;
        ctx.beginPath();
        ctx.moveTo(0, h * 0.5 - w * 0.5 * slope);
        ctx.lineTo(w, h * 0.5 + w * 0.5 * slope);
        ctx.stroke();
    }

    // 7. Slide 7: Tangent Field
    function drawTangentVectorBg(ctx, w, h, t) {
        ctx.fillStyle = 'rgba(4, 120, 87, 0.25)';
        for (let x = 70; x < w; x += 100) {
            for (let y = 70; y < h; y += 100) {
                const angle = Math.atan2(y - h / 2, x - w / 2) + t * 0.6;
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle);
                ctx.fillRect(-12, -1.5, 24, 3);
                ctx.restore();
            }
        }
    }

    // 8. Slide 8: Reflection Field
    function drawReflectionSymmetryBg(ctx, w, h, t) {
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.15)';
        ctx.setLineDash([10, 10]);
        ctx.beginPath(); ctx.moveTo(0, h * 0.5); ctx.lineTo(w, h * 0.5); ctx.stroke();
        ctx.setLineDash([]);

        for (let i = 0; i < 20; i++) {
            const x = (i * 85 + t * 50) % w;
            const dy = Math.sin(i + t * 2.5) * 90 + 35;
            ctx.fillStyle = '#be185d';
            ctx.beginPath(); ctx.arc(x, h * 0.5 - dy, 4.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#1d4ed8';
            ctx.beginPath(); ctx.arc(x, h * 0.5 + dy, 4.5, 0, Math.PI * 2); ctx.fill();
        }
    }

    // 9. Slide 9: Math Symbol Rain
    function drawMatrixMathRain(ctx, w, h, t) {
        const chars = ['λ', 'x_R', 'y_R', 'mod', 'O', 'Z_p', '≡', '⊕', 'y²', 'x³', 'P+Q', '2P'];
        ctx.font = '15px JetBrains Mono, monospace';
        ctx.fillStyle = 'rgba(29, 78, 216, 0.2)';
        for (let i = 0; i < 28; i++) {
            const x = (i * 55) % w;
            const y = ((t * 110 + i * 110) % h);
            ctx.fillText(chars[i % chars.length], x, y);
        }
    }

    // 10. Slide 10: Point Grid
    function drawDiscreteGridBg(ctx, w, h, t) {
        const cols = 23; const rows = 23;
        const gx = w * 0.5 - 190; const gy = h * 0.5 - 190;
        ctx.fillStyle = 'rgba(180, 83, 9, 0.3)';
        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                if ((c * c * c + c + 1 - r * r) % 5 === 0) {
                    ctx.beginPath();
                    ctx.arc(gx + c * 17, gy + r * 17, 3 + Math.sin(t * 2 + c) * 1.2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }

    // 11. Slide 11: Circuit Traces
    function drawCircuitBoardBg(ctx, w, h, t) {
        ctx.strokeStyle = 'rgba(4, 120, 87, 0.18)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 10; i++) {
            const y = 80 + i * 60;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w * 0.4, y);
            ctx.lineTo(w * 0.5, y + 30);
            ctx.lineTo(w, y + 30);
            ctx.stroke();
        }
    }

    // 12. Slide 12: Binary Highway
    function drawBinaryBitstreamBg(ctx, w, h, t) {
        const bits = '10101011001011011101001';
        ctx.font = '16px JetBrains Mono, monospace';
        ctx.fillStyle = 'rgba(180, 83, 9, 0.25)';
        for (let i = 0; i < bits.length; i++) {
            const x = (i * 65 + t * 70) % w;
            const y = 100 + (i % 6) * 90;
            ctx.fillText(bits[i], x, y);
        }
    }

    // 13. Slide 13: Shield Rings
    function drawSecurityShieldBg(ctx, w, h, t) {
        ctx.strokeStyle = 'rgba(220, 38, 38, 0.18)';
        ctx.lineWidth = 2.5;
        const cx = w * 0.5; const cy = h * 0.5;
        for (let r = 90; r <= 280; r += 45) {
            ctx.beginPath();
            ctx.arc(cx, cy, r, t * 0.3, t * 0.3 + Math.PI * 1.4);
            ctx.stroke();
        }
    }

    // 14. Slide 14: Encrypted Key Flow
    function drawKeyExchangeFlowBg(ctx, w, h, t) {
        const cy = h * 0.5;
        ctx.strokeStyle = 'rgba(190, 24, 93, 0.25)';
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(80, cy); ctx.lineTo(w - 80, cy); ctx.stroke();

        const kx = 80 + ((t * 220) % (w - 160));
        ctx.fillStyle = '#be185d';
        ctx.beginPath(); ctx.arc(kx, cy, 7, 0, Math.PI * 2); ctx.fill();
    }

    // 15. Slide 15: Cyber Globe
    function drawWorldCyberMapBg(ctx, w, h, t) {
        const cx = w * 0.5; const cy = h * 0.5;
        ctx.strokeStyle = 'rgba(29, 78, 216, 0.15)';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(cx, cy, 230, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(cx, cy, 230, 80, t * 0.4, 0, Math.PI * 2); ctx.stroke();
    }

    // 16. Slide 16: Cortex Glow
    function drawCyberCortexBg(ctx, w, h, t) {
        const cx = w * 0.5; const cy = h * 0.5;
        const pulse = Math.sin(t * 3) * 20;
        ctx.fillStyle = 'rgba(29, 78, 216, 0.05)';
        ctx.beginPath(); ctx.arc(cx, cy, 200 + pulse, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(180, 83, 9, 0.25)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(cx, cy, 140 + pulse, 0, Math.PI * 2); ctx.stroke();
    }

    // ============================================================
    // INTERACTIVE CANVAS DIAGRAMS ON SLIDES (LIGHT THEME OPTIMIZED)
    // ============================================================

    function drawAllCanvases() {
        try { drawAdditionDiagram(); } catch(e) {}
        try { drawDoublingDiagram(); } catch(e) {}
    }

    function drawAdditionDiagram() {
        const canvas = document.getElementById('additionCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width; const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // Light Grid
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)'; ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
        for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }

        const scale = 50; const cx = w * 0.4; const cy = h * 0.5;

        // Bold Royal Blue Curve
        ctx.strokeStyle = '#1d4ed8'; ctx.lineWidth = 3.5;
        ctx.beginPath();
        let started = false;
        for (let px = -120; px <= 200; px++) {
            const x = px / scale;
            const y2 = x * x * x - 3 * x + 3;
            if (y2 >= 0) {
                const y = Math.sqrt(y2);
                const sx = cx + px; const sy = cy - y * scale;
                if (!started) { ctx.moveTo(sx, sy); started = true; } else ctx.lineTo(sx, sy);
            }
        }
        ctx.stroke();

        ctx.beginPath();
        started = false;
        for (let px = -120; px <= 200; px++) {
            const x = px / scale;
            const y2 = x * x * x - 3 * x + 3;
            if (y2 >= 0) {
                const y = Math.sqrt(y2);
                const sx = cx + px; const sy = cy + y * scale;
                if (!started) { ctx.moveTo(sx, sy); started = true; } else ctx.lineTo(sx, sy);
            }
        }
        ctx.stroke();

        const P = { x: -0.5, y: 2.09 };
        const Q = { x: 2.0, y: 2.23 };
        const lambda = (Q.y - P.y) / (Q.x - P.x);
        const xR = lambda * lambda - P.x - Q.x;
        const yR = lambda * (P.x - xR) - P.y;

        const sP = { x: cx + P.x * scale, y: cy - P.y * scale };
        const sQ = { x: cx + Q.x * scale, y: cy - Q.y * scale };
        const sR = { x: cx + xR * scale, y: cy - yR * scale };
        const sNegR = { x: cx + xR * scale, y: cy + yR * scale };

        // Secant Line (Crimson Pink)
        ctx.strokeStyle = '#be185d'; ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(sP.x - 60, sP.y - 60 * lambda);
        ctx.lineTo(sR.x + 40, sR.y + 40 * lambda);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(15,23,42,0.4)';
        ctx.beginPath(); ctx.moveTo(sR.x, sR.y); ctx.lineTo(sNegR.x, sNegR.y); ctx.stroke();
        ctx.setLineDash([]);

        drawPoint(ctx, sP.x, sP.y, '#1d4ed8', 'P');
        drawPoint(ctx, sQ.x, sQ.y, '#1d4ed8', 'Q');
        drawPoint(ctx, sR.x, sR.y, '#dc2626', 'R');
        drawPoint(ctx, sNegR.x, sNegR.y, '#047857', 'P + Q = -R');
    }

    function drawDoublingDiagram() {
        const canvas = document.getElementById('doublingCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width; const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)'; ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
        for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }

        const scale = 50; const cx = w * 0.4; const cy = h * 0.5;

        ctx.strokeStyle = '#1d4ed8'; ctx.lineWidth = 3.5;
        ctx.beginPath();
        let started = false;
        for (let px = -120; px <= 200; px++) {
            const x = px / scale;
            const y2 = x * x * x - 3 * x + 3;
            if (y2 >= 0) {
                const y = Math.sqrt(y2);
                const sx = cx + px; const sy = cy - y * scale;
                if (!started) { ctx.moveTo(sx, sy); started = true; } else ctx.lineTo(sx, sy);
            }
        }
        ctx.stroke();

        ctx.beginPath();
        started = false;
        for (let px = -120; px <= 200; px++) {
            const x = px / scale;
            const y2 = x * x * x - 3 * x + 3;
            if (y2 >= 0) {
                const y = Math.sqrt(y2);
                const sx = cx + px; const sy = cy + y * scale;
                if (!started) { ctx.moveTo(sx, sy); started = true; } else ctx.lineTo(sx, sy);
            }
        }
        ctx.stroke();

        const P = { x: 1.2, y: 1.39 };
        const lambda = (3 * P.x * P.x - 3) / (2 * P.y);
        const xR = lambda * lambda - 2 * P.x;
        const yR = lambda * (P.x - xR) - P.y;

        const sP = { x: cx + P.x * scale, y: cy - P.y * scale };
        const sR = { x: cx + xR * scale, y: cy - yR * scale };
        const sNegR = { x: cx + xR * scale, y: cy + yR * scale };

        ctx.strokeStyle = '#b45309'; ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(sP.x - 80, sP.y + 80 * lambda);
        ctx.lineTo(sR.x + 50, sR.y - 50 * lambda);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(15,23,42,0.4)';
        ctx.beginPath(); ctx.moveTo(sR.x, sR.y); ctx.lineTo(sNegR.x, sNegR.y); ctx.stroke();
        ctx.setLineDash([]);

        drawPoint(ctx, sP.x, sP.y, '#b45309', 'P');
        drawPoint(ctx, sR.x, sR.y, '#dc2626', 'R');
        drawPoint(ctx, sNegR.x, sNegR.y, '#047857', '2P = -R');
    }

    function drawPoint(ctx, sx, sy, color, label) {
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(sx, sy, 7, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = '#0f172a';
        ctx.font = '800 14px Outfit, sans-serif';
        ctx.fillText(label, sx + 10, sy - 8);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
