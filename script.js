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

  // Bouton menu
  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMenu);
  }

  // Overlay
  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  // Liens menu
  links.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // ===== HEADER SCROLL =====
  window.addEventListener("scroll", () => {

    if (!header) return;

    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

  });

  // ===== REVEAL PREMIUM =====

  const revealElements = document.querySelectorAll(`
    .section-title,
    .about-image,
    .about-content,
    .expertise-card,
    .service-card,
    .timeline-item,
    .premium-project-card,
    .availability-box,
    .contact-card,
    .contact-form-box,
    .hero-stat-card,
    .hero-socials a
  `);

  revealElements.forEach(el => {
    el.classList.add("reveal");
  });

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add("active");

        observer.unobserve(entry.target);

      }

    });

  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => {
    observer.observe(el);
  });

  // ===== CONTACT FORM SAFE =====

  const contactForm = document.querySelector(".contact-form-box form");

  if (contactForm) {

    contactForm.addEventListener("submit", function(e) {

      const honeypot = this.website?.value || "";
      const captcha = this.captcha?.value || "";

      // Anti-bot
      if (honeypot !== "") {
        e.preventDefault();
        return;
      }

      // Captcha si présent
      if (captcha && parseInt(captcha) !== 7) {
        e.preventDefault();
        alert("Captcha incorrect");
        return;
      }

    });

  }
  // ===== HERO VIDEO AUTOPLAY FIX =====
  const heroVideo = document.querySelector("#heroVideo");

  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.playsInline = true;

    const playVideo = () => {
      heroVideo.play().catch(() => {
        console.log("Autoplay bloqué, retry...");
      });
    };

    // tentative immédiate
    playVideo();

    // retry si navigateur bloque
    setTimeout(playVideo, 1000);
    setTimeout(playVideo, 3000);
  }
  const video = document.querySelector(".hero-video");

if (video) {
  video.muted = true;
  video.playsInline = true;

  const playVideo = () => {
    video.play().catch(() => {});
  };

  window.addEventListener("load", playVideo);
  setTimeout(playVideo, 500);
  setTimeout(playVideo, 2000);
}
});
