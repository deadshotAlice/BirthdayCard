
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