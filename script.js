const scrollButtons = document.querySelectorAll("[data-scroll]");
const envelope = document.querySelector(".envelope");
const openLetterButton = document.querySelector("#open-letter");
const revealReasonsButton = document.querySelector("#reveal-reasons");
const reasonCards = Array.from(document.querySelectorAll(".reason-card"));
const sendLoveButton = document.querySelector("#send-love");
const finalMessage = document.querySelector("#final-message");
const backgroundMusic = document.querySelector("#background-music");
const musicToggle = document.querySelector("#music-toggle");
const heartUnlock = document.querySelector("#heart-unlock");
const romanticArrow = document.querySelector("#romantic-arrow");
const romanticPopup = document.querySelector("#romantic-popup");

const finalLines = [
  "I love you more than every sunset.",
  "More than yesterday. Softer than tomorrow. Always.",
  "You are my favorite horizon."
];

const ambientTones = [
  "rgba(221, 113, 93, 0.44)",
  "rgba(185, 80, 98, 0.34)",
  "rgba(244, 183, 95, 0.38)",
  "rgba(236, 247, 245, 0.42)"
];

function updateMusicButton() {
  if (!backgroundMusic || !musicToggle) return;

  const isPlaying = !backgroundMusic.paused;
  musicToggle.classList.toggle("is-playing", isPlaying);
  document.body.classList.toggle("music-is-blocked", !isPlaying);
  document.body.classList.toggle("music-is-playing", isPlaying);
  musicToggle.setAttribute("aria-label", isPlaying ? "Music is playing" : "Start the magic");
  if (heartUnlock) heartUnlock.setAttribute("aria-hidden", isPlaying ? "true" : "false");
}

function tryPlayMusic() {
  if (!backgroundMusic) return Promise.resolve();

  backgroundMusic.volume = 0.58;
  backgroundMusic.loop = true;
  backgroundMusic.muted = false;

  return backgroundMusic
    .play()
    .then(() => {
      updateMusicButton();
      return true;
    })
    .catch(() => {
      updateMusicButton();
      return false;
    });
}

function showUnlockPopup() {
  if (!romanticPopup) return;

  romanticPopup.hidden = false;
  romanticPopup.classList.add("is-open");
}

function hideUnlockPopup() {
  if (!romanticPopup) return;

  romanticPopup.classList.remove("is-open");
  window.setTimeout(() => {
    romanticPopup.hidden = true;
  }, 320);
}

function layoutRomanticArrow() {
  if (!romanticArrow || !musicToggle) return;

  const message = romanticArrow.closest(".romantic-cta__message");
  if (!message) return;

  const messageRect = message.getBoundingClientRect();
  const heartRect = musicToggle.getBoundingClientRect();
  const startX = messageRect.right - 24;
  const startY = messageRect.bottom - 16;
  const endX = heartRect.left + heartRect.width / 2;
  const endY = heartRect.top + heartRect.height / 2;
  const angle = (Math.atan2(endY - startY, endX - startX) * 180) / Math.PI + 118;

  romanticArrow.style.setProperty("--arrow-rotate", `${angle}deg`);
}

function setupArrowVideo() {
  if (!romanticArrow) return;

  const arrowVideo = romanticArrow.querySelector(".romantic-cta__arrow-video--source");
  const arrowCanvas = romanticArrow.querySelector(".romantic-cta__arrow-video");
  if (!arrowVideo || !arrowCanvas) return;

  const arrowContext = arrowCanvas.getContext("2d", { willReadFrequently: true });
  let arrowFrameId = 0;

  const paintArrowFrame = () => {
    if (!arrowVideo.videoWidth || !arrowContext) return;

    const { videoWidth, videoHeight } = arrowVideo;
    if (arrowCanvas.width !== videoWidth) arrowCanvas.width = videoWidth;
    if (arrowCanvas.height !== videoHeight) arrowCanvas.height = videoHeight;

    arrowContext.drawImage(arrowVideo, 0, 0, videoWidth, videoHeight);
    const frame = arrowContext.getImageData(0, 0, videoWidth, videoHeight);
    const pixels = frame.data;

    for (let index = 0; index < pixels.length; index += 4) {
      const red = pixels[index];
      const green = pixels[index + 1];
      const blue = pixels[index + 2];
      const greenExcess = green - Math.max(red, blue);

      if (greenExcess > 28 && green > 55) {
        pixels[index + 3] = Math.max(0, 255 - greenExcess * 5);
      }
    }

    arrowContext.putImageData(frame, 0, 0);
  };

  const startArrowVideo = () => {
    arrowVideo.play().catch(() => {});
    layoutRomanticArrow();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      paintArrowFrame();
      return;
    }

    const loopArrowFrame = () => {
      paintArrowFrame();
      arrowFrameId = window.requestAnimationFrame(loopArrowFrame);
    };

    loopArrowFrame();
  };

  arrowVideo.addEventListener("loadeddata", startArrowVideo, { once: true });
}

function setupRomanticCta() {
  if (!musicToggle || !heartUnlock) return;

  const beginRomanticCta = () => {
    layoutRomanticArrow();
    setupArrowVideo();
  };

  if (document.readyState === "complete") beginRomanticCta();
  else window.addEventListener("load", beginRomanticCta, { once: true });

  window.addEventListener("resize", layoutRomanticArrow);
  window.addEventListener("orientationchange", layoutRomanticArrow);

  romanticPopup?.querySelectorAll("[data-close-popup]").forEach((element) => {
    element.addEventListener("click", hideUnlockPopup);
  });
}

function setupBackgroundMusic() {
  if (!backgroundMusic || !musicToggle) return;

  tryPlayMusic();

  window.addEventListener("load", tryPlayMusic, { once: true });
  window.addEventListener("pageshow", tryPlayMusic);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) tryPlayMusic();
  });

  backgroundMusic.addEventListener("play", updateMusicButton);
  backgroundMusic.addEventListener("pause", updateMusicButton);
  backgroundMusic.addEventListener("ended", tryPlayMusic);

  musicToggle.addEventListener("click", () => {
    tryPlayMusic();
    burstHearts(musicToggle, 22);
    showUnlockPopup();
  });

  musicToggle.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    tryPlayMusic();
    burstHearts(musicToggle, 22);
  });
}

function setupAmbientLove() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const layer = document.createElement("div");
  const isMobile = window.matchMedia("(max-width: 640px)").matches;
  const heartCount = isMobile ? 14 : 26;
  const sparkCount = isMobile ? 8 : 14;

  layer.className = "ambient-love";
  layer.setAttribute("aria-hidden", "true");
  document.body.classList.add("has-ambient-love");

  for (let index = 0; index < heartCount + sparkCount; index += 1) {
    const isSpark = index >= heartCount;
    const item = document.createElement("span");
    const size = isSpark
      ? Math.round(Math.random() * 4 + 3)
      : Math.round(Math.random() * 10 + 8);
    const drift = Math.round(Math.random() * 170 - 85);
    const duration = Math.round(Math.random() * 11 + 13);
    const delay = Math.round(Math.random() * -duration);
    const x = Math.round(Math.random() * 100);
    const opacity = isSpark
      ? (Math.random() * 0.25 + 0.16).toFixed(2)
      : (Math.random() * 0.18 + 0.12).toFixed(2);

    item.className = isSpark ? "ambient-spark" : "ambient-heart";
    item.style.setProperty("--x", `${x}%`);
    item.style.setProperty("--size", `${size}px`);
    item.style.setProperty("--drift", `${drift}px`);
    item.style.setProperty("--duration", `${duration}s`);
    item.style.setProperty("--delay", `${delay}s`);
    item.style.setProperty("--opacity", opacity);
    item.style.setProperty("--tone", ambientTones[index % ambientTones.length]);
    layer.appendChild(item);
  }

  document.body.prepend(layer);
}

function burstHearts(origin, amount = 12) {
  const rect = origin.getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;

  for (let index = 0; index < amount; index += 1) {
    const heart = document.createElement("span");
    const drift = `${Math.round(Math.random() * 160 - 80)}px`;
    const size = `${Math.round(Math.random() * 8 + 10)}px`;

    heart.className = "heart";
    heart.style.left = `${startX + Math.random() * 36 - 18}px`;
    heart.style.top = `${startY + Math.random() * 24 - 12}px`;
    heart.style.setProperty("--drift", drift);
    heart.style.setProperty("--heart-size", size);
    heart.style.animationDelay = `${index * 28}ms`;

    document.body.appendChild(heart);
    window.setTimeout(() => heart.remove(), 1400);
  }
}

scrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.scroll);
    if (!target) return;

    burstHearts(button, 8);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

openLetterButton.addEventListener("click", () => {
  envelope.classList.add("is-open");
  openLetterButton.textContent = "Opened";
  openLetterButton.disabled = true;
  burstHearts(openLetterButton, 16);
  window.setTimeout(() => document.querySelector("#reasons").scrollIntoView({ behavior: "smooth" }), 1100);
});

revealReasonsButton.addEventListener("click", () => {
  reasonCards.forEach((card, index) => {
    window.setTimeout(() => card.classList.add("is-visible"), index * 120);
  });

  revealReasonsButton.textContent = "There you are";
  revealReasonsButton.disabled = true;
  burstHearts(revealReasonsButton, 18);
});

sendLoveButton.addEventListener("click", () => {
  const line = finalLines[Math.floor(Math.random() * finalLines.length)];
  finalMessage.textContent = line;
  burstHearts(sendLoveButton, 26);
});

setupRomanticCta();
setupBackgroundMusic();
setupAmbientLove();
