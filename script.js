document.addEventListener("DOMContentLoaded", () => {

  // ===== ELEMENTS =====
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const overlay = document.querySelector(".menu-overlay");
  const links = document.querySelectorAll(".nav-menu a");
  const header = document.querySelector(".header");

  // sécurité
  if (!menuToggle || !navMenu || !overlay) return;

  // ===== MENU SIMPLE STABLE =====
  function openMenu() {
    navMenu.classList.add("active");
    menuToggle.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    navMenu.classList.remove("active");
    menuToggle.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("menu-open");
  }

  menuToggle.addEventListener("click", () => {
    if (navMenu.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener("click", closeMenu);

  links.forEach(link => link.addEventListener("click", closeMenu));


  // ===== HEADER SCROLL =====
  window.addEventListener("scroll", () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 50);
  });


  // ===== REVEAL ULTRA SAFE (IMPORTANT) =====
  const items = document.querySelectorAll(
    "section, .expertise-card, .service-card, .premium-project-card, .timeline-item, .contact-card, .hero-stat-card"
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, {
    threshold: 0.15
  });

  items.forEach(el => observer.observe(el));

});
