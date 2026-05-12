const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const links = document.querySelectorAll(".nav-menu a");

// OPEN / CLOSE MENU
menuToggle.addEventListener("click", () => {
navMenu.classList.toggle("active");

// icon toggle
if(navMenu.classList.contains("active")){
menuToggle.innerHTML = '<i class="fas fa-times"></i>';
}else{
menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
}
});

// CLOSE MENU WHEN CLICK LINK
links.forEach(link => {
link.addEventListener("click", () => {
navMenu.classList.remove("active");
menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
});
});

// CLOSE MENU OUTSIDE CLICK
window.addEventListener("click", (e) => {
if(!e.target.closest(".nav-menu") && !e.target.closest(".menu-toggle")){
navMenu.classList.remove("active");
menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
}
});

// SMOOTH SCROLL (bonus UX premium)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener("click", function(e){
e.preventDefault();

const target = document.querySelector(this.getAttribute("href"));

if(target){
window.scrollTo({
top: target.offsetTop - 80,
behavior: "smooth"
});
}
});
});

// SIMPLE FADE-IN ON SCROLL (premium feel)
const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if(entry.isIntersecting){
entry.target.style.opacity = 1;
entry.target.style.transform = "translateY(0)";
}
});
}, {threshold:0.1});

document.querySelectorAll(".expertise-card, .service-card, .project-card").forEach(el => {
el.style.opacity = 0;
el.style.transform = "translateY(20px)";
el.style.transition = "0.6s ease";
observer.observe(el);
});
