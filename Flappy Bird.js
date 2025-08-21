//board
let board;
let boardWidth = 360;
let boardHeight = 570;
let context;

//bird
let birdWidth = 35;  //variables 
let birdHeight = 32;
let birdX = 50;
let birdY = boardHeight / 2 - birdHeight / 2; // center vertically

let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight,
}

//variables for pipe:
let pipeArray = [];   
 //We create pipeArray to store multiple pipe 
// objects that appear on the game board.

let pipeWidth = 64;
let pipeHeight = 450;
let pipeX = boardWidth;
let pipeY = 0; //from the top

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2;
let velocityY = 0; //bird jump velocity
let gravity = 0.4;
let gameOver = false;
let score=0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); 
    // context.fillStyle = "green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    birdImg = new Image();  //creates a new Image object to hold the bird picture
    birdImg.src = "./flappybird (1).png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height)
    }

    //top pipe
    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    //bottom pipe
    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);
    if(bird.y>board.height){
        gameOver=true;
      
    } 

    //bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
 
    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
    score += 0.5;
    pipe.passed = true;
}


        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }
    while(pipeArray.length> 0 && pipeArray[0].x<-pipeWidth){
        pipeArray.shift();
    }

    //score
      context.fillStyle="white";
      context.font="45px sans-serif";
      context.fillText(score, 5, 45);
      
      if (gameOver) {
    context.fillStyle = "red";                // Make it stand out
    context.font = "48px sans-serif";         // Bigger font
    context.fillText("Game Over", 48, boardHeight/2);
}
}

function placePipes() {
    if (gameOver) { // fixed typo here
        return;
    }
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * pipeHeight / 2;
    let openingSpace = board.height / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(topPipe);

    let bottompipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(bottompipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        velocityY = -6;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}
