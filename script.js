const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let asteroids = [];
let numAsteroids = 3;
let bullets = [];

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

  split() {
    if (this.size > 5) {
      asteroids.push(new Asteroid(this.x, this.y, this.size / 2, this.speed));
      asteroids.push(new Asteroid(this.x, this.y, this.size / 2, this.speed));
    }
  }
}

class Ship {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
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
    this.x += this.speedX;
    this.y += this.speedY;

    // Keep the ship within the canvas boundaries
    if (this.x < 10) {
      this.x = 10;
    } else if (this.x > canvas.width - 10) {
      this.x = canvas.width - 10;
    }

    if (this.y < 10) {
      this.y = 10;
    } else if (this.y > canvas.height - 30) {
      this.y = canvas.height - 30;
    }
  }

  shoot() {
    bullets.push(new Bullet(this.x, this.y - 20));
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 5;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.strokeStyle = "#666";
    ctx.fillStyle = "#666";
    ctx.fill();
    ctx.stroke();
  }

  update() {
    this.y -= this.speed;

    // Remove the bullet if it goes off the canvas
    if (this.y < -10) {
      bullets.shift();
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
    ship.speedX = -3;
  } else if (event.key === "ArrowRight") {
    ship.speedX = 3;
  } else if (event.key === "ArrowUp") {
    ship.speedY = -3;
  } else if (event.key === "ArrowDown") {
    ship.speedY = 3;
  } else if (event.key === " ") {
    ship.shoot();
  }
}

function handleKeyUp(event) {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    ship.speedX = 0;
  } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    ship.speedY = 0;
  }
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

function checkCollisions() {
  for (let i = 0; i < bullets.length; i++) {
    for (let j = 0; j < asteroids.length; j++) {
      let dx = bullets[i].x - asteroids[j].x;
      let dy = bullets[i].y - asteroids[j].y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < bullets[i].speed + asteroids[j].size) {
        bullets.splice(i, 1);
        asteroids[j].split();
        asteroids.splice(j, 1);
        break;
      }
    }
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let asteroid of asteroids) {
    asteroid.draw();
    asteroid.update();
  }

  for (let bullet of bullets) {
    bullet.draw();
    bullet.update();
  }

  ship.draw();
  ship.update();

  checkCollisions();

  requestAnimationFrame(update);
}

initAsteroids();
update();
