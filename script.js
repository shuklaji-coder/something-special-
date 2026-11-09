/**
 * ==========================================================================
 *  LOVE STORY FOR AKANSHA MISHRA - COMPLETE INTERACTIVE JAVASCRIPT ENGINE
 *  Awwwards-Level Polish | Apple-meets-Bollywood Romance
 * ==========================================================================
 */

(function () {
  'use strict';

  const CFG = window.STORY_CONFIG || {};

  // Audio References
  const bgAudioTag = document.getElementById('bg-audio-tag');
  const bgAudio = bgAudioTag || new Audio(CFG.audio?.src || 'assets/bg_music.mp3');
  bgAudio.loop = true;
  bgAudio.preload = 'auto';
  let isMusicPlaying = false;
  let audioContext = null;

  // DOM Elements
  const loaderScreen = document.getElementById('loader-screen');
  const loaderPercent = document.getElementById('loader-percent');
  const atmosphereCanvas = document.getElementById('atmosphere-canvas');
  const openStoryBtn = document.getElementById('open-story-btn');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const headerMusicToggle = document.getElementById('header-music-toggle');
  const bottomMusicToggle = document.getElementById('bottom-music-toggle');
  const brandLogoBtn = document.getElementById('brand-logo-btn');
  const customCursor = document.getElementById('custom-cursor');

  // Proposal Elements
  const btnProposalYes = document.getElementById('btn-proposal-yes');
  const btnProposalNo = document.getElementById('btn-proposal-no');
  const proposalVignette = document.getElementById('proposal-vignette');
  const flashOverlay = document.getElementById('flash-overlay');
  const celebrationModal = document.getElementById('celebration-modal');
  const easterEggModal = document.getElementById('easter-egg-modal');

  // Chat Elements
  const chatStream = document.getElementById('chat-stream');
  const chatTypingIndicator = document.getElementById('chat-typing-indicator');
  const chatReplayBtn = document.getElementById('chat-replay-btn');

  // Envelope & Letter Elements
  const waxEnvelope = document.getElementById('wax-envelope');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const unfoldedParchment = document.getElementById('unfolded-parchment');
  const typewriterText = document.getElementById('typewriter-text');


  /* ==========================================================================
     0. LOADER SYSTEM
     ========================================================================== */
  let loadProgress = 0;
  const loadInterval = setInterval(() => {
    loadProgress += Math.floor(Math.random() * 8) + 4;
    if (loadProgress >= 100) {
      loadProgress = 100;
      clearInterval(loadInterval);
      if (loaderPercent) loaderPercent.textContent = '100%';
      setTimeout(() => {
        if (loaderScreen) loaderScreen.classList.add('loaded');
        revealIntroLines();
        if (!isMusicPlaying) playMusic();
      }, 600);
    } else {
      if (loaderPercent) loaderPercent.textContent = loadProgress + '%';
    }
  }, 60);

  function revealIntroLines() {
    const lines = document.querySelectorAll('.poetic-line');
    lines.forEach((line, idx) => {
      setTimeout(() => {
        line.classList.add('visible');
      }, (idx + 1) * 750);
    });
  }

  // Tapping anywhere on loader starts audio immediately
  if (loaderScreen) {
    function unlockFromLoader() {
      playMusic();
      loaderScreen.classList.add('loaded');
      revealIntroLines();
    }
    loaderScreen.addEventListener('click', unlockFromLoader);
    loaderScreen.addEventListener('touchstart', unlockFromLoader, { passive: true });
  }

  /* ==========================================================================
     1. BACKGROUND CANVAS: STARS, FIREFLIES & FALLING ROSE PETALS
     ========================================================================== */
  if (atmosphereCanvas) {
    const ctx = atmosphereCanvas.getContext('2d');
    let width = (atmosphereCanvas.width = window.innerWidth);
    let height = (atmosphereCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = atmosphereCanvas.width = window.innerWidth;
      height = atmosphereCanvas.height = window.innerHeight;
      initStars();
    });

    // 1. Stars
    const stars = [];
    const starCount = Math.min(130, Math.floor((width * height) / 9000));

    function initStars() {
      stars.length = 0;
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5 + 0.3,
          alpha: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.02 + 0.005,
          growing: Math.random() > 0.5
        });
      }
    }
    initStars();

    // 2. Fireflies (Warm golden drifting orbs)
    const fireflies = [];
    const fireflyCount = 28;
    for (let i = 0; i < fireflyCount; i++) {
      fireflies.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.8 + 1.2,
        baseAlpha: Math.random() * 0.5 + 0.3,
        alpha: 0.5,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.7 + 0.3,
        glowColor: Math.random() > 0.5 ? 'rgba(245, 208, 97,' : 'rgba(255, 120, 170,'
      });
    }

    // 3. Falling Rose Petals
    const petals = [];
    const petalCount = 22;
    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: Math.random() * 12 + 10,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
        fallSpeed: Math.random() * 1.2 + 0.8,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayRange: Math.random() * 2.5 + 1.5,
        swayOffset: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.45 + 0.45
      });
    }

    function drawPetal(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.scale(1, 0.65); // Flattens into realistic petal shape

      const gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, p.size);
      gradient.addColorStop(0, `rgba(255, 120, 160, ${p.opacity})`);
      gradient.addColorStop(0.6, `rgba(230, 25, 94, ${p.opacity})`);
      gradient.addColorStop(1, `rgba(140, 14, 55, ${p.opacity * 0.8})`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.8, p.size * 0.8, p.size * 0.6, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.6, -p.size * 0.8, -p.size * 0.8, 0, -p.size);
      ctx.fill();
      ctx.restore();
    }

    function renderAtmosphere() {
      ctx.clearRect(0, 0, width, height);

      // Render Stars
      for (let s of stars) {
        if (s.growing) {
          s.alpha += s.speed;
          if (s.alpha >= 0.95) s.growing = false;
        } else {
          s.alpha -= s.speed;
          if (s.alpha <= 0.15) s.growing = true;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render Fireflies
      for (let f of fireflies) {
        f.angle += (Math.random() - 0.5) * 0.1;
        f.x += Math.cos(f.angle) * f.speed;
        f.y += Math.sin(f.angle) * f.speed;

        if (f.x < -20) f.x = width + 20;
        if (f.x > width + 20) f.x = -20;
        if (f.y < -20) f.y = height + 20;
        if (f.y > height + 20) f.y = -20;

        f.alpha = f.baseAlpha + Math.sin(Date.now() * 0.003 + f.angle) * 0.25;

        // Glow
        const radGlow = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius * 4);
        radGlow.addColorStop(0, `${f.glowColor} ${f.alpha})`);
        radGlow.addColorStop(1, `${f.glowColor} 0)`);
        ctx.fillStyle = radGlow;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render Petals
      for (let p of petals) {
        p.swayOffset += p.swaySpeed;
        p.x += Math.sin(p.swayOffset) * p.swayRange;
        p.y += p.fallSpeed;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 40) {
          p.y = -30;
          p.x = Math.random() * width;
        }
        drawPetal(p);
      }

      requestAnimationFrame(renderAtmosphere);
    }
    renderAtmosphere();
  }

  /* ==========================================================================
     2. CUSTOM CURSOR & STARDUST TRAIL (Desktop)
     ========================================================================== */
  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Sparkle trail
    if (Math.random() > 0.45) {
      spawnSparkle(mouseX, mouseY);
    }
  });

  function spawnSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'cursor-sparkle';
    const isGold = Math.random() > 0.5;
    sparkle.style.background = isGold
      ? 'radial-gradient(circle, #fff3c4, #f5d061)'
      : 'radial-gradient(circle, #ffd1dc, #ff4d8d)';
    const size = Math.random() * 6 + 4;
    sparkle.style.width = size + 'px';
    sparkle.style.height = size + 'px';
    sparkle.style.boxShadow = isGold
      ? '0 0 10px rgba(245, 208, 97, 0.8)'
      : '0 0 10px rgba(255, 77, 141, 0.8)';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    document.body.appendChild(sparkle);

    setTimeout(() => {
      sparkle.remove();
    }, 700);
  }

  function updateCursor() {
    cursorX += (mouseX - cursorX) * 0.25;
    cursorY += (mouseY - cursorY) * 0.25;
    if (customCursor) {
      customCursor.style.left = cursorX + 'px';
      customCursor.style.top = cursorY + 'px';
    }
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  /* ==========================================================================
     3. AUDIO SYSTEM: BACKGROUND MUSIC & HEARTBEAT SYNTHESIZER
     ========================================================================== */
  function playMusic() {
    initAudioContext();
    bgAudio.muted = false;
    bgAudio.volume = 0.85;
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isMusicPlaying = true;
          updateMusicUI();
        })
        .catch(() => {
          // Browser autoplay restriction: start muted first so it rolls, then unmute on first gesture!
          bgAudio.muted = true;
          bgAudio.play().then(() => {
            setupUnmuteTrigger();
          }).catch(() => {
            setupGlobalAudioTriggers();
          });
        });
    }
  }

  function setupUnmuteTrigger() {
    const unmute = () => {
      bgAudio.muted = false;
      bgAudio.volume = 0.85;
      isMusicPlaying = true;
      updateMusicUI();
      ['pointerdown', 'touchstart', 'touchend', 'mousedown', 'mousemove', 'scroll', 'wheel', 'keydown', 'click'].forEach((evt) => {
        window.removeEventListener(evt, unmute, { capture: true });
        document.removeEventListener(evt, unmute, { capture: true });
      });
    };

    ['pointerdown', 'touchstart', 'touchend', 'mousedown', 'mousemove', 'scroll', 'wheel', 'keydown', 'click'].forEach((evt) => {
      window.addEventListener(evt, unmute, { capture: true, once: true });
      document.addEventListener(evt, unmute, { capture: true, once: true });
    });
  }

  function setupGlobalAudioTriggers() {
    const gestureEvents = [
      'pointerdown', 'touchstart', 'touchend', 'mousedown', 'mousemove',
      'scroll', 'wheel', 'keydown', 'click', 'mouseover'
    ];

    function triggerStart() {
      initAudioContext();
      bgAudio.muted = false;
      bgAudio.volume = 0.85;
      bgAudio
        .play()
        .then(() => {
          isMusicPlaying = true;
          updateMusicUI();
          cleanupTriggers();
        })
        .catch(() => {});
    }

    function cleanupTriggers() {
      gestureEvents.forEach((evt) => {
        window.removeEventListener(evt, triggerStart, { capture: true });
        document.removeEventListener(evt, triggerStart, { capture: true });
      });
    }

    gestureEvents.forEach((evt) => {
      window.addEventListener(evt, triggerStart, { capture: true, passive: true });
      document.addEventListener(evt, triggerStart, { capture: true, passive: true });
    });
  }

  function pauseMusic() {
    bgAudio.pause();
    isMusicPlaying = false;
    updateMusicUI();
  }

  function toggleMusic() {
    if (isMusicPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }

  function updateMusicUI() {
    document.body.classList.toggle('music-playing', isMusicPlaying);
    if (headerMusicToggle) {
      headerMusicToggle.setAttribute('title', isMusicPlaying ? 'Click to Mute' : 'Click to Unmute');
    }
    if (bottomMusicToggle) {
      bottomMusicToggle.setAttribute('title', isMusicPlaying ? 'Click to Mute' : 'Click to Unmute');
    }
  }

  if (headerMusicToggle) headerMusicToggle.addEventListener('click', toggleMusic);
  if (bottomMusicToggle) bottomMusicToggle.addEventListener('click', toggleMusic);

  // Directly start audio right away!
  playMusic();
  setupGlobalAudioTriggers();

  // Web Audio API Synthesized Realistic Heartbeat (No missing file!)
  let heartbeatInterval = null;

  function initAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioContext = new AudioCtx();
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }

  function playHeartbeatThump(pitch = 55, intensity = 1.0) {
    if (!audioContext) return;
    try {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.value = 120;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(32, audioContext.currentTime + 0.14);

      gain.gain.setValueAtTime(0.4 * intensity, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.16);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioContext.destination);

      osc.start();
      osc.stop(audioContext.currentTime + 0.18);
    } catch (e) {
      // Audio context fallbacks
    }
  }

  function startHeartbeatLoop() {
    initAudioContext();
    if (heartbeatInterval) clearInterval(heartbeatInterval);

    // "Thump-thump ... Thump-thump" realistic rhythm
    function doubleThump() {
      playHeartbeatThump(60, 0.9);
      setTimeout(() => {
        playHeartbeatThump(48, 0.6);
      }, 180);
    }

    doubleThump();
    heartbeatInterval = setInterval(doubleThump, 1300);
    if (proposalVignette) proposalVignette.classList.add('beating');
  }

  function stopHeartbeatLoop() {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
    if (proposalVignette) proposalVignette.classList.remove('beating');
  }

  /* ==========================================================================
     4. OPEN STORY TRIGGER (User Interaction Starts Sound + Scrolls)
     ========================================================================== */
  if (openStoryBtn) {
    openStoryBtn.addEventListener('click', () => {
      initAudioContext();
      playMusic();
      const ch1 = document.getElementById('chapter-1');
      if (ch1) {
        ch1.scrollIntoView({ behavior: 'smooth' });
      }
      setTimeout(startChatSimulation, 1200);
    });
  }

  /* ==========================================================================
     5. CHAPTER 1: REALISTIC CHAT REPLAY SIMULATION
     ========================================================================== */
  const messages = CFG.chatMessages || [
    { sender: "him", text: "Hey Akansha... did you just listen to that song? 🎧", time: "11:42 PM" },
    { sender: "her", text: "Haha yes! Kaise pata? Wait, do you always stay up this late? 👀", time: "11:44 PM" },
    { sender: "him", text: "Sirf tab... jab notification tumhare naam ka ho 😄", time: "11:45 PM" },
    { sender: "her", text: "Achaa ji? Itna special treatment? 🙈", time: "11:46 PM" },
    { sender: "him", text: "Sach me. Tumse baat karke pata hi nahi chala kab raat se subah ho gayi...", time: "01:20 AM" },
    { sender: "her", text: "Same here. Tumhari baatein sunna ajeeb sa sukoon deta hai ❤️", time: "03:45 AM" },
    { sender: "him", text: "Aur tabhi mujhe laga tha... 'Yeh ladki bohot special hai.'", time: "03:47 AM" }
  ];

  let chatRunning = false;

  function startChatSimulation() {
    if (!chatStream || chatRunning) return;
    chatRunning = true;
    chatStream.innerHTML = '';
    if (chatTypingIndicator) chatTypingIndicator.classList.remove('active');

    let currentMsgIdx = 0;

    function renderNextMessage() {
      if (currentMsgIdx >= messages.length) {
        chatRunning = false;
        if (chatTypingIndicator) chatTypingIndicator.classList.remove('active');
        return;
      }

      const msg = messages[currentMsgIdx];
      const isHer = msg.sender === 'her';

      if (isHer && chatTypingIndicator) {
        chatTypingIndicator.classList.add('active');
        chatStream.scrollTop = chatStream.scrollHeight;
      }

      const delay = isHer ? 1400 : 900;

      setTimeout(() => {
        if (chatTypingIndicator) chatTypingIndicator.classList.remove('active');

        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${msg.sender}`;
        bubble.innerHTML = `
          <div class="chat-text">${msg.text}</div>
          <span class="chat-time">${msg.time}</span>
        `;
        chatStream.appendChild(bubble);

        // Trigger smooth reveal animation
        requestAnimationFrame(() => {
          bubble.classList.add('visible');
          chatStream.scrollTop = chatStream.scrollHeight;
        });

        currentMsgIdx++;
        setTimeout(renderNextMessage, 850);
      }, delay);
    }

    renderNextMessage();
  }

  if (chatReplayBtn) {
    chatReplayBtn.addEventListener('click', () => {
      chatRunning = false;
      startChatSimulation();
    });
  }

  // Trigger chat replay when chapter 1 scrolls into view
  const chapter1Elem = document.getElementById('chapter-1');
  if (chapter1Elem && 'IntersectionObserver' in window) {
    const chatObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !chatRunning && (!chatStream || chatStream.children.length === 0)) {
            startChatSimulation();
          }
        });
      },
      { threshold: 0.3 }
    );
    chatObserver.observe(chapter1Elem);
  }

  /* ==========================================================================
     6. CHAPTER 2: 3D TILT EFFECT & VOICE NOTE MOCKUP
     ========================================================================== */
  const traitCards = document.querySelectorAll('.trait-card');
  traitCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      const glare = card.querySelector('.card-glare');
      if (glare) {
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.22), transparent 70%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // Mobile Device Orientation Gyroscope Tilt
  if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
    window.addEventListener('deviceorientation', (e) => {
      if (e.beta && e.gamma) {
        const tiltY = Math.min(Math.max(e.gamma / 3, -10), 10);
        const tiltX = Math.min(Math.max((e.beta - 45) / 4, -10), 10);
        traitCards.forEach((card) => {
          card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });
      }
    });
  }

  /* ==========================================================================
     INTERACTIVE SCRATCH CARD ENGINE (Chapter 2)
     ========================================================================== */
  function initScratchCard() {
    const canvas = document.getElementById('scratch-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    let isDrawing = false;
    let isRevealed = false;

    function resize() {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      canvas.width = rect.width;
      canvas.height = rect.height;
      drawCover();
    }

    function drawCover() {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#d4af37');
      grad.addColorStop(0.3, '#fbe396');
      grad.addColorStop(0.6, '#ff80ab');
      grad.addColorStop(1, '#c28833');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      for (let i = 0; i < 35; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 3 + 1, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#260e22';
      ctx.font = 'bold 15px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✨ 🪙 Scratch Karo Akansha! 🪙 ✨', canvas.width / 2, canvas.height / 2 - 8);

      ctx.font = '12px Poppins, sans-serif';
      ctx.fillStyle = '#42163b';
      ctx.fillText('(Rub with your finger or mouse)', canvas.width / 2, canvas.height / 2 + 16);
    }

    function scratch(e) {
      if (!isDrawing || isRevealed) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 26, 0, Math.PI * 2);
      ctx.fill();

      if ('vibrate' in navigator && Math.random() > 0.7) {
        try { navigator.vibrate(10); } catch (err) {}
      }

      checkPercent();
    }

    let checkThrottle = 0;
    function checkPercent() {
      if (isRevealed) return;
      checkThrottle++;
      if (checkThrottle % 15 !== 0) return;

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let clearPixels = 0;
      const total = pixels.length / 4;

      for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] === 0) clearPixels += 4;
      }

      if (clearPixels / total > 0.35) {
        isRevealed = true;
        canvas.style.opacity = '0';
        canvas.style.pointerEvents = 'none';
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 40,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff4d8d', '#f5d061', '#ffffff']
          });
        }
      }
    }

    canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e); });
    canvas.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', () => { isDrawing = false; });

    canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); }, { passive: false });
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); scratch(e); }, { passive: false });
    canvas.addEventListener('touchend', () => { isDrawing = false; });

    window.addEventListener('resize', resize);
    setTimeout(resize, 350);
  }

  initScratchCard();

  /* ==========================================================================
     7. CHAPTER 3: CINEMATIC DUAL VIDEO CONTROLS
     ========================================================================== */
  function setupVideoPlayer(videoId, btnId) {
    const videoElem = document.getElementById(videoId);
    const btnElem = document.getElementById(btnId);
    if (!videoElem) return;

    if (btnElem) {
      btnElem.addEventListener('click', (e) => {
        e.stopPropagation();
        videoElem.muted = !videoElem.muted;
        if (videoElem.muted) {
          btnElem.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            <span>Tap to Unmute</span>
          `;
        } else {
          btnElem.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            <span>Mute Video</span>
          `;
          if (bgAudio) bgAudio.volume = 0.2;
        }
      });
    }

    videoElem.addEventListener('click', () => {
      if (videoElem.paused) {
        videoElem.play();
      } else {
        videoElem.pause();
      }
    });
  }

  setupVideoPlayer('story-video-1', 'video-unmute-btn-1');
  setupVideoPlayer('story-video-2', 'video-unmute-btn-2');

  /* ==========================================================================
     8. CHAPTER 6: SEALED ENVELOPE & TYPEWRITER LOVE LETTER
     ========================================================================== */
  let letterOpened = false;

  function openLoveLetter() {
    if (letterOpened) return;
    letterOpened = true;

    if (waxEnvelope) waxEnvelope.classList.add('envelope-opened');
    if (unfoldedParchment) unfoldedParchment.classList.add('active');

    // Typewriter effect
    const letterParagraphs = CFG.letter || [
      "Meri sabse pyaari Akansha,",
      "Sach kahun toh mujhe nahi pata tha ki screen ke uss paar se koi insaan mere dil ke itna kareeb aa sakta hai.",
      "Hum kabhi mile nahi... par har video call ke baad, mera dil sirf tumhari taraf hi kheencha chala gaya.",
      "Log kehte hain distance mushkil hota hai, par jab insaan sahi ho toh har doori choti lagti hai.",
      "Mujhe nahi pata kal kya hoga... par aaj, mujhe sirf aur sirf tum chahiye.",
      "Always yours, with all my heart ❤️"
    ];

    const fullText = letterParagraphs.join('\n\n');
    let charIdx = 0;
    if (typewriterText) {
      typewriterText.textContent = '';
      const cursorSpan = document.createElement('span');
      cursorSpan.className = 'typewriter-cursor';
      typewriterText.appendChild(cursorSpan);

      const typeInterval = setInterval(() => {
        if (charIdx < fullText.length) {
          const char = fullText[charIdx];
          const textNode = document.createTextNode(char);
          typewriterText.insertBefore(textNode, cursorSpan);
          charIdx++;
        } else {
          clearInterval(typeInterval);
          cursorSpan.remove();
        }
      }, 34);
    }
  }

  if (waxSealBtn) waxSealBtn.addEventListener('click', openLoveLetter);
  if (waxEnvelope) waxEnvelope.addEventListener('click', openLoveLetter);

  /* ==========================================================================
     9. CHAPTER 7: PROPOSAL CLIMAX & RUNAWAY NO BUTTON
     ========================================================================== */
  // Monitor when proposal section enters view to start heartbeat
  const proposalSection = document.getElementById('proposal-section');
  if (proposalSection && 'IntersectionObserver' in window) {
    const proposalObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startHeartbeatLoop();
          } else {
            stopHeartbeatLoop();
          }
        });
      },
      { threshold: 0.4 }
    );
    proposalObserver.observe(proposalSection);
  }

  // RUNAWAY NO BUTTON LOGIC
  const noResponses = CFG.proposal?.noResponses || [
    "No 🙈",
    "Are you sure? 🥺",
    "Ek baar aur soch lo...",
    "Pakka? Dil toot jayega mera 💔",
    "Aise mat karo na please...",
    "Main sach me ro dunga 😭",
    "Galat button dab gaya shayad?",
    "Ab toh YES hi dabana padega! 😏"
  ];

  let noAttemptCount = 0;
  let yesScale = 1.0;

  function evadeNoButton(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    noAttemptCount++;

    // Mobile Haptic Feedback
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([35, 50, 35]);
      } catch (err) {}
    }

    // Teleport NO button to random safe coordinates
    const box = document.querySelector('.proposal-box');
    if (box && btnProposalNo) {
      const boxRect = box.getBoundingClientRect();
      const btnRect = btnProposalNo.getBoundingClientRect();

      const maxX = boxRect.width - btnRect.width - 40;
      const maxY = 90;

      const randomX = (Math.random() - 0.5) * maxX;
      const randomY = (Math.random() - 0.5) * maxY;

      const shrinkFactor = Math.max(0.65, 1 - noAttemptCount * 0.05);

      btnProposalNo.style.position = 'relative';
      btnProposalNo.style.transform = `translate(${randomX}px, ${randomY}px) scale(${shrinkFactor})`;

      // Change text sequentially
      const nextTextIndex = Math.min(noAttemptCount, noResponses.length - 1);
      btnProposalNo.textContent = noResponses[nextTextIndex];

      // Grow YES button
      yesScale += 0.08;
      if (btnProposalYes) {
        btnProposalYes.style.transform = `scale(${yesScale})`;
        btnProposalYes.style.boxShadow = `0 15px ${35 + noAttemptCount * 5}px rgba(255, 77, 141, ${0.6 + noAttemptCount * 0.04})`;
      }

      // After 8 attempts, NO button vanishes completely!
      if (noAttemptCount >= 8) {
        btnProposalNo.classList.add('vanished');
        setTimeout(() => {
          btnProposalNo.style.display = 'none';
        }, 300);
      }
    }
  }

  if (btnProposalNo) {
    btnProposalNo.addEventListener('mouseenter', evadeNoButton);
    btnProposalNo.addEventListener('touchstart', evadeNoButton, { passive: false });
    btnProposalNo.addEventListener('click', evadeNoButton);
  }

  /* ==========================================================================
     10. CINEMATIC FIREWORKS & CELEBRATION ENGINE
     ========================================================================== */
  const fwCanvas = document.getElementById('fireworks-canvas');
  let fwCtx = fwCanvas ? fwCanvas.getContext('2d') : null;
  let fwWidth = 0, fwHeight = 0;
  const rockets = [];
  const fwParticles = [];
  let fwRunning = false;
  let fwAutoLaunchTimer = null;

  function initFireworksCanvas() {
    if (!fwCanvas) return;
    fwWidth = fwCanvas.width = window.innerWidth;
    fwHeight = fwCanvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      if (!fwCanvas) return;
      fwWidth = fwCanvas.width = window.innerWidth;
      fwHeight = fwCanvas.height = window.innerHeight;
    });
  }
  initFireworksCanvas();

  // Romantic Royal Fireworks Color Sets
  const fwColorSets = [
    ['#ff4d8d', '#ff1493', '#ffd1dc', '#ffffff'], // Romantic Rose & Pink
    ['#f5d061', '#ffe58f', '#fff3c4', '#ffffff'], // Imperial Gold
    ['#a855f7', '#d946ef', '#f472b6', '#ffffff'], // Deep Violet Romance
    ['#38bdf8', '#818cf8', '#c084fc', '#ffffff'], // Electric Twilight
    ['#ff3366', '#f5d061', '#ffffff', '#ff99bb']  // Bollywood Sunset
  ];

  class Rocket {
    constructor(startX, startY, targetX, targetY, burstType) {
      this.x = startX;
      this.y = startY;
      this.targetX = targetX;
      this.targetY = targetY;
      this.burstType = burstType || (Math.random() > 0.4 ? 'heart' : 'peony');
      this.colors = fwColorSets[Math.floor(Math.random() * fwColorSets.length)];

      const dx = targetX - startX;
      const dy = targetY - startY;
      const dist = Math.hypot(dx, dy) || 1;
      const speed = Math.random() * 3 + 12;
      this.vx = (dx / dist) * speed;
      this.vy = (dy / dist) * speed;
      this.trail = [];
      this.alive = true;
      playRocketAscendSound();
    }

    update() {
      this.trail.push({ x: this.x, y: this.y, alpha: 1 });
      if (this.trail.length > 5) this.trail.shift();

      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.05; // gravity

      if (this.y <= this.targetY || this.vy >= 0) {
        this.alive = false;
        explodeAt(this.x, this.y, this.burstType, this.colors);
      }
    }

    draw(ctx) {
      ctx.save();
      for (let i = 0; i < this.trail.length; i++) {
        const p = this.trail[i];
        ctx.fillStyle = `rgba(245, 208, 97, ${p.alpha * (i / this.trail.length)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class FireworkParticle {
    constructor(x, y, vx, vy, color, isGlitter) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.color = color;
      this.isGlitter = isGlitter;
      this.alpha = 1;
      this.decay = Math.random() * 0.016 + 0.011;
      this.gravity = isGlitter ? 0.05 : 0.08;
      this.drag = 0.96;
      this.size = Math.random() * 2.6 + 1.6;
      this.trail = [];
    }

    update() {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 4) this.trail.shift();

      this.vx *= this.drag;
      this.vy *= this.drag;
      this.vy += this.gravity;

      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }

    draw(ctx) {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.size;
      ctx.beginPath();
      if (this.trail.length > 1) {
        ctx.moveTo(this.trail[0].x, this.trail[0].y);
        for (let t of this.trail) ctx.lineTo(t.x, t.y);
      } else {
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      }
      ctx.stroke();

      // Glowing core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function explodeAt(x, y, burstType, colors) {
    playExplosionSound();

    if (burstType === 'heart') {
      // True Mathematical Heart Burst
      const particleCount = 75;
      for (let i = 0; i < particleCount; i++) {
        const t = (i / particleCount) * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const speed = Math.random() * 0.25 + 0.35;
        const color = colors[i % colors.length];
        fwParticles.push(new FireworkParticle(x, y, hx * speed, hy * speed, color, true));
      }
    } else {
      // Golden Peony / Willow Burst
      const count = 95;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6.5 + 1.5;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const color = colors[Math.floor(Math.random() * colors.length)];
        fwParticles.push(new FireworkParticle(x, y, vx, vy, color, Math.random() > 0.5));
      }
    }
  }

  function renderFireworksLoop() {
    if (!fwCtx) return;
    fwCtx.save();
    fwCtx.globalCompositeOperation = 'destination-out';
    fwCtx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    fwCtx.fillRect(0, 0, fwWidth, fwHeight);
    fwCtx.restore();

    fwCtx.save();
    fwCtx.globalCompositeOperation = 'lighter';

    // Update & draw rockets
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.update();
      r.draw(fwCtx);
      if (!r.alive) rockets.splice(i, 1);
    }

    // Update & draw particles
    for (let i = fwParticles.length - 1; i >= 0; i--) {
      const p = fwParticles[i];
      p.update();
      p.draw(fwCtx);
      if (p.alpha <= 0) fwParticles.splice(i, 1);
    }

    fwCtx.restore();

    if (fwRunning || rockets.length > 0 || fwParticles.length > 0) {
      requestAnimationFrame(renderFireworksLoop);
    }
  }

  function launchRocket(targetX, targetY, burstType) {
    if (!fwCanvas) return;
    const startX = (Math.random() * 0.6 + 0.2) * fwWidth;
    const startY = fwHeight + 20;
    const tx = targetX || (Math.random() * 0.7 + 0.15) * fwWidth;
    const ty = targetY || (Math.random() * 0.45 + 0.15) * fwHeight;
    rockets.push(new Rocket(startX, startY, tx, ty, burstType));
    if (!fwRunning) {
      fwRunning = true;
      requestAnimationFrame(renderFireworksLoop);
    }
  }

  // Synthesized Audio Effects for Fireworks
  function playRocketAscendSound() {
    if (!audioContext) return;
    try {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(250, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, audioContext.currentTime + 0.35);
      gain.gain.setValueAtTime(0.04, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start();
      osc.stop(audioContext.currentTime + 0.36);
    } catch (e) {}
  }

  function playExplosionSound() {
    if (!audioContext) return;
    try {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 180;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, audioContext.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.32);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioContext.destination);
      osc.start();
      osc.stop(audioContext.currentTime + 0.35);

      const chime = audioContext.createOscillator();
      const chimeGain = audioContext.createGain();
      chime.type = 'sine';
      chime.frequency.setValueAtTime(900 + Math.random() * 500, audioContext.currentTime);
      chimeGain.gain.setValueAtTime(0.06, audioContext.currentTime);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);
      chime.connect(chimeGain);
      chimeGain.connect(audioContext.destination);
      chime.start();
      chime.stop(audioContext.currentTime + 0.42);
    } catch (e) {}
  }

  /* ==========================================================================
     YES BUTTON TRIGGER & GRAND CELEBRATION
     ========================================================================== */
  function triggerCelebration() {
    stopHeartbeatLoop();

    // Camera Flash Effect
    if (flashOverlay) {
      flashOverlay.classList.add('active');
      setTimeout(() => {
        flashOverlay.classList.remove('active');
      }, 400);
    }

    // 1. Launch Grand Opening Salute: 5 Simultaneous Fireworks!
    launchRocket(fwWidth * 0.2, fwHeight * 0.3, 'heart');
    launchRocket(fwWidth * 0.5, fwHeight * 0.22, 'heart');
    launchRocket(fwWidth * 0.8, fwHeight * 0.32, 'heart');
    setTimeout(() => {
      launchRocket(fwWidth * 0.35, fwHeight * 0.28, 'peony');
      launchRocket(fwWidth * 0.65, fwHeight * 0.25, 'heart');
    }, 320);

    // 2. Start Continuous Auto-Firework Waves
    if (fwAutoLaunchTimer) clearInterval(fwAutoLaunchTimer);
    fwAutoLaunchTimer = setInterval(() => {
      const isHeart = Math.random() > 0.35;
      launchRocket(null, null, isHeart ? 'heart' : 'peony');
    }, 750);

    // 3. Multi-Angle Confetti Stadium Cannons
    fireworksExplosion();

    // 4. Open celebration modal
    setTimeout(() => {
      if (celebrationModal) celebrationModal.classList.add('active');
    }, 600);
  }

  if (btnProposalYes) {
    btnProposalYes.addEventListener('click', triggerCelebration);
  }

  // Interactive Tap for More Fireworks button
  const btnFireworksBoost = document.getElementById('btn-fireworks-boost');
  if (btnFireworksBoost) {
    btnFireworksBoost.addEventListener('click', (e) => {
      e.stopPropagation();
      launchRocket(fwWidth * 0.5, fwHeight * 0.25, 'heart');
      setTimeout(() => launchRocket(fwWidth * 0.3, fwHeight * 0.3, 'peony'), 150);
      setTimeout(() => launchRocket(fwWidth * 0.7, fwHeight * 0.3, 'heart'), 300);
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 60,
          spread: 120,
          origin: { y: 0.5 },
          colors: ['#ff4d8d', '#f5d061', '#ffffff']
        });
      }
    });
  }

  // Realistic Fireworks & Heart Confetti
  function fireworksExplosion() {
    if (typeof confetti === 'function') {
      const duration = 7 * 1000;
      const animationEnd = Date.now() + duration;

      // Stadium cannons from both sides
      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        // Left cannon
        confetti({
          particleCount: 25,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: ['#ff4d8d', '#f5d061', '#ffffff', '#ffd1dc']
        });

        // Right cannon
        confetti({
          particleCount: 25,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: ['#ff4d8d', '#f5d061', '#ffffff', '#ffd1dc']
        });

        // Center burst
        if (Math.random() > 0.5) {
          confetti({
            particleCount: 20,
            spread: 360,
            origin: { x: 0.5, y: 0.4 },
            colors: ['#ff4d8d', '#f5d061', '#e6195e', '#ffffff']
          });
        }
      }, 280);
    } else {
      for (let i = 0; i < 40; i++) {
        setTimeout(() => {
          spawnSparkle(
            window.innerWidth / 2 + (Math.random() - 0.5) * 400,
            window.innerHeight / 2 + (Math.random() - 0.5) * 300
          );
        }, i * 60);
      }
    }
  }

  // Close celebration modal or trigger actions
  const screenshotBtn = document.getElementById('btn-screenshot-badge');
  if (screenshotBtn) {
    screenshotBtn.addEventListener('click', () => {
      alert('📸 Take a quick screenshot on your phone/laptop now and send it to me with your brightest smile! ❤️');
    });
  }

  /* ==========================================================================
     11. EASTER EGG: TAP LOGO 5 TIMES
     ========================================================================== */
  let logoTapCount = 0;
  let lastTapTime = 0;

  if (brandLogoBtn) {
    brandLogoBtn.addEventListener('click', () => {
      const now = Date.now();
      if (now - lastTapTime < 900) {
        logoTapCount++;
      } else {
        logoTapCount = 1;
      }
      lastTapTime = now;

      // Pulse logo icon
      const heartIcon = brandLogoBtn.querySelector('.brand-heart-icon');
      if (heartIcon) {
        heartIcon.style.transform = `scale(${1 + logoTapCount * 0.15})`;
      }

      if (logoTapCount >= 5) {
        logoTapCount = 0;
        if (easterEggModal) easterEggModal.classList.add('active');
        fireworksExplosion();
      }
    });
  }

  const easterCloseBtn = document.getElementById('easter-close-btn');
  if (easterCloseBtn && easterEggModal) {
    easterCloseBtn.addEventListener('click', () => {
      easterEggModal.classList.remove('active');
    });
  }

  /* ==========================================================================
     12. SCROLL PROGRESS BAR & ACTIVE CHAPTER TRACKING
     ========================================================================== */
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / scrollHeight) * 100;

    if (progressBarFill) {
      progressBarFill.style.width = Math.min(progress, 100) + '%';
    }
  });

  // Smooth scroll links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();

