const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let asteroids = [];
let numAsteroids = 3;

class Asteroid {
  constructor(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.strokeStyle = "#666";
    ctx.fillStyle = "#666";
    ctx.fill();
    ctx.stroke();
  }

  update() {
    this.y += this.speed;

    // If the asteroid goes off the canvas, reset its position
    if (this.y > canvas.height + this.size) {
      this.y = -this.size;
      this.x =
        Math.floor(Math.random() * 3) * (canvas.width / 3) + canvas.width / 6;
    }
  }
}

class Ship {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 0;
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - 10, this.y + 20);
    ctx.lineTo(this.x + 10, this.y + 20);
    ctx.closePath();
    ctx.strokeStyle = "#666";
    ctx.fillStyle = "#666";
    ctx.fill();
    ctx.stroke();
  }

  update() {
    this.x += this.speed;

    // Keep the ship within the canvas boundaries
    if (this.x < 10) {
      this.x = 10;
    } else if (this.x > canvas.width - 10) {
      this.x = canvas.width - 10;
    }
  }
}

const ship = new Ship(canvas.width / 2, canvas.height - 30);

function initAsteroids() {
  for (let i = 0; i < numAsteroids; i++) {
    let x =
      Math.floor(Math.random() * 3) * (canvas.width / 3) + canvas.width / 6;
    let y = Math.random() * canvas.height;
    let size = 10;
    let speed = 1;
    asteroids.push(new Asteroid(x, y, size, speed));
  }
}

function handleKeyDown(event) {
  if (event.key === "ArrowLeft") {
    ship.speed = -3;
  } else if (event.key === "ArrowRight") {
    ship.speed = 3;
  }
}

function handleKeyUp(event) {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    ship.speed = 0;
  }
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let asteroid of asteroids) {
    asteroid.draw();
    asteroid.update();
  }

  ship.draw();
  ship.update();

  requestAnimationFrame(update);
}

initAsteroids();
update();
