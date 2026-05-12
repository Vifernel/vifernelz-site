*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:'Poppins',sans-serif;
}

body{
background:#0a0a0a;
color:#fff;
overflow-x:hidden;
}

a{
text-decoration:none;
color:inherit;
}

/* HEADER */
.header{
position:fixed;
top:0;
width:100%;
z-index:1000;
background:rgba(0,0,0,0.6);
backdrop-filter:blur(10px);
}

.navbar{
display:flex;
justify-content:space-between;
align-items:center;
padding:15px 20px;
}

.logo{
font-weight:800;
font-size:20px;
color:#fff;
}

.logo span{
color:#d4af37;
}

.header-right{
display:flex;
align-items:center;
gap:15px;
}

.top-whatsapp{
color:#25D366;
font-size:22px;
}

/* MENU */
.menu-toggle{
font-size:22px;
cursor:pointer;
color:#fff;
}

.nav-menu{
position:fixed;
top:0;
left:0;
width:100%;
height:100vh;
background:#050505;
display:flex;
justify-content:space-between;
padding:60px 40px;
transform:translateX(-100%);
transition:0.5s;
z-index:9999;
}

.nav-menu.active{
transform:translateX(0);
}

.nav-menu a{
display:block;
font-size:28px;
margin-bottom:20px;
color:#fff;
font-weight:600;
}

.nav-menu a:hover{
color:#d4af37;
}

.menu-box{
background:rgba(255,255,255,0.05);
padding:20px;
margin-bottom:20px;
border-left:3px solid #d4af37;
}

/* HERO */
.hero{
min-height:100vh;
display:flex;
align-items:center;
justify-content:space-between;
padding:120px 50px 50px;
}

.hero-content{
max-width:600px;
}

.badge{
background:#d4af37;
color:#000;
padding:5px 15px;
border-radius:20px;
font-size:12px;
font-weight:600;
}

.hero h1{
font-size:50px;
margin:20px 0;
}

.hero h1 span{
color:#d4af37;
}

.hero p{
color:#ccc;
line-height:1.6;
}

.hero-buttons{
margin-top:20px;
display:flex;
gap:15px;
}

.btn-primary{
background:#d4af37;
color:#000;
padding:10px 20px;
border-radius:30px;
font-weight:600;
}

.btn-secondary{
border:1px solid #d4af37;
padding:10px 20px;
border-radius:30px;
color:#d4af37;
}

.hero-stats{
display:flex;
gap:20px;
margin-top:30px;
}

.hero-stats div{
text-align:center;
}

.hero-image img{
width:320px;
border-radius:20px;
box-shadow:0 0 30px rgba(212,175,55,0.4);
}

/* SECTIONS */
.section{
padding:80px 50px;
}

.section h2{
font-size:30px;
margin-bottom:40px;
color:#d4af37;
}

.grid{
display:flex;
gap:40px;
align-items:center;
}

.about-img{
width:300px;
border-radius:20px;
}

.cards{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
gap:20px;
}

.card{
background:rgba(255,255,255,0.05);
padding:20px;
border-radius:15px;
text-align:center;
border:1px solid rgba(255,255,255,0.1);
transition:0.3s;
}

.card:hover{
transform:translateY(-10px);
border-color:#d4af37;
}

/* WHATSAPP FLOAT */
.whatsapp-float{
position:fixed;
bottom:20px;
right:20px;
background:#25D366;
color:#fff;
width:60px;
height:60px;
border-radius:50%;
display:flex;
align-items:center;
justify-content:center;
font-size:30px;
box-shadow:0 0 20px rgba(37,211,102,0.5);
animation:pulse 2s infinite;
z-index:9999;
}

@keyframes pulse{
0%{transform:scale(1);}
50%{transform:scale(1.1);}
100%{transform:scale(1);}
}

/* RESPONSIVE */
@media(max-width:768px){
.hero{
flex-direction:column;
text-align:center;
}

.hero h1{
font-size:35px;
}

.grid{
flex-direction:column;
}
}
