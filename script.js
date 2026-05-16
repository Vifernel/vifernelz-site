document.addEventListener("DOMContentLoaded", () => {

  // ===== MENU SAFE =====
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const overlay = document.querySelector(".menu-overlay");
  const links = document.querySelectorAll(".nav-menu a");
  const header = document.querySelector(".header");

  function openMenu() {
    navMenu?.classList.add("active");
    menuToggle?.classList.add("active");
    overlay?.classList.add("active");
    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    navMenu?.classList.remove("active");
    menuToggle?.classList.remove("active");
    overlay?.classList.remove("active");
    document.body.classList.remove("menu-open");
  }

  menuToggle?.addEventListener("click", () => {
    navMenu.classList.contains("active") ? closeMenu() : openMenu();
  });

  overlay?.addEventListener("click", closeMenu);

  links.forEach(link => {
    link.addEventListener("click", closeMenu);
  });


  // ===== HEADER SCROLL =====
  window.addEventListener("scroll", () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 50);
  });


  // ===== REVEAL SAFE (NO BUG, NO PAGE DISAPPEAR) =====
  const revealElements = document.querySelectorAll(
    "section, .expertise-card, .service-card, .premium-project-card, .timeline-item, .contact-card, .hero-stat-card"
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, {
    threshold: 0.08
  });

  revealElements.forEach(el => {
    el.classList.add("reveal");
    observer.observe(el);
  });

});
