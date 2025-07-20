// game.js
import {
  playPew,
  playExplosion,
  playLevelUp,
  playGameOver,
  startMusic,
  stopMusic,
  startBackground,
  stopBackground
} from './audio.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx    = canvas.getContext('2d');

  // ——————————————————————————————————————————————
  // Game state
  // ——————————————————————————————————————————————
  let gameOver         = false;
  const gameOverText   = "¡GAME OVER!";
  let level            = 1;
  let score            = 0;
  let waitingNextLevel = false;
  let nextLevelTimer   = 0;
  const nextLevelDelay = 120; // frames (~2 seconds at 60fps)

  // ——————————————————————————————————————————————
  // Player
  // ——————————————————————————————————————————————
  const player = { x: 380, y: 540, width: 80, height: 40, speed: 5 };
  let leftPressed    = false;
  let rightPressed   = false;
  let triggerPressed = false;

  // ——————————————————————————————————————————————
  // Bullets
  // ——————————————————————————————————————————————
  const bullets     = [];
  const bulletSpeed = 7;
  const bulletW     = 4;
  const bulletH     = 10;

  // ——————————————————————————————————————————————
  // Enemies
  // ——————————————————————————————————————————————
  const enemies      = [];
  const rows         = 3;
  const cols         = 8;
  const enemyWidth   = 60;
  const enemyHeight  = 20;
  const enemyPadding = 20;
  const offsetTop    = 50;
  const offsetLeft   = 50;
  let enemySpeed     = 1;
  let enemyDirection = 1;
  const dropDistance = 10;

  // ——————————————————————————————————————————————
  // Sprites
  // ——————————————————————————————————————————————
  const shipImage  = new Image();
  shipImage.src    = 'assets/player2.png';
  let shipLoaded   = false;
  shipImage.onload = () => { shipLoaded = true; };

  const enemyImage   = new Image();
  enemyImage.src     = 'assets/enemy_drone.png';
  let enemyLoaded    = false;
  enemyImage.onload  = () => { enemyLoaded = true; };

  // ——————————————————————————————————————————————
  // Level-clear messages
  // ——————————————————————————————————————————————
  const messages = [
    "ALL INVADERS ELIMINATED!",
    "GALACTIC VICTORY ACHIEVED!",
    "YOU SAVED THE GALAXY!",
    "MISSION ACCOMPLISHED, HERO!",
    "PREPARE FOR THE NEXT WAVE!"
  ];

  // ——————————————————————————————————————————————
  // Input handlers
  // ——————————————————————————————————————————————
  document.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft')  leftPressed = true;
    if (e.code === 'ArrowRight') rightPressed = true;
    if (e.code === 'Space') {
      triggerPressed = true;
      e.preventDefault();
    }
    // Speed controls
    if (e.code === 'ArrowUp') {
      enemySpeed += 0.5;
    }
    if (e.code === 'ArrowDown') {
      enemySpeed = Math.max(0.5, enemySpeed - 0.5);
    }
    // Restart on R
    if (gameOver && e.code === 'KeyR') {
      gameOver         = false;
      score            = 0;
      level            = 1;
      enemySpeed       = 1;
      waitingNextLevel = false;
      bullets.length   = 0;
      initEnemies();
      startMusic();
      startBackground();
    }
  });

  document.addEventListener('keyup', e => {
    if (e.code === 'ArrowLeft')  leftPressed    = false;
    if (e.code === 'ArrowRight') rightPressed   = false;
    if (e.code === 'Space')       triggerPressed = false;
  });

  // ——————————————————————————————————————————————
  // Utility: AABB overlap test
  // ——————————————————————————————————————————————
  function checkOverlap(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  // ——————————————————————————————————————————————
  // Initialize enemies
  // ——————————————————————————————————————————————
  function initEnemies() {
    enemies.length = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = offsetLeft + c * (enemyWidth + enemyPadding);
        const y = offsetTop  + r * (enemyHeight + enemyPadding);
        enemies.push({ x, y, width: enemyWidth, height: enemyHeight, alive: true });
      }
    }
  }

  // ——————————————————————————————————————————————
  // Shooting
  // ——————————————————————————————————————————————
  function shootBullet() {
    bullets.push({
      x: player.x + player.width / 2 - bulletW / 2,
      y: player.y,
      width: bulletW,
      height: bulletH
    });
    playPew();
  }

  // ——————————————————————————————————————————————
  // Collision handler
  // ——————————————————————————————————————————————
  function handleCollision(bi, ei) {
    enemies[ei].alive = false;
    bullets.splice(bi, 1);
    score += 10;
    playExplosion();
  }

  // ——————————————————————————————————————————————
  // Level-up handler
  // ——————————————————————————————————————————————
  function nextLevel() {
    level++;
    waitingNextLevel = false;
    playLevelUp();
  }

  // ——————————————————————————————————————————————
  // Main update loop
  // ——————————————————————————————————————————————
  function update() {
    // Move player
    if (leftPressed  && player.x > 0)                            player.x -= player.speed;
    if (rightPressed && player.x + player.width < canvas.width)  player.x += player.speed;

    // Shoot
    if (triggerPressed) {
      shootBullet();
      triggerPressed = false;
    }

    // Next-level timer
    if (waitingNextLevel) {
      nextLevelTimer++;
      if (nextLevelTimer >= nextLevelDelay) {
        nextLevel();
        enemySpeed += 0.5;
        initEnemies();
        bullets.length = 0;
      }
      return;
    }

    // Level cleared?
    if (enemies.every(e => !e.alive)) {
      waitingNextLevel = true;
      nextLevelTimer   = 0;
    }

    // Enemy reaches bottom → Game Over
    for (const e of enemies) {
      if (e.alive && e.y + e.height >= player.y) {
        gameOver = true;
        stopMusic();
        stopBackground();
        playGameOver();
        break;
      }
    }
    if (gameOver) return;

    // Move enemies
    let minX = canvas.width, maxX = 0;
    enemies.forEach(e => {
      if (!e.alive) return;
      minX = Math.min(minX, e.x);
      maxX = Math.max(maxX, e.x + e.width);
    });
    if ((enemyDirection === 1  && maxX + enemySpeed >= canvas.width) ||
        (enemyDirection === -1 && minX - enemySpeed <= 0)) {
      enemyDirection *= -1;
      enemies.forEach(e => { if (e.alive) e.y += dropDistance; });
    }
    enemies.forEach(e => { if (e.alive) e.x += enemySpeed * enemyDirection; });

    // Move bullets & cleanup
    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].y -= bulletSpeed;
      if (bullets[i].y + bullets[i].height < 0) bullets.splice(i, 1);
    }

    // Bullet-enemy collisions
    for (let i = bullets.length - 1; i >= 0; i--) {
      for (let j = enemies.length - 1; j >= 0; j--) {
        if (enemies[j].alive && checkOverlap(bullets[i], enemies[j])) {
          handleCollision(i, j);
          break;
        }
      }
    }
  }

  // ——————————————————————————————————————————————
  // Render loop
  // ——————————————————————————————————————————————
  function render() {
    // Clear background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Game Over screen
    if (gameOver) {
      ctx.fillStyle = 'red';
      ctx.font = '64px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(gameOverText, canvas.width / 2, canvas.height / 2);
      ctx.font = '24px Arial';
      ctx.fillText('Press R to restart', canvas.width / 2, canvas.height / 2 + 50);
      ctx.textAlign = 'left';
      return;
    }

    // HUD
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 25);
    ctx.fillText(`Level: ${level}`, canvas.width - 120, 25);

    // Player sprite
    if (shipLoaded) {
      ctx.drawImage(shipImage, player.x, player.y, player.width, player.height);
    } else {
      ctx.fillStyle = 'lime';
      ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    // Bullets
    ctx.fillStyle = 'red';
    bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

    // Enemies
    enemies.forEach(e => {
      if (!e.alive) return;
      if (enemyLoaded) {
        ctx.drawImage(enemyImage, e.x, e.y, e.width, e.height);
      } else {
        ctx.fillStyle = 'white';
        ctx.fillRect(e.x, e.y, e.width, e.height);
      }
    });

    // Level-clear message
    if (waitingNextLevel) {
      const msg = messages[(level - 1) % messages.length];
      ctx.fillStyle = 'yellow';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(msg, canvas.width / 2, canvas.height / 2);
      ctx.textAlign = 'left';
    }
  }

  // ——————————————————————————————————————————————
  // Start game
  // ——————————————————————————————————————————————
  initEnemies();
  startMusic();
  startBackground();
  function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
  }
  gameLoop();
});
