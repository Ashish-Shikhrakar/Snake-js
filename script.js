const canvas = document.getElementById("snake");
const ctx = canvas.getContext("2d");

//game objects
const snake = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  direction: "left",
  color: snake_color,
};

const food = {
  x: 0,
  y: 0,
  color: food_color,
};

const obstacle = {
  x: 0,
  y: 0,
};
class snake_parts {
  constructor(x, y) {
    this.x = snake.x;
    this.y = snake.y;
  }
}

//game variables
var Speed = 100;
var body_parts = 2;
var size_of_each_object = 25;
var snake_color = "#cf2f74";
var food_color = "#d2ee82";
var gamestate = false;
var score = 0;
var hscore = getCookie("highscore");
var timer = 0;
var obstacleLengthX;
var obstacleLengthY;
var absoluteObstacleX;
var absoluteObstacleY;
var obstacleWidth;
var obstacleHeight;
const snake_body = [];

//game functions
function setCookie(name, value, daysToExpire) {
  //cookie for highscore
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + daysToExpire);

  const cookieString = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
  document.cookie = cookieString;
}
function getCookie(name) {
  //retrieve previous highscore
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}
function drawrect(x, y, w, h, color) {
  //draw canvas
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}
function drawSnake(x, y, w, h) {
  //draw snake body and head on canvas
  ctx.fillStyle = snake_color;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "orange";
  for (var i = 0; i < snake_body.length; i++) {
    let parts = snake_body[i];
    ctx.fillRect(parts.x, parts.y, w, h);
  }
  snake_body.push(new snake_parts(snake.x, snake.y));
  if (snake_body.length > body_parts) {
    snake_body.shift();
  }
}

function drawFood(x, y, w, h) {
  //draw food on canvas
  ctx.fillStyle = food_color;
  ctx.fillRect(x, y, w, h);
}

function drawObstacle(x, y, w, h) {
  // draw obstacles on difficulty 4 on canvas
  ctx.fillStyle = "#d35400";
  ctx.fillRect(x, y, w, h);
  absoluteObstacleX = x;
  absoluteObstacleY = y;
  obstacleWidth = w;
  obstacleHeight = h;
}

function drawtext(text, x, y, color) {
  //write text on the canvas
  ctx.fillStyle = color;
  ctx.font = "35px Courier New";
  ctx.fillText(text, x, y);
}

function renderFood() {
  //generate coordinates for food
  food.x =
    Math.floor(Math.random() * (canvas.width / size_of_each_object)) *
    size_of_each_object;
  food.y =
    Math.floor(Math.random() * (canvas.width / size_of_each_object)) *
    size_of_each_object;
  drawFood(food.x, food.y, size_of_each_object, size_of_each_object);
}

function renderObstacle() {
  //generate coordinates for obstacles
  let randomnum = 0;

  randomnum = Math.round(Math.random());
  obstacle.x =
    Math.floor(Math.random() * (canvas.width / size_of_each_object)) *
    size_of_each_object;
  obstacle.y =
    Math.floor(Math.random() * (canvas.width / size_of_each_object)) *
    size_of_each_object;
  timer++;
  const isObstaclesHorizontal = randomnum === 0;
  if (isObstaclesHorizontal) {
    obstacleLengthX = size_of_each_object * 6;
    obstacleLengthY = size_of_each_object;
  } else {
    obstacleLengthX = size_of_each_object;
    obstacleLengthY = size_of_each_object * 6;
  }
}
async function draw() {
  //draw all objects on canvas
  drawrect(0, 0, canvas.width, canvas.height, "black");
  drawSnake(snake.x, snake.y, size_of_each_object, size_of_each_object);
  drawFood(food.x, food.y, size_of_each_object, size_of_each_object);
  if (diff_value == 4 && timer > 0) {
    drawObstacle(obstacle.x, obstacle.y, obstacleLengthX, obstacleLengthY);
  }
}
function incrementScore() {
  //increase score and speed of the game when eating a piece of food
  score = score + 1 + score_multiplier;
  if (fps < speed_cap) {
    fps += fps_increment;
    if (fps > speed_cap) {
      fps = speed_cap;
    }
  }
  document.getElementById("score").innerHTML = score;
  if (score > parseInt(hscore, 10)) {
    setCookie("highscore", score, 365);
    document.getElementById("hscore").innerHTML = score;
  }
}

function gameOverScreen() {
  //games screen when game is over
  gamestate = false;
  document.getElementById("hscore").innerHTML = getCookie("highscore");
  drawtext(
    "Game Over!!",
    canvas.width / 2 - 6 * size_of_each_object,
    canvas.height / 2 - 2 * size_of_each_object,
    "red"
  );
  drawtext(
    "Your score: " + score,
    canvas.width / 2 - 6 * size_of_each_object,
    canvas.height / 2,
    "white"
  );
  drawtext(
    "High score: " + getCookie("highscore"),
    canvas.width / 2 - 6 * size_of_each_object,
    canvas.height / 2 + 2 * size_of_each_object,
    "white"
  );
  if (!hscore || score > parseInt(hscore, 10)) {
    setCookie("highscore", score, 365);
  }
}

function collisionDetect() {
  //check for collisions
  if (snake.x == food.x && snake.y == food.y) {
    body_parts++;
    renderFood();
    incrementScore();
  }
  if (snake.x == canvas.width || snake.x == 0 - size_of_each_object) {
    gameOverScreen();
  } else if (snake.y == canvas.height || snake.y == 0 - size_of_each_object) {
    gameOverScreen();
  }
  for (var i = 0; i < snake_body.length; i++) {
    let parts = snake_body[i];
    if (snake.x == parts.x && snake.y == parts.y) {
      gameOverScreen();
    }
  }

  if (diff_value == 4) {
    if (
      snake.x < obstacle.x + obstacleWidth &&
      snake.x + size_of_each_object > obstacle.x &&
      snake.y < obstacle.y + obstacleHeight &&
      snake.y + size_of_each_object > obstacle.y
    ) {
      gameOverScreen();
    }
  }
}

function moveSnake() {
  //move snake to new coordinates
  if (snake.direction == "left") {
    snake.x -= size_of_each_object;
  } else if (snake.direction == "right") {
    snake.x += size_of_each_object;
  } else if (snake.direction == "up") {
    snake.y -= size_of_each_object;
  } else if (snake.direction == "down") {
    snake.y += size_of_each_object;
  }
}

function resetBoard() {
  // reset all variables to default
  snake.x = canvas.width / 2;
  snake.y = canvas.height / 2;
  food.x = 0;
  food.y = 0;
  snake.direction = "left";
  body_parts = 2;
  score = 0;
  snake_body.length = 0;
  timer = 0;
  absoluteObstacleX = null;
  absoluteObstacleY = null;
  if (diff_value == 1) {
    fps = 8;
    speed_cap = 16;
  } else if (diff_value == 2) {
    fps = 10;
    speed_cap = 20;
  } else {
    fps = 13;
    speed_cap = 24;
  }
  document.getElementById("score").innerHTML = score;
}

//binding keys
function onKeyDown(e) {
  e.preventDefault();
  if (e.keyCode == 37 && snake.direction != "right") {
    snake.direction = "left";
  } else if (e.keyCode == 38 && snake.direction != "down") {
    snake.direction = "up";
  } else if (e.keyCode == 39 && snake.direction != "left") {
    snake.direction = "right";
  } else if (e.keyCode == 40 && snake.direction != "up") {
    snake.direction = "down";
  }
}
function update() {
  //updates game canvas
  moveSnake();
  collisionDetect();
}
window.onload = function () {
  //default slider value and highscore
  document.addEventListener("keydown", onKeyDown);
  document.getElementById("hscore").innerHTML = getCookie("highscore");
  slider.value = 2;
};

document.getElementById("start").addEventListener("click", function () {
  //button event to start game
  clearInterval(game);
  resetBoard();
  gamestate = true;
});

function game() {
  //run game
  if (gamestate) {
    draw();
    document.getElementById("myRange").disabled = true;
    update();
  } else {
    document.getElementById("myRange").disabled = false;
  }
}

//intervals defined
setInterval(renderObstacle, 3000);
setInterval(game, fpslimit);
