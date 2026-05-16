document.addEventListener("DOMContentLoaded", () => {

  // ===== MENU =====
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const overlay = document.querySelector(".menu-overlay");
  const links = document.querySelectorAll(".nav-menu a");
  const header = document.querySelector(".header");

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

  function toggleMenu() {
    if (navMenu.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // bouton menu
  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMenu);
  }

  // click overlay
  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  // click lien menu
  links.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // ===== HEADER SCROLL EFFECT =====
  window.addEventListener("scroll", () => {

    if (!header) return;

    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

  });

  // ===== REVEAL ON SCROLL FIX =====
  const revealElements = document.querySelectorAll(`
    section,
    .expertise-card,
    .service-card,
    .premium-project-card,
    .timeline-item,
    .contact-card,
    .hero-stat-card,
    .about-image,
    .about-content
  `);

  // état initial AVANT apparition
  revealElements.forEach(el => {
    el.classList.add("reveal");
  });

  const revealObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }

    });

  }, {
    threshold: 0.12
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

});
