
"use strict";

/* =========================================
   SEJAL'S FANTASY BIRTHDAY WEBSITE
   Made with love by Bunny 🐰❤️
========================================= */

const CONFIG = {
  // Her real date and time of birth, local India time.
  birthDate: new Date(2006, 9, 26, 19, 45, 0),

  // Birthday surprise unlock date.
  unlockDate: new Date(2026, 9, 26, 0, 0, 0),

  // Birthday displayed in the next-birthday countdown.
  birthdayMonth: 9, // October; JavaScript months start at 0.
  birthdayDay: 26,

  // Optional: change these captions for your own photos.
  herPhotos: [
    { src: "assets/her/photo01.jpg", caption: "My favourite smile 💗" },
    { src: "assets/her/photo02.jpg", caption: "A little sunshine ☀️" },
    { src: "assets/her/photo03.jpg", caption: "Simply beautiful 🌸" },
    { src: "assets/her/photo04.jpg", caption: "My favourite girl 🫶" },
    { src: "assets/her/photo05.jpg", caption: "A moment worth keeping ✨" },
    { src: "assets/her/photo06.jpg", caption: "Pretty in every way 💕" },
    { src: "assets/her/photo07.jpg", caption: "My little star 🌟" },
    { src: "assets/her/photo08.jpg", caption: "That lovely smile 🥹" },
    { src: "assets/her/photo09.jpg", caption: "A memory of you 🌷" },
    { src: "assets/her/photo10.jpg", caption: "Forever my favourite ♡" }
  ],

  ourPhotos: [
    { src: "assets/us/photo01.jpg", caption: "A little piece of us ❤️" },
    { src: "assets/us/photo02.jpg", caption: "Together is a lovely place 💗" },
    { src: "assets/us/photo03.jpg", caption: "One for our memory book 📸" },
    { src: "assets/us/photo04.jpg", caption: "Our kind of happiness ✨" },
    { src: "assets/us/photo05.jpg", caption: "Little moments, big feelings 🫶" },
    { src: "assets/us/photo06.jpg", caption: "A favourite memory 🌙" },
    { src: "assets/us/photo07.jpg", caption: "Two smiles, one memory 💕" },
    { src: "assets/us/photo08.jpg", caption: "One more moment to keep 🌸" },
    { src: "assets/us/photo09.jpg", caption: "A page in our story 📖" },
    { src: "assets/us/photo10.jpg", caption: "More memories to come ♡" }
  ],

  // Replace these sample entries with your REAL milestones and dates.
  // Use "date: null" when you don't want to display a date.
  journey: [
    {
      date: null,
      title: "The beginning of our story 🌱",
      description: "The First day meet on 18th October 2025",
      photo: null
    },
    {
      date: null,
      title: "Our first favourite memory 📸",
      description: "Amritsar Trip",
      photo: null
    },
    {
      date: null,
      title: "The moment that made us smile 💗",
      description: "Our every moment and time spending together",
      photo: null
    },
    {
      date: null,
      title: "A memory we will keep 🌙",
      description: "Amritsar Trip , my birthday, Internship , Couple Dance",
      photo: null
    },
    {
      date: null,
      title: "The next chapter ✨",
      description: "There are still so many lovely moments waiting to be made.",
      photo: null
    }
  ]
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

let heartTimer = null;
let balloonTimer = null;
let ageTimer = null;
let birthdayTimer = null;
let starFrame = null;
let micStream = null;
let micContext = null;
let micFrame = null;
let micActive = false;
let audioContext = null;

const gate = $("#gate");
const website = $("#website");
const gateForm = $("#dob-form");
const gateError = $("#gate-error");
const welcomePopup = $("#welcome-popup");
const lovePopup = $("#love-popup");

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

/* =========================================
   1. BIRTHDAY GATE
========================================= */

gateForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const day = Number($("#dob-day").value);
  const month = Number($("#dob-month").value);
  const year = Number($("#dob-year").value);

  const enteredDate = new Date(year, month - 1, day);

  const validDate =
    Number.isInteger(day) &&
    Number.isInteger(month) &&
    Number.isInteger(year) &&
    enteredDate.getFullYear() === year &&
    enteredDate.getMonth() === month - 1 &&
    enteredDate.getDate() === day;

  if (!validDate) {
    showGateError("Enter a valid date, meri jaan. 💗");
    return;
  }

  // Birthday DOB: 26 October 2006.
  if (day !== 26 || month !== 10 || year !== 2006) {
    showGateError("Wrong secret date, my pagal bacha! Try again. 🐰");
    return;
  }

  // The birthday gate opens at midnight on the configured date.
  if (Date.now() < CONFIG.unlockDate.getTime()) {
    showGateError("The birthday surprise isn't unlocked yet. Come back at midnight! 🌙");
    return;
  }

  gateError.textContent = "Surprise unlocked! Welcome, Sejal. ❤️";

  gateForm.querySelector("button[type='submit']").disabled = true;

  window.setTimeout(() => {
    gate.classList.add("leaving");
    document.body.classList.remove("locked");

    website.hidden = false;
    welcomePopup.hidden = false;

    startBackgroundEffects();
    setupStarAnimation();
    startAgeCounter();
    startBirthdayCountdown();
    revealVisibleSections();

    window.setTimeout(() => {
      gate.hidden = true;
    }, 700);
  }, 550);
});

function showGateError(message) {
  gateError.textContent = message;

  const inner = $(".gate-inner");
  inner.classList.remove("shake");
  void inner.offsetWidth;
  inner.classList.add("shake");
}

/* =========================================
   2. MIDNIGHT STATUS
========================================= */

function updateMidnightStatus() {
  const now = new Date();
  const countdown = $("#midnight-countdown");
  const status = $("#midnight-status");

  if (now >= CONFIG.unlockDate) {
    countdown.textContent = "✨ 00:00:00 — Birthday Surprise Unlocked! 🎂";
    status.textContent = "🔓 Midnight arrived! Enter DOB to unlock 💗";
    return;
  }

  const remaining = CONFIG.unlockDate.getTime() - now.getTime();
  const totalSeconds = Math.floor(remaining / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  countdown.textContent =
    `${days}d ${String(hours).padStart(2, "0")}:` +
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")} until the magic ✨`;

  status.textContent = "🔒 The gate opens at midnight 💗";
}

updateMidnightStatus();
window.setInterval(updateMidnightStatus, 1000);

/* =========================================
   3. POPUPS
========================================= */

$("#bunny-message").addEventListener("click", () => {
  lovePopup.hidden = false;
  playChime();
});

$$("[data-close]").forEach((button) => {
  button.addEventListener("click", () => {
    const popup = document.getElementById(button.dataset.close);
    if (popup) popup.hidden = true;
  });
});

[lovePopup, welcomePopup].forEach((popup) => {
  popup.addEventListener("click", (event) => {
    if (event.target === popup) popup.hidden = true;
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    [lovePopup, welcomePopup].forEach((popup) => {
      if (popup) popup.hidden = true;
    });

    closeLightbox();
  }
});

$("#enter-world").addEventListener("click", () => {
  welcomePopup.hidden = true;
  playChime();
  celebrate();
  $("#home").scrollIntoView({ behavior: "smooth" });
});

/* =========================================
   4. LIVE AGE CALCULATOR
   Calendar-based years, months, days, hours,
   minutes and seconds since her birth time.
========================================= */

function addCalendarMonths(date, months) {
  const result = new Date(date);
  const originalDay = result.getDate();

  result.setDate(1);
  result.setMonth(result.getMonth() + months);

  const lastDay = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0
  ).getDate();

  result.setDate(Math.min(originalDay, lastDay));
  return result;
}

function getAgeParts(birth, now) {
  if (now < birth) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  let years = now.getFullYear() - birth.getFullYear();
  let cursor = new Date(birth);
  cursor.setFullYear(cursor.getFullYear() + years);

  if (cursor > now) {
    years--;
    cursor = new Date(birth);
    cursor.setFullYear(cursor.getFullYear() + years);
  }

  let months = 0;

  while (months < 12) {
    const next = addCalendarMonths(cursor, 1);
    if (next > now) break;
    cursor = next;
    months++;
  }

  let remainder = Math.floor((now.getTime() - cursor.getTime()) / 1000);

  const days = Math.floor(remainder / 86400);
  remainder %= 86400;

  const hours = Math.floor(remainder / 3600);
  remainder %= 3600;

  const minutes = Math.floor(remainder / 60);
  const seconds = remainder % 60;

  return { years, months, days, hours, minutes, seconds };
}

function updateAge() {
  const now = new Date();
  const age = getAgeParts(CONFIG.birthDate, now);

  $("#age-years").textContent = age.years;
  $("#age-months").textContent = age.months;
  $("#age-days").textContent = age.days;
  $("#age-hours").textContent = String(age.hours).padStart(2, "0");
  $("#age-minutes").textContent = String(age.minutes).padStart(2, "0");
  $("#age-seconds").textContent = String(age.seconds).padStart(2, "0");
}

function startAgeCounter() {
  updateAge();

  if (!ageTimer) {
    ageTimer = window.setInterval(updateAge, 1000);
  }
}

/* =========================================
   5. NEXT BIRTHDAY COUNTDOWN
========================================= */

function getNextBirthday(now) {
  let year = now.getFullYear();

  let next = new Date(
    year,
    CONFIG.birthdayMonth,
    CONFIG.birthdayDay,
    0, 0, 0
  );

  if (next <= now) {
    next = new Date(
      year + 1,
      CONFIG.birthdayMonth,
      CONFIG.birthdayDay,
      0, 0, 0
    );
  }

  return next;
}

function updateBirthdayCountdown() {
  const now = new Date();
  const nextBirthday = getNextBirthday(now);
  const remaining = Math.max(0, nextBirthday.getTime() - now.getTime());
  const totalSeconds = Math.floor(remaining / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  $("#next-birthday-countdown").textContent =
    `${days} days · ${hours} hours · ${minutes} minutes · ${seconds} seconds`;
}

function startBirthdayCountdown() {
  updateBirthdayCountdown();

  if (!birthdayTimer) {
    birthdayTimer = window.setInterval(updateBirthdayCountdown, 1000);
  }
}

/* =========================================
   6. BUILD BOTH PHOTO GALLERIES
========================================= */

function createPhotoCard(photo, index, groupName) {
  const figure = document.createElement("figure");
  figure.className = "photo-card";

  const image = document.createElement("img");
  image.src = photo.src;
  image.alt = `${groupName} photo ${index + 1}`;
  image.loading = "lazy";
  image.decoding = "async";

  image.addEventListener("click", () => {
    if (image.naturalWidth > 0) {
      openLightbox(photo.src, image.alt);
    }
  });

  image.addEventListener("error", () => {
    image.alt = "Photo not found. Check the filename in the assets folder.";
    image.style.opacity = ".35";
    figure.classList.add("photo-missing");
  });

  const caption = document.createElement("figcaption");

  const number = document.createElement("span");
  number.className = "photo-number";
  number.textContent = `MEMORY ${String(index + 1).padStart(2, "0")}`;

  const captionText = document.createElement("span");
  captionText.textContent = photo.caption;

  caption.append(number, captionText);
  figure.append(image, caption);

  return figure;
}

function renderGallery(selector, photos, groupName) {
  const grid = $(selector);
  if (!grid) return;

  const fragment = document.createDocumentFragment();

  photos.forEach((photo, index) => {
    fragment.appendChild(createPhotoCard(photo, index, groupName));
  });

  grid.replaceChildren(fragment);
}

renderGallery("#her-photo-grid", CONFIG.herPhotos, "Sejal");
renderGallery("#our-photo-grid", CONFIG.ourPhotos, "Us");

/* =========================================
   7. PHOTO LIGHTBOX
========================================= */

let lightbox = null;

function openLightbox(src, alt) {
  closeLightbox();

  lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Photo preview");

  const image = document.createElement("img");
  image.src = src;
  image.alt = alt;

  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "×";
  close.setAttribute("aria-label", "Close photo");
  close.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  lightbox.append(image, close);
  document.body.appendChild(lightbox);
  close.focus();
}

function closeLightbox() {
  if (lightbox) {
    lightbox.remove();
    lightbox = null;
  }
}

/* =========================================
   8. OUR JOURNEY TIMELINE
========================================= */

function renderJourney() {
  const timeline = $("#journey-timeline");
  const fragment = document.createDocumentFragment();

  CONFIG.journey.forEach((item) => {
    const entry = document.createElement("article");
    entry.className = "timeline-item";

    const dot = document.createElement("span");
    dot.className = "timeline-dot";

    const card = document.createElement("div");
    card.className = "timeline-card";

    const date = document.createElement("div");
    date.className = "timeline-date";
    date.textContent = item.date || "A MEMORY TO REMEMBER";

    const title = document.createElement("h3");
    title.textContent = item.title;

    const description = document.createElement("p");
    description.textContent = item.description;

    card.append(date, title, description);

    if (item.photo) {
      const img = document.createElement("img");
      img.src = item.photo;
      img.alt = item.title;
      img.loading = "lazy";
      card.appendChild(img);
    }

    entry.append(dot, card);
    fragment.appendChild(entry);
  });

  timeline.replaceChildren(fragment);
}

renderJourney();

/* =========================================
   9. CAKE: BLOW OUT AND RELIGHT CANDLES
========================================= */

function blowCandles() {
  const cake = $("#cake-art");
  cake.classList.add("blown");

  $("#cake-message").textContent =
    "Wish made! May your dreams find their way to you. ✨💗";

  playChime();
  celebrate();
}

function relightCandles() {
  $("#cake-art").classList.remove("blown");
  $("#cake-message").textContent =
    "The candles are glowing again. Make another wish, Sejal! 🕯️";
}

$("#blow-candles").addEventListener("click", blowCandles);
$("#relight-candles").addEventListener("click", relightCandles);

/* =========================================
   10. OPTIONAL MICROPHONE BLOW DETECTION

   Requires browser permission and a secure
   context, normally localhost or HTTPS.
========================================= */

$("#mic-blow").addEventListener("click", async () => {
  if (micActive) {
    stopMicrophone();
    return;
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    $("#cake-message").textContent =
      "Microphone isn't available here. Use the Blow Candles button instead.";
    return;
  }

  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error("Audio unavailable");

    micContext = new AudioContextClass();

    if (micContext.state === "suspended") {
      await micContext.resume();
    }

    const source = micContext.createMediaStreamSource(micStream);
    const analyser = micContext.createAnalyser();

    analyser.fftSize = 1024;
    source.connect(analyser);

    const samples = new Uint8Array(analyser.fftSize);
    micActive = true;

    $("#mic-blow").textContent = "Listening... tap to stop 🎙️";
    $("#cake-message").textContent =
      "Blow gently towards your microphone! 🌬️";

    let loudFrames = 0;

    function listen() {
      if (!micActive) return;

      analyser.getByteTimeDomainData(samples);

      let sum = 0;
      for (const value of samples) {
        const normalized = (value - 128) / 128;
        sum += normalized * normalized;
      }

      const volume = Math.sqrt(sum / samples.length);

      if (volume > 0.18) {
        loudFrames++;
      } else {
        loudFrames = Math.max(0, loudFrames - 1);
      }

      if (loudFrames >= 7) {
        stopMicrophone();
        blowCandles();
        return;
      }

      micFrame = requestAnimationFrame(listen);
    }

    listen();
  } catch (error) {
    stopMicrophone();

    $("#cake-message").textContent =
      "Microphone permission unavailable. You can still use the button! 💗";
  }
});

function stopMicrophone() {
  micActive = false;

  if (micFrame) cancelAnimationFrame(micFrame);
  micFrame = null;

  if (micStream) {
    micStream.getTracks().forEach((track) => track.stop());
    micStream = null;
  }

  if (micContext) {
    micContext.close().catch(() => {});
    micContext = null;
  }

  const micButton = $("#mic-blow");
  if (micButton) micButton.textContent = "🎙️ Blow using microphone";
}

/* =========================================
   11. BALLOONS
========================================= */

const balloonColors = [
  "#ff477a", "#d68cff", "#ff9ebd",
  "#ffcf70", "#b49bff", "#ff76ad"
];

function createBalloon() {
  if (document.hidden) return;

  const container = $("#balloons");
  const balloon = document.createElement("span");

  balloon.className = "balloon";
  balloon.style.left = `${random(2, 96)}%`;
  balloon.style.setProperty("--balloon-color", pick(balloonColors));
  balloon.style.animationDuration = `${random(7, 12)}s`;
  balloon.style.transform = `scale(${random(.7, 1.3)})`;

  container.appendChild(balloon);
  window.setTimeout(() => balloon.remove(), 13000);
}

function releaseBalloons() {
  const amount = window.innerWidth < 600 ? 16 : 30;

  for (let i = 0; i < amount; i++) {
    window.setTimeout(createBalloon, i * 100);
  }

  playChime();
}

$("#release-balloons").addEventListener("click", releaseBalloons);

/* =========================================
   12. CONFETTI
========================================= */

function celebrate() {
  const container = $("#confetti");
  const colors = [
    "#ff3867", "#ff9bb6", "#c48bff",
    "#ffd166", "#ffffff", "#ff75bd"
  ];

  const amount = window.innerWidth < 600 ? 75 : 130;

  for (let i = 0; i < amount; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";

    piece.style.left = `${random(0, 100)}vw`;
    piece.style.background = pick(colors);
    piece.style.animationDuration = `${random(2.5, 5)}s`;
    piece.style.animationDelay = `${random(0, 1.3)}s`;
    piece.style.width = `${random(4, 9)}px`;
    piece.style.height = `${random(7, 15)}px`;

    container.appendChild(piece);
    window.setTimeout(() => piece.remove(), 7000);
  }

  burstHearts(window.innerWidth / 2, window.innerHeight / 2);
}

$("#final-celebrate").addEventListener("click", () => {
  celebrate();
  releaseBalloons();
});

/* =========================================
   13. FLOATING HEARTS
========================================= */

function createFloatingHeart() {
  if (document.hidden) return;

  const heart = document.createElement("span");
  heart.className = "floating-heart";
  heart.textContent = pick(["♥", "♡", "💗", "💕", "✨"]);
  heart.style.left = `${random(1, 98)}%`;
  heart.style.fontSize = `${random(12, 25)}px`;
  heart.style.animationDuration = `${random(7, 12)}s`;

  $("#floating-hearts").appendChild(heart);
  window.setTimeout(() => heart.remove(), 13000);
}

function burstHearts(x, y) {
  const container = $("#floating-hearts");
  const symbols = ["💗", "💕", "♥", "✨", "💖"];

  for (let i = 0; i < 18; i++) {
    const heart = document.createElement("span");
    heart.textContent = pick(symbols);

    heart.style.cssText = `
      position:fixed;
      left:${x}px;
      top:${y}px;
      font-size:${random(14, 26)}px;
      transition:transform 1s ease, opacity 1s ease;
      z-index:60;
    `;

    container.appendChild(heart);

    requestAnimationFrame(() => {
      heart.style.transform =
        `translate(${random(-150, 150)}px, ${random(-150, 100)}px)`;
      heart.style.opacity = "0";
    });

    window.setTimeout(() => heart.remove(), 1200);
  }
}

function startBackgroundEffects() {
  if (reducedMotion) return;

  if (!heartTimer) {
    heartTimer = window.setInterval(createFloatingHeart, 1400);
  }

  if (!balloonTimer) {
    balloonTimer = window.setInterval(createBalloon, 5000);
  }
}

/* =========================================
   14. ROMANTIC CHIME
========================================= */

function playChime() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioContext) audioContext = new AudioContextClass();

    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }

    [523.25, 659.25, 783.99].forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const start = audioContext.currentTime + index * 0.12;

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.045, start + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start(start);
      oscillator.stop(start + 0.38);
    });
  } catch {
    // The website continues to work without sound.
  }
}

/* =========================================
   15. OPTIONAL BACKGROUND MUSIC
========================================= */

const music = $("#birthday-music");
const musicToggle = $("#music-toggle");

musicToggle.addEventListener("click", async () => {
  if (!music.paused) {
    music.pause();
    musicToggle.textContent = "♫ Music: Off";
    return;
  }

  try {
    await music.play();
    musicToggle.textContent = "♫ Music: On";
  } catch {
    musicToggle.textContent = "♫ Add romantic.mp3";
    $("#cake-message").textContent =
      "Add assets/music/romantic.mp3 to enable background music.";
  }
});

/* =========================================
   16. STAR CANVAS
========================================= */

function setupStarAnimation() {
  const canvas = $("#stars");
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  let width = 0;
  let height = 0;
  let stars = [];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(120, Math.floor(width * height / 9000));

    stars = Array.from({ length: count }, () => ({
      x: random(0, width),
      y: random(0, height),
      r: random(.4, 1.7),
      phase: random(0, 7),
      speed: random(.3, 1.2)
    }));
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);

    stars.forEach((star) => {
      const alpha = reducedMotion
        ? .5
        : .2 + (Math.sin(time * .001 * star.speed + star.phase) + 1) * .3;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 164, 198, ${alpha})`;
      ctx.fill();
    });
  }

  function animate(time) {
    draw(time);
    starFrame = requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resize);
  resize();

  if (starFrame) cancelAnimationFrame(starFrame);
  draw(0);

  if (!reducedMotion) {
    starFrame = requestAnimationFrame(animate);
  }
}

/* =========================================
   17. STARTUP & TAB VISIBILITY
========================================= */

function revealVisibleSections() {
  const sections = $$(".content-section, .hero, .finale");

  if (!("IntersectionObserver" in window) || reducedMotion) {
    sections.forEach((section) => section.classList.add("shown"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("shown");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  sections.forEach((section) => observer.observe(section));
}

// Gentle fade-in for page sections.
const revealStyle = document.createElement("style");
revealStyle.textContent = `
  .content-section, .hero, .finale {
    opacity: 0;
    transform: translateY(18px);
    transition: opacity .7s ease, transform .7s ease;
  }
  .content-section.shown, .hero.shown, .finale.shown {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(revealStyle);

// Clean up microphone and pause background effects when the page is hidden.
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (heartTimer) clearInterval(heartTimer);
    if (balloonTimer) clearInterval(balloonTimer);

    heartTimer = null;
    balloonTimer = null;

    if (starFrame) cancelAnimationFrame(starFrame);
    starFrame = null;
  } else if (!document.body.classList.contains("locked")) {
    startBackgroundEffects();
    setupStarAnimation();
  }
});

// The front page shows the live unlock countdown even before DOB entry.
setupStarAnimation();
