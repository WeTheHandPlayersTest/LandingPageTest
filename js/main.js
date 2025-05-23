// === ✅ HAMBURGER MENU LOGIKA ===
const burger = document.getElementById("btn-burger");
const menuPopup = document.getElementById("navPopupMenu");
const closeBtn = document.getElementById("closeMenu");
const overlay = document.getElementById("menuOverlay");

const updateAria = (expanded) => {
  burger.setAttribute("aria-expanded", expanded.toString());
};

function positionCloseButton() {
  const rect = menuPopup.getBoundingClientRect();
  closeBtn.style.position = "absolute";
  closeBtn.style.top = `${window.scrollY + rect.top + 20}px`;
  closeBtn.style.left = `${window.scrollX + rect.right - 36}px`;
  closeBtn.style.display = "block";
  closeBtn.style.zIndex = "1001";
}

function injectSocialIcons() {
  const isMobile = window.innerWidth < 1279;
  const source = document.getElementById("socialSource");
  const existingClone = document.getElementById("socialClone");

  if (isMobile && source && !existingClone) {
    const clone = source.cloneNode(true);
    clone.id = "socialClone";
    clone.classList.add("social-in-popup");
    menuPopup.appendChild(clone);
  }
}

function showMenu() {
  menuPopup.classList.add("active");
  burger.classList.add("active");
  closeBtn.style.display = "block";
  overlay.classList.add("active");
  updateAria(true);
  positionCloseButton();
  injectSocialIcons();
}

function hideMenu() {
  menuPopup.classList.remove("active");
  burger.classList.remove("active");
  closeBtn.style.display = "none";
  overlay.classList.remove("active");
  burger.blur();
  updateAria(false);

  const socialClone = document.getElementById("socialClone");
  if (socialClone) socialClone.remove();
}

burger.addEventListener("click", () => {
  menuPopup.classList.contains("active") ? hideMenu() : showMenu();
});

closeBtn.addEventListener("click", hideMenu);
overlay.addEventListener("click", hideMenu);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menuPopup.classList.contains("active")) hideMenu();
});

document.addEventListener("click", (e) => {
  if (
    !menuPopup.contains(e.target) &&
    !burger.contains(e.target) &&
    !closeBtn.contains(e.target) &&
    menuPopup.classList.contains("active")
  ) {
    hideMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1279) {
    if (menuPopup.classList.contains("active")) hideMenu();
    const clone = document.getElementById("socialClone");
    if (clone) clone.remove();
  } else {
    if (menuPopup.classList.contains("active")) positionCloseButton();
  }

  restartMarquee();
});

window.addEventListener("scroll", () => {
  if (menuPopup.classList.contains("active")) positionCloseButton();
});

// === ✅ MARQUEE S KONZISTENTNOU RÝCHLOSŤOU V PIXELOCH ZA SEKUNDU ===
let scrollSpeedPerSecond = 60; // nastaviteľná rýchlosť (px/s)
let animationFrameId = null;
let contentWidth = 0;
let marqueeTrack = null;
let marqueeContent = null;
let startTimestamp = null;

function setupMarquee() {
  cancelAnimationFrame(animationFrameId);

  marqueeTrack = document.getElementById("marqueeTrack");
  marqueeContent = document.getElementById("marqueeContent");

  if (!marqueeTrack || !marqueeContent) return;

  marqueeContent.innerHTML = '';

  const baseText = document.createElement("span");
  baseText.className = "marquee-text";
  baseText.innerText = "• BECOME A #HANDPLAYER WITH OUR GAMES";

  const temp = baseText.cloneNode(true);
  temp.style.position = 'absolute';
  temp.style.visibility = 'hidden';
  document.body.appendChild(temp);
  const textWidth = temp.getBoundingClientRect().width;
  temp.remove();

  const containerWidth = marqueeTrack.offsetWidth;
  const repeatCount = Math.ceil((containerWidth * 2) / textWidth) + 1;

  for (let i = 0; i < repeatCount; i++) {
    marqueeContent.appendChild(baseText.cloneNode(true));
  }

  contentWidth = marqueeContent.scrollWidth / 2;
  startTimestamp = null;

  animationFrameId = requestAnimationFrame(animateMarquee);
}

function animateMarquee(timestamp) {
  if (!marqueeTrack) return;

  if (!startTimestamp) startTimestamp = timestamp;
  const elapsed = (timestamp - startTimestamp) / 1000;

  const distance = (scrollSpeedPerSecond * elapsed) % contentWidth;
  const offset = -distance;

  marqueeTrack.style.transform = `translateX(${offset}px)`;
  animationFrameId = requestAnimationFrame(animateMarquee);
}

function restartMarquee() {
  setupMarquee();
}

document.addEventListener("DOMContentLoaded", () => {
  setupMarquee();
});
