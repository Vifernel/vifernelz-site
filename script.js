// ===== MENU FIX STABLE =====
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const overlay = document.querySelector(".menu-overlay");
const links = document.querySelectorAll(".nav-menu a");

// ouvrir / fermer menu
function toggleMenu() {
  navMenu.classList.toggle("active");
  menuToggle.classList.toggle("active");
  overlay.classList.toggle("active");
}

// bouton menu
menuToggle.addEventListener("click", toggleMenu);

// fermer menu quand on clique dehors
overlay.addEventListener("click", () => {
  navMenu.classList.remove("active");
  menuToggle.classList.remove("active");
  overlay.classList.remove("active");
});

// fermer quand on clique sur un lien
links.forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    menuToggle.classList.remove("active");
    overlay.classList.remove("active");
  });
});

// ===== HEADER SCROLL EFFECT =====
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// ===== REVEAL ON SCROLL =====
const revealElements = document.querySelectorAll(`
section,
.expertise-card,
.service-card,
.premium-project-card,
.timeline-item,
.contact-card
`);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("reveal");
      entry.target.classList.add("active");
    }
  });
}, {
  threshold: 0.12
});

revealElements.forEach(el => {
  el.classList.add("reveal");
  observer.observe(el);
});

// ===== SECTION ANIMATION =====
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, {
    threshold: 0.15
  });

  sections.forEach(section => {
    sectionObserver.observe(section);
  });
});
