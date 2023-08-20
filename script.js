const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restart-btn");
const btn1 = document.getElementById("btn1");
const btn2 = document.getElementById("btn2");

// Game variables
let asteroids = [];
let numAsteroids = 3;
let bullets = [];
let score = 0;
let lives = 3;
const shipSize = 20;

class Asteroid {
  constructor(x, y, size, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speedX = speedX;
    this.speedY = speedY;
    this.vertices = this.generateVertices(); // Lägg till detta
  }

  // Ny funktion för att generera slumpmässiga vertexpunkter för asteroiden
  generateVertices() {
    const numVertices = 5 + Math.floor(Math.random() * 5); // Mellan 5 och 10 vertexpunkter
    const vertices = [];
    for (let i = 0; i < numVertices; i++) {
      const angle = i * (360 / numVertices) * (Math.PI / 180);
      const distance =
        this.size + (Math.random() * this.size * 0.4 - this.size * 0.2); // Vissa variationer i avståndet
      const x = this.x + distance * Math.cos(angle);
      const y = this.y + distance * Math.sin(angle);
      vertices.push({ x, y });
    }
    return vertices;
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
    for (let i = 1; i < this.vertices.length; i++) {
      ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
    }
    ctx.closePath();
    ctx.strokeStyle = "#666";
    ctx.fillStyle = "#666";
    ctx.fill();
    ctx.stroke();
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Uppdatera vertexpunkterna när asteroiden rör sig
    for (let vertex of this.vertices) {
      vertex.x += this.speedX;
      vertex.y += this.speedY;
    }

    if (this.y > canvas.height + this.size) {
      this.y = -this.size;
      this.x =
        Math.floor(Math.random() * 3) * (canvas.width / 3) + canvas.width / 6;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 + 1;
      this.vertices = this.generateVertices(); // Generera nya vertexpunkter när asteroiden återställs
    }
  }

  split() {
    if (this.size > 5) {
      asteroids.push(
        new Asteroid(this.x, this.y, this.size / 2, this.speedX, this.speedY)
      );
      asteroids.push(
        new Asteroid(this.x, this.y, this.size / 2, this.speedX, this.speedY)
      );
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
    let speedX = Math.random() * 2 - 1;
    let speedY = Math.random() * 2 + 1;
    asteroids.push(new Asteroid(x, y, size, speedX, speedY));
  }
}

function handleKeyDown(event) {
  event.preventDefault();
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
        score += 10;
        break;
      }
    }
  }

  for (let j = 0; j < asteroids.length; j++) {
    let dx = ship.x - asteroids[j].x;
    let dy = ship.y - asteroids[j].y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < shipSize + asteroids[j].size) {
      lives--;
      asteroids.splice(j, 1);
      break;
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

  ctx.font = "16px DS-Digital"; // Ändrat från "DS-Digital" till "Arial"
  ctx.fillStyle = "black";
  ctx.fillText(`Lives: ${lives}`, 10, 20);
  ctx.fillText(`Score: ${score}`, canvas.width - 80, 20);

  if (lives <= 0) {
    ctx.font = "40px DS-Digital"; // Ändrat från "DS-Digital" till "Arial"
    ctx.fillStyle = "black";
    ctx.fillText("Game Over", canvas.width / 2 - 86, canvas.height / 2);
    return;
  }

  if (asteroids.length === 0) {
    numAsteroids++;
    initAsteroids();
  }

  requestAnimationFrame(update);
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

btn1.addEventListener("click", function () {
  ship.shoot();
});

btn1.addEventListener("touchstart", function () {
  ship.shoot();
});

btn2.addEventListener("mouseup", function () {
  ship.speedX = 0;
  ship.speedY = 0;
});

btn2.addEventListener("touchstart", function (event) {
  if (event.cancelable) {
    event.preventDefault();
  }

  if (event.target === btn2) {
    const touch = event.touches[0];
    const rect = btn2.getBoundingClientRect();
    if (touch.clientX < rect.left + rect.width / 2) {
      ship.speedX = -3;
    } else {
      ship.speedX = 3;
    }

    if (touch.clientY < rect.top + rect.height / 2) {
      ship.speedY = -3;
    } else {
      ship.speedY = 3;
    }
  }
});

btn2.addEventListener("touchmove", function (event) {
  if (event.target === btn2) {
    const touch = event.touches[0];
    const rect = btn2.getBoundingClientRect();
    if (touch.clientX < rect.left + rect.width / 2) {
      ship.speedX = -3;
    } else {
      ship.speedX = 3;
    }

    if (touch.clientY < rect.top + rect.height / 2) {
      ship.speedY = -3;
    } else {
      ship.speedY = 3;
    }
  }
});

btn2.addEventListener("touchend", function () {
  ship.speedX = 0;
  ship.speedY = 0;
});

restartBtn.addEventListener("click", function () {
  location.reload();
});

initAsteroids();
update();
