var dog,sadDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var gameState,readState;
var bedroom,garden,washroom;

function preload(){
sadDog=loadImage("Images/Dog.png");
Happy=loadImage("Images/Happy.png");
bedroom = loadImage("Images/Bed Room.png");
garden = loadImage("Images/Garden.png");
washroom = loadImage("Images/Wash Room.png");
dead = loadImage("Images/deadDog.png");

}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
  
  
  dog=createSprite(800,200,150,150);
  dog.addImage(Happy);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }

   if(gameState=="Hungry"){
     dog.addImage(dead);
   }else{
    dog.addImage(Happy);
   }

   currentTime= hour();
   if(currentTime==(lastFed+1)){
     update("Playing")
     foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping")
    foodObj.garden();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing")
    foodObj.washroom();
  } else{
    update("Hungry")
    foodObj.display();
  }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  console.log("poo")

  database.ref('/').update({
    gameState:state
  })
}