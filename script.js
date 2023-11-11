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
let shipHit = false;

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
      let speedX1 = this.speedX + Math.random() - 0.5;
      let speedY1 = this.speedY + Math.random() - 0.5;
      let speedX2 = this.speedX + Math.random() - 0.5;
      let speedY2 = this.speedY + Math.random() - 0.5;
      asteroids.push(
        new Asteroid(this.x, this.y, this.size / 2, speedX1, speedY1)
      );
      asteroids.push(
        new Asteroid(this.x, this.y, this.size / 2, speedX2, speedY2)
      );
    }
  }
}
class ShipPiece {
  constructor(x, y, speedX, speedY, rotationSpeed) {
    this.x = x;
    this.y = y;
    this.speedX = speedX;
    this.speedY = speedY;
    this.rotationSpeed = rotationSpeed;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotationSpeed += Math.random() - 0.5;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotationSpeed);
    ctx.fillRect(-2, -2, 4, 4);
    ctx.restore();
  }
}

let shipPieces = [];

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
    ctx.strokeStyle = shipHit ? "red" : "#666";
    ctx.fillStyle = shipHit ? "red" : "#666";
    ctx.fill();
    ctx.stroke();
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < shipSize) {
      this.x = shipSize;
    } else if (this.x > canvas.width - shipSize) {
      this.x = canvas.width - shipSize;
    }

    if (this.y < shipSize) {
      this.y = shipSize;
    } else if (this.y > canvas.height - shipSize) {
      this.y = canvas.height - shipSize;
    }
  }

  shoot() {
    bullets.push(new Bullet(this.x, this.y - 20));
  }

  split() {
    for (let i = 0; i < 10; i++) {
      let speedX = (Math.random() - 0.5) * 6;
      let speedY = (Math.random() - 0.5) * 6;
      let rotationSpeed = (Math.random() - 0.5) * 0.2;
      shipPieces.push(
        new ShipPiece(this.x, this.y, speedX, speedY, rotationSpeed)
      );
    }
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
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = asteroids.length - 1; j >= 0; j--) {
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

  for (let j = asteroids.length - 1; j >= 0; j--) {
    let dx = ship.x - asteroids[j].x;
    let dy = ship.y - asteroids[j].y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < shipSize + asteroids[j].size) {
      lives--;
      shipHit = true;
      setTimeout(() => (shipHit = false), 1000);
      ship.split();
      asteroids.splice(j, 1);
      if (lives <= 0) {
        // Additional logic to handle game over
      }
      break;
    }
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and draw asteroids
  asteroids.forEach((asteroid, index) => {
    asteroid.update();
    asteroid.draw();
    // Handle off-screen asteroids
    if (asteroidIsGone(asteroid)) {
      asteroids.splice(index, 1);
    }
  });

  // Update and draw bullets
  bullets.forEach((bullet, index) => {
    bullet.update();
    bullet.draw();
    // Remove bullets that have gone off-screen
    if (bullet.y < 0) {
      bullets.splice(index, 1);
    }
  });

  // Update and draw ship pieces
  shipPieces.forEach((piece, index) => {
    piece.update();
    piece.draw();
    // Remove the piece after some condition, e.g., off-screen
    if (pieceIsGone(piece)) {
      shipPieces.splice(index, 1);
    }
  });

  // If the ship is not hit, draw and update ship
  if (!shipHit) {
    ship.update();
    ship.draw();
  }

  // Check for collisions (bullets with asteroids, ship with asteroids)
  checkCollisions();

  // Draw score and lives
  ctx.font = "16px DS-Digital";
  ctx.fillStyle = "black";
  ctx.fillText(`Score: ${score}`, 8, 20);
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);

  // If no lives left, end the game
  if (lives <= 0) {
    gameOver();
    return; // Stop the game loop
  }

  // If all asteroids are destroyed, create new ones
  if (asteroids.length === 0) {
    numAsteroids++;
    initAsteroids();
  }

  // Continue the game loop
  requestAnimationFrame(update);
}

function asteroidIsGone(asteroid) {
  // Returns true if the asteroid is off-screen
  return (
    asteroid.x < -asteroid.size ||
    asteroid.x > canvas.width + asteroid.size ||
    asteroid.y < -asteroid.size ||
    asteroid.y > canvas.height + asteroid.size
  );
}

function pieceIsGone(piece) {
  // Returns true if the ship piece is off-screen (for example)
  return (
    piece.x < -5 ||
    piece.x > canvas.width + 5 ||
    piece.y < -5 ||
    piece.y > canvas.height + 5
  );
}

function gameOver() {
  ctx.font = "40px DS-Digital";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
  // Additional game over logic, if any
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
btn2.addEventListener("touchmove", function (event) {
  handleTouch(event.touches[0]);
});

btn2.addEventListener("touchend", function () {
  ship.speedX = 0;
  ship.speedY = 0;
  btn2.style.backgroundColor = ""; // Återställ knappens färg
});

function handleTouch(touch) {
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

restartBtn.addEventListener("click", function () {
  location.reload();
});

initAsteroids();
update();
