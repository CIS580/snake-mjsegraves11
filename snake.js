/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
backBuffer.width = frontBuffer.width;
backBuffer.height = frontBuffer.height;
var backCtx = backBuffer.getContext('2d');
var oldTime = performance.now();

var snakeBody = [ {x:30,y:30},{x:35,y:30},
                  {x:40,y:30},{x:45,y:30},{x:50,y:30},
                  {x:55,y:30},{x:60,y:30},{x:65,y:30},
                  {x:70,y:30},{x:75,y:30},{x:80,y:30},
                  {x:85,y:30},{x:90,y:30},{x:95,y:30},
                  {x:100,y:30},{x:105,y:30},{x:110,y:30},
                  {x:115,y:30},{x:120,y:30},{x:125,y:30},
                  {x:130,y:30} ];

var snakeRadius = 25;
var apple = {x:600,y:300};
var appleRadius = 10;
var twoPI = 2 * Math.PI;
var input = {
  up: false,
  down: false,
  right: false,
  left: false
}
var gameOver = false;
var newGame = false;

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
function loop(newTime) {
  var elapsedTime = newTime - oldTime;
  oldTime = newTime;

  update(elapsedTime);
  render(elapsedTime);
  frontCtx.clearRect(0,0,frontBuffer.width,frontBuffer.height);
  // Flip the back buffer
  frontCtx.drawImage(backBuffer, 0, 0);

  // Run the next loop
  window.requestAnimationFrame(loop);
}

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {elapsedTime} A DOMHighResTimeStamp indicting
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {

  if(gameOver && newGame)
  {
    location.reload();
  }

  //Check to see if snake is out of bounds
  if(snakeBody[snakeBody.length-1].x > 735 || snakeBody[snakeBody.length-1].x < 25) {
    gameOver = true;
  }
  if(snakeBody[snakeBody.length-1].y > 455 || snakeBody[snakeBody.length-1].y < 25) {
    gameOver = true;
  }

  //Check to see if snake ate itself
  snakeX = Math.abs(snakeBody[snakeBody.length-1].x - snakeBody[0].x);
  snakeY = Math.abs(snakeBody[snakeBody.length-1].y - snakeBody[0].y);
  snakeZ = snakeRadius + snakeRadius;
  if((snakeX*snakeX)+(snakeY*snakeY) <= (snakeZ*snakeZ)) {
    gameOver = true;
  }

    //Check to see if apple was consumed
  x = Math.abs(snakeBody[snakeBody.length-1].x - apple.x);
  y = Math.abs(snakeBody[snakeBody.length-1].y - apple.y);
  z = snakeRadius + appleRadius;
  if((x*x)+(y*y) <= (z*z)) {
    consumedApple();
  }

  moveSnake();

  // TODO: [Extra Credit] Determine if the snake has run into an obstacle

}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {elapsedTime} A DOMHighResTimeStamp indicting
  * the number of milliseconds passed since the last frame.
  */
function render(elapsedTime) {
  backCtx.clearRect(0, 0, backBuffer.width, backBuffer.height);
  if(!gameOver)
  {
    //Apple
    backCtx.beginPath();
    backCtx.arc(apple.x,apple.y,appleRadius,0,twoPI);
    backCtx.fillStyle = 'red';
    backCtx.fill();
    backCtx.stroke();
    backCtx.closePath();
    //Snake
    for(var i=0; i<snakeBody.length; i++) {
      backCtx.beginPath();
      backCtx.arc(snakeBody[i].x,snakeBody[i].y,snakeRadius,0,twoPI);
      backCtx.fillStyle = 'lightgreen';
      backCtx.fill();
      backCtx.stroke();
      backCtx.closePath();
    }
  }
  else 
  {
    backCtx.font = "100px Arial";
    backCtx.strokeText("Game Over",100,200);
    backCtx.font = "40px Arial";
    backCtx.strokeText("Press [Enter] to play again",120,300);
  }
}

function spawnApple() {
  apple.x = Math.round(Math.random()*(755-30))+30;
  apple.y = Math.round(Math.random()*(475-30))+30;
}

function growSnake() {
  var lastX = snakeBody[0].x;
  var lastY = snakeBody[0].y;
  if(input.up) {
    snakeBody.unshift({x:lastX,y:lastY+5},{x:lastX,y:lastY+10},{x:lastX,y:lastY+15});
  }
  if(input.down) {
    snakeBody.unshift({x:lastX,y:lastY-5},{x:lastX,y:lastY-10},{x:lastX,y:lastY-15});
  }
  if(input.right) {
    snakeBody.unshift({x:lastX-5,y:lastY},{x:lastX-10,y:lastY},{x:lastX-15,y:lastY});
  }
  if(input.left) {
    snakeBody.unshift({x:lastX+5,y:lastY},{x:lastX+10,y:lastY},{x:lastX+15,y:lastY});
  }
}

function moveSnake() {
  if(input.up) {
    for(var i=0; i<snakeBody.length-1; i++) {
      snakeBody[i].y = snakeBody[i+1].y;
      snakeBody[i].x = snakeBody[i+1].x;
    }
    snakeBody[snakeBody.length-1].y -= 5;
  }
  if(input.down) {
    for(var i=0; i<snakeBody.length-1; i++) {
      snakeBody[i].y = snakeBody[i+1].y;
      snakeBody[i].x = snakeBody[i+1].x;
    }
    snakeBody[snakeBody.length-1].y += 5;
  }
  if(input.right) {
    for(var i=0; i<snakeBody.length-1; i++) {
      snakeBody[i].y = snakeBody[i+1].y;
      snakeBody[i].x = snakeBody[i+1].x;
    }
    snakeBody[snakeBody.length-1].x += 5;
  }
  if(input.left) {
    for(var i=0; i<snakeBody.length-1; i++) {
      snakeBody[i].y = snakeBody[i+1].y;
      snakeBody[i].x = snakeBody[i+1].x;
    }
    snakeBody[snakeBody.length-1].x -= 5;
  }
}

function consumedApple() {
  growSnake();
  spawnApple();
}

window.onkeydown = function(event) {
  event.preventDefault();
  switch(event.keyCode){
    case 38:
      input.up = true;
      input.down = false;
      input.right = false;
      input.left = false;
      break;
    case 37:
      input.up = false;
      input.down = false;
      input.right = false;
      input.left = true;
      break;
    case 39:
      input.up = false;
      input.down = false;
      input.right = true;
      input.left = false;
      break;
    case 40:
      input.up = false;
      input.down = true;
      input.right = false;
      input.left = false;
      break;
    case 13:
      newGame = true;
      break;
  }
}

/* Launch the game */
window.requestAnimationFrame(loop);
