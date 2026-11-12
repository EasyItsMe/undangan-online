/**
 * THE ROYAL WEDDING OF SITI AMI & ABDUL AZIS
 * ULTRA-LUXURY INTERACTIVE JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. Inisialisasi Efek Percikan Api (Preloader & Cover Photo)
  initFireSparksEffect();

  // 0.1 Inisialisasi Preloader / Loading Screen
  initPreloader();

  // 1. Inisialisasi Nama Tamu dari URL Parameter (?to=Nama+Tamu)
  initGuestName();

  // 2. Inisialisasi Canvas Dual Petals & Golden Stardust
  initPetalsEffect();

  // 3. Countdown Timer Pernikahan & Khitanan (Target: 06 Des 2026)
  initCountdownTimer();

  // 4. Inisialisasi Buku Tamu & RSVP (Local Storage + Like/Aamiin)
  initGuestbook();

  // 5. Inisialisasi Scroll Spy untuk Bottom Nav
  initScrollSpy();

  // 6. Inisialisasi Generator Undangan WhatsApp
  initShareModal();

  // 7. Inisialisasi Virtual Tabur Bunga Restu
  initFlowerShower();

  // 8. Inisialisasi Scroll Progress & Back to Top Button
  initScrollProgressAndBackToTop();

  // 9. Inisialisasi Galeri Foto Fullscreen Lightbox
  initGalleryLightbox();

  // 10. Inisialisasi Video Cinema Player & Audio Sync
  initVideoPlayerSync();

  // 11. Inisialisasi Micro-interaction Ripple Effect
  initRippleEffect();

  // 12. Inisialisasi Animasi Mengetik Teks (Typewriter Effect)
  initTypewriterEffect();

  // 13. Inisialisasi AOS (Animate on Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: false,
      mirror: false,
      offset: 50
    });
  }
});

/* ==========================================================================
   1. GUEST NAME EXTRACTION (?to=Bapak+Supangat / ?guest=...)
   ========================================================================== */
function initGuestName() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestParam = urlParams.get('to') || urlParams.get('guest') || urlParams.get('u');
  
  const guestNameElement = document.getElementById('guest-name');
  const formNameInput = document.getElementById('form-name');

  if (guestParam) {
    const formattedName = decodeURIComponent(guestParam.replace(/\+/g, ' ')).trim();
    if (guestNameElement) guestNameElement.textContent = formattedName;
    if (formNameInput) formNameInput.value = formattedName;
  }
}

/* ==========================================================================
   2. COVER GATE WITH ROYAL WAX SEAL & AUDIO
   ========================================================================== */
const coverOverlay = document.getElementById('cover-overlay');
const openBtn = document.getElementById('open-invitation-btn');
const audio = document.getElementById('wedding-audio');
const musicBtn = document.getElementById('music-btn');
const diskIcon = document.getElementById('disk-icon');

let isMusicPlaying = false;
let audioCtx = null;
let synthTimer = null;

if (openBtn) {
  openBtn.addEventListener('click', () => {
    // Bunyikan nada chimes mewah
    playChimeSound();

    // Buka Kunci Layar
    document.body.classList.remove('locked');
    coverOverlay.classList.add('opened');

    // Tampilkan tombol musik floating
    if (musicBtn) {
      musicBtn.style.display = 'flex';
    }

    // Mainkan Audio (Bypass Autoplay Policy)
    playAudio();

    // Luncurkan Efek Confetti & Hujan Emas
    launchCelebrationConfetti();

    // Refresh AOS posisi elemen setelah cover terangkat
    setTimeout(() => {
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    }, 600);
  });
}

function playAudio() {
  if (!audio) return;
  
  audio.play().then(() => {
    isMusicPlaying = true;
    diskIcon.classList.add('spinning');
    stopSynthMelody();
  }).catch((err) => {
    console.warn("Audio MP3 blocked or failed, using romantic synth fallback:", err);
    startSynthMelody();
    isMusicPlaying = true;
    diskIcon.classList.add('spinning');
  });
}

function pauseAudio() {
  if (audio) audio.pause();
  stopSynthMelody();
  isMusicPlaying = false;
  diskIcon.classList.remove('spinning');
}

if (musicBtn) {
  musicBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  });
}

// Suara Chime Elegan saat Buka Undangan & Tabur Bunga
function playChimeSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    // Chord Emas Mewah (C6, E6, G6, C7)
    const chimeNotes = [1046.50, 1318.51, 1567.98, 2093.00];
    chimeNotes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.06, audioCtx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + idx * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + idx * 0.08);
      osc.stop(audioCtx.currentTime + idx * 0.08 + 1.2);
    });
  } catch (e) {
    // Ignore audio context errors
  }
}

// Gentle ambient chime synthesizer fallback (works 100% offline)
function startSynthMelody() {
  if (synthTimer) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  // Romantic pentatonic harp: F4, A4, C5, D5, E5
  const notes = [349.23, 440.00, 523.25, 587.33, 659.25, 523.25, 440.00, 392.00];
  let noteIndex = 0;

  synthTimer = setInterval(() => {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(notes[noteIndex % notes.length], audioCtx.currentTime);
      gain.gain.setValueAtTime(0.035, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.8);
      noteIndex++;
    } catch (e) {
      // Ignored
    }
  }, 1000);
}

function stopSynthMelody() {
  if (synthTimer) {
    clearInterval(synthTimer);
    synthTimer = null;
  }
}

/* ==========================================================================
   3. CELEBRATION CONFETTI
   ========================================================================== */
function launchCelebrationConfetti() {
  if (typeof confetti === 'function') {
    // Semburan kelopak emas
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.65 },
      colors: ['#d4af37', '#f3e5b8', '#ffffff', '#e91e63']
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: ['#d4af37', '#aa7e2e', '#ffffff']
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: ['#d4af37', '#aa7e2e', '#ffffff']
      });
    }, 280);
  }
}

/* ==========================================================================
   4. DUAL ENGINE: FALLING PETALS + GOLDEN STARDUST EMBERS
   ========================================================================== */
function initPetalsEffect() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  const sparkles = [];
  const TOTAL_PETALS = 20;
  const TOTAL_SPARKLES = 25;

  // Class Petal: Kelopak bunga lembut jatuh ke bawah
  class Petal {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * -height;
      this.size = Math.random() * 8 + 6;
      this.speedY = Math.random() * 1.2 + 0.8;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 1.5 - 0.75;
      this.opacity = Math.random() * 0.45 + 0.3;
      this.color = Math.random() > 0.4 ? 'rgba(235, 205, 140,' : 'rgba(255, 220, 220,';
    }
    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.01) + this.speedX;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 20) {
        this.reset();
        this.y = -10;
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color + this.opacity + ')';
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Class Sparkle: Kilauan debu emas naik perlahan ke atas
  class Sparkle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 50;
      this.radius = Math.random() * 2 + 1;
      this.speedY = Math.random() * 0.8 + 0.3;
      this.opacity = Math.random() * 0.7 + 0.2;
      this.glow = Math.random() * 8 + 4;
    }
    update() {
      this.y -= this.speedY;
      this.opacity -= 0.0015;
      if (this.y < -10 || this.opacity <= 0) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(247, 223, 165, ${this.opacity})`;
      ctx.shadowColor = '#d4af37';
      ctx.shadowBlur = this.glow;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < TOTAL_PETALS; i++) petals.push(new Petal());
  for (let i = 0; i < TOTAL_SPARKLES; i++) sparkles.push(new Sparkle());

  function animate() {
    if (coverOverlay.classList.contains('opened')) return;

    ctx.clearRect(0, 0, width, height);
    petals.forEach(p => { p.update(); p.draw(); });
    sparkles.forEach(s => { s.update(); s.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   5. COUNTDOWN TIMER (MINGGU MALAM SENIN, 06 DESEMBER 2026)
   ========================================================================== */
function initCountdownTimer() {
  const weddingDate = new Date('2026-12-06T08:00:00+07:00').getTime();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ==========================================================================
   6. RSVP & GUESTBOOK WITH LIKE / "AAMIIN" REACTION
   ========================================================================== */
const STORAGE_KEY = 'wedding_wishes_ami_azis';

const DEFAULT_WISHES = [
  {
    id: 1,
    name: 'Bpk. Supangat (Kades Sentul)',
    status: 'Hadir',
    pax: '2',
    message: 'Barakallahu lakum wa baraka alaikum wa jama\'a bainakuma fii khoir. Selamat berbahagia untuk kedua mempelai Siti Ami & Abdul Azis, serta selamat atas khitanan ananda Andiks Satria & Raditya Panca. Semoga menjadi keluarga sakinah mawaddah warahmah dan putra yang sholeh berbakti.',
    timestamp: '2 jam yang lalu',
    likes: 12
  },
  {
    id: 2,
    name: 'Bpk. Azwar Anas, S.T., M.I.Kom',
    status: 'Hadir',
    pax: '2',
    message: 'Selamat menempuh hidup baru untuk Ami dan Azis. Semoga senantiasa diberkahi rezeki dan kebahagiaan oleh Allah SWT. Serta doa terbaik untuk ananda Andiks & Raditya semoga tumbuh menjadi anak sholeh yang membanggakan keluarga dan bangsa.',
    timestamp: '4 jam yang lalu',
    likes: 8
  },
  {
    id: 3,
    name: 'Keluarga Kadingding & Ujungtebu',
    status: 'Hadir',
    pax: '4',
    message: 'Alhamdulillah, selamat untuk Kang Azis & Neng Ami. Semoga lancar acaranya dari awal hingga selesai di Kp. Buah Gede. Aamiin ya Rabbal Alamin.',
    timestamp: '1 hari yang lalu',
    likes: 6
  },
  {
    id: 4,
    name: 'Keluarga Besar Kp. Dumus & Pematang',
    status: 'Hadir',
    pax: '3',
    message: 'Selamat atas pernikahan Ami & Azis serta khitanan Andiks Satria & Raditya Panca. Semoga Allah SWT melimpahkan berkah dan kebahagiaan berlimpah untuk seluruh keluarga besar.',
    timestamp: '1 hari yang lalu',
    likes: 9
  }
];

function initGuestbook() {
  const form = document.getElementById('rsvp-form');
  const countEl = document.getElementById('wishes-count');
  const countHadirEl = document.getElementById('count-hadir');

  let wishes = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (!wishes || !Array.isArray(wishes) || wishes.length === 0) {
    wishes = DEFAULT_WISHES;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
  }

  window.renderWishes = function() {
    const wishesList = document.getElementById('wishes-list');
    if (!wishesList) return;
    wishesList.innerHTML = '';

    let hadirCount = 0;

    wishes.forEach((wish) => {
      if (wish.status === 'Hadir') hadirCount++;

      let badgeClass = 'hadir';
      let statusText = 'Hadir';
      if (wish.status === 'Belum Pasti') {
        badgeClass = 'ragu';
        statusText = 'Ragu-ragu';
      } else if (wish.status === 'Tidak Hadir') {
        badgeClass = 'tidak-hadir';
        statusText = 'Tidak Hadir';
      }

      const item = document.createElement('div');
      item.className = 'wish-item';
      item.innerHTML = `
        <div class="wish-meta">
          <div class="wish-author">
            <i class="fa-solid fa-circle-user" style="color: var(--gold-primary);"></i>
            <span>${escapeHTML(wish.name)}</span>
            <span class="wish-status-pill ${badgeClass}">${statusText}</span>
          </div>
          <span class="wish-time">${wish.timestamp || 'Baru saja'}</span>
        </div>
        <p class="wish-message">${escapeHTML(wish.message)}</p>
        <div class="wish-footer">
          <button class="btn-aamiin" onclick="likeWish(${wish.id})">
            <i class="fa-solid fa-heart"></i> Aamiin <span id="like-count-${wish.id}">${wish.likes || 1}</span>
          </button>
        </div>
      `;
      wishesList.appendChild(item);
    });

    if (countEl) countEl.textContent = wishes.length;
    if (countHadirEl) countHadirEl.textContent = `${hadirCount} Hadir`;
  };

  window.renderWishes();

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const status = document.getElementById('form-status').value;
      const pax = document.getElementById('form-pax').value;
      const message = document.getElementById('form-message').value.trim();

      if (!name || !status || !message) {
        showToast('Mohon lengkapi semua kolom yang wajib diisi!');
        return;
      }

      const newWish = {
        id: Date.now(),
        name,
        status,
        pax,
        message,
        timestamp: 'Baru saja',
        likes: 1
      };

      wishes.unshift(newWish);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));

      window.renderWishes();
      form.reset();

      playChimeSound();
      showToast('Terima kasih atas doa restu & konfirmasi kehadiran Anda!');
    });
  }
}

// Like / "Aamiin" Reaction Handler
window.likeWish = function(id) {
  let wishes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_WISHES;
  const wish = wishes.find(w => w.id === id);
  if (wish) {
    wish.likes = (wish.likes || 1) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));

    const counter = document.getElementById(`like-count-${id}`);
    if (counter) counter.textContent = wish.likes;

    // Small celebratory confetti burst
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 15,
        spread: 30,
        origin: { y: 0.8 },
        colors: ['#e91e63', '#d4af37']
      });
    }
  }
};

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

/* ==========================================================================
   7. VIRTUAL TABUR BUNGA RESTU (DIGITAL FLOWER SHOWER)
   ========================================================================== */
function initFlowerShower() {
  const flowerBtn = document.getElementById('flower-shower-btn');
  if (!flowerBtn) return;

  flowerBtn.addEventListener('click', () => {
    playChimeSound();

    if (typeof confetti === 'function') {
      // Semburan bunga & hati merah muda dan emas
      confetti({
        particleCount: 65,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#e91e63', '#ff80ab', '#d4af37', '#ffffff', '#ffd54f']
      });

      setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 60,
          origin: { x: 0.1, y: 0.7 },
          colors: ['#e91e63', '#d4af37']
        });
        confetti({
          particleCount: 40,
          angle: 120,
          spread: 60,
          origin: { x: 0.9, y: 0.7 },
          colors: ['#e91e63', '#d4af37']
        });
      }, 250);
    }

    showToast('🌸 Doa restu & taburan bunga Anda telah terkirim! Terima kasih.');
  });
}

/* ==========================================================================
   8. SALIN KE CLIPBOARD & TOAST NOTIFICATION
   ========================================================================== */
function copyToClipboard(text, message = 'Berhasil disalin ke papan klip!') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(message);
    }).catch(() => {
      fallbackCopy(text, message);
    });
  } else {
    fallbackCopy(text, message);
  }
}

function fallbackCopy(text, message) {
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  tempInput.style.position = 'fixed';
  tempInput.style.left = '-9999px';
  document.body.appendChild(tempInput);
  tempInput.focus();
  tempInput.select();
  try {
    document.execCommand('copy');
    showToast(message);
  } catch (err) {
    showToast('Gagal menyalin teks');
  }
  document.body.removeChild(tempInput);
}

let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   9. GOOGLE CALENDAR LINK GENERATOR
   ========================================================================== */
function addToGoogleCalendar(title, startDatetime, endDatetime, location, details) {
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const url = `${baseUrl}&text=${encodeURIComponent(title)}&dates=${startDatetime}/${endDatetime}&location=${encodeURIComponent(location)}&details=${encodeURIComponent(details)}`;
  window.open(url, '_blank');
}

/* ==========================================================================
   10. BOTTOM NAVIGATION SCROLL SPY
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.bottom-nav .nav-item');

  if (sections.length === 0 || navItems.length === 0) return;

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navItems.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   11. WHATSAPP INVITATION GENERATOR MODAL
   ========================================================================== */
function initShareModal() {
  const openShareBtn = document.getElementById('open-share-modal-btn');
  const shareGuestInput = document.getElementById('input-share-guest');

  if (openShareBtn) {
    openShareBtn.addEventListener('click', () => {
      openShareModal();
    });
  }

  if (shareGuestInput) {
    shareGuestInput.addEventListener('input', () => {
      updateSharePreview();
    });
  }

  updateSharePreview();
}

function openShareModal() {
  const modal = document.getElementById('share-modal');
  if (modal) {
    modal.classList.add('active');
    updateSharePreview();
  }
}

function closeShareModal(event) {
  if (event && event.target && event.target.closest('.modal-card-dark') && !event.target.classList.contains('modal-close-btn')) {
    return;
  }
  const modal = document.getElementById('share-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function updateSharePreview() {
  const guestInput = document.getElementById('input-share-guest');
  const previewTextarea = document.getElementById('share-preview-text');
  const btnSendWA = document.getElementById('btn-send-whatsapp');

  const guestName = (guestInput && guestInput.value.trim()) ? guestInput.value.trim() : 'Bapak/Ibu/Sahabat';
  
  const currentBase = window.location.href.split('?')[0];
  const inviteUrl = `${currentBase}?to=${encodeURIComponent(guestName)}`;

  const message = `Kepada Yth.
Bapak/Ibu/Saudara/i *${guestName}*

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk menghadiri acara resepsi pernikahan kami serta khitanan putra kami:

*The Royal Wedding of Siti Ami & Abdul Azis*
*Serta Walimatul Khitan: Andiks Satria & Raditya Panca*

🗓 *Minggu Malam Senin, 06 Desember 2026* (26 Jumadil Akhir 1448 H)
⏰ Akad Nikah: 08.00 - 09.00 WIB
⏰ Resepsi & Khitanan: 09.00 WIB s/d Selesai
📍 *Bertempat di Kediaman Mempelai Wanita:*
Kp. Buah Gede RT. 009 RW. 005 Ds. Sentul Kec. Kragilan Kab. Serang - Banten

Untuk info detail rangkaian acara, susunan rundown, panduan busana, peta lokasi, serta konfirmasi kehadiran (RSVP), silakan kunjungi tautan undangan digital resmi kami:
${inviteUrl}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih.
Wassalamu'alaikum Warahmatullahi Wabarakatuh.
- Ami & Azis -`;

  if (previewTextarea) {
    previewTextarea.value = message;
  }

  if (btnSendWA) {
    btnSendWA.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  }
}

function copyShareText() {
  const previewTextarea = document.getElementById('share-preview-text');
  if (!previewTextarea) return;

  copyToClipboard(previewTextarea.value, 'Format pesan WhatsApp berhasil disalin!');
}

/* ==========================================================================
   12. TABS CONTROLLER (PENGANGKAT HAJAT & TURUT MENGUNDANG)
   ========================================================================== */
function switchFamilyTab(tabName) {
  const tabWanita = document.getElementById('tab-wanita');
  const tabPria = document.getElementById('tab-pria');
  const buttons = document.querySelectorAll('.family-tabs-row .family-tab-btn');

  if (tabName === 'wanita') {
    if (tabWanita) tabWanita.classList.add('active');
    if (tabPria) tabPria.classList.remove('active');
    if (buttons[0]) buttons[0].classList.add('active');
    if (buttons[1]) buttons[1].classList.remove('active');
  } else if (tabName === 'pria') {
    if (tabPria) tabPria.classList.add('active');
    if (tabWanita) tabWanita.classList.remove('active');
    if (buttons[1]) buttons[1].classList.add('active');
    if (buttons[0]) buttons[0].classList.remove('active');
  }
}

/* ==========================================================================
   13. PRELOADER & SCREEN TRANSITION
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('preloader-progress-bar');
  if (!preloader) return;

  const startTime = Date.now();
  const MIN_DISPLAY_MS = 1400; // Minimal 1.4 detik agar animasi monogram & percikan api dinikmati
  let progress = 10;

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 18) + 8;
    if (progress > 95) progress = 95;
    if (progressBar) progressBar.style.width = progress + '%';
  }, 120);

  const hidePreloader = () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

    setTimeout(() => {
      clearInterval(interval);
      if (progressBar) progressBar.style.width = '100%';
      setTimeout(() => {
        preloader.classList.add('fade-out');
        if (typeof window.startCoverPhotoRingSparks === 'function') {
          window.startCoverPhotoRingSparks();
        }
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 800);
      }, 350);
    }, remaining);
  };

  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
    setTimeout(hidePreloader, 3200); // Safety fallback timeout
  }
}

/* ==========================================================================
   14. SCROLL PROGRESS BAR & BACK TO TOP BUTTON
   ========================================================================== */
function initScrollProgressAndBackToTop() {
  const progressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (backToTopBtn) {
      if (scrollTop > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
window.scrollToTop = scrollToTop;

/* ==========================================================================
   15. FULLSCREEN PHOTO LIGHTBOX GALLERY
   ========================================================================== */
const GALLERY_ITEMS = [
  {
    src: 'assets/gallery-1.jpg',
    caption: 'Tatapan Penuh Makna & Bahagia — Siti Ami & Abdul Azis'
  },
  {
    src: 'assets/gallery-2.jpg',
    caption: 'Dalam Senyuman & Harapan Bersama Menuju Akad Suci'
  },
  {
    src: 'assets/gallery-3.jpg',
    caption: 'Busana Anggun Klasik & Kehangatan Dua Jiwa'
  },
  {
    src: 'assets/gallery-4.jpg',
    caption: 'Langkah Awal Meniti Janji Setia Seumur Hidup'
  },
  {
    src: 'assets/gallery-5.jpg',
    caption: 'Doa dan Ketulusan Hati Dalam Ikatan Suci'
  },
  {
    src: 'assets/gallery-6.jpg',
    caption: 'The Royal Wedding Moments — Selamanya Berdampingan'
  }
];

let currentLightboxIndex = 0;
let touchStartX = 0;
let touchEndX = 0;

function initGalleryLightbox() {
  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('gallery-lightbox');
    if (!lightbox || !lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      prevLightbox();
    } else if (e.key === 'ArrowRight') {
      nextLightbox();
    }
  });

  // Mobile Touch Swipe Navigation
  const lightbox = document.getElementById('gallery-lightbox');
  if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          prevLightbox();
        } else {
          nextLightbox();
        }
      }
    }, { passive: true });
  }
}

function openLightbox(index) {
  if (typeof index !== 'number' || index < 0 || index >= GALLERY_ITEMS.length) {
    index = 0;
  }
  currentLightboxIndex = index;
  updateLightboxContent();

  const lightbox = document.getElementById('gallery-lightbox');
  if (lightbox) {
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}
window.openLightbox = openLightbox;

function closeLightbox(event) {
  if (event && event.target && event.target.closest('.lightbox-content-box') && !event.target.classList.contains('lightbox-close-btn')) {
    return;
  }
  const lightbox = document.getElementById('gallery-lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}
window.closeLightbox = closeLightbox;

function prevLightbox(event) {
  if (event) event.stopPropagation();
  currentLightboxIndex = (currentLightboxIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
  updateLightboxContent();
}
window.prevLightbox = prevLightbox;

function nextLightbox(event) {
  if (event) event.stopPropagation();
  currentLightboxIndex = (currentLightboxIndex + 1) % GALLERY_ITEMS.length;
  updateLightboxContent();
}
window.nextLightbox = nextLightbox;

function updateLightboxContent() {
  const item = GALLERY_ITEMS[currentLightboxIndex];
  const imgEl = document.getElementById('lightbox-img');
  const captionEl = document.getElementById('lightbox-caption');
  const counterEl = document.getElementById('lightbox-counter');

  if (imgEl && item) {
    imgEl.style.opacity = '0.3';
    imgEl.src = item.src;
    imgEl.alt = item.caption;
    imgEl.onload = () => {
      imgEl.style.opacity = '1';
    };
  }
  if (captionEl && item) {
    captionEl.textContent = item.caption;
  }
  if (counterEl) {
    counterEl.textContent = `${currentLightboxIndex + 1} / ${GALLERY_ITEMS.length}`;
  }
}

/* ==========================================================================
   16. CINEMA VIDEO PLAYER & AUDIO SYNC CONTROLLER
   ========================================================================== */
let wasBackgroundMusicPlayingBeforeVideo = false;

function initVideoPlayerSync() {
  const video = document.getElementById('prewedding-video-player');
  if (!video) return;

  video.addEventListener('play', () => {
    const playOverlay = document.getElementById('video-play-overlay');
    const toggleBtnIcon = document.querySelector('#btn-toggle-video-ctrl i');
    if (playOverlay) playOverlay.classList.add('hidden');
    if (toggleBtnIcon) toggleBtnIcon.className = 'fa-solid fa-pause';

    // Pause background wedding music while watching video
    if (isMusicPlaying) {
      wasBackgroundMusicPlayingBeforeVideo = true;
      pauseAudio();
    }
  });

  video.addEventListener('pause', () => {
    const playOverlay = document.getElementById('video-play-overlay');
    const toggleBtnIcon = document.querySelector('#btn-toggle-video-ctrl i');
    if (playOverlay) playOverlay.classList.remove('hidden');
    if (toggleBtnIcon) toggleBtnIcon.className = 'fa-solid fa-play';

    // Resume background music if it was playing before
    if (wasBackgroundMusicPlayingBeforeVideo && !isMusicPlaying) {
      playAudio();
      wasBackgroundMusicPlayingBeforeVideo = false;
    }
  });

  video.addEventListener('ended', () => {
    const playOverlay = document.getElementById('video-play-overlay');
    const toggleBtnIcon = document.querySelector('#btn-toggle-video-ctrl i');
    if (playOverlay) playOverlay.classList.remove('hidden');
    if (toggleBtnIcon) toggleBtnIcon.className = 'fa-solid fa-rotate-left';

    if (wasBackgroundMusicPlayingBeforeVideo && !isMusicPlaying) {
      playAudio();
      wasBackgroundMusicPlayingBeforeVideo = false;
    }
  });
}

function togglePreweddingVideo() {
  const video = document.getElementById('prewedding-video-player');
  if (!video) return;

  if (video.paused || video.ended) {
    video.play().catch(err => {
      console.warn("Video playback prevented:", err);
    });
  } else {
    video.pause();
  }
}
window.togglePreweddingVideo = togglePreweddingVideo;

function togglePreweddingMute() {
  const video = document.getElementById('prewedding-video-player');
  const muteBtnIcon = document.querySelector('#btn-toggle-video-mute i');
  if (!video) return;

  video.muted = !video.muted;
  if (muteBtnIcon) {
    muteBtnIcon.className = video.muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
  }
}
window.togglePreweddingMute = togglePreweddingMute;

/* ==========================================================================
   17. PERSONALIZED QR CODE MODAL FOR GUESTS
   ========================================================================== */
function openQRModal() {
  const modal = document.getElementById('qr-modal');
  const guestDisplay = document.getElementById('qr-guest-display');
  const qrImg = document.getElementById('qr-code-image');
  
  const guestNameEl = document.getElementById('guest-name');
  const guestName = (guestNameEl ? guestNameEl.textContent : 'Tamu Undangan').trim() || 'Tamu Undangan';

  if (guestDisplay) {
    guestDisplay.textContent = guestName;
  }

  // Generate personalized check-in data URL
  const qrData = encodeURIComponent(`WEDDING: Siti Ami & Abdul Azis | GUEST: ${guestName} | DATE: 06 Des 2026 | LOC: Kp. Buah Gede`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrData}&color=1a1612&bgcolor=d4af37`;

  if (qrImg) {
    qrImg.src = qrUrl;
    qrImg.alt = `QR Code Kehadiran ${guestName}`;
  }

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}
window.openQRModal = openQRModal;

function closeQRModal(event) {
  if (event && event.target && event.target.closest('.modal-card-dark') && !event.target.classList.contains('modal-close-btn') && !event.target.classList.contains('btn-send-wa')) {
    return;
  }
  const modal = document.getElementById('qr-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}
window.closeQRModal = closeQRModal;

function downloadQRCode() {
  const qrImg = document.getElementById('qr-code-image');
  if (!qrImg || !qrImg.src) return;

  const link = document.createElement('a');
  link.href = qrImg.src;
  link.download = `QR-Undangan-Ami-Azis.png`;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Mengunduh QR Code Undangan...');
}
window.downloadQRCode = downloadQRCode;

/* ==========================================================================
   18. ADMIN DASHBOARD & 1-CLICK CSV/EXCEL DATA EXPORT
   ========================================================================== */
function openAdminModal() {
  const modal = document.getElementById('admin-modal');
  renderAdminRSVPTable();
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}
window.openAdminModal = openAdminModal;

function closeAdminModal(event) {
  if (event && event.target && event.target.closest('.modal-card-dark') && !event.target.classList.contains('modal-close-btn')) {
    return;
  }
  const modal = document.getElementById('admin-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}
window.closeAdminModal = closeAdminModal;

function renderAdminRSVPTable() {
  const wishes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_WISHES;
  const tbody = document.getElementById('admin-rsvp-table-body');

  const totalEl = document.getElementById('admin-total-rsvp');
  const hadirEl = document.getElementById('admin-total-hadir');
  const raguEl = document.getElementById('admin-total-ragu');
  const tidakEl = document.getElementById('admin-total-tidak');
  const paxEl = document.getElementById('admin-total-pax');

  let countHadir = 0;
  let countRagu = 0;
  let countTidak = 0;
  let totalPax = 0;

  if (tbody) tbody.innerHTML = '';

  wishes.forEach((item, index) => {
    const paxNum = parseInt(item.pax, 10) || 1;
    if (item.status === 'Hadir') {
      countHadir++;
      totalPax += paxNum;
    } else if (item.status === 'Belum Pasti') {
      countRagu++;
      totalPax += Math.ceil(paxNum * 0.5);
    } else {
      countTidak++;
    }

    if (tbody) {
      const tr = document.createElement('tr');
      let statusBadge = `<span class="badge badge-hadir">Hadir</span>`;
      if (item.status === 'Belum Pasti') {
        statusBadge = `<span class="badge badge-ragu">Ragu-ragu</span>`;
      } else if (item.status === 'Tidak Hadir') {
        statusBadge = `<span class="badge badge-tidak">Tidak Hadir</span>`;
      }

      tr.innerHTML = `
        <td class="text-center">${index + 1}</td>
        <td><strong>${escapeHTML(item.name)}</strong></td>
        <td>${statusBadge}</td>
        <td class="text-center">${paxNum} org</td>
        <td class="table-msg-cell" title="${escapeHTML(item.message)}">${escapeHTML(item.message)}</td>
        <td class="table-time-cell">${item.timestamp || '-'}</td>
        <td class="text-center">
          <button class="btn-delete-row" onclick="deleteWish(${item.id})" title="Hapus Data">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    }
  });

  if (totalEl) totalEl.textContent = wishes.length;
  if (hadirEl) hadirEl.textContent = countHadir;
  if (raguEl) raguEl.textContent = countRagu;
  if (tidakEl) tidakEl.textContent = countTidak;
  if (paxEl) paxEl.textContent = totalPax;
}
window.renderAdminRSVPTable = renderAdminRSVPTable;

function deleteWish(id) {
  if (!confirm('Apakah Anda yakin ingin menghapus data ucapan / konfirmasi ini?')) return;

  let wishes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_WISHES;
  wishes = wishes.filter(w => w.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));

  renderAdminRSVPTable();
  if (typeof window.renderWishes === 'function') {
    window.renderWishes();
  }
  showToast('Data berhasil dihapus dari daftar RSVP.');
}
window.deleteWish = deleteWish;

function exportRSVPToCSV() {
  const wishes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_WISHES;
  if (!wishes || wishes.length === 0) {
    showToast('Belum ada data RSVP untuk diekspor!');
    return;
  }

  // CSV Header
  const headers = ['No', 'Nama Tamu', 'Konfirmasi Kehadiran', 'Jumlah Pax', 'Ucapan & Doa', 'Waktu Kirim', 'Jumlah Aamiin'];
  
  // Format rows with double quotes escaping
  const csvRows = [headers.join(',')];

  wishes.forEach((w, idx) => {
    const row = [
      idx + 1,
      `"${(w.name || '').replace(/"/g, '""')}"`,
      `"${(w.status || '').replace(/"/g, '""')}"`,
      w.pax || 1,
      `"${(w.message || '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`,
      `"${(w.timestamp || '').replace(/"/g, '""')}"`,
      w.likes || 0
    ];
    csvRows.push(row.join(','));
  });

  // Include UTF-8 BOM for Microsoft Excel compatibility
  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Data_RSVP_Pernikahan_Ami_Azis_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('Data RSVP berhasil diekspor ke format Excel (.CSV)!');
}
window.exportRSVPToCSV = exportRSVPToCSV;

/* ==========================================================================
   19. BUTTON RIPPLE EFFECT MICRO-INTERACTIONS
   ========================================================================== */
function initRippleEffect() {
  const rippleTargets = document.querySelectorAll('.btn-ripple, .btn-gold, .btn-open-invitation, .btn-action-primary, .btn-action-outline, .btn-copy, .btn-calendar, .btn-send-wa, .btn-export-excel');

  rippleTargets.forEach((btn) => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple-wave');

      const existingRipple = this.querySelector('.ripple-wave');
      if (existingRipple) {
        existingRipple.remove();
      }

      this.appendChild(circle);

      setTimeout(() => {
        circle.remove();
      }, 650);
    });
  });
}

/* ==========================================================================
   20. FIRE SPARKS & EMBERS ENGINE (EFEK PERCIKAN API MEWAH)
   ========================================================================== */
class FireSpark {
  constructor(x, y, vx, vy, colorType = 'spark') {
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;
    this.vx = vx;
    this.vy = vy;
    this.colorType = colorType; // 'spark' or 'ember'
    this.life = 0;
    this.maxLife = colorType === 'ember' ? Math.random() * 40 + 35 : Math.random() * 26 + 14;
    this.size = colorType === 'ember' ? Math.random() * 2.4 + 1.2 : Math.random() * 2.2 + 1.0;
    this.gravity = colorType === 'ember' ? -0.12 : 0.09; // Embers float upward gently
    this.friction = colorType === 'ember' ? 0.985 : 0.935;
    this.alpha = 1;
  }

  update() {
    this.prevX = this.x;
    this.prevY = this.y;
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;

    if (this.colorType === 'ember') {
      this.vx += (Math.random() - 0.5) * 0.25;
    }

    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    this.alpha = Math.max(0, 1 - (this.life / this.maxLife));
    return this.life < this.maxLife;
  }

  draw(ctx) {
    const progress = this.life / this.maxLife;
    ctx.save();

    // Gradasi Warna Api: Putih Kilat Panas -> Emas Terang -> Oranye Berpijar -> Merah Bara
    let r, g, b;
    if (progress < 0.2) {
      r = 255;
      g = 255;
      b = Math.floor(210 + (1 - progress * 5) * 45); // Putih kekuningan
    } else if (progress < 0.55) {
      r = 255;
      g = Math.floor(190 - (progress - 0.2) * 200); // Emas ke oranye terang
      b = 25;
    } else {
      r = 255;
      g = Math.floor(75 * (1 - progress)); // Oranye ke merah bara
      b = 0;
    }

    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${this.alpha})`;
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.alpha})`;
    ctx.shadowBlur = this.colorType === 'ember' ? 8 : 6;
    ctx.shadowColor = `rgba(255, 145, 0, ${this.alpha * 0.9})`;

    if (this.colorType === 'spark') {
      // Ekor garis percikan api dinamis (Streak)
      ctx.lineWidth = Math.max(0.7, this.size * this.alpha);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(this.prevX, this.prevY);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();

      // Titik pijar ujung percikan
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.55, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Bara api lembut melayang
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * (1 - progress * 0.4), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

function initFireSparksEffect() {
  initPreloaderSparks();
  initCoverPhotoSparks();
}

/**
 * 20.1 PERCIKAN API PADA PRELOADER (CINCIN MONOGRAM A & A)
 */
function initPreloaderSparks() {
  const canvas = document.getElementById('preloader-sparks-canvas');
  const preloader = document.getElementById('preloader');
  if (!canvas || !preloader) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const sparks = [];
  let animId = null;
  let angle = 0;

  function render() {
    if (preloader.classList.contains('fade-out') && sparks.length === 0) {
      if (animId) cancelAnimationFrame(animId);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // Titik pusat cincin preloader
    const ringEl = document.querySelector('.preloader-spinner-ring');
    let centerX = width / 2;
    let centerY = height / 2 - 25;
    let radius = 42;

    if (ringEl) {
      const rect = ringEl.getBoundingClientRect();
      centerX = rect.left + rect.width / 2;
      centerY = rect.top + rect.height / 2;
      radius = rect.width / 2;
    }

    angle += 0.085;

    // Semburkan percikan api dari cincin yang sedang berputar
    if (!preloader.classList.contains('fade-out')) {
      for (let i = 0; i < 3; i++) {
        const emitAngle = angle + (Math.random() - 0.5) * 0.45;
        const spawnX = centerX + Math.cos(emitAngle) * radius;
        const spawnY = centerY + Math.sin(emitAngle) * radius;
        const speed = Math.random() * 4.2 + 2.0;
        const burstAngle = emitAngle + (Math.random() - 0.5) * 0.9;
        const vx = Math.cos(burstAngle) * speed;
        const vy = Math.sin(burstAngle) * speed - 0.6;
        sparks.push(new FireSpark(spawnX, spawnY, vx, vy, 'spark'));
      }

      // Bara api melayang ke atas
      if (Math.random() < 0.45) {
        const emberAngle = Math.random() * Math.PI * 2;
        const spawnX = centerX + Math.cos(emberAngle) * (radius * 0.9);
        const spawnY = centerY + Math.sin(emberAngle) * (radius * 0.9);
        sparks.push(new FireSpark(spawnX, spawnY, (Math.random() - 0.5) * 1.4, -(Math.random() * 2.0 + 0.8), 'ember'));
      }
    }

    // Update & gambar semua partikel
    for (let i = sparks.length - 1; i >= 0; i--) {
      if (sparks[i].update()) {
        sparks[i].draw(ctx);
      } else {
        sparks.splice(i, 1);
      }
    }

    animId = requestAnimationFrame(render);
  }

  animId = requestAnimationFrame(render);
}

/**
 * 20.2 PERCIKAN API PADA FOTO UTAMA HALAMAN PERTAMA (COVER GOLDEN RING)
 * Percikan api HANYA menyala saat cincin berputar/memuat (3 detik), 
 * dan HILANG SEPENUHNYA saat loading lingkaran selesai.
 */
function initCoverPhotoSparks() {
  const canvas = document.getElementById('cover-sparks-canvas');
  const ringWrapper = document.querySelector('.sparkling-ring-wrapper');
  if (!canvas || !ringWrapper) return;

  const ctx = canvas.getContext('2d');
  const sparks = [];
  let animId = null;
  let ringStartTime = null;
  const RING_DURATION_MS = 3000; // Tepat 3.0 detik sesuai animasi CSS drawRing

  function resize() {
    const rect = ringWrapper.getBoundingClientRect();
    const padding = 50;
    canvas.width = rect.width + padding * 2;
    canvas.height = rect.height + padding * 2;
  }

  resize();
  window.addEventListener('resize', resize);

  function startCoverPhotoRingSparks() {
    // Sinkronkan ulang animasi garis emas SVG
    const ringComet = document.querySelector('.ring-comet');
    if (ringComet) {
      ringComet.style.animation = 'none';
      void ringComet.offsetWidth; // Force reflow
      ringComet.style.animation = 'drawRing 3s ease-out forwards';
    }

    ringStartTime = performance.now();
    if (!animId) {
      animId = requestAnimationFrame(render);
    }
  }

  window.startCoverPhotoRingSparks = startCoverPhotoRingSparks;

  // Jika preloader sudah selesai atau tidak ada, jalankan langsung setelah 300ms
  const preloader = document.getElementById('preloader');
  if (!preloader || preloader.style.display === 'none' || preloader.classList.contains('fade-out')) {
    setTimeout(startCoverPhotoRingSparks, 300);
  }

  function render(now) {
    if (!ringStartTime) ringStartTime = now;
    const elapsed = now - ringStartTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = (canvas.width - 100) / 2 * 0.94;

    // KETIKA LOADING LINGKARAN SEDANG BERJALAN (0 s/d 3.0 detik)
    if (elapsed < RING_DURATION_MS) {
      // Easing out matching CSS drawRing
      const linearP = elapsed / RING_DURATION_MS;
      const easeOutP = 1 - Math.pow(1 - linearP, 2);

      // Posisi kepala lingkaran yang sedang digambar (mulai dari jam 12: -PI/2)
      const currentAngle = -Math.PI / 2 + easeOutP * (Math.PI * 2);

      // Semburan percikan api keluar dari kepala lingkaran yang bergerak
      for (let i = 0; i < 4; i++) {
        const jitter = currentAngle + (Math.random() - 0.5) * 0.2;
        const spawnX = centerX + Math.cos(jitter) * radius;
        const spawnY = centerY + Math.sin(jitter) * radius;

        // Semprot ke arah berlawanan jarum jam dan memancar ke luar
        const sprayAngle = jitter + Math.PI + (Math.random() - 0.5) * 1.2;
        const speed = Math.random() * 4.2 + 1.8;
        const vx = Math.cos(sprayAngle) * speed + Math.cos(jitter) * 1.0;
        const vy = Math.sin(sprayAngle) * speed + Math.sin(jitter) * 1.0 - 0.5;

        sparks.push(new FireSpark(spawnX, spawnY, vx, vy, 'spark'));
      }

      // Percikan halus acak sepanjang busur yang telah terbentuk
      if (Math.random() < 0.4) {
        const pastAngle = -Math.PI / 2 + Math.random() * easeOutP * (Math.PI * 2);
        const spawnX = centerX + Math.cos(pastAngle) * radius;
        const spawnY = centerY + Math.sin(pastAngle) * radius;
        sparks.push(new FireSpark(spawnX, spawnY, (Math.random() - 0.5) * 2, -Math.random() * 1.5, 'spark'));
      }
    }
    // KETIKA LOADING LINGKARAN TELAH SELESAI (elapsed >= 3.0 detik):
    // EMISI PERCIKAN API BERHENTI TOTAL! Partikel tersisa akan memudar dan hilang.

    // Batasi partikel
    if (sparks.length > 120) {
      sparks.splice(0, sparks.length - 120);
    }

    // Update dan gambar partikel
    for (let i = sparks.length - 1; i >= 0; i--) {
      if (sparks[i].update()) {
        sparks[i].draw(ctx);
      } else {
        sparks.splice(i, 1);
      }
    }

    // KETIKA SEMUA PERCIKAN TELAH MATI & LOADING LINGKARAN SELESAI:
    // Hentikan requestAnimationFrame, bersihkan kanvas sepenuhnya!
    if (elapsed >= RING_DURATION_MS && sparks.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animId);
      animId = null;
      return;
    }

    animId = requestAnimationFrame(render);
  }
}

/* ==========================================================================
   21. TYPEWRITER ANIMATION ENGINE (KHUSUS 3 BAGIAN YANG DITENTUKAN)
   ========================================================================== */
function initTypewriterEffect() {
  /**
   * Hanya diaktifkan khusus pada 3 bagian kata-kata sesuai permintaan pengguna:
   * 1. Blok Pembuka: Sambutan formal & Ayat QS. Ar-Rum: 21 (Screenshot 3)
   * 2. Doa Syukuran Khitanan Putra Kami (Screenshot 2)
   * 3. Blok Penutup: Ucapan Terima Kasih (Screenshot 1)
   */
  function observeBlock(triggerEl, items) {
    if (!triggerEl) return;

    // Simpan teks asli semua item
    items.forEach(el => {
      if (el && !el.hasAttribute('data-typewriter-orig')) {
        el.setAttribute('data-typewriter-orig', el.innerHTML.trim());
        el.style.minHeight = el.offsetHeight > 0 ? `${el.offsetHeight}px` : 'auto';
        el.innerHTML = '';
      }
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !triggerEl.hasAttribute('data-typed')) {
          triggerEl.setAttribute('data-typed', 'true');
          obs.unobserve(triggerEl);

          // Jalankan animasi pengetikan berurutan (sequential)
          let currentIndex = 0;
          function playNext() {
            if (currentIndex < items.length) {
              const el = items[currentIndex];
              currentIndex++;
              if (el) {
                const fullHtml = el.getAttribute('data-typewriter-orig');
                const textLen = el.textContent ? el.textContent.length : 100;
                const speed = textLen > 180 ? 12 : (textLen > 80 ? 17 : 24);
                typeHtmlElement(el, fullHtml, speed, playNext);
              } else {
                playNext();
              }
            }
          }

          playNext();
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    observer.observe(triggerEl);
  }

  // 1. Blok Sambutan Formal & QS. Ar-Rum 21 (Screenshot 3)
  const greetingBlock = document.querySelector('.greeting-text-block');
  const greetingP1 = document.querySelector('.greeting-paragraph');
  const greetingP2 = document.querySelector('.greeting-ayah');
  if (greetingBlock && (greetingP1 || greetingP2)) {
    observeBlock(greetingBlock, [greetingP1, greetingP2].filter(Boolean));
  }

  // 2. Doa Syukuran Khitanan Putra Kami (Screenshot 2)
  const khitanQuote = document.querySelector('.khitan-doa-quote');
  if (khitanQuote) {
    observeBlock(khitanQuote, [khitanQuote]);
  }

  // 3. Blok Ucapan Terima Kasih Penutup (Screenshot 1)
  const thankyouBlock = document.querySelector('.video-thankyou-block');
  const thankyouP1 = document.querySelector('.thankyou-paragraph-1');
  const thankyouP2 = document.querySelector('.thankyou-paragraph-2');
  if (thankyouBlock && (thankyouP1 || thankyouP2)) {
    observeBlock(thankyouBlock, [thankyouP1, thankyouP2].filter(Boolean));
  }
}

/**
 * Helper: Mengetik teks karakter per karakter dengan dukungan tag HTML (<br>, <strong>, dsb)
 */
function typeHtmlElement(el, fullHtml, speed = 20, callback) {
  el.innerHTML = '';
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  cursor.innerHTML = '|';
  el.appendChild(cursor);

  let i = 0;
  let currentHtml = '';

  function step() {
    if (i < fullHtml.length) {
      if (fullHtml[i] === '<') {
        // Lewati tag HTML langsung tanpa dieja satu per satu
        const tagEnd = fullHtml.indexOf('>', i);
        if (tagEnd !== -1) {
          currentHtml += fullHtml.substring(i, tagEnd + 1);
          i = tagEnd + 1;
        } else {
          currentHtml += fullHtml[i];
          i++;
        }
      } else if (fullHtml[i] === '&') {
        // Tangani entity HTML (&amp;, &quot;) sekaligus
        const entityEnd = fullHtml.indexOf(';', i);
        if (entityEnd !== -1 && entityEnd - i < 10) {
          currentHtml += fullHtml.substring(i, entityEnd + 1);
          i = entityEnd + 1;
        } else {
          currentHtml += fullHtml[i];
          i++;
        }
      } else {
        currentHtml += fullHtml[i];
        i++;
      }

      el.innerHTML = currentHtml;
      el.appendChild(cursor);

      // Variasi jitter kecepatan alami
      const jitter = (Math.random() - 0.5) * (speed * 0.35);
      setTimeout(step, Math.max(8, speed + jitter));
    } else {
      // Pengetikan selesai, hilangkan kursor dengan anggun
      el.innerHTML = fullHtml;
      cursor.classList.add('finished');
      el.appendChild(cursor);
      setTimeout(() => {
        cursor.remove();
        el.style.minHeight = '';
        if (typeof callback === 'function') callback();
      }, 700);
    }
  }

  step();
}



