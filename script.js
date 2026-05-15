// MENU
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const links = document.querySelectorAll(".nav-menu a");

// Ouvrir / fermer menu
menuToggle.addEventListener("click", () => {
navMenu.classList.toggle("active");
menuToggle.classList.toggle("active");
});

// Fermer quand on clique sur un lien
links.forEach(link => {
link.addEventListener("click", () => {
navMenu.classList.remove("active");
menuToggle.classList.remove("active");
});
});

// HEADER SCROLL EFFECT

const header =
document.querySelector(".header");

window.addEventListener("scroll", () => {

if(window.scrollY > 50){
header.classList.add("scrolled");
}else{
header.classList.remove("scrolled");
}

});

// REVEAL ON SCROLL

const revealElements =
document.querySelectorAll(`
section,
.expertise-card,
.service-card,
.premium-project-card,
.timeline-item,
.contact-card
`);

const observer =
new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("reveal");
entry.target.classList.add("active");

}

});

},{
threshold:0.12
});

revealElements.forEach(el=>{
el.classList.add("reveal");
observer.observe(el);
});

// OUTSIDE CLICK CLOSE

window.addEventListener("click",(e)=>{

if(
!e.target.closest(".nav-menu")
&&
!e.target.closest(".menu-toggle")
){

navMenu.classList.remove("active");

menuToggle.innerHTML =
'<i class="fas fa-bars"></i>';

}

});
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, {
    threshold: 0.15
  });

  sections.forEach(section => {
    observer.observe(section);
  });
});
document.addEventListener("DOMContentLoaded", () => {

  // Animation scroll sections
  const sections = document.querySelectorAll("section");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
        entry.target.classList.add("active");
      }
    });
  }, {
    threshold: 0.15
  });

  sections.forEach(section => {
    observer.observe(section);
  });

});
const overlay = document.querySelector(".menu-overlay");

// ouvrir / fermer overlay en même temps que menu
menuToggle.addEventListener("click", () => {
navMenu.classList.toggle("active");
menuToggle.classList.toggle("active");
overlay.classList.toggle("active");
});

// clic sur overlay = fermeture
overlay.addEventListener("click", () => {
navMenu.classList.remove("active");
menuToggle.classList.remove("active");
overlay.classList.remove("active");
});

// clic sur liens = fermeture aussi
links.forEach(link => {
link.addEventListener("click", () => {
navMenu.classList.remove("active");
menuToggle.classList.remove("active");
overlay.classList.remove("active");
});
});
