/**
 * ====================================================================
 *  SORRY AKANSHA - MAIN SCRIPT
 *  Dedicated to Akansha Mishra from Rohan Shukla (Mummu)
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.SORRY_CONFIG || {};

  // ==================================================================
  // 1. POPULATE DYNAMIC CONTENT FROM CONFIG
  // ==================================================================

  // Populate Apology Letter
  const letterEl = document.getElementById('letter-content');
  if (letterEl && config.apologyLetter) {
    letterEl.innerHTML = config.apologyLetter
      .map((p, idx) => {
        const isCoke = p.toLowerCase().includes('diet coke') || p.toLowerCase().includes('chilled');
        return `<p class="${isCoke ? 'diet-coke-highlight' : ''}">${p}</p>`;
      })
      .join('');
  }

  // Populate Promises Grid
  const promisesGrid = document.getElementById('promises-grid');
  if (promisesGrid && config.cards) {
    promisesGrid.innerHTML = config.cards
      .map(
        (card) => `
      <div class="promise-card">
        <div class="promise-emoji-wrap">${card.emoji}</div>
        <h3 class="promise-title">${card.title}</h3>
        <p class="promise-desc">${card.desc}</p>
      </div>
    `
      )
      .join('');
  }

  // Populate Scratch Card Secret
  if (config.scratchNote) {
    const titleEl = document.getElementById('contract-title');
    const msgEl = document.getElementById('contract-message');
    const signEl = document.getElementById('contract-sign');
    if (titleEl) titleEl.textContent = config.scratchNote.title;
    if (msgEl) msgEl.textContent = `"${config.scratchNote.message}"`;
    if (signEl) signEl.textContent = config.scratchNote.sign;
  }

  // Setup WhatsApp share button
  const whatsappBtn = document.getElementById('whatsapp-btn');
  if (whatsappBtn && config.whatsappText) {
    const encodedMsg = encodeURIComponent(config.whatsappText);
    whatsappBtn.href = `https://api.whatsapp.com/send?text=${encodedMsg}`;
  }

  // ==================================================================
  // 2. AUDIO & AUTOPLAY UNLOCK ENGINE
  // ==================================================================
  const audio = document.getElementById('bg-audio');
  const musicPill = document.getElementById('music-pill');
  const vinylDisc = document.getElementById('vinyl-disc');
  const musicIcon = document.getElementById('music-icon');
  const musicStatus = document.getElementById('music-status');
  let audioUnlocked = false;

  function updateAudioUI(isPlaying) {
    if (isPlaying) {
      vinylDisc.classList.add('spin');
      musicIcon.textContent = '⏸️';
      musicStatus.textContent = 'Now Playing ❤️';
    } else {
      vinylDisc.classList.remove('spin');
      musicIcon.textContent = '▶️';
      musicStatus.textContent = 'Tap to Play';
    }
  }

  function playAudio() {
    if (!audio) return;
    audio
      .play()
      .then(() => {
        audioUnlocked = true;
        updateAudioUI(true);
      })
      .catch(() => {
        updateAudioUI(false);
      });
  }

  function toggleAudio() {
    if (!audio) return;
    if (audio.paused) {
      playAudio();
    } else {
      audio.pause();
      updateAudioUI(false);
    }
  }

  if (musicPill) {
    musicPill.addEventListener('click', toggleAudio);
  }

  // Global user gesture unlocker for background music
  function unlockOnGesture() {
    if (!audioUnlocked && audio) {
      playAudio();
    }
    // Remove listeners once attempted
    window.removeEventListener('pointerdown', unlockOnGesture);
    window.removeEventListener('touchstart', unlockOnGesture);
    window.removeEventListener('click', unlockOnGesture);
    window.removeEventListener('scroll', unlockOnGesture);
  }

  window.addEventListener('pointerdown', unlockOnGesture, { once: true });
  window.addEventListener('touchstart', unlockOnGesture, { once: true });
  window.addEventListener('click', unlockOnGesture, { once: true });
  window.addEventListener('scroll', unlockOnGesture, { once: true });

  // Try initial autoplay
  playAudio();

  // ==================================================================
  // 3. BACKGROUND PARTICLES (HEARTS, STARS & FIZZ BUBBLES)
  // ==================================================================
  const pCanvas = document.getElementById('particles-canvas');
  if (pCanvas) {
    const pCtx = pCanvas.getContext('2d');
    let pWidth = (pCanvas.width = window.innerWidth);
    let pHeight = (pCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      pWidth = pCanvas.width = window.innerWidth;
      pHeight = pCanvas.height = window.innerHeight;
    });

    const particles = [];
    const particleTypes = ['bubble', 'heart', 'star'];
    const hearts = ['❤️', '💖', '💕', '✨'];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * pWidth,
        y: Math.random() * pHeight,
        type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
        size: Math.random() * 12 + 6,
        speedY: Math.random() * 0.8 + 0.3,
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.2,
        char: hearts[Math.floor(Math.random() * hearts.length)]
      });
    }

    function animateParticles() {
      pCtx.clearRect(0, 0, pWidth, pHeight);

      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;

        // Reset if off screen
        if (p.y < -30) {
          p.y = pHeight + 20;
          p.x = Math.random() * pWidth;
        }

        pCtx.save();
        pCtx.globalAlpha = p.opacity;

        if (p.type === 'bubble') {
          pCtx.beginPath();
          pCtx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          pCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          pCtx.fill();
          pCtx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          pCtx.lineWidth = 1;
          pCtx.stroke();
        } else if (p.type === 'heart') {
          pCtx.font = `${p.size}px sans-serif`;
          pCtx.fillText(p.char, p.x, p.y);
        } else {
          pCtx.fillStyle = 'rgba(255, 209, 102, 0.6)';
          pCtx.beginPath();
          pCtx.arc(p.x, p.y, p.size / 4, 0, Math.PI * 2);
          pCtx.fill();
        }

        pCtx.restore();
      });

      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ==================================================================
  // 4. SYNTHETIC AUDIO POP SOUND (Web Audio API for Diet Coke Can)
  // ==================================================================
  function playCokePopSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Sharp "Pop" Click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.7, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);

      // Fizzy hiss noise
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, ctx.currentTime + 0.05);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(ctx.currentTime + 0.05);
      noise.stop(ctx.currentTime + 0.5);
    } catch (e) {
      // Audio context might fail on older browsers silently
    }
  }

  // ==================================================================
  // 5. INTERACTIVE 3D DIET COKE CAN
  // ==================================================================
  const cokeCan = document.getElementById('coke-can');
  const fizzContainer = document.getElementById('fizz-container');
  const rewardCard = document.getElementById('coke-reward-card');
  let canPopped = false;

  function burstCanFizz() {
    if (!fizzContainer) return;
    const colors = ['#ffffff', '#ff4d79', '#e01a22', '#ffd166'];
    const emojis = ['🥤', '❤️', '✨', '🫧'];

    for (let i = 0; i < 22; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'fizz-bubble';

      const isEmoji = Math.random() > 0.55;
      if (isEmoji) {
        bubble.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        bubble.style.fontSize = `${Math.random() * 14 + 10}px`;
      } else {
        const size = Math.random() * 12 + 6;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.background = colors[Math.floor(Math.random() * colors.length)];
        bubble.style.boxShadow = '0 0 6px rgba(255, 255, 255, 0.8)';
      }

      bubble.style.left = '50%';
      bubble.style.top = '10px';

      const angle = (Math.random() * Math.PI) + Math.PI; // Upward arc
      const dist = Math.random() * 130 + 50;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;

      bubble.style.setProperty('--tx', `${tx}px`);
      bubble.style.setProperty('--ty', `${ty}px`);

      fizzContainer.appendChild(bubble);

      setTimeout(() => {
        bubble.remove();
      }, 1250);
    }
  }

  if (cokeCan) {
    cokeCan.addEventListener('click', () => {
      cokeCan.classList.remove('popped');
      void cokeCan.offsetWidth; // Trigger reflow
      cokeCan.classList.add('popped');

      playCokePopSound();
      burstCanFizz();

      if (!canPopped) {
        canPopped = true;
        if (rewardCard) {
          setTimeout(() => {
            rewardCard.style.display = 'block';
          }, 350);
        }
      }
    });
  }

  // ==================================================================
  // 6. INTERACTIVE SCRATCH CARD ENGINE
  // ==================================================================
  const scratchCanvas = document.getElementById('scratch-canvas');
  const scratchHint = document.getElementById('scratch-hint');

  if (scratchCanvas) {
    const sCtx = scratchCanvas.getContext('2d');
    const container = scratchCanvas.parentElement;

    function resizeScratchCanvas() {
      const rect = container.getBoundingClientRect();
      scratchCanvas.width = rect.width;
      scratchCanvas.height = rect.height;
      paintScratchFoil();
    }

    function paintScratchFoil() {
      const w = scratchCanvas.width;
      const h = scratchCanvas.height;

      // Metallic Silver-Rose gradient foil
      const grad = sCtx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#c7cdd4');
      grad.addColorStop(0.3, '#ffffff');
      grad.addColorStop(0.5, '#b0b6be');
      grad.addColorStop(0.8, '#ffccd5');
      grad.addColorStop(1, '#949ba4');

      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, w, h);

      // Add shimmer dots
      for (let i = 0; i < 150; i++) {
        sCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        sCtx.beginPath();
        sCtx.arc(Math.random() * w, Math.random() * h, Math.random() * 2 + 1, 0, Math.PI * 2);
        sCtx.fill();
      }

      // Add instruction label on the foil
      sCtx.fillStyle = '#2b173e';
      sCtx.font = 'bold 15px Poppins, sans-serif';
      sCtx.textAlign = 'center';
      sCtx.fillText('✨ SCRATCH HERE WITH FINGER / MOUSE ✨', w / 2, h / 2 - 8);

      sCtx.font = 'italic 12px Poppins, sans-serif';
      sCtx.fillStyle = '#e01a22';
      sCtx.fillText('Mummu Ka Secret Contract Dekhne Ke Liye...', w / 2, h / 2 + 16);
    }

    let isDrawing = false;
    let scratchedPercentage = 0;
    let autoCleared = false;

    function scratch(e) {
      if (!isDrawing || autoCleared) return;

      const rect = scratchCanvas.getBoundingClientRect();
      let clientX, clientY;

      if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      sCtx.globalCompositeOperation = 'destination-out';
      sCtx.beginPath();
      sCtx.arc(x, y, 24, 0, Math.PI * 2);
      sCtx.fill();

      checkScratched();
    }

    function checkScratched() {
      if (autoCleared) return;
      const w = scratchCanvas.width;
      const h = scratchCanvas.height;
      const imgData = sCtx.getImageData(0, 0, w, h);
      const pixels = imgData.data;
      let transparentCount = 0;

      // Sample every 4th pixel for performance
      for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] === 0) {
          transparentCount++;
        }
      }

      const totalSampled = pixels.length / 16;
      scratchedPercentage = (transparentCount / totalSampled) * 100;

      if (scratchedPercentage > 40) {
        autoCleared = true;
        scratchCanvas.style.transition = 'opacity 0.6s ease';
        scratchCanvas.style.opacity = '0';
        if (scratchHint) {
          scratchHint.innerHTML = '🎉 <strong>Contract Officially Revealed!</strong> ❤️';
          scratchHint.style.color = '#4ade80';
        }
        setTimeout(() => {
          scratchCanvas.remove();
        }, 650);
      }
    }

    // Event Listeners for scratch
    scratchCanvas.addEventListener('mousedown', () => { isDrawing = true; });
    window.addEventListener('mouseup', () => { isDrawing = false; });
    scratchCanvas.addEventListener('mousemove', scratch);

    scratchCanvas.addEventListener('touchstart', (e) => {
      isDrawing = true;
      scratch(e);
      e.preventDefault();
    }, { passive: false });

    window.addEventListener('touchend', () => { isDrawing = false; });
    scratchCanvas.addEventListener('touchmove', (e) => {
      scratch(e);
      e.preventDefault();
    }, { passive: false });

    // Initial sizing
    setTimeout(resizeScratchCanvas, 100);
    window.addEventListener('resize', resizeScratchCanvas);
  }

  // ==================================================================
  // 7. THE FAMOUS RUNAWAY "NO" BUTTON
  // ==================================================================
  const btnNo = document.getElementById('btn-no');
  const btnYes = document.getElementById('btn-yes');
  const decisionWrap = document.getElementById('decision-buttons-wrap');
  const runawayHint = document.getElementById('runaway-hint');
  const avatarFace = document.getElementById('avatar-face');
  const decisionEmoji = document.getElementById('decision-emoji');

  const noResponses = (config.noResponses && config.noResponses.length > 0)
    ? config.noResponses
    : [
        'No 😤',
        'Pakka? 🥺',
        'Ek baar aur soch lo...',
        'Mummu sach me ro dega 😭',
        'Diet Coke chilled wali dunga, pakka! 🥤',
        'Ek tight hug bhi dunga! 🫂',
        'Please na Akansha... 🥺🥺',
        'Ab toh YES bolna hi padega! 😏'
      ];

  let runawayAttempts = 0;

  function runAway() {
    runawayAttempts++;

    // Update text
    const nextText = noResponses[runawayAttempts % noResponses.length];
    const noTextEl = btnNo.querySelector('.btn-text');
    if (noTextEl) noTextEl.textContent = nextText;

    // Update puppy eyes / sad faces
    if (avatarFace) avatarFace.textContent = runawayAttempts % 2 === 0 ? '😭' : '🥺';
    if (decisionEmoji) decisionEmoji.textContent = '😭';

    // Calculate runaway movement
    const wrapRect = decisionWrap.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    const maxDeltaX = Math.min(window.innerWidth - 120, 260);
    const maxDeltaY = 90;

    const randomX = (Math.random() - 0.5) * maxDeltaX * 1.5;
    const randomY = (Math.random() - 0.5) * maxDeltaY * 2;

    const scale = Math.max(0.65, 1 - runawayAttempts * 0.05);

    btnNo.style.position = 'relative';
    btnNo.style.transform = `translate(${randomX}px, ${randomY}px) scale(${scale})`;
    btnNo.style.zIndex = '50';

    // Enlarge the YES button subtly to encourage clicking
    if (btnYes) {
      const yesScale = Math.min(1.35, 1 + runawayAttempts * 0.05);
      btnYes.style.transform = `scale(${yesScale})`;
    }

    // After 7 attempts, disable the NO button playfully
    if (runawayAttempts >= 8) {
      btnNo.style.opacity = '0';
      btnNo.style.pointerEvents = 'none';
      if (runawayHint) {
        runawayHint.innerHTML = '🚫 <strong>NO button is officially broken! Only YES is allowed! 😜❤️</strong>';
        runawayHint.style.color = '#ff4d79';
      }
    }
  }

  if (btnNo) {
    btnNo.addEventListener('mouseenter', runAway);
    btnNo.addEventListener('touchstart', (e) => {
      e.preventDefault();
      runAway();
    }, { passive: false });
    btnNo.addEventListener('click', (e) => {
      e.preventDefault();
      runAway();
    });
  }

  // ==================================================================
  // 8. THE YES CLIMAX & CELEBRATION
  // ==================================================================
  const modal = document.getElementById('celebration-modal');
  const flashOverlay = document.getElementById('flash-overlay');
  const btnCloseModal = document.getElementById('btn-close-modal');

  function triggerCelebration() {
    // 1. Flash effect
    if (flashOverlay) {
      flashOverlay.style.opacity = '0.85';
      setTimeout(() => {
        flashOverlay.style.opacity = '0';
      }, 400);
    }

    // 2. Multi-stage confetti cannon
    if (typeof confetti === 'function') {
      const count = 250;
      const defaults = {
        origin: { y: 0.65 },
        zIndex: 10001
      };

      function fire(particleRatio, opts) {
        confetti(
          Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
          })
        );
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
        colors: ['#ff4d79', '#e01a22', '#ffffff']
      });
      fire(0.2, {
        spread: 60,
        colors: ['#ffd166', '#ff758c', '#e01a22']
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45
      });
    }

    // 3. Launch Fireworks on Canvas
    launchFireworks();

    // 4. Show Celebration Modal
    setTimeout(() => {
      if (modal) modal.classList.add('show');
    }, 500);

    // 5. Update Avatar to Joy
    if (avatarFace) avatarFace.textContent = '🥰';
    if (decisionEmoji) decisionEmoji.textContent = '💖';
  }

  if (btnYes) {
    btnYes.addEventListener('click', triggerCelebration);
  }

  if (btnCloseModal && modal) {
    btnCloseModal.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  }

  // ==================================================================
  // 9. FIREWORKS CANVAS LOGIC
  // ==================================================================
  function launchFireworks() {
    const fCanvas = document.getElementById('fireworks-canvas');
    if (!fCanvas) return;
    const fCtx = fCanvas.getContext('2d');
    fCanvas.width = window.innerWidth;
    fCanvas.height = window.innerHeight;

    const fireworks = [];
    const colors = ['#ff4d79', '#ff758c', '#ffd166', '#e01a22', '#ffffff', '#4ade80'];

    for (let f = 0; f < 6; f++) {
      setTimeout(() => {
        const startX = Math.random() * (fCanvas.width * 0.7) + fCanvas.width * 0.15;
        const startY = Math.random() * (fCanvas.height * 0.45) + fCanvas.height * 0.15;
        const color = colors[Math.floor(Math.random() * colors.length)];

        for (let i = 0; i < 45; i++) {
          const angle = (Math.PI * 2 * i) / 45;
          const speed = Math.random() * 5 + 2;
          fireworks.push({
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            color: color,
            decay: Math.random() * 0.02 + 0.015
          });
        }
      }, f * 350);
    }

    let fAnimFrame;
    function renderFireworks() {
      fCtx.clearRect(0, 0, fCanvas.width, fCanvas.height);

      for (let i = fireworks.length - 1; i >= 0; i--) {
        const p = fireworks[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06; // gravity
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          fireworks.splice(i, 1);
          continue;
        }

        fCtx.save();
        fCtx.globalAlpha = p.alpha;
        fCtx.fillStyle = p.color;
        fCtx.beginPath();
        fCtx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        fCtx.fill();
        fCtx.restore();
      }

      if (fireworks.length > 0) {
        fAnimFrame = requestAnimationFrame(renderFireworks);
      } else {
        fCtx.clearRect(0, 0, fCanvas.width, fCanvas.height);
        cancelAnimationFrame(fAnimFrame);
      }
    }

    renderFireworks();
  }
});
