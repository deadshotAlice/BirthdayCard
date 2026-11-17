
const blessings=[
    {
        img:'public/figure1.jpg',
        word:'生日快乐感情顺利喵。',
    },
    {
        img:'public/figure2.jpg',
        word:'李桑，祝掼蛋头游！一千万豆子！同花飞机！！！',
    },
    {
        img:'public/figure3.jpg',
        word:'好好吃饭，好好睡觉，天天开心！',
    },
    {
        img:'public/figure4.jpg',
        word:'Diao！！！给你放首“大肘子”的歌！',
    },
    {
        img:'public/figure5.jpg',
        word:'儿子。',

    },
]

function createEmpty(){
        const empty=document.createElement('p');
        empty.className='empty-message';
        empty.textContent='喵喵喵喵';
        return empty;
}

 function createBlessingCard({ img: src, word }) {
    const card = document.createElement('article');
    card.className = 'box';
    const bg = document.createElement('div');
    bg.className = 'elements bg';
    const imgBx = document.createElement('div');     
    imgBx.className = 'elements imgBx';
    const img = document.createElement('img');
    img.src = src;
    img.alt = word;
    imgBx.append(img);
    const name = document.createElement('div');   
    name.className = 'elements name';
    name.textContent=word;
    // const h2 = document.createElement('h2');
    // h2.textContent = word;
    // name.append(h2);
    const glass = document.createElement('div');     
    glass.className = 'card';
    card.append(bg, imgBx, name, glass);
    return card;
  }

function render(){
    const container1=document.querySelector('.container1');
    if(!container1){
        return;
    }
    container1.innerHTML='';
    if(blessings.length===0){
        container1.append(createEmpty());
        return;
    }
    container1.append(...blessings.map(createBlessingCard));

}
    render();