const burger = document.getElementById("btn-burger");
const menuPopup = document.getElementById("navPopupMenu");
const closeBtn = document.getElementById("closeMenu");

const updateAria = (expanded) => {
  burger.setAttribute("aria-expanded", expanded.toString());
};

function positionCloseButton() {
  const rect = menuPopup.getBoundingClientRect();
  closeBtn.style.position = "absolute";
  closeBtn.style.top = `${window.scrollY + rect.top + 16}px`;
  closeBtn.style.left = `${window.scrollX + rect.right - 48}px`;
  closeBtn.style.display = "block";
  closeBtn.style.zIndex = "1001";
}

function showMenu() {
  menuPopup.classList.add("active");
  burger.classList.add("active");
  closeBtn.style.display = "block";
  updateAria(true);
  positionCloseButton();
}

function hideMenu() {
  menuPopup.classList.remove("active");
  burger.classList.remove("active");
  closeBtn.style.display = "none";
  burger.blur(); // 💡 odstráni focus z burger buttonu
  updateAria(false);
}

burger.addEventListener("click", () => {
  const isActive = menuPopup.classList.contains("active");
  isActive ? hideMenu() : showMenu();
});

closeBtn.addEventListener("click", hideMenu);

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
});

window.addEventListener("scroll", () => {
  if (menuPopup.classList.contains("active")) {
    positionCloseButton();
  }
});