const header = document.querySelector('.header');

window.addEventListener('scroll', () => {

  if(window.scrollY > 50){
    header.style.background = "rgba(0,0,0,.85)";
    header.style.boxShadow = "0 10px 35px rgba(0,0,0,.35)";
  } else {
    header.style.background = "rgba(0,0,0,.35)";
    header.style.boxShadow = "none";
  }

});


const observer = new IntersectionObserver((entries) => {

  entries.forEach((entry) => {

    if(entry.isIntersecting){
      entry.target.classList.add('show');
    }

  });

},{
  threshold:0.15
});


document.querySelectorAll(
'.about-card, .card, .skill, .contact-box, .hero-left, .hero-right'
).forEach((el)=>{

  el.classList.add('hidden');
  observer.observe(el);

});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {

  anchor.addEventListener('click', function(e){

    e.preventDefault();

    const target = document.querySelector(
      this.getAttribute('href')
    );

    target.scrollIntoView({
      behavior:'smooth'
    });

  });

});
