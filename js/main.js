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

  restartMarquees();
});

window.addEventListener("scroll", () => {
  if (menuPopup.classList.contains("active")) positionCloseButton();
});

// === ✅ MARQUEE S PLYNULÝM CHODOM A OBNOVOU MIMO OBRAZOVKY ===
let scrollSpeedPerSecond = 60;
let animationFrameIds = [];

function setupAllMarquees() {
  animationFrameIds.forEach(id => cancelAnimationFrame(id));
  animationFrameIds = [];

  const allContainers = document.querySelectorAll(".marquee-container");

  allContainers.forEach(container => {
    const track = container.querySelector(".marquee-track");
    const content = container.querySelector(".marquee-content");

    if (!track || !content) return;

    // Získaj pôvodný text
    const originalTextEl = content.querySelector(".marquee-text");
    const rawText = originalTextEl?.innerText?.trim() || "• DEFAULT MARQUEE TEXT";

    // Vyčisti obsah
    content.innerHTML = "";

    // Vytvor základný prvok textu
    const span = document.createElement("span");
    span.className = "marquee-text";
    span.innerText = rawText;
    span.style.display = "inline-block";

    // Zmeraj šírku textu
    const temp = span.cloneNode(true);
    temp.style.position = "absolute";
    temp.style.visibility = "hidden";
    document.body.appendChild(temp);
    const textWidth = temp.getBoundingClientRect().width;
    document.body.removeChild(temp);

    // Získaj potrebný počet opakovaní na pokrytie minimálne 2× šírky viewportu
    const containerWidth = container.offsetWidth;
    const repeatCount = Math.ceil((containerWidth * 2) / textWidth) + 2;

    for (let i = 0; i < repeatCount; i++) {
      const copy = span.cloneNode(true);
      content.appendChild(copy);
    }

    // Duplikuj celý obsah ešte raz, aby loop bol plynulý
    const clonedContent = content.cloneNode(true);
    while (clonedContent.firstChild) {
      content.appendChild(clonedContent.firstChild);
    }

    const loopWidth = content.scrollWidth / 2;

    let startTimestamp = null;

    function animate(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = (timestamp - startTimestamp) / 1000;
      const distance = (scrollSpeedPerSecond * elapsed) % loopWidth;
      const offset = -distance;

      track.style.transform = `translateX(${offset}px)`;

      const id = requestAnimationFrame(animate);
      animationFrameIds.push(id);
    }

    requestAnimationFrame(animate);
  });
}

function restartMarquees() {
  setupAllMarquees();
}

document.addEventListener("DOMContentLoaded", () => {
  setupAllMarquees();
});
