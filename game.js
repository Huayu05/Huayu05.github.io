const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let dino = { x: 50, y: 150, width: 40, height: 40, velocityY: 0, jumping: false };
let gravity = 1;
let obstacles = [];
let gameSpeed = 5;

function jump() {
  if (!dino.jumping) {
    dino.velocityY = -15;
    dino.jumping = true;
  }
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') jump();
});

function spawnObstacle() {
  const obstacle = {
    x: canvas.width,
    y: 160,
    width: 20,
    height: 40
  };
  obstacles.push(obstacle);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dino physics
  dino.y += dino.velocityY;
  dino.velocityY += gravity;
  if (dino.y > 150) {
    dino.y = 150;
    dino.jumping = false;
  }

  // Draw dino
  ctx.fillStyle = "green";
  ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

  // Obstacles
  for (let i = 0; i < obstacles.length; i++) {
    const obs = obstacles[i];
    obs.x -= gameSpeed;
    ctx.fillStyle = "red";
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

    // Collision
    if (
      dino.x < obs.x + obs.width &&
      dino.x + dino.width > obs.x &&
      dino.y < obs.y + obs.height &&
      dino.y + dino.height > obs.y
    ) {
      alert("Game Over!");
      document.location.reload();
    }
  }

  // Remove off-screen obstacles
  obstacles = obstacles.filter(o => o.x + o.width > 0);
}

setInterval(() => {
  spawnObstacle();
}, 1500);

function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

gameLoop();