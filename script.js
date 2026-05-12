const header = document.querySelector('.header');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

/* NAVBAR SCROLL EFFECT */

window.addEventListener('scroll', () => {

  if(window.scrollY > 60){
    header.style.background = "rgba(0,0,0,.88)";
    header.style.backdropFilter = "blur(20px)";
    header.style.boxShadow =
    "0 10px 40px rgba(0,0,0,.35)";
  } else {
    header.style.background =
    "rgba(0,0,0,.4)";
    header.style.boxShadow = "none";
  }

});

/* MOBILE MENU */

menuToggle.addEventListener('click', () => {

  navMenu.classList.toggle('active');

});

/* CLOSE MENU AFTER CLICK */

document.querySelectorAll('.nav-menu a')
.forEach(link => {

  link.addEventListener('click', () => {

    navMenu.classList.remove('active');

  });

});

/* SCROLL REVEAL */

const observer = new IntersectionObserver((entries) => {

  entries.forEach(entry => {

    if(entry.isIntersecting){
      entry.target.classList.add('show');
    }

  });

},{
  threshold:0.15
});

document.querySelectorAll(
'.service-card, .project-card, .about-image, .about-text, .gallery-grid img, .contact-box, .hero-content, .hero-image-wrapper, .stat-card'
).forEach(el => {

  el.classList.add('hidden');
  observer.observe(el);

});

/* SMOOTH SCROLL */

document.querySelectorAll('a[href^="#"]')
.forEach(anchor => {

  anchor.addEventListener('click', function(e){

    e.preventDefault();

    const target = document.querySelector(
      this.getAttribute('href')
    );

    if(target){
      target.scrollIntoView({
        behavior:'smooth'
      });
    }

  });

});

/* ACTIVE MOBILE MENU STYLE */

const style = document.createElement('style');

style.innerHTML = `
@media(max-width:980px){

.nav-menu.active{
display:flex;
flex-direction:column;
position:absolute;
top:90px;
left:20px;
right:20px;
background:#0d0d0d;
padding:30px;
border-radius:25px;
gap:25px;
z-index:999;
border:1px solid rgba(212,175,55,.15);
box-shadow:
0 20px 50px rgba(0,0,0,.4);
}

.hidden{
opacity:0;
transform:translateY(80px);
transition:all 1s ease;
}

.show{
opacity:1;
transform:translateY(0);
}

}
`;

document.head.appendChild(style);
