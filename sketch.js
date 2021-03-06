var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOver, gameOverIm;
var restart, restartIm;

var check;
var jumpSound;
var dieSound;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverIm = loadImage("gameOver.png");

  restartIm = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  check = loadSound("check.mp3");
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  trex = createSprite(50, windowHeight/2+70, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;

  ground = createSprite(windowWidth/2, windowHeight/2, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -4;
  
  gameOver = createSprite(windowWidth/2,windowHeight/2-140);
  gameOver.addImage("gameOver", gameOverIm);
  gameOver.scale=0.6;
  
  restart = createSprite(windowWidth/2,windowHeight/2-100);
  restart.addImage("restart", restartIm);
  restart.scale=0.5;

  invisibleGround = createSprite(windowWidth/2, windowHeight/2+25, windowWidth, 40);
  invisibleGround.visible = false;

  // create Obstacles and Cloud groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  score = 0;
}

function draw() {
  
  background("black");
  fill("white");
  textSize(17);
  textFont("Times New Roman");
  text("Score: " + score, windowWidth-200, 40);
  trex.collide(invisibleGround);
  
  console.log(trex.y)

  if (gameState === PLAY) {
    
    score = score + Math.round(getFrameRate() / 60);
    if(score % 100 === 1 && score >= 0){
      check.play();
    }

    gameOver.visible=false;
    restart.visible=false;
    
    //move the ground
    ground.velocityX = -(6+score/100);

    
    if (touches.length > 0 && trex.y >= windowHeight/2-20 || keyDown("space") && trex.y >= windowHeight/2-20 || keyDown("up") && trex.y >= windowHeight/2-20){
      jumpSound.play();
      trex.velocityY = -13;
      touches = [];
    }

    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    //spawn the clouds
  spawnClouds();

  //spawn obstacles on the ground
  spawnObstacles();
    
    
    trex.setCollider("circle", 0, 0, 50);
    
    if(trex.isTouching(obstaclesGroup)){
      dieSound.play();
      gameState = END;
    }
      
  } 
  else if (gameState === END) {

    gameOver.visible=true;
    restart.visible=true;
    
    //stop the ground
    ground.velocityX = 0;
    obstaclesGroup.setVelocityEach(0,0);
    cloudsGroup.setVelocityEach(0,0);
    trex.changeAnimation("collided", trex_collided);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    trex.velocityY=0;
    
    if(mousePressedOver(restart) || touches.length > 0){
      reset();
      touches =[];
    }
  }

  drawSprites();
}

function spawnObstacles() {
  if (frameCount % 40 === 0) {
    
    var obstacle = createSprite(windowWidth, windowHeight/2-10, 10, 40);
    obstacle.velocityX = -(6+score/100);


    // //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    //adding obstacles to the group
    obstaclesGroup.add(obstacle);
  }
}



function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(windowWidth, 100, 40, 10);
    cloud.y = Math.round(random(100, 150));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -(5+score/100);

    //assign lifetime to the variable
    cloud.lifetime = 250;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //adding cloud to the group
    cloudsGroup.add(cloud);
  }

}

function reset(){
  score = 0;
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
}
