/* story.js — Tahap 2: scroll bercerita. Dimuat setelah script utama (butuh window.HK, GSAP, ScrollTrigger).
   HP 3D yang SAMA dari hero dipinjam: canvas dipindah ke area pin, lalu dikembalikan ke hero. */
(function(){
'use strict';
var HK=window.HK, THREE=HK.THREE;

/* ============ CONFIG.cerita: teks & isi layar contoh (ubah di sini) ============ */
CONFIG.cerita={
  kicker:'Dari kosong jadi tayang',
  // Isi layar HP contoh. Harga di bawah hanya CONTOH untuk mockup, ganti sesuai aslinya.
  warung:{nama:'Pojok nDesa',telp:'08xx-xxxx-xxxx',tagline:'Warung makan rumahan di Magelang',lokasi:'Magelang, Jawa Tengah'},
  menu:[['Bebek Goreng','25.000'],['Ayam Goreng','18.000'],['Nila Bakar','22.000'],['Es Teh Manis','4.000']],
  // {kuota} otomatis diganti CONFIG.kuotaTotal. "aksen" = potongan kalimat yang diwarnai hijau.
  langkah:[
    {label:'Masalah',teks:'Pelanggan cari usahamu lewat HP, tapi yang mereka temukan kosong.',aksen:'kosong.'},
    {label:'Menu muncul',teks:'Menu dan harga rapi, nggak perlu ditanya satu-satu.',aksen:'rapi,'},
    {label:'Tombol pesan',teks:'Satu tap, pesanan langsung masuk WhatsApp.',aksen:'langsung masuk WhatsApp.'},
    {label:'Jadi',teks:'Jadi satu link yang siap dibagikan. Gratis untuk {kuota} usaha pertama.',aksen:'Gratis untuk {kuota} usaha pertama.'}
  ]
};
var Z=CONFIG.cerita, WG=Z.warung, N=Z.langkah.length;

/* ============ Bagian HTML (disisipkan tepat setelah marquee) ============ */
var sec=document.createElement('section');
sec.className='story'; sec.id='story';
sec.setAttribute('aria-label','Cerita: dari halaman kosong jadi halaman utuh');
sec.innerHTML='<div class="story-pin"><div class="story-glow"></div><span class="kicker story-kicker"></span>'+
  '<div class="story-copy"><div class="story-slides"></div></div><div class="story-steps"></div></div>';
document.querySelector('.marquee').insertAdjacentElement('afterend',sec);
var pin=sec.querySelector('.story-pin');
sec.querySelector('.story-kicker').textContent=Z.kicker;
var slides=[], steps=[];
Z.langkah.forEach(function(s,i){
  var k=String(CONFIG.kuotaTotal), txt=s.teks.replace('{kuota}',k), ak=s.aksen.replace('{kuota}',k);
  var d=document.createElement('div'); d.className='story-slide';
  d.innerHTML='<p>'+txt.replace(ak,'<em>'+ak+'</em>')+'</p>';
  sec.querySelector('.story-slides').appendChild(d); slides.push(d);
  var st=document.createElement('div'); st.className='story-step';
  st.innerHTML='<span></span><i><b></b></i>'; st.querySelector('span').textContent=(i+1)+'. '+s.label;
  sec.querySelector('.story-steps').appendChild(st); steps.push(st);
});

/* ============ Menggambar layar HP lewat Canvas 2D (crossfade antar langkah) ============ */
var W=HK.screenCanvas.width, H=HK.screenCanvas.height, FONT='"Plus Jakarta Sans",system-ui,sans-serif';
var NAVY='#14295C', YEL='#FACC15';   // khusus isi layar contoh Pojok nDesa
function mk(){var c=document.createElement('canvas');c.width=W;c.height=H;return c;}
var LA=mk(), LB=mk();
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
function tx(c,s,x,y,f,col,al){c.font=f;c.fillStyle=col;c.textAlign=al||'left';c.fillText(s,x,y);}
function ease(t){t=Math.max(0,Math.min(1,t));return 1-Math.pow(1-t,3);}
function chrome(c,col){ // status bar + dynamic island
  tx(c,'09.41',60,70,'700 28px '+FONT,col); c.fillStyle='rgba(0,0,0,.85)'; rr(c,W/2-92,30,184,52,26); c.fill();
  c.fillStyle=col; rr(c,W-110,50,44,20,6); c.fill();
}
function rows(c,k,o){ // daftar menu; baris masuk satu per satu sesuai k (0..1)
  Z.menu.forEach(function(m,i){
    var t=ease((k*1.6-i*.35)/.6), y=o.y+i*o.gap, dx=(1-t)*60, s='Rp '+m[1];
    c.globalAlpha=t; tx(c,m[0],48+dx,y,'700 40px '+FONT,o.ink);
    if(o.pill){
      c.font='700 30px '+FONT; var pw=c.measureText(s).width+36;
      c.fillStyle=YEL; rr(c,W-48-pw+dx,y-38,pw,54,27); c.fill(); tx(c,s,W-66+dx,y,'700 30px '+FONT,NAVY,'right');
    }else tx(c,s,W-48+dx,y,'600 34px '+FONT,'#94A3B8','right');
    c.strokeStyle=o.line; c.lineWidth=2; c.beginPath(); c.moveTo(48+dx,y+30); c.lineTo(W-48+dx,y+30); c.stroke();
  });
  c.globalAlpha=1;
}
function darkHead(c){
  c.fillStyle='#0B1220'; c.fillRect(0,0,W,H); chrome(c,'#E5E7EB');
  tx(c,'WARUNG MAKAN RUMAHAN',48,190,'700 24px '+FONT,'#22C55E');
  tx(c,WG.nama,48,300,'800 96px '+FONT,'#E5E7EB');
  tx(c,'MENU',48,470,'700 24px '+FONT,'#94A3B8');
}
var DRAW=[
  function(c){ // 1. Masalah: halaman kosong, abu, hanya nama + telepon
    c.fillStyle='#E5E7EB'; c.fillRect(0,0,W,H); chrome(c,'#0B1220');
    tx(c,WG.nama,W/2,700,'800 84px '+FONT,'#0B1220','center');
    tx(c,'Telp. '+WG.telp,W/2,780,'600 34px '+FONT,'#94A3B8','center');
  },
  function(c,k){ // 2. Menu muncul satu per satu
    darkHead(c); rows(c,k,{y:560,gap:112,ink:'#E5E7EB',line:'rgba(255,255,255,.08)'});
  },
  function(c,k){ // 3. Tombol hijau muncul + berdenyut sekali
    darkHead(c); rows(c,1,{y:560,gap:112,ink:'#E5E7EB',line:'rgba(255,255,255,.08)'});
    var a=ease(k*2), p=Math.max(0,Math.min(1,(k-.45)*3)), s=.85+.15*a+.07*Math.sin(Math.PI*p);
    c.save(); c.translate(W/2,1300); c.scale(s,s); c.globalAlpha=a;
    c.fillStyle='#22C55E'; rr(c,-300,-54,600,108,54); c.fill();
    c.strokeStyle='#22C55E'; c.lineWidth=6; c.globalAlpha=a*(1-p)*(p>0?1:0);
    rr(c,-300-p*30,-54-p*30,600+p*60,108+p*60,54+p*30); c.stroke();
    c.globalAlpha=a; tx(c,'Pesan via WA',0,14,'800 40px '+FONT,'#0B1220','center'); c.restore();
  },
  function(c){ // 4. Jadi: halaman utuh gaya Pojok nDesa (biru tua & kuning)
    c.fillStyle='#F5F7FB'; c.fillRect(0,0,W,H);
    c.fillStyle=NAVY; c.fillRect(0,0,W,480); chrome(c,'#E5E7EB');
    tx(c,WG.nama,48,290,'800 100px '+FONT,YEL); tx(c,WG.tagline,48,350,'500 29px '+FONT,'#E5E7EB');
    var x=48; ['Bebek','Ayam','Nila','Prasmanan'].forEach(function(l){
      c.font='700 26px '+FONT; var w=c.measureText(l).width+44;
      c.fillStyle=YEL; rr(c,x,400,w,52,26); c.fill(); tx(c,l,x+22,436,'700 26px '+FONT,NAVY); x+=w+12;
    });
    c.fillStyle=YEL; rr(c,48,520,W-96,84,24); c.fill();
    tx(c,'Terima pesanan nasi kotak',W/2,574,'700 30px '+FONT,NAVY,'center');
    rows(c,1,{y:720,gap:104,ink:NAVY,line:'rgba(20,41,92,.12)',pill:true});
    c.fillStyle='#22C55E'; rr(c,48,1210,W-96,108,54); c.fill();
    tx(c,'Pesan via WA',W/2,1276,'800 40px '+FONT,NAVY,'center');
    tx(c,WG.lokasi,W/2,1400,'600 28px '+FONT,'#94A3B8','center');
  }
];
function renderScreen(v){ // v = posisi langkah desimal (0..N); crossfade di akhir tiap langkah
  var sf=Math.min(v,N-.001), i=Math.floor(sf), fr=sf-i, bl=Math.max(0,(fr-.78)/.22);
  bl=bl*bl*(3-2*bl);
  DRAW[i](LA.getContext('2d'),Math.min(1,fr/.7));
  var c=HK.screenCtx; c.clearRect(0,0,W,H); c.save(); rr(c,0,0,W,H,98); c.clip(); c.drawImage(LA,0,0);
  if(bl>0&&i<N-1){ DRAW[i+1](LB.getContext('2d'),0); c.globalAlpha=bl; c.drawImage(LB,0,0); }
  c.restore(); HK.screenTexture.needsUpdate=true;
  steps.forEach(function(s,j){ s.classList.toggle('on',j===i); s.querySelector('b').style.transform='scaleX('+Math.max(0,Math.min(1,sf-j))+')'; });
}
HK.drawScreenStep=function(v){renderScreen(v);};

/* ============ Linimasa scroll: HP berputar, miring, kamera mendekat, lalu netral ============ */
var sv={px:0,sc:1,rx:0,ry:0,zoom:0,gs:1}, st={v:0}, mounted=false;
function apply(){ // salin nilai cerita ke HK.story (dibaca render loop di index.html)
  var S=HK.story, cam=HK.camera, vH=2*9*Math.tan(THREE.MathUtils.degToRad(cam.fov/2));
  S.x=cam.aspect>=1 ? sv.px*vH*cam.aspect*0.24 : 0;   // desktop: ke kanan; HP kecil: tetap tengah di atas teks
  S.scale=sv.sc; S.rx=sv.rx; S.ry=sv.ry; S.zoom=sv.zoom; S.gs=sv.gs;
}
function update(){ if(mounted){ apply(); renderScreen(st.v); } }
function neutral(){ Object.assign(HK.story,{x:0,y:0,scale:1,rx:0,ry:0,rz:0,zoom:0,gs:1}); }

var tl=gsap.timeline({
  defaults:{ease:'none',immediateRender:false}, onUpdate:update,
  scrollTrigger:{trigger:sec,start:'top top',end:'bottom bottom',pin:pin,pinSpacing:false,scrub:0.8,anticipatePin:1}
});
tl.fromTo(sv,{px:0,ry:0,gs:1},{px:1,ry:-.5,gs:.6,duration:.1,ease:'power2.out'},0)            // masuk ke sisi layar
  .fromTo(sv,{ry:-.5},{ry:.5,duration:.8},.1)                                                   // putar bertahap -0.5 -> 0.5
  .fromTo(sv,{rx:0},{rx:.14,duration:.25,ease:'sine.inOut'},.15)
  .fromTo(sv,{rx:.14},{rx:-.08,duration:.3,ease:'sine.inOut'},.4)
  .fromTo(sv,{rx:-.08},{rx:0,duration:.2,ease:'sine.inOut'},.7)
  .fromTo(sv,{zoom:0},{zoom:1.5,duration:.14,ease:'power2.inOut'},.72)                          // kamera mendekat (langkah akhir)
  .fromTo(sv,{px:1,ry:.5,zoom:1.5,gs:.6},{px:0,ry:0,zoom:0,gs:1,duration:.1,ease:'power2.inOut'},.9) // kembali netral
  .fromTo(st,{v:0},{v:N,duration:.8},.1);                                                       // langkah layar HP
slides.forEach(function(d,i){
  var a=i===0?.04:.1+.2*i;
  tl.fromTo(d,{opacity:0,y:40},{opacity:1,y:0,duration:.05,ease:'power2.out'},a);
  tl.fromTo(d,{opacity:1,y:0},{opacity:0,y:-40,duration:.05,ease:'power2.in'},i<N-1?.1+.2*(i+1)-.05:.9);
});

/* ============ Pinjam canvas hero selama bagian cerita aktif ============ */
function mount(on){
  if(on===mounted) return;
  mounted=on;
  var host=on?pin:document.getElementById('hero');
  host.insertBefore(HK.renderer.domElement,host.firstChild);
  HK.host=host; HK.storyOn=on;                 // storyOn: render loop tetap jalan walau hero keluar layar
  if(on){ apply(); renderScreen(st.v); } else { neutral(); HK.drawScreen(); HK.screenTexture.needsUpdate=true; }
  HK.resize();
}
var mt=ScrollTrigger.create({trigger:sec,start:'top top',end:'bottom top',onToggle:function(s){mount(s.isActive);}});
ScrollTrigger.addEventListener('refresh',function(){mount(mt.isActive); update();});

/* ============ ScrollTrigger.refresh(): setelah loader selesai & saat ukuran layar berubah ============ */
var html=document.documentElement, rt;
function refresh(){ HK.resize(); ScrollTrigger.refresh(); }
var mo=new MutationObserver(function(){
  if(html.classList.contains('is-loading')) return;
  mo.disconnect(); setTimeout(refresh,60); setTimeout(refresh,1500);   // loader selesai, lalu setelah tirai benar-benar hilang
});
if(html.classList.contains('is-loading')) mo.observe(html,{attributes:true,attributeFilter:['class']}); else refresh();
window.addEventListener('load',function(){ScrollTrigger.refresh();});
document.fonts.ready.then(function(){ScrollTrigger.refresh();});
function onResize(){ clearTimeout(rt); rt=setTimeout(refresh,120); }
window.addEventListener('resize',onResize); window.addEventListener('orientationchange',onResize);
})();
