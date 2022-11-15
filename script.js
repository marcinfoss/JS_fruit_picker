window.addEventListener('mousemove',this.mousePosition,false);
window.addEventListener('click',this.mouseClickHandler,false);
window.addEventListener('keydown',this.keyHandler,false);
window.addEventListener('touchend',this.touchHandler, false);

function touchHandler(e) {
    // Cache the client X/Y coordinates
    playerPosition.x = e.touches[0].clientX - canvasPosition.x - 64;
    playerPosition.y = e.touches[0].clientY - canvasPosition.y - 64;
    console.log(playerPosition, e);
}

function mousePosition(e){
    playerPosition.x = e.clientX - canvasPosition.x - 64;
    playerPosition.y = e.clientY - canvasPosition.y - 64;
}

function mouseClickHandler(e){
    if(!musicStarted){
        backgroundMusic.play();
        musicStarted = true;
    }
}

function keyHandler(e){
    if(e.keyCode == 32){
        if(gameSpeed == 0){
            gameSpeed = 1;
        }
        else {
            gameSpeed = 0;
        }
    }
    console.log(e.keyCode, " ", gameSpeed);
}


const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

let canvasPosition = canvas.getBoundingClientRect();
const CANVAS_WIDTH = canvas.width = Math.floor(canvasPosition.width);
const CANVAS_HEIGHT = canvas.height = Math.floor(canvasPosition.height);

ctx.font = '50px Impact';
let musicStarted=false;
const backgroundMusic = new Audio();
backgroundMusic.src = "sound/the_field_of_dreams.mp3";
backgroundMusic.loop = true;

const playerImage = new Image();
playerImage.src = 'img/wooden_crate_01.png';
const spriteWidth = 64;
const spriteHeight = 64;

const background1 = new Image();
background1.src = 'img/backgrounds/background01.jpg';
const background2 = new Image();
background2.src = 'img/backgrounds/background02.jpg';
const background3 = new Image();
background3.src = 'img/backgrounds/background03.jpg';
const background4 = new Image();
background4.src = 'img/backgrounds/background04.jpg';
const background = [background1, background2, background3, background4];

let gameFrame = 0;
let gameSpeed = 1;
let score = 0;
let dropped = 0;

let playerPosition = {x:100, y:100};


//fruit images
const peach1 = new Image();
peach1.src = 'img/cake_64/35.png';
const apple1 = new Image();
apple1.src = 'img/cake_64/36.png';
const orange1 = new Image();
orange1.src = 'img/cake_64/37.png';
const tomato1 = new Image();
tomato1.src = 'img/cake_64/38.png';
const peach2 = new Image();
peach2.src = 'img/cake_64/39.png';
const apple2 = new Image();
apple2.src = 'img/cake_64/40.png';
const orange2 = new Image();
orange2.src = 'img/cake_64/41.png';
const tomato2 = new Image();
tomato2.src = 'img/cake_64/42.png';
const peach3 = new Image();
peach3.src = 'img/cake_64/43.png';
const apple3 = new Image();
apple3.src = 'img/cake_64/44.png';
const orange3 = new Image();
orange3.src = 'img/cake_64/45.png';
const tomato3 = new Image();
tomato3.src = 'img/cake_64/46.png';
const bodyElement = document.getElementById('body');
//sounds
/*dropSound = new Audio();
dropSound.src = "sound/dropped.wav";
pickedSound = new Audio();
pickedSound.src = "sound/picked.wav";
*/
const FRUIT_IMAGES = [
    peach1,
    apple1,
    orange1,
    tomato1,
    peach2,
    apple2,
    orange2,
    tomato2,
    peach3,
    apple3,
    orange3,
    tomato3
];

function drawScore(){
    ctx.fillStyle = 'black';
    ctx.fillText('Złapałaś: '+ score + " owoców!  Upadło " + dropped + " owoców.", 50,75);
    ctx.fillStyle = 'white';
    ctx.fillText('Złapałaś: '+ score + " owoców!  Upadło " + dropped + " owoców.", 55,80);
}
function playerCollision(x,y,size){
    if( x > (playerPosition.x + 48 + size/2) ||
        x < (playerPosition.x - 48 - size/2) ||
        y > (playerPosition.y + 10) ||
        y < playerPosition.y - size/4){
            return false;
        }
        else {
            console.log(playerPosition," x:",x, "y:",y)
            return true;
        }
}

class Fruit{
    constructor(){
        this.x = Math.round(Math.random() * (CANVAS_WIDTH - 200) + 90);
        this.y = -64;
        this.size = Math.round(Math.random()*64+64);
        let fruitNumber = Math.floor(Math.random()*FRUIT_IMAGES.length);
        //console.log(fruitNumber);
        this.image = FRUIT_IMAGES[fruitNumber];
        this.speed = Math.floor(Math.random()*5+5);
        this.markForDelete = false;
        this.dropSound = new Audio();
        this.dropSound.src = "sound/dropped.wav";
        this.pickedSound = new Audio();
        this.pickedSound.src = "sound/picked.wav";
        
    }
    update(){
        this.y += this.speed * gameSpeed;
        if( this.y + this.size > CANVAS_HEIGHT ) {
            this.markForDelete = true;
            dropped++;
            this.dropSound.play();
            bodyElement.style.backgroundColor = "rgb(255, 0, 0)";

        }
        if(playerCollision(this.x, this.y, this.size)){
            score++;
            this.markForDelete = true;
            this.pickedSound.play();
            let r=Math.floor(Math.random()*255);
            let g=Math.floor(Math.random()*255);
            let b=Math.floor(Math.random()*255);
            
            bodyElement.style.backgroundColor = "rgb("+r+","+g+","+b+")";
        }
    }

    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
    }

};

let fruits = [];
const fruitInterval = 800;
let timeToNextFruit = 0;
let lastTime = 0;

function animate(timestamp){
    ctx.clearRect(0, 0 , CANVAS_WIDTH, CANVAS_HEIGHT);
    backgroundNumber= (Math.floor((score/15)) % background.length);
    ctx.drawImage(background[backgroundNumber], 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    let deltatime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextFruit += deltatime*gameSpeed;
    if(timeToNextFruit > fruitInterval){
        fruits.push(new Fruit())
        timeToNextFruit = 0;
    };
    [...fruits].forEach(object => object.update());
    [...fruits].forEach(object => object.draw());
    fruits = fruits.filter(object => !object.markForDelete);
    ctx.drawImage(playerImage, playerPosition.x, playerPosition.y, 128, 128);
    drawScore();
    requestAnimationFrame(animate);
}

animate(0);