var PLAY = 1;
var END = 0;
var gameState = PLAY;
var jumpSound ,checkpointSound ,dieSound

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOver,gameOverImg,restart,restartImg;



function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg=loadImage("gameOver.png");
  restartImg=loadImage("restart.png");
 jumpSound=loadSound("jump.mp3");
 checkpointSound=loadSound("checkpoint.mp3");
 dieSound=loadSound("die.mp3");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(width/2,height,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
 
  gameOver=createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImg);
  gameOver.scale=0.5

  restart=createSprite(width/2,height/2);
  restart.addImage(restartImg);
  restart.scale=0.5

  invisibleGround = createSprite(width/2,height+30,width,70);
  invisibleGround.visible = false;
  
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  
  
  score = 0;
obstaclesGroup=new Group();
cloudsGroup=new Group();
trex.debug=false
trex.setCollider("rectangle",0,0,90,90);
}

function draw() {
  background(180);
  fill("green")
  text("Pontuação: "+ score, 500,50);
  
  
  
  if(gameState === PLAY){
    
    gameOver.visible=false;
    restart.visible=false;

    ground.velocityX = -(4+3*score/100);
   
    score = score + Math.round(getFrameRate()/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
   
    if(touches.length>0 ||keyDown("space")&& trex.y >= 595) {
        trex.velocityY = -13;
        jumpSound.play();
        touches=[];
    }
    
  
    trex.velocityY = trex.velocityY + 0.8
  
  
    spawnClouds();
  
   
    spawnObstacles();
    if(score>0 && score%100===0){
    checkpointSound.play();
    }
    
    if(obstaclesGroup.isTouching(trex)){
        dieSound.play();
        gameState = END;
        
    }
  }
   else if (gameState === END) {
       gameOver.visible=true;
       restart.visible=true;

      ground.velocityX = 0;
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     trex.changeAnimation("collided",trex_collided);
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
     trex.velocityY=0
     if(mousePressedOver(restart)){ 
      console.log("reiniciar")
      reset(); }
   }
   
 

  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}
function reset(){ gameState=PLAY;
 gameOver.visible=false; 
 restart.visible=false; 
  obstaclesGroup.destroyEach(); 
 cloudsGroup.destroyEach(); 
 trex.changeAnimation("running",trex_running);
 score=0;
}
function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(windowWidth,windowHeight-20,10,40);
   obstacle.velocityX = -(6+score/100);
   
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    obstacle.scale = 0.5;
    obstacle.lifetime = 500;
   
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
   if (frameCount % 60 === 0) {
     cloud = createSprite(windowWidth,100,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
    cloud.lifetime = 300;
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
   cloudsGroup.add(cloud);
    }
}

