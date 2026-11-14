/**
 * ====================================================================
 *  AKANSHA & MUMMU - 30 ROMANTIC QUESTIONS QUIZ JAVASCRIPT ENGINE
 *  Handcrafted with Love by Rohan Shukla (Software Engineer)
 * ====================================================================
 */

(function () {
  'use strict';

  const CFG = window.QUIZ_CONFIG || {};
  const questions = CFG.questions || [];

  // Audio References
  const bgAudio = document.getElementById('quiz-bg-audio') || new Audio(CFG.audioSrc || 'assets/bg_music.mp3');
  bgAudio.loop = true;
  bgAudio.preload = 'auto';
  let isMusicPlaying = false;
  let audioContext = null;

  // DOM Elements
  const introModal = document.getElementById('intro-modal');
  const btnStartQuiz = document.getElementById('btn-start-quiz');
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const badgeQuestionNum = document.getElementById('badge-question-num');
  const loveScoreTxt = document.getElementById('love-score-txt');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const cardCategoryTag = document.getElementById('card-category-tag');
  const qCircleNum = document.getElementById('q-circle-num');
  const qMainText = document.getElementById('q-main-text');
  const milestoneContainer = document.getElementById('milestone-container');
  const qOptionsContainer = document.getElementById('q-options-container');
  const reactionBox = document.getElementById('reaction-box');
  const reactionText = document.getElementById('reaction-text');
  const screenshotActionStrip = document.getElementById('screenshot-action-strip');
  const btnCopyAnswer = document.getElementById('btn-copy-answer');
  const btnWhatsappAnswer = document.getElementById('btn-whatsapp-answer');
  const btnPrevQ = document.getElementById('btn-prev-q');
  const btnNextQ = document.getElementById('btn-next-q');
  const counterCurrent = document.getElementById('counter-current');

  // Proposal & Celebration Elements
  const proposalModal = document.getElementById('proposal-modal');
  const btnProposalYes = document.getElementById('btn-proposal-yes');
  const btnProposalNo = document.getElementById('btn-proposal-no');
  const celebrationModal = document.getElementById('celebration-modal');
  const flashOverlay = document.getElementById('flash-overlay');
  const btnMoreFireworks = document.getElementById('btn-more-fireworks');

  // Quiz State
  let currentIndex = 0;
  const userAnswers = {}; // { questionId: { optionIndex: number, text: string } }

  /* ==========================================================================
     1. AUDIO ENGINE & UNLOCK ON FIRST USER INTERACTION
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
      ['pointerdown', 'touchstart', 'touchend', 'mousedown', 'scroll', 'click'].forEach((evt) => {
        window.removeEventListener(evt, unmute, { capture: true });
        document.removeEventListener(evt, unmute, { capture: true });
      });
    };
    ['pointerdown', 'touchstart', 'touchend', 'mousedown', 'scroll', 'click'].forEach((evt) => {
      window.addEventListener(evt, unmute, { capture: true, once: true });
      document.addEventListener(evt, unmute, { capture: true, once: true });
    });
  }

  function setupGlobalAudioTriggers() {
    const gestureEvents = ['pointerdown', 'touchstart', 'touchend', 'mousedown', 'scroll', 'click'];
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
    if (musicToggleBtn) {
      if (isMusicPlaying) {
        musicToggleBtn.classList.add('active');
      } else {
        musicToggleBtn.classList.remove('active');
      }
    }
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      initAudioContext();
      if (isMusicPlaying) {
        bgAudio.pause();
        isMusicPlaying = false;
      } else {
        bgAudio.muted = false;
        bgAudio.play();
        isMusicPlaying = true;
      }
      updateMusicUI();
    });
  }

  // Play music immediately + set fallback listeners
  playMusic();
  setupGlobalAudioTriggers();

  // Intro Start Button Click
  if (btnStartQuiz) {
    btnStartQuiz.addEventListener('click', () => {
      playMusic();
      if (introModal) introModal.classList.add('hidden');
    });
  }

  /* ==========================================================================
     2. QUIZ ENGINE & RENDERING (30 Questions)
     ========================================================================== */
  function renderQuestion(index) {
    if (index < 0 || index >= questions.length) return;
    const q = questions[index];

    // If Question 30 (Proposal Climax)
    if (q.type === 'proposal-climax' || index === 29) {
      openProposalModal();
      return;
    }

    // Update Headers & Counter
    const qNum = index + 1;
    if (badgeQuestionNum) badgeQuestionNum.textContent = `Question ${qNum} of 30`;
    if (counterCurrent) counterCurrent.textContent = qNum;
    if (cardCategoryTag) cardCategoryTag.textContent = q.category || 'Love Quiz ✨';
    if (qCircleNum) qCircleNum.textContent = qNum;
    if (qMainText) qMainText.textContent = q.question;

    // Progress Bar Fill & Love Score
    const percent = ((qNum) / 30) * 100;
    if (progressBarFill) progressBarFill.style.width = `${percent}%`;
    const scoreVal = Math.min(100, Math.round(percent + (Object.keys(userAnswers).length > 5 ? 10 : 0)));
    if (loveScoreTxt) loveScoreTxt.textContent = `${scoreVal}%`;

    // Milestone Handling
    renderMilestone(q);

    // Render Options
    if (qOptionsContainer) {
      qOptionsContainer.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D'];
      const currentSelected = userAnswers[q.id];

      q.options.forEach((optText, optIdx) => {
        const btn = document.createElement('button');
        btn.className = 'q-option-btn';
        if (currentSelected && currentSelected.optionIndex === optIdx) {
          btn.classList.add('selected');
        }

        btn.innerHTML = `
          <div class="option-badge">${letters[optIdx] || '•'}</div>
          <div class="option-text">${optText}</div>
        `;

        btn.addEventListener('click', () => {
          handleOptionSelect(q, optIdx, optText);
        });

        qOptionsContainer.appendChild(btn);
      });
    }

    // Reaction Box & Screenshot Strip State
    if (userAnswers[q.id]) {
      showReactionAndScreenshot(q, userAnswers[q.id].text);
    } else {
      if (reactionBox) reactionBox.classList.add('hidden');
      if (screenshotActionStrip) screenshotActionStrip.classList.add('hidden');
    }

    // Update Navigation Buttons
    if (btnPrevQ) btnPrevQ.disabled = (index === 0);
    if (btnNextQ) {
      btnNextQ.innerHTML = (index === 28) ? 'Question 30: Grand Finale 💍' : 'Next Question ➡️';
    }

    // Scroll card smoothly into view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleOptionSelect(q, optIdx, optText) {
    userAnswers[q.id] = { optionIndex: optIdx, text: optText };

    // Update active class on options
    if (qOptionsContainer) {
      const allButtons = qOptionsContainer.querySelectorAll('.q-option-btn');
      allButtons.forEach((b, i) => {
        b.classList.toggle('selected', i === optIdx);
      });
    }

    // Mini confetti burst
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 20,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ff4d8d', '#f5d061', '#ffffff']
      });
    }

    // Vibrate gently if supported
    if ('vibrate' in navigator) {
      try { navigator.vibrate(30); } catch (e) {}
    }

    showReactionAndScreenshot(q, optText);
  }

  function showReactionAndScreenshot(q, selectedAnswerText) {
    // Show Mummu's reaction
    if (reactionBox && reactionText) {
      reactionText.textContent = q.mummuReaction || "Sach bolun toh tumhara ye answer sunke dil khush ho gaya! ❤️";
      reactionBox.classList.remove('hidden');
    }

    // Show Screenshot & WhatsApp Strip
    if (screenshotActionStrip) {
      screenshotActionStrip.classList.remove('hidden');

      // WhatsApp formatted message
      if (btnWhatsappAnswer) {
        const waMsg = `Mummu! Maine Question ${q.id} ka answer diya:\n"${selectedAnswerText}"\n❤️ (Borivali ⇄ Dahisar)`;
        btnWhatsappAnswer.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(waMsg)}`;
      }

      // Copy Answer Button
      if (btnCopyAnswer) {
        btnCopyAnswer.onclick = () => {
          const copyMsg = `Question ${q.id}: ${q.question}\nAkansha's Answer: "${selectedAnswerText}"\n❤️ Specially for Mummu!`;
          if (navigator.clipboard) {
            navigator.clipboard.writeText(copyMsg).then(() => {
              btnCopyAnswer.innerHTML = '<span>✅ Copied! Ab SS leke bhejo 📸</span>';
              setTimeout(() => {
                btnCopyAnswer.innerHTML = '<span>📋 Copy Answer</span>';
              }, 2500);
            });
          }
        };
      }
    }
  }

  /* ==========================================================================
     3. MILESTONE EMBEDS (Photos, Videos, Scratch Card)
     ========================================================================== */
  function renderMilestone(q) {
    if (!milestoneContainer) return;
    milestoneContainer.innerHTML = '';

    if (q.type === 'photo-milestone') {
      milestoneContainer.classList.remove('hidden');
      milestoneContainer.innerHTML = `
        <div class="photos-milestone-grid">
          <div class="milestone-photo-card hero-photo">
            <img src="${CFG.media?.photo2 || 'assets/photo2.jpg'}" alt="Akansha Portrait">
          </div>
          <div class="milestone-photo-card">
            <img src="${CFG.media?.photo1 || 'assets/photo1.jpg'}" alt="Akansha Smiling">
          </div>
          <div class="milestone-photo-card">
            <img src="${CFG.media?.photo2 || 'assets/photo2.jpg'}" alt="Akansha Close-up">
          </div>
          <div class="milestone-photo-card">
            <img src="${CFG.media?.photo3 || 'assets/photo3.jpg'}" alt="Akansha Elegance">
          </div>
        </div>
      `;
    } else if (q.type === 'video1-milestone') {
      milestoneContainer.classList.remove('hidden');
      milestoneContainer.innerHTML = `
        <div class="video-milestone-wrapper">
          <button id="unmute-vid-1" class="video-unmute-btn">🔊 Tap to Unmute</button>
          <video id="milestone-vid-1" playsinline muted loop autoplay preload="auto">
            <source src="${CFG.media?.video1 || 'assets/video.mp4'}" type="video/mp4">
          </video>
        </div>
      `;
      setupMilestoneVideo('milestone-vid-1', 'unmute-vid-1');
    } else if (q.type === 'video2-milestone') {
      milestoneContainer.classList.remove('hidden');
      milestoneContainer.innerHTML = `
        <div class="video-milestone-wrapper">
          <button id="unmute-vid-2" class="video-unmute-btn">🔊 Tap to Unmute</button>
          <video id="milestone-vid-2" playsinline muted loop autoplay preload="auto">
            <source src="${CFG.media?.video2 || 'assets/video2.mp4'}" type="video/mp4">
          </video>
        </div>
      `;
      setupMilestoneVideo('milestone-vid-2', 'unmute-vid-2');
    } else if (q.type === 'scratch-milestone') {
      milestoneContainer.classList.remove('hidden');
      milestoneContainer.innerHTML = `
        <div class="scratch-milestone-wrapper">
          <div class="scratch-secret-content">
            <h4>✨ FOR MY FOREVER AKANSHA ✨</h4>
            <p>"Borivali me uss black outfit me dekhne ke baad se, tumhara chehra mere dil se utra hi nahi! You are my forever happiness, Akansha 🥰✨"</p>
            <div style="font-size:0.75rem; color:var(--gold-primary); margin-top:4px;">— Rohan (Your Favourite Mummu)</div>
          </div>
          <canvas id="scratch-canvas" class="scratch-canvas-overlay"></canvas>
        </div>
        <div style="text-align:center; font-size:0.78rem; color:var(--gold-light); margin-bottom:10px;">
          👆 Ungli ya mouse se gold layer ko scratch karo!
        </div>
      `;
      setTimeout(initScratchCard, 100);
    } else {
      milestoneContainer.classList.add('hidden');
    }
  }

  function setupMilestoneVideo(videoId, btnId) {
    const vid = document.getElementById(videoId);
    const btn = document.getElementById(btnId);
    if (!vid || !btn) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      vid.muted = !vid.muted;
      btn.textContent = vid.muted ? '🔊 Tap to Unmute' : '🔇 Mute Video';
      if (!vid.muted && bgAudio) {
        bgAudio.volume = 0.25;
      } else if (bgAudio) {
        bgAudio.volume = 0.85;
      }
    });

    vid.addEventListener('click', () => {
      if (vid.paused) vid.play();
      else vid.pause();
    });
  }

  function initScratchCard() {
    const canvas = document.getElementById('scratch-canvas');
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

    // Decorative sparkles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 3 + 1, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#260e22';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ 🪙 Scratch Karo Akansha! 🪙 ✨', canvas.width / 2, canvas.height / 2 - 6);

    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#42163b';
    ctx.fillText('(Rub with finger or mouse)', canvas.width / 2, canvas.height / 2 + 14);

    function scratch(e) {
      if (!isDrawing || isRevealed) return;
      const cRect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const x = clientX - cRect.left;
      const y = clientY - cRect.top;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 24, 0, Math.PI * 2);
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
            particleCount: 50,
            spread: 80,
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

  // Previous & Next Button Listeners
  if (btnPrevQ) {
    btnPrevQ.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        renderQuestion(currentIndex);
      }
    });
  }

  if (btnNextQ) {
    btnNextQ.addEventListener('click', () => {
      if (currentIndex < questions.length - 1) {
        currentIndex++;
        renderQuestion(currentIndex);
      } else {
        openProposalModal();
      }
    });
  }

  /* ==========================================================================
     4. QUESTION 30: THE GRAND FINALE PROPOSAL CLIMAX
     ========================================================================== */
  function openProposalModal() {
    if (proposalModal) {
      proposalModal.classList.remove('hidden');
    }
  }

  const noResponses = [
    "No 🙈",
    "Are you sure? 🥺",
    "Ek baar aur soch lo...",
    "Pakka? Mummu ro dega 😭",
    "Galat button dab gaya shayad?",
    "Aise mat karo na please...",
    "Ab toh YES hi dabana padega! 😏",
    "Mummu sirf tumhara hai! ❤️"
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
      try { navigator.vibrate([30, 40, 30]); } catch (err) {}
    }

    const box = document.querySelector('.proposal-box');
    if (box && btnProposalNo) {
      const boxRect = box.getBoundingClientRect();
      const btnRect = btnProposalNo.getBoundingClientRect();

      const maxX = boxRect.width - btnRect.width - 40;
      const randomX = (Math.random() - 0.5) * maxX;
      const randomY = (Math.random() - 0.5) * 80;

      const shrinkFactor = Math.max(0.65, 1 - noAttemptCount * 0.05);

      btnProposalNo.style.position = 'relative';
      btnProposalNo.style.transform = `translate(${randomX}px, ${randomY}px) scale(${shrinkFactor})`;

      const nextTextIndex = Math.min(noAttemptCount, noResponses.length - 1);
      btnProposalNo.textContent = noResponses[nextTextIndex];

      yesScale += 0.08;
      if (btnProposalYes) {
        btnProposalYes.style.transform = `scale(${yesScale})`;
        btnProposalYes.style.boxShadow = `0 15px ${35 + noAttemptCount * 6}px rgba(255, 77, 141, 0.8)`;
      }

      if (noAttemptCount >= 8) {
        btnProposalNo.style.display = 'none';
      }
    }
  }

  if (btnProposalNo) {
    btnProposalNo.addEventListener('mouseenter', evadeNoButton);
    btnProposalNo.addEventListener('touchstart', evadeNoButton, { passive: false });
    btnProposalNo.addEventListener('click', evadeNoButton);
  }

  if (btnProposalYes) {
    btnProposalYes.addEventListener('click', () => {
      // Camera Flash
      if (flashOverlay) {
        flashOverlay.classList.add('active');
        setTimeout(() => flashOverlay.classList.remove('active'), 400);
      }

      // Hide Proposal Modal
      if (proposalModal) proposalModal.classList.add('hidden');

      // Launch Fireworks
      launchRocket(fwWidth * 0.25, fwHeight * 0.3, 'heart');
      launchRocket(fwWidth * 0.5, fwHeight * 0.22, 'heart');
      launchRocket(fwWidth * 0.75, fwHeight * 0.32, 'heart');
      setTimeout(() => {
        launchRocket(fwWidth * 0.35, fwHeight * 0.28, 'peony');
        launchRocket(fwWidth * 0.65, fwHeight * 0.25, 'heart');
      }, 350);

      // Continuous rocket waves
      if (fwAutoLaunchTimer) clearInterval(fwAutoLaunchTimer);
      fwAutoLaunchTimer = setInterval(() => {
        const isHeart = Math.random() > 0.35;
        launchRocket(null, null, isHeart ? 'heart' : 'peony');
      }, 800);

      // Confetti storm
      fireworksExplosion();

      // Open Celebration Modal
      setTimeout(() => {
        if (celebrationModal) celebrationModal.classList.remove('hidden');
      }, 600);
    });
  }

  if (btnMoreFireworks) {
    btnMoreFireworks.addEventListener('click', (e) => {
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
     5. CINEMATIC 3D PARTICLES FIREWORKS ENGINE
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
     6. BACKGROUND TWINKLING STARS
     ========================================================================== */
  const starsCanvas = document.getElementById('stars-canvas');
  if (starsCanvas) {
    const sCtx = starsCanvas.getContext('2d');
    let sWidth = (starsCanvas.width = window.innerWidth);
    let sHeight = (starsCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      sWidth = starsCanvas.width = window.innerWidth;
      sHeight = starsCanvas.height = window.innerHeight;
    });

    const stars = [];
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random() * sWidth,
        y: Math.random() * sHeight,
        r: Math.random() * 1.5 + 0.4,
        a: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.02 + 0.005
      });
    }

    function renderStars() {
      sCtx.clearRect(0, 0, sWidth, sHeight);
      for (let s of stars) {
        s.a += s.speed;
        if (s.a > 0.9 || s.a < 0.2) s.speed = -s.speed;
        sCtx.fillStyle = `rgba(255, 255, 255, ${Math.abs(s.a)})`;
        sCtx.beginPath();
        sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        sCtx.fill();
      }
      requestAnimationFrame(renderStars);
    }
    renderStars();
  }

  // Initialize the first question
  renderQuestion(0);

})();
