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
    navMenu.classList.contains("active")
      ? closeMenu()
      : openMenu();
  }

  // menu button
  menuToggle?.addEventListener("click", toggleMenu);

  // overlay close
  overlay?.addEventListener("click", closeMenu);

  // links close
  links.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // ===== HEADER EFFECT =====
  window.addEventListener("scroll", () => {

    if (!header) return;

    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

  });

  // ===== SCROLL REVEAL FIX =====
  const revealItems = document.querySelectorAll(`
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

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }

    });

  }, {
    threshold: 0.01
  });

  revealItems.forEach(item => {
    observer.observe(item);
  });

});
