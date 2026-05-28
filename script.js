const scrollButtons = document.querySelectorAll("[data-scroll]");
const envelope = document.querySelector(".envelope");
const openLetterButton = document.querySelector("#open-letter");
const revealReasonsButton = document.querySelector("#reveal-reasons");
const reasonCards = Array.from(document.querySelectorAll(".reason-card"));
const sendLoveButton = document.querySelector("#send-love");
const finalMessage = document.querySelector("#final-message");

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

setupAmbientLove();
