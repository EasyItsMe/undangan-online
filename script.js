/**
 * UNDANGAN PERNIKAHAN ONLINE - INTERACTIVE JAVASCRIPT
 * Rizky Pratama & Adinda Putri
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inisialisasi Nama Tamu dari URL Parameter (?to=Nama+Tamu)
  initGuestName();

  // 2. Inisialisasi Canvas Kelopak Bunga (Falling Petals)
  initPetalsEffect();

  // 3. Countdown Timer Pernikahan
  initCountdownTimer();

  // 4. Inisialisasi Buku Tamu & RSVP (Local Storage + Mock Data)
  initGuestbook();

  // 5. Inisialisasi Scroll Spy untuk Bottom Nav
  initScrollSpy();

  // 6. Inisialisasi Generator Undangan WhatsApp
  initShareModal();

  // 7. Inisialisasi AOS (Animate on Scroll)
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
   1. GUEST NAME EXTRACTION (?to=Bapak+Ahmad / ?guest=...)
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
   2. COVER GATE & AUDIO CONTROLLER (WITH WEB AUDIO FALLBACK)
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
    // Buka Kunci Layar
    document.body.classList.remove('locked');
    coverOverlay.classList.add('opened');

    // Tampilkan tombol musik floating
    if (musicBtn) {
      musicBtn.style.display = 'flex';
    }

    // Mainkan Audio (Bypass Autoplay Policy karena ada user click)
    playAudio();

    // Luncurkan Efek Confetti Bahagia
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
    // Start Web Audio chime synthesis fallback
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

// Gentle ambient chime synthesizer fallback (works 100% offline)
function startSynthMelody() {
  if (synthTimer) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  // Romantic acoustic harp/piano scale (F major / D minor pentatonic: F, A, C, D, E)
  const notes = [349.23, 440.00, 523.25, 587.33, 659.25, 523.25, 440.00, 392.00];
  let noteIndex = 0;

  synthTimer = setInterval(() => {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(notes[noteIndex % notes.length], audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
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
    // Semburan pertama
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#c5a059', '#e5c57b', '#ffffff', '#e8f0eb']
    });

    // Semburan kedua samping
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#c5a059', '#9b783e', '#ffffff']
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#c5a059', '#9b783e', '#ffffff']
      });
    }, 250);
  }
}

/* ==========================================================================
   4. FALLING PETALS CANVAS ANIMATION
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
  const TOTAL_PETALS = 24;

  class Petal {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * -height;
      this.size = Math.random() * 8 + 6;
      this.speedY = Math.random() * 1.2 + 0.8;
      this.speedX = Math.random() * 1 - 0.5;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 1.5 - 0.75;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.color = Math.random() > 0.4 ? 'rgba(235, 205, 140,' : 'rgba(255, 230, 220,';
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
      
      // Draw simple petal path
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < TOTAL_PETALS; i++) {
    petals.push(new Petal());
  }

  function animate() {
    // Berhenti jika cover sudah dibuka untuk menghemat performa CPU / baterai HP
    if (coverOverlay.classList.contains('opened')) return;

    ctx.clearRect(0, 0, width, height);
    petals.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   5. COUNTDOWN TIMER
   ========================================================================== */
function initCountdownTimer() {
  // Target Tanggal Acara: Minggu Malam Senin, 06 Desember 2026, 08:00:00 WIB
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
   6. RSVP & GUESTBOOK (BUKU TAMU)
   ========================================================================== */
const STORAGE_KEY = 'wedding_wishes_ami_azis';

const DEFAULT_WISHES = [
  {
    id: 1,
    name: 'Bpk. Supangat (Kades Sentul)',
    status: 'Hadir',
    pax: '2',
    message: 'Barakallahu lakum wa baraka alaikum wa jama\'a bainakuma fii khoir. Selamat berbahagia untuk kedua mempelai Siti Ami & Abdul Azis, serta selamat atas khitanan ananda Andiks Satria & Raditya Panca. Semoga menjadi keluarga sakinah mawaddah warahmah dan putra yang sholeh berbakti.',
    timestamp: '2 jam yang lalu'
  },
  {
    id: 2,
    name: 'Bpk. Azwar Anas, S.T., M.I.Kom',
    status: 'Hadir',
    pax: '2',
    message: 'Selamat menempuh hidup baru untuk Ami dan Azis. Semoga senantiasa diberkahi rezeki dan kebahagiaan oleh Allah SWT. Serta doa terbaik untuk ananda Andiks & Raditya semoga tumbuh menjadi anak sholeh yang membanggakan keluarga dan bangsa.',
    timestamp: '4 jam yang lalu'
  },
  {
    id: 3,
    name: 'Keluarga Kadingding & Ujungtebu',
    status: 'Hadir',
    pax: '4',
    message: 'Alhamdulillah, selamat untuk Kang Azis & Neng Ami. Semoga lancar acaranya dari awal hingga selesai di Kp. Buah Gede. Aamiin ya Rabbal Alamin.',
    timestamp: '1 hari yang lalu'
  },
  {
    id: 4,
    name: 'Keluarga Besar Kp. Dumus & Pematang',
    status: 'Hadir',
    pax: '3',
    message: 'Selamat atas pernikahan Ami & Azis serta khitanan Andiks Satria & Raditya Panca. Semoga Allah SWT melimpahkan berkah dan kebahagiaan berlimpah untuk seluruh keluarga besar.',
    timestamp: '1 hari yang lalu'
  }
];

function initGuestbook() {
  const form = document.getElementById('rsvp-form');
  const wishesList = document.getElementById('wishes-list');
  const countEl = document.getElementById('wishes-count');
  const countHadirEl = document.getElementById('count-hadir');

  // Load existing data from localStorage or use defaults
  let wishes = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (!wishes || !Array.isArray(wishes) || wishes.length === 0) {
    wishes = DEFAULT_WISHES;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
  }

  function renderWishes() {
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
            <i class="fa-solid fa-circle-user" style="color: var(--primary);"></i>
            <span>${escapeHTML(wish.name)}</span>
            <span class="wish-status-pill ${badgeClass}">${statusText}</span>
          </div>
          <span class="wish-time">${wish.timestamp || 'Baru saja'}</span>
        </div>
        <p class="wish-message">${escapeHTML(wish.message)}</p>
      `;
      wishesList.appendChild(item);
    });

    if (countEl) countEl.textContent = wishes.length;
    if (countHadirEl) countHadirEl.textContent = `${hadirCount} Hadir`;
  }

  renderWishes();

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
        timestamp: 'Baru saja'
      };

      wishes.unshift(newWish);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));

      renderWishes();
      form.reset();

      showToast('Terima kasih atas doa restu & konfirmasi kehadiran Anda!');
    });
  }
}

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
   7. SALIN KE CLIPBOARD & TOAST NOTIFICATION
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
   8. GOOGLE CALENDAR LINK GENERATOR
   ========================================================================== */
function addToGoogleCalendar(title, startDatetime, endDatetime, location, details) {
  // Format startDatetime / endDatetime: YYYYMMDDTHHmmss
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const url = `${baseUrl}&text=${encodeURIComponent(title)}&dates=${startDatetime}/${endDatetime}&location=${encodeURIComponent(location)}&details=${encodeURIComponent(details)}`;
  window.open(url, '_blank');
}

/* ==========================================================================
   9. GALLERY LIGHTBOX
   ========================================================================== */
function openLightbox(imageUrl) {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  if (!modal || !modalImg) return;

  modalImg.src = imageUrl;
  modal.classList.add('active');
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (modal) modal.classList.remove('active');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
  }
});

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

  // Generate initial preview text
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
  if (event && event.target && event.target.closest('.modal-card') && !event.target.classList.contains('modal-close-btn')) {
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
  
  // Create invitation URL with ?to= parameter
  const currentBase = window.location.href.split('?')[0];
  const inviteUrl = `${currentBase}?to=${encodeURIComponent(guestName)}`;

  const message = `Kepada Yth.
Bapak/Ibu/Saudara/i *${guestName}*

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk menghadiri acara resepsi pernikahan kami serta khitanan putra kami:

*The Wedding of Siti Ami & Abdul Azis*
*Serta Khitanan: Andiks Satria & Raditya Panca*

🗓 *Minggu Malam Senin, 06 Desember 2026* (26 Jumadil Akhir 1448 H)
⏰ Akad Nikah: 08.00 - 09.00 WIB
⏰ Resepsi & Khitanan: 09.00 WIB s/d Selesai
📍 *Bertempat di Kediaman Mempelai Wanita:*
Kp. Buah Gede RT. 009 RW. 005 Ds. Sentul Kec. Kragilan Kab. Serang - Banten

Untuk info detail rangkaian acara, peta lokasi, dan konfirmasi kehadiran (RSVP), silakan kunjungi tautan undangan digital kami:
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
  const buttons = document.querySelectorAll('.family-tabs .tab-btn');

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
