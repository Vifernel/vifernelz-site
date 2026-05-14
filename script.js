// MENU
const menuToggle =
document.querySelector(".menu-toggle");

const navMenu =
document.querySelector(".nav-menu");

const links =
document.querySelectorAll(".nav-menu a");

menuToggle.addEventListener("click", () => {

navMenu.classList.toggle("active");

if(navMenu.classList.contains("active")){
menuToggle.innerHTML =
'<i class="fas fa-times"></i>';
}else{
menuToggle.innerHTML =
'<i class="fas fa-bars"></i>';
}

});

links.forEach(link => {

link.addEventListener("click", () => {

navMenu.classList.remove("active");

menuToggle.innerHTML =
'<i class="fas fa-bars"></i>';

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
