let myTri = {
  x:200,
  y:600,
  r:0
}
let gameState="title";
let clockcounter = 30;
let score = 0;
let bulletArray = [];
let enemyArray = [];
let totalEnemies = 30;
let fire = false;
let bgimg;
let bgy = 0;
let heroimg;
let enemyimg;
var pewSound;
var bubblePopSound = new Audio("https://cdn.glitch.com/edd69898-e596-439e-a56b-fb0eb0c524f6%2Fbubblepop.mp3?1508813635715");
var failSound;
var winSound = new Audio("https://cdn.glitch.com/edd69898-e596-439e-a56b-fb0eb0c524f6%2Fwow.mp3?1508813645193");

function setup(){
  //createCanvas(640, 480);
  createCanvas(displayWidth,displayHeight);
  myTri.y=height*0.8;
  pewSound = loadSound("https://cdn.glitch.com/7691a1ca-d78d-487c-9ab5-6d5dc0da38b0%2FbreakoutClick2.mp3?1499205747579");
  failSound = loadSound("https://cdn.glitch.com/edd69898-e596-439e-a56b-fb0eb0c524f6%2FbreakoutDie.mp3?1508813656846");
  bgimg = loadImage("https://cdn.glitch.com/f964c8a2-d153-4788-abea-655acbc4b83d%2Fdotbg2.jpg?1510331277552");  // Load the image
  heroimg = loadImage("https://cdn.glitch.com/f964c8a2-d153-4788-abea-655acbc4b83d%2Fship.png?1510275465923");  // Load the image
  enemyimg = loadImage("https://cdn.glitch.com/f964c8a2-d153-4788-abea-655acbc4b83d%2Fenemy2.png?1510275464215");  // Load the image
  setInterval(clockTick,1000);
  for (let i=0; i<totalEnemies;i++){
    enemyArray[i] = new Enemy(random(0,width),0-i*90,25);
  }
}

function draw(){
  background(0);
  //tint(255,25);
  image(bgimg, 0, bgy-height, displayWidth, displayHeight);
  image(bgimg, 0, bgy, displayWidth, displayHeight);
  bgy+=3;
  if(bgy>height)
    bgy=0;
  drawTimer();
  if (gameState == "title"){
    titleScreen();
  } else {
    // inGame
    if (score<10 && enemyArray.length<10)
      enemyArray[enemyArray.length] = new Enemy(random(0,width),random(0-enemyArray.length*80),25);
    
    for (let i=0; i<bulletArray.length;i++){
      bulletArray[i].move();
      bulletArray[i].show();
    }
    for (let i=enemyArray.length-1; i>=0;i--){
      enemyArray[i].move();
      enemyArray[i].show();
      checkForCollision(i);
    }
    showTri();
    checkInput();
  
  }  
}

function checkForCollision(target){
  for (let i=bulletArray.length-1; i>=0;i--){
    if (enemyArray[target].contains(bulletArray[i].x,bulletArray[i].y)){
      score++;
      enemyArray.splice(target,1);
      bulletArray.splice(i,1);
      break;
    } else if (bulletArray[i].y<0){
      bulletArray.splice(i,1);
    }
  }
}

function drawTimer(){
  fill("red");
  textAlign(LEFT);
  textSize(32);
  text("Timer: "+clockcounter, 10, 30);

  text("Score: "+score, 10, 60);
}

function titleScreen(){
  stroke("white");
  strokeWeight(4);
  fill("red");
  textAlign(CENTER);
  textSize(32);
  text("Click anywhere to play", width/2, height/2);
}

function clockTick(){
  if (gameState=="inGame" && clockcounter > 0){
    clockcounter--;
  }
}

function mousePressed(){
  gameState = "inGame";
}

function keyPressed(){
  if (keyCode ==32){
    pewSound.play();
    bulletArray[bulletArray.length] = new Bullet(myTri.x,myTri.y-15,2);
  }
}

function showTri(){
  stroke(255);
  noFill();
  // A triangle
  //triangle(myTri.x, myTri.y-15,myTri.x-10, myTri.y+15, myTri.x+10, myTri.y+15);
  //tint(255,0);
  image(heroimg, myTri.x-13, myTri.y-45, heroimg.width/10, heroimg.height/10);
}
function checkInput(){
  if (mouseIsPressed){
    myTri.x=mouseX;
    if(fire){
      pewSound.play();
      bulletArray[bulletArray.length] = new Bullet(myTri.x,myTri.y-15,2);
      fire= false;
    }
  } else{
    fire = true;
  }
  if (keyIsDown(LEFT_ARROW))
    myTri.x-=9;

  if (keyIsDown(RIGHT_ARROW))
    myTri.x+=9;

//   if (keyIsDown(UP_ARROW))
//     myTri.y-=3;

//   if (keyIsDown(DOWN_ARROW))
//     myTri.y+=3;
  if(myTri.x>width){
    myTri.x=width;
  }else if (myTri.x<0){
    myTri.x=0;
  }
  if(myTri.y>height){
    myTri.y=height;
  }else if (myTri.y<0){
    myTri.y=0;
  }
}

class Bullet {
  constructor(_x,_y,_size){
    this.x = _x;
    this.y = _y;
    this.diam = _size;
    // Pick colors randomly
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
    this.alpha = 0;
    this.wasClicked = false;
  }
  setAlpha(_alf){
    this.alpha = _alf;
  }
  iWasClicked(){
    this.wasClicked = true;
  }
  wasThisClicked(){
    return this.wasClicked;
  }
  show(){
    stroke("yellow"); // yellow outline
	  strokeWeight(2); // line width
	  //noFill();
    fill(this.r, this.g, this.b, this.alpha);
	  ellipse(this.x, this.y, this.diam, this.diam); // draw an ellipse/circle
  }
  move(){
    this.y = this.y + random(-14.1,-15.0);
    
  }
  contains(_mousex,_mousey){
    let d = dist(_mousex,_mousey,this.x,this.y);
    if (d<this.diam/2){
      return true;
    } else {
      return false;
    }
  }
}

class Enemy {
  constructor(_x,_y,_size){
    this.x = _x;
    this.y = _y;
    this.diam = _size;
    // Pick colors randomly
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
    this.alpha = 0;
    this.wasClicked = false;
  }
  setAlpha(_alf){
    this.alpha = _alf;
  }
  iWasClicked(){
    this.wasClicked = true;
  }
  wasThisClicked(){
    return this.wasClicked;
  }
  show(){
    stroke("red"); // white outline
	  strokeWeight(2); // line width
	  //fill(125);
    //fill(this.r, this.g, this.b, this.alpha);
    //triangle(this.x,this.y,this.x-this.diam/4,this.y-this.diam,this.x+this.diam/4,this.y-this.diam);
	  //ellipse(this.x, this.y, this.diam*0.6, this.diam); // draw an ellipse/circle
    //tint(255,0);
    image(enemyimg, this.x-15, this.y-15, enemyimg.width/30, enemyimg.height/30);


  }
  move(){
    this.y = this.y - random(-1.5,-1.0);
    if (this.y>height){
      failSound.play();
      score--;
      this.y=-20;
    }
  }
  contains(_mousex,_mousey){
    let d = dist(_mousex,_mousey,this.x,this.y);
    if (d<this.diam/2){
      return true;
    } else {
      return false;
    }
  }
}