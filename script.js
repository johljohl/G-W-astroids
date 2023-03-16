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

class Asteroid {
  constructor(x, y, size, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speedX = speedX;
    this.speedY = speedY;
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
    this.x += this.speedX;
    this.y += this.speedY;

    // If the asteroid goes off the canvas, reset its position and change its direction
    if (this.y > canvas.height + this.size) {
      this.y = -this.size;
      this.x =
        Math.floor(Math.random() * 3) * (canvas.width / 3) + canvas.width / 6;
      this.speedX = Math.random() * 2 - 1; // Slumpa en hastighet i x-led mellan -1 och 1
      this.speedY = Math.random() * 2 + 1; // Slumpa en hastighet i y-led mellan 1 och 3
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

  changeDirection(newSpeedX, newSpeedY) {
    this.speedX = newSpeedX;
    this.speedY = newSpeedY;
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
    let speedX = Math.random() * 2 - 1; // Slumpa en hastighet i x-led mellan -1 och 1
    let speedY = Math.random() * 2 + 1; // Slumpa en hastighet i y-led mellan 1 och 3
    asteroids.push(new Asteroid(x, y, size, speedX, speedY));
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

function handleKeyPress(event) {
  if (event.key === "d") {
    // Tryck på "d" för att svänga höger
    asteroids[0].changeDirection(2, 1);
  } else if (event.key === "a") {
    // Tryck på "a" för att svänga vänster
    asteroids[0].changeDirection(-2, 1);
  }
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
document.addEventListener("keypress", handleKeyPress);

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

// Lägg till händelsehanterare för touchmove och touchend
btn2.addEventListener("touchstart", function (event) {
  event.preventDefault(); // Förhindra att händelsen skickas vidare till andra element
  if (event.target === btn2) {
    const touch = event.touches[0];
    if (touch.clientX < btn2.offsetLeft + btn2.offsetWidth / 2) {
      // Flytta åt vänster
      ship.speedX = -3;
    } else {
      // Flytta åt höger
      ship.speedX = 3;
    }

    if (touch.clientY < btn2.offsetTop + btn2.offsetHeight / 2) {
      // Flytta uppåt
      ship.speedY = -3;
    } else {
      // Flytta nedåt
      ship.speedY = 3;
    }
  }
});

btn2.addEventListener("touchmove", function (event) {
  event.preventDefault(); // Förhindra att händelsen skickas vidare till andra element
  if (event.target === btn2) {
    const touch = event.touches[0];
    if (touch.clientX < btn2.offsetLeft + btn2.offsetWidth / 2) {
      // Flytta åt vänster
      ship.speedX = -3;
    } else {
      // Flytta åt höger
      ship.speedX = 3;
    }

    if (touch.clientY < btn2.offsetTop + btn2.offsetHeight / 2) {
      // Flytta uppåt
      ship.speedY = -3;
    } else {
      // Flytta nedåt
      ship.speedY = 3;
    }
  }
});

btn2.addEventListener("touchend", function () {
  ship.speedX = 0;
  ship.speedY = 0;
});

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
        score += 10; // Öka poängen med 10 poäng för varje träffad astroid
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

  ctx.fillStyle = "black"; // Vit textfärg
  ctx.font = " 20px DS-Digital, sans-serif"; // Använd Arial typsnitt med en fet stil
  ctx.fillText(`Score: ${score}`, 20, 40); // Rita texten på x-koordinaten 20 och y-koordinaten 40

  requestAnimationFrame(update);
}
restartBtn.addEventListener("click", function () {
  location.reload();
});

initAsteroids();
update();
