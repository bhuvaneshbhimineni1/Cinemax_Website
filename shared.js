const MOVIES = [
  { id:"1", title:"Dune: Part Three",   genre:"Sci-Fi / Epic",      rating:9.1, votes:"284K", duration:"2h 52m", badge:"4K",   emoji:"🏜️", stdPrice:220, premPrice:350, desc:"The final chapter of Paul Atreides' saga across Arrakis, leading a rebellion for the universe's most precious resource.", cast:["Timothée Chalamet","Zendaya","Rebecca Ferguson"], director:"Denis Villeneuve", language:"English",          release:"2026-01-10", tags:["Epic","Sci-Fi","Drama"] },
  { id:"2", title:"The Last Frontier",  genre:"Action / Thriller",  rating:8.4, votes:"191K", duration:"2h 18m", badge:"IMAX", emoji:"🚀", stdPrice:280, premPrice:420, desc:"An elite team races across three continents to stop a rogue satellite network before it triggers global warfare.",         cast:["Chris Hemsworth","Ana de Armas","Idris Elba"],    director:"Chad Stahelski",   language:"English",          release:"2026-02-14", tags:["Action","Thriller","Spy"] },
  { id:"3", title:"Neon Shadows",       genre:"Neo-Noir / Mystery", rating:8.9, votes:"142K", duration:"1h 58m", badge:"",     emoji:"🌆", stdPrice:200, premPrice:320, desc:"A disgraced detective unravels a conspiracy stretching to the highest levels of power in a rain-drenched neon city.",       cast:["Oscar Isaac","Cate Blanchett","Mahershala Ali"],  director:"Park Chan-wook",   language:"English/Korean",   release:"2026-02-28", tags:["Neo-Noir","Mystery","Crime"] },
  { id:"4", title:"Crimson Dynasty",    genre:"Historical / Drama", rating:8.6, votes:"178K", duration:"3h 05m", badge:"NEW",  emoji:"🏯", stdPrice:200, premPrice:320, desc:"A sweeping epic chronicling four generations of a noble family torn apart by war, love, and betrayal.",                    cast:["Tony Leung","Zhang Ziyi","Andy Lau"],             director:"Zhang Yimou",      language:"Mandarin",         release:"2026-03-05", tags:["Historical","Drama","War"] },
  { id:"5", title:"Quantum Break",      genre:"Sci-Fi / Action",    rating:7.8, votes:"156K", duration:"2h 10m", badge:"IMAX", emoji:"⚡", stdPrice:280, premPrice:420, desc:"A physicist who discovers time manipulation finds someone else already knows the secret and is using it against him.",      cast:["Florence Pugh","Michael B. Jordan","Awkwafina"], director:"Gareth Edwards",   language:"English",          release:"2026-03-12", tags:["Sci-Fi","Action","Time Travel"] },
  { id:"6", title:"Ocean's Reckoning",  genre:"Comedy / Heist",     rating:8.2, votes:"203K", duration:"1h 56m", badge:"",     emoji:"🎰", stdPrice:200, premPrice:320, desc:"The world's most charming thieves return for one last job at a casino owned by someone who knows all their tricks.",      cast:["Ryan Gosling","Margot Robbie","Donald Glover"],  director:"Steven Soderbergh",language:"English",          release:"2026-03-15", tags:["Comedy","Heist","Crime"] },
  { id:"7", title:"Midnight in Kyoto",  genre:"Romance / Drama",    rating:8.7, votes:"119K", duration:"2h 02m", badge:"",     emoji:"🌸", stdPrice:200, premPrice:320, desc:"Two strangers spend one magical night in Kyoto during cherry blossom season, carrying secrets that could unite or destroy.", cast:["Saoirse Ronan","Steven Yeun","Gemma Chan"],      director:"Sofia Coppola",    language:"English/Japanese", release:"2026-03-18", tags:["Romance","Drama","Art House"] },
  { id:"8", title:"Dark Matter",        genre:"Horror / Thriller",  rating:8.0, votes:"167K", duration:"1h 45m", badge:"NEW",  emoji:"👁️", stdPrice:200, premPrice:320, desc:"A family moves into their dream home only to discover the house exists simultaneously in a dimension where their worst fears are alive.", cast:["Lupita Nyong'o","Daniel Kaluuya","Anya Taylor-Joy"], director:"Jordan Peele", language:"English", release:"2026-03-17", tags:["Horror","Thriller","Psychological"] },
];

const SHOWTIMES = ["10:00 AM","01:30 PM","04:15 PM","07:00 PM","10:30 PM"];
const SHOWTIME_LABELS = {"10:00 AM":"Morning Show","01:30 PM":"Afternoon","04:15 PM":"Evening","07:00 PM":"Prime Time","10:30 PM":"Night Show"};
const PREMIUM_ROWS = new Set(["E","F","G","H"]);
const ROWS = ["A","B","C","D","E","F","G","H"];

const Store = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch{ return null; } },
  set: (k,v) => localStorage.setItem(k, JSON.stringify(v)),
  getBookings: () => Store.get("cx_bookings") || [],
  saveBooking: (b) => { const all = Store.getBookings(); all.unshift(b); Store.set("cx_bookings", all); },
  getWishlist: () => Store.get("cx_wishlist") || [],
  toggleWishlist: (id) => {
    const w = Store.getWishlist();
    const idx = w.indexOf(id);
    if(idx>=0) w.splice(idx,1); else w.push(id);
    Store.set("cx_wishlist", w);
    return idx < 0;
  }
};

function genTakenSeats(movieId, date, time) {
  const seed = (movieId+date+time).split("").reduce((a,c)=>a+c.charCodeAt(0),0);
  const rng = (s) => { let x=Math.sin(s)*10000; return x-Math.floor(x); };
  const taken = new Set();
  ROWS.forEach((r,ri) => {
    for(let i=1;i<=10;i++){
      if(rng(seed*ri*13+i*7)<0.28) taken.add(r+i);
    }
  });
  return taken;
}

function genBookingId() {
  return "CMX" + Math.random().toString(36).slice(2,8).toUpperCase();
}

function getNext7Days() {
  const days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const result=[];
  for(let i=0;i<7;i++){
    const d=new Date(); d.setDate(d.getDate()+i);
    result.push({ iso:d.toISOString().split("T")[0], day:i===0?"Today":i===1?"Tomorrow":days[d.getDay()], num:d.getDate(), month:months[d.getMonth()] });
  }
  return result;
}

function renderNav(activePage) {
  const pages = [
    {href:"index.html", label:"Home"},
    {href:"movies.html", label:"Movies"},
    {href:"offers.html", label:"Offers"},
    {href:"my-tickets.html", label:"My Tickets"},
  ];
  const bookings = Store.getBookings().length;
  return `
  <header>
    <a href="index.html" class="logo">CINEMAX</a>
    <nav>
      ${pages.map(p=>`<a href="${p.href}" class="${activePage===p.href?'active':''}">${p.label}</a>`).join("")}
    </nav>
    <div class="header-right">
      <a href="my-tickets.html" class="ticket-badge">${bookings>0?`<span class="badge-count">${bookings}</span>`:""}<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 012 2v3a2 2 0 000 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 000-4V7a2 2 0 012-2z"/></svg></a>
    </div>
  </header>`;
}

const SHARED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Lora:ital@0;1&display=swap');
  :root{
    --bg:#09090e;--surface:#111118;--card:#18181f;--card2:#1e1e27;--border:#252530;
    --accent:#e8c96d;--accent2:#ff6b6b;--accent3:#6de8c9;--text:#eeecf0;--muted:#6a6a88;
    --green:#4caf87;--purple:#8b5cf6;
  }
  *{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;min-height:100vh;overflow-x:hidden}
  a{text-decoration:none;color:inherit}
  header{display:flex;justify-content:space-between;align-items:center;padding:1.2rem 4rem;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:200;background:rgba(9,9,14,.95);backdrop-filter:blur(16px)}
  .logo{font-family:'Bebas Neue',sans-serif;font-size:1.9rem;letter-spacing:5px;color:var(--accent);text-shadow:0 0 28px rgba(232,201,109,.25)}
  nav{display:flex;gap:2rem}
  nav a{font-size:.82rem;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);transition:color .2s;position:relative;padding-bottom:2px}
  nav a::after{content:'';position:absolute;bottom:-2px;left:0;right:0;height:1px;background:var(--accent);transform:scaleX(0);transition:transform .25s}
  nav a:hover{color:var(--text)}
  nav a.active{color:var(--accent)}
  nav a.active::after,nav a:hover::after{transform:scaleX(1)}
  .header-right{display:flex;align-items:center;gap:1rem}
  .ticket-badge{color:var(--muted);position:relative;transition:color .2s;display:flex}
  .ticket-badge:hover{color:var(--accent)}
  .badge-count{position:absolute;top:-6px;right:-6px;background:var(--accent2);color:#fff;font-size:.6rem;font-weight:700;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center}
  .btn{padding:.8rem 2rem;border-radius:8px;border:none;font-family:'DM Sans',sans-serif;font-size:.82rem;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:.5rem}
  .btn-gold{background:var(--accent);color:var(--bg)}
  .btn-gold:hover{background:#f0d880;transform:translateY(-2px);box-shadow:0 8px 24px rgba(232,201,109,.3)}
  .btn-outline{background:transparent;color:var(--text);border:1.5px solid var(--border)}
  .btn-outline:hover{border-color:var(--muted);color:var(--text)}
  .movie-card{background:var(--card);border-radius:14px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:all .25s;position:relative}
  .movie-card:hover{transform:translateY(-5px);border-color:rgba(232,201,109,.4);box-shadow:0 12px 40px rgba(0,0,0,.5)}
  .movie-poster{height:260px;position:relative;background:linear-gradient(135deg,#18181f,#252530);display:flex;align-items:center;justify-content:center;overflow:hidden}
  .movie-emoji-bg{font-size:6rem;opacity:.13;user-select:none;transition:transform .4s}
  .movie-card:hover .movie-emoji-bg{transform:scale(1.15)}
  .movie-gradient{position:absolute;bottom:0;left:0;right:0;height:70%;background:linear-gradient(transparent,rgba(9,9,14,.95))}
  .movie-badge-tag{position:absolute;top:10px;right:10px;background:var(--accent2);color:#fff;font-size:.6rem;font-weight:700;letter-spacing:1.5px;padding:3px 8px;border-radius:4px;text-transform:uppercase}
  .movie-info{padding:1rem}
  .movie-title-sm{font-weight:600;font-size:.92rem;margin-bottom:.35rem;line-height:1.3}
  .movie-meta-row{color:var(--muted);font-size:.76rem;display:flex;gap:.5rem;flex-wrap:wrap;align-items:center}
  .star{color:var(--accent);font-weight:700}
  .section{padding:5rem 4rem}
  .section-header{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:2.5rem}
  .section-title{font-family:'Bebas Neue',sans-serif;font-size:2rem;letter-spacing:4px;line-height:1}
  .section-sub{color:var(--muted);font-size:.82rem;letter-spacing:1px;margin-top:.3rem}
  .see-all{font-size:.75rem;letter-spacing:2px;text-transform:uppercase;color:var(--muted);display:flex;align-items:center;gap:.4rem;transition:color .2s}
  .see-all:hover{color:var(--accent)}
  .movies-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:1.4rem}
  .alert-bar{background:rgba(232,201,109,.08);border:1px solid rgba(232,201,109,.3);border-radius:8px;padding:.7rem 1rem;color:var(--accent);font-size:.8rem;display:none;margin-top:.8rem}
  .alert-bar.show{display:block}
  .alert-bar.err{background:rgba(255,107,107,.07);border-color:rgba(255,107,107,.3);color:var(--accent2)}
  footer{border-top:1px solid var(--border);padding:3rem 4rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:2rem;margin-top:4rem}
  .footer-logo{font-family:'Bebas Neue',sans-serif;font-size:1.4rem;letter-spacing:4px;color:var(--accent)}
  .footer-links{display:flex;gap:2rem}
  .footer-links a{font-size:.75rem;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);transition:color .2s}
  .footer-links a:hover{color:var(--text)}
  .footer-copy{font-size:.73rem;color:var(--muted)}
  @media(max-width:768px){
    header{padding:1rem 1.2rem}
    nav{display:none}
    .section{padding:3rem 1.2rem}
    footer{padding:2rem 1.2rem;flex-direction:column;align-items:flex-start}
  }
`;
