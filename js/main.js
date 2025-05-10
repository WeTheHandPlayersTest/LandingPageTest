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
}

burger.addEventListener("click", () => {
  const isActive = menuPopup.classList.contains("active");
  isActive ? hideMenu() : showMenu();
});

closeBtn.addEventListener("click", hideMenu);
overlay.addEventListener("click", hideMenu);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menuPopup.classList.contains("active")) {
    hideMenu();
  }
});

document.addEventListener("click", (e) => {
  const isClickInside =
    menuPopup.contains(e.target) ||
    burger.contains(e.target) ||
    closeBtn.contains(e.target);

  if (!isClickInside && menuPopup.classList.contains("active")) {
    hideMenu();
  }
});

window.addEventListener("resize", () => {
  const isDesktop = window.innerWidth >= 1279;

  if (isDesktop && menuPopup.classList.contains("active")) {
    hideMenu();
  } else if (!isDesktop && menuPopup.classList.contains("active")) {
    positionCloseButton();
  }

  // ❌ Odstráň ikony pri návrate na desktop
  const existingClone = document.getElementById("socialClone");
  if (isDesktop && existingClone) {
    existingClone.remove();
  }
});

window.addEventListener("scroll", () => {
  if (menuPopup.classList.contains("active")) {
    positionCloseButton();
  }
});

const resizeObserver = new ResizeObserver(() => {
  if (menuPopup.classList.contains("active")) {
    positionCloseButton();
  }
});

resizeObserver.observe(menuPopup);