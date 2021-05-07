var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var feed,lastFed;
var time;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);
  database.ref("FeedTime").on("value",getTime);
  foodObj = new Food();
  database.ref("Food").on("value",readStock);
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feed=createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();
  database.ref("/").on("value",readFood,showError); 
  fill("0");
  text("Last Feed: "+time,300,30);
  text("Scooby",780,130);
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.getFoodStock(foodS);
}

function readFood(d)  {
  lastFed=d.val();
  foodObj.getFedTime(lastFed);
}

function getTime(a)  {
  time=a.val();
  console.log(a.val());
}

function feedDog(){
  dog.addImage(happyDog);
  d=new Date();
  lastFed=d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear()+"\t"+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
  database.ref("/").update({FeedTime:lastFed});
  if(foodS>0)  {
    foodS--;
    database.ref('/').update({
      Food:foodS
    }) 
  } 
  else  {
    alert("Buy Milk");
  }
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function showError()  {
  console.log("Fail to read from database");
}