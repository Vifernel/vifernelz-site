const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const links = document.querySelectorAll(".nav-menu a");

// Ouvrir / fermer menu
menuToggle.addEventListener("click", () => {
navMenu.classList.toggle("active");

// changer icône
if(navMenu.classList.contains("active")){
menuToggle.innerHTML = '<i class="fas fa-times"></i>';
}else{
menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
}
});

// fermer menu en cliquant sur un lien
links.forEach(link => {
link.addEventListener("click", () => {
navMenu.classList.remove("active");
menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
});
});

// fermer menu si clic hors zone (optionnel)
window.addEventListener("click", (e) => {
if(!e.target.closest(".nav-menu") && !e.target.closest(".menu-toggle")){
navMenu.classList.remove("active");
menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
}
});
