/**
 * ==========================================================================
 *  AKANSHA OS 18.0 - INTERACTIVE JAVASCRIPT ENGINE
 *  Handcrafted with Love by Rohan Shukla (Software Engineer)
 * ==========================================================================
 */

(function () {
  'use strict';

  const CFG = window.STORY_CONFIG || {};

  // Audio References
  const bgAudio = document.getElementById('bg-audio-tag') || new Audio(CFG.audio?.src || 'assets/bg_music.mp3');
  bgAudio.loop = true;
  bgAudio.preload = 'auto';
  let isMusicPlaying = false;
  let audioContext = null;

  // DOM Elements
  const bootScreen = document.getElementById('boot-screen');
  const bootProgressFill = document.getElementById('boot-progress-fill');
  const bootUnlockBtn = document.getElementById('boot-unlock-btn');
  const lockscreenView = document.getElementById('lockscreen-view');
  const lockNotifBanner = document.getElementById('lock-notif-banner');
  const lockSwipeBtn = document.getElementById('lock-swipe-btn');
  const dynamicIsland = document.getElementById('dynamic-island');
  const facetimeModal = document.getElementById('facetime-modal-view');
  const proposalClimaxView = document.getElementById('proposal-climax-view');
  const celebrationModal = document.getElementById('celebration-screen-modal');
  const flashOverlay = document.getElementById('flash-overlay');

  /* ==========================================================================
     0. LIVE TIME & CLOCK
     ========================================================================== */
  function updateLiveClock() {
    const now = new Date();
    let hours = now.getHours();
    let mins = now.getMinutes();
    mins = mins < 10 ? '0' + mins : mins;
    const timeStr = `${hours}:${mins}`;

    const statusClock = document.getElementById('status-clock');
    const lockClock = document.getElementById('lock-clock');
    if (statusClock) statusClock.textContent = timeStr;
    if (lockClock) lockClock.textContent = timeStr;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const lockDate = document.getElementById('lock-date');
    if (lockDate) {
      lockDate.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
    }
  }
  setInterval(updateLiveClock, 1000);
  updateLiveClock();

  /* ==========================================================================
     1. AUDIO ENGINE & UNLOCK ON FIRST MOMENT
     ========================================================================== */
  function initAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioContext = new AudioCtx();
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }

  function playMusic() {
    initAudioContext();
    bgAudio.muted = false;
    bgAudio.volume = 0.85;
    const p = bgAudio.play();
    if (p !== undefined) {
      p.then(() => {
        isMusicPlaying = true;
        updateMusicUI();
      }).catch(() => {
        // Muted fallback
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
    const gestureEvents = ['pointerdown', 'touchstart', 'touchend', 'mousedown', 'mousemove', 'scroll', 'wheel', 'keydown', 'click'];
    function triggerStart() {
      initAudioContext();
      bgAudio.muted = false;
      bgAudio.volume = 0.85;
      bgAudio.play().then(() => {
        isMusicPlaying = true;
        updateMusicUI();
        cleanupTriggers();
      }).catch(() => {});
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

  function updateMusicUI() {
    document.body.classList.toggle('music-playing', isMusicPlaying);
  }

  playMusic();
  setupGlobalAudioTriggers();

  // Dynamic Island Click to expand/collapse
  if (dynamicIsland) {
    dynamicIsland.addEventListener('click', (e) => {
      e.stopPropagation();
      dynamicIsland.classList.toggle('expanded');
    });
  }

  /* ==========================================================================
     2. BOOT SCREEN & UNLOCK TRANSITIONS
     ========================================================================== */
  let bootProgress = 0;
  const bootInterval = setInterval(() => {
    bootProgress += Math.floor(Math.random() * 8) + 5;
    if (bootProgress >= 100) {
      bootProgress = 100;
      clearInterval(bootInterval);
      if (bootProgressFill) bootProgressFill.style.width = '100%';
      if (bootUnlockBtn) bootUnlockBtn.style.display = 'inline-flex';
    } else {
      if (bootProgressFill) bootProgressFill.style.width = bootProgress + '%';
    }
  }, 50);

  function unlockFromBoot() {
    playMusic();
    if (bootScreen) bootScreen.classList.add('hidden');
  }

  if (bootUnlockBtn) bootUnlockBtn.addEventListener('click', unlockFromBoot);
  if (bootScreen) bootScreen.addEventListener('click', unlockFromBoot);

  function unlockToHomescreen() {
    playMusic();
    if (lockscreenView) lockscreenView.classList.add('unlocked');
  }

  if (lockSwipeBtn) lockSwipeBtn.addEventListener('click', unlockToHomescreen);
  if (lockNotifBanner) {
    lockNotifBanner.addEventListener('click', () => {
      unlockToHomescreen();
      openApp('app-messages');
    });
  }

  /* ==========================================================================
     3. APP WINDOW NAVIGATION
     ========================================================================== */
  function openApp(appId) {
    playMusic();
    const appWindow = document.getElementById(appId);
    if (appWindow) {
      appWindow.classList.add('open');
      if (appId === 'app-messages') {
        startChatSimulation();
      }
      if (appId === 'app-scratch') {
        setTimeout(initScratchCard, 200);
      }
    }
  }

  function closeApp(appWindow) {
    if (appWindow) {
      appWindow.classList.remove('open');
    }
  }

  document.querySelectorAll('.ios-app-item[data-app]').forEach((item) => {
    item.addEventListener('click', () => {
      const appId = item.getAttribute('data-app');
      openApp(appId);
    });
  });

  const homeFeatureWidget = document.querySelector('.home-feature-widget');
  if (homeFeatureWidget) {
    homeFeatureWidget.addEventListener('click', () => {
      openApp('app-maps');
    });
  }

  document.querySelectorAll('.app-back-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const parentWindow = btn.closest('.ios-app-window');
      closeApp(parentWindow);
    });
  });

  /* ==========================================================================
     4. MESSAGES APP: BORIVALI CHAT REPLAY
     ========================================================================== */
  const chatStream = document.getElementById('chat-stream-ios');
  const chatTypingIndicator = document.getElementById('chat-typing-bubble');
  const chatReplayAction = document.getElementById('chat-replay-action');
  const messages = CFG.chatMessages || [];
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

      const delay = isHer ? 1200 : 750;

      setTimeout(() => {
        if (chatTypingIndicator) chatTypingIndicator.classList.remove('active');

        const bubble = document.createElement('div');
        bubble.className = `ios-chat-bubble ${msg.sender}`;
        bubble.innerHTML = `
          <div>${msg.text}</div>
          <span style="display:block; font-size:0.65rem; color:rgba(255,255,255,0.6); margin-top:3px; text-align:right;">${msg.time}</span>
        `;
        chatStream.appendChild(bubble);

        requestAnimationFrame(() => {
          bubble.classList.add('visible');
          chatStream.scrollTop = chatStream.scrollHeight;
        });

        currentMsgIdx++;
        setTimeout(renderNextMessage, 700);
      }, delay);
    }

    renderNextMessage();
  }

  if (chatReplayAction) {
    chatReplayAction.addEventListener('click', () => {
      chatRunning = false;
      startChatSimulation();
    });
  }

  /* ==========================================================================
     5. REELS APP: VIDEO CONTROLS
     ========================================================================== */
  function setupReel(vidId, btnClass) {
    const vid = document.getElementById(vidId);
    const btn = document.querySelector('.' + btnClass);
    if (!vid || !btn) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      vid.muted = !vid.muted;
      btn.textContent = vid.muted ? '🔊 Tap to Unmute' : '🔇 Mute Video';
      if (!vid.muted && bgAudio) bgAudio.volume = 0.2;
    });

    vid.addEventListener('click', () => {
      if (vid.paused) vid.play();
      else vid.pause();
    });
  }
  setupReel('reel-video-1', 'reel-unmute-1');
  setupReel('reel-video-2', 'reel-unmute-2');

  /* ==========================================================================
     6. SCRATCH CARD ENGINE (Secret Note)
     ========================================================================== */
  function initScratchCard() {
    const canvas = document.getElementById('scratch-ios-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    let isDrawing = false;
    let isRevealed = false;

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Metallic rose-gold scratch layer
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
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ 🪙 Scratch Karo Akansha! 🪙 ✨', canvas.width / 2, canvas.height / 2 - 8);

    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#42163b';
    ctx.fillText('(Rub with your finger or mouse)', canvas.width / 2, canvas.height / 2 + 16);

    function scratch(e) {
      if (!isDrawing || isRevealed) return;
      const cRect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const x = clientX - cRect.left;
      const y = clientY - cRect.top;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 26, 0, Math.PI * 2);
      ctx.fill();

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
  }

  /* ==========================================================================
     7. FACETIME INCOMING CALL & PROPOSAL CLIMAX
     ========================================================================== */
  function triggerFaceTimeCall() {
    initAudioContext();
    if (facetimeModal) {
      facetimeModal.classList.add('ringing');
      playFaceTimeRingtone();
    }
  }

  const appTriggerFacetime = document.getElementById('app-trigger-facetime');
  const dockFacetimeBtn = document.getElementById('dock-facetime-btn');
  if (appTriggerFacetime) appTriggerFacetime.addEventListener('click', triggerFaceTimeCall);
  if (dockFacetimeBtn) dockFacetimeBtn.addEventListener('click', triggerFaceTimeCall);

  // Synthesized FaceTime Ringtone
  let ringInterval = null;
  function playFaceTimeRingtone() {
    function chimes() {
      if (!audioContext) return;
      try {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.3);
        gain.gain.setValueAtTime(0.08, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.32);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start();
        osc.stop(audioContext.currentTime + 0.35);
      } catch (e) {}
    }
    chimes();
    ringInterval = setInterval(chimes, 2000);
  }

  function stopFaceTimeRingtone() {
    if (ringInterval) {
      clearInterval(ringInterval);
      ringInterval = null;
    }
  }

  // Decline button playfully runs away / rejects
  const btnFacetimeDecline = document.getElementById('btn-facetime-decline');
  if (btnFacetimeDecline) {
    btnFacetimeDecline.addEventListener('click', (e) => {
      e.stopPropagation();
      alert("🙈 Aise Mummu ki call decline nahi kar sakte! Pehle suno toh sahi!");
    });
  }

  // Accept FaceTime Call -> Transitions into Proposal
  const btnFacetimeAccept = document.getElementById('btn-facetime-accept');
  if (btnFacetimeAccept) {
    btnFacetimeAccept.addEventListener('click', () => {
      stopFaceTimeRingtone();
      if (facetimeModal) facetimeModal.classList.remove('ringing');
      if (proposalClimaxView) proposalClimaxView.classList.add('active');
    });
  }

  /* ==========================================================================
     8. PROPOSAL RUNAWAY NO BUTTON & YES CELEBRATION
     ========================================================================== */
  const btnIosYes = document.getElementById('btn-ios-yes');
  const btnIosNo = document.getElementById('btn-ios-no');

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

    if ('vibrate' in navigator) {
      try { navigator.vibrate([35, 50, 35]); } catch (err) {}
    }

    const box = document.querySelector('.proposal-question-box');
    if (box && btnIosNo) {
      const boxRect = box.getBoundingClientRect();
      const btnRect = btnIosNo.getBoundingClientRect();

      const maxX = boxRect.width - btnRect.width - 30;
      const randomX = (Math.random() - 0.5) * maxX;
      const randomY = (Math.random() - 0.5) * 80;

      const shrinkFactor = Math.max(0.65, 1 - noAttemptCount * 0.05);

      btnIosNo.style.position = 'relative';
      btnIosNo.style.transform = `translate(${randomX}px, ${randomY}px) scale(${shrinkFactor})`;

      const nextTextIndex = Math.min(noAttemptCount, noResponses.length - 1);
      btnIosNo.textContent = noResponses[nextTextIndex];

      yesScale += 0.08;
      if (btnIosYes) {
        btnIosYes.style.transform = `scale(${yesScale})`;
        btnIosYes.style.boxShadow = `0 15px ${35 + noAttemptCount * 5}px rgba(255, 77, 141, 0.7)`;
      }

      if (noAttemptCount >= 8) {
        btnIosNo.style.display = 'none';
      }
    }
  }

  if (btnIosNo) {
    btnIosNo.addEventListener('mouseenter', evadeNoButton);
    btnIosNo.addEventListener('touchstart', evadeNoButton, { passive: false });
    btnIosNo.addEventListener('click', evadeNoButton);
  }

  /* ==========================================================================
     9. YES BUTTON: GRAND FIREWORKS & CELEBRATION
     ========================================================================== */
  function triggerCelebration() {
    if (flashOverlay) {
      flashOverlay.classList.add('active');
      setTimeout(() => flashOverlay.classList.remove('active'), 400);
    }

    // 5-Rocket Salute
    launchRocket(fwWidth * 0.2, fwHeight * 0.3, 'heart');
    launchRocket(fwWidth * 0.5, fwHeight * 0.22, 'heart');
    launchRocket(fwWidth * 0.8, fwHeight * 0.32, 'heart');
    setTimeout(() => {
      launchRocket(fwWidth * 0.35, fwHeight * 0.28, 'peony');
      launchRocket(fwWidth * 0.65, fwHeight * 0.25, 'heart');
    }, 320);

    // Continuous waves
    if (fwAutoLaunchTimer) clearInterval(fwAutoLaunchTimer);
    fwAutoLaunchTimer = setInterval(() => {
      const isHeart = Math.random() > 0.35;
      launchRocket(null, null, isHeart ? 'heart' : 'peony');
    }, 750);

    fireworksExplosion();

    setTimeout(() => {
      if (celebrationModal) celebrationModal.classList.add('active');
    }, 600);
  }

  if (btnIosYes) {
    btnIosYes.addEventListener('click', triggerCelebration);
  }

  const btnFireworksBurstIos = document.getElementById('btn-fireworks-burst-ios');
  if (btnFireworksBurstIos) {
    btnFireworksBurstIos.addEventListener('click', (e) => {
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

  /* ==========================================================================
     10. CINEMATIC FIREWORKS ENGINE
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

  const fwColorSets = [
    ['#ff4d8d', '#ff1493', '#ffd1dc', '#ffffff'],
    ['#f5d061', '#ffe58f', '#fff3c4', '#ffffff'],
    ['#a855f7', '#d946ef', '#f472b6', '#ffffff'],
    ['#38bdf8', '#818cf8', '#c084fc', '#ffffff'],
    ['#ff3366', '#f5d061', '#ffffff', '#ff99bb']
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
    }

    update() {
      this.trail.push({ x: this.x, y: this.y, alpha: 1 });
      if (this.trail.length > 5) this.trail.shift();

      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.05;

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

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function explodeAt(x, y, burstType, colors) {
    if (burstType === 'heart') {
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

    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.update();
      r.draw(fwCtx);
      if (!r.alive) rockets.splice(i, 1);
    }

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

  function fireworksExplosion() {
    if (typeof confetti === 'function') {
      const duration = 6 * 1000;
      const animationEnd = Date.now() + duration;

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        confetti({
          particleCount: 25,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: ['#ff4d8d', '#f5d061', '#ffffff']
        });
        confetti({
          particleCount: 25,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: ['#ff4d8d', '#f5d061', '#ffffff']
        });
      }, 280);
    }
  }

  /* ==========================================================================
     11. BACKGROUND STARS & FIREFLIES CANVAS
     ========================================================================== */
  const atmCanvas = document.getElementById('atmosphere-canvas');
  if (atmCanvas) {
    const ctx = atmCanvas.getContext('2d');
    let width = (atmCanvas.width = window.innerWidth);
    let height = (atmCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = atmCanvas.width = window.innerWidth;
      height = atmCanvas.height = window.innerHeight;
    });

    const stars = [];
    for (let i = 0; i < 90; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.4,
        a: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.02 + 0.005
      });
    }

    function renderAtm() {
      ctx.clearRect(0, 0, width, height);
      for (let s of stars) {
        s.a += s.speed;
        if (s.a > 0.9 || s.a < 0.2) s.speed = -s.speed;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(s.a)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(renderAtm);
    }
    renderAtm();
  }

})();
