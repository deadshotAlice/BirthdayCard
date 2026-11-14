
const $=(s)=>document.querySelector(s);
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const canvas=$('#fx');
const button=$('.button');
const ctx = canvas.getContext("2d");
let particles=[];
let last=0;
function resize(){
    canvas.width=innerWidth;
    canvas.height=innerHeight;
}
resize();
addEventListener('resize',resize);
function burst(x,y,count=7,explosion=false){
    if(reduced){
        return;
    }
    for(let i=0;i<count;i++){
        let a=Math.random()*Math.PI*2;
        let s=explosion?Math.random()*10:Math.random()*2;
        particles.push({
            x,
            y,
            vx:Math.cos(a)*s,
            vy:explosion?Math.sin(a)*s:-Math.random()*3-1,
            life:1,
            decay:explosion?0.1+Math.random()*0.03:0.04+Math.random()*0.05,
            size:explosion?Math.random()*5+2:Math.random()*3+1,
            hue:Math.random()*40+10,

        })
    }
    if(particles.length>1800){
        particles.splice(0,particles.length-1800);
    }

}
addEventListener("pointermove",(e)=>{
    if(e.pointerType==='mouse'&&performance.now()-last>4){
        burst(e.clientX,e.clientY,4);
        last=performance.now();
    }
})
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.globalCompositeOperation='lighter';
    particles=particles.filter((p)=>(p.life>0));
    for(let p of particles){
        p.x+=p.vx;
        p.y+=p.vy;
        p.life-=p.decay;
        ctx.beginPath();
        ctx.fillStyle=`hsla(${p.hue},100%,80%,${Math.max(0.5,0.5+p.life*0.2)})`;
        ctx.shadowBlur=12;
        ctx.shadowColor='#ff8bee';
        ctx.ellipse(
            p.x,
            p.y,
            Math.max(0.1,p.life*p.size),
            Math.max(0.1,p.life*p.size*1.8),
            0,
            0,
            Math.PI*2,

        );
        ctx.fill();
    }
      requestAnimationFrame(draw);
}
if(!reduced){
    draw();
}
addEventListener("pointerdown",(e)=>{
    burst(
        e.clientX,
        e.clientY,
        100,
        true,
    );
})

const flame=$('.flame');
const cake=$('.cake');
const cakeContainer=$('.cakeContainer');
const elementsWord=$('.elements.word');
if(flame) flame.remove();
if(cake) cake.addEventListener('click',()=>{
    cakeContainer.appendChild(flame);});
document.querySelectorAll(".box").forEach((el)=>{
    VanillaTilt.init(el, {
        max: 25,
        speed: 400,
        glare: true,
    });
});
document.querySelectorAll(".elements.word").forEach((el)=>{
    VanillaTilt.init(el, {
        max: 25,
        speed: 400,
        glare: true,
    });
});

const radius = 360;
const total = 8;

let rotation = 0,
  galleryIndex = 0,
  autoTimer;

for (let i = 0; i < total; i++) {
  const card = document.createElement("div");
  card.className = "orbit-card";
  card.innerHTML = `<img src="public/画廊${i + 1}.jpg" alt="Random Photo ${i + 1}"><span>MEMORY / 00${i + 1}</span>`;
  card.style.transform = `rotateY(${i * (360 / total)}deg) translateZ(${radius}px)`;
  $("#ring").append(card);
}

function rotate(d) {
  rotation -= d * (360 / total);
  galleryIndex = (galleryIndex + d + total) % total;
  $("#ring").style.transform = `rotateY(${rotation}deg)`;
  $("#galleryCount").textContent = `0${galleryIndex + 1} / 0${total}`;
}

$("#prevGallery").onclick = () => rotate(-1);
$("#nextGallery").onclick = () => rotate(1);
$("#autoGallery").onclick = () => {
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  } else {
    autoTimer = setInterval(() => {
      if (!document.hidden) rotate(1);
    }, 2600);
  }
  $("#autoGallery").textContent = autoTimer ? "暂停旋转" : "自动旋转";
  $("#autoGallery").setAttribute("aria-pressed", !!autoTimer);
};

let swipeX = 0;
$("#orbit").addEventListener(
  "touchstart",
  (e) => (swipeX = e.touches[0].clientX),
  { passive: true },
);
$("#orbit").addEventListener(
  "touchend",
  (e) => {
    const d = swipeX - e.changedTouches[0].clientX;
    if (Math.abs(d) > 40) rotate(d > 0 ? 1 : -1);
  },
  { passive: true },
);
