import Player from './Player.js';
import Ground from './Ground.js';
import CactusController from './CactusController.js';
import Score from './Score.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d')

const gameWidth = 800;
const gameHeight = 200;

const gameSpeedStart = 0.75;
const gameSpeedIncrement = 0.00001;

const playerWidth = 88 / 1.5;
const playerHeight = 94 / 1.5;
const minJumpHeight = 150;
const maxJumpHeight = gameHeight;

const groundWidth = 2400;
const groundHeight = 24;
const groundAndCactusSpeed = 0.5;

const cactusConfig = [
  {width:48 / 1.5, height: 100 / 1.5, image: 'images/cactus_1.png'}, 
  {width:98 / 1.5, height: 100 / 1.5, image: 'images/cactus_2.png'},
  {width:68 / 1.5, height: 70 / 1.5, image: 'images/cactus_3.png'},
];

let player = null;
let ground = null;
let cactusController = null;
let score = null;

let scaleRatio = null;
let previousTime = null;
let gameSpeed = gameSpeedStart;
let gameOver = false;
let hasRestartEventListener = false;
let waitingToStart = true;

function createSprites() {
  const playerWidthInGame = playerWidth * scaleRatio;
  const playerHeightInGame = playerHeight * scaleRatio;
  const minJumpHeightInGame = minJumpHeight * scaleRatio;
  const maxJumpHeightInGame = maxJumpHeight * scaleRatio;

  const groundWidthInGame = groundWidth * scaleRatio;
  const groundHeightInGame = groundHeight * scaleRatio;

  player = new Player(ctx, playerWidthInGame, playerHeightInGame, minJumpHeightInGame, maxJumpHeightInGame, scaleRatio);
  ground = new Ground(ctx, groundWidthInGame, groundHeightInGame, groundAndCactusSpeed, scaleRatio);

  const cactusImages = cactusConfig.map(cactus => {
    const image = new Image();
    image.src = cactus.image;
    return {
      image: image,
      width: cactus.width * scaleRatio,
      height: cactus.height * scaleRatio,
    }
  });

  cactusController = new CactusController(ctx, cactusImages, scaleRatio, groundAndCactusSpeed);

  score = new Score(ctx, scaleRatio);
}

function setScreen() {
  scaleRatio = getScaleRatio();
  canvas.width = gameWidth * scaleRatio;
  canvas.height = gameHeight * scaleRatio;
  createSprites();
}

function getScaleRatio() {
  const screenWidth = Math.min(
    window.innerWidth,
    document.documentElement.clientWidth
  );
  
  const screenHeight = Math.min(
    window.innerHeight,
    document.documentElement.clientHeight
  );

  if (screenWidth / screenHeight < gameWidth / gameHeight) {
    return screenWidth / gameWidth;
  }
  else {
    return screenHeight / gameHeight;
  }
}

function clearScreen() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function reset() {
  hasRestartEventListener = false;
  gameOver = false;
  waitingToStart = false
  ground.reset();
  cactusController.reset();
  score.reset();
  gameSpeed = gameSpeedStart;
}

function showGameOver() {
  const fontSize = 70 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = 'grey';
  const x = canvas.width / 4.5;
  const y = canvas.height / 2;
  ctx.fillText("GAME OVER", x, y);
}

function showStartGameText() {
  const fontSize = 40 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = 'grey';
  const x = canvas.width / 14;
  const y = canvas.height / 2;
  ctx.fillText("Tap Screen or Press Space to Start", x, y);
}

function setupGameReset() {
  if (!hasRestartEventListener) {
    hasRestartEventListener = true;

    setTimeout(() => {
      window.addEventListener('keyup', reset, {once: true});
      window.addEventListener('touchstart', reset, {once: true});
    }, 500);
  }
}

function updateGameSpeed(frameTimeDelta) {
  gameSpeed += frameTimeDelta * gameSpeedIncrement;
  console.log(gameSpeed); 
}

function gameLoop(currentTime) {
  if (previousTime === null) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    return;
  }

  const frameTimeDelta = currentTime - previousTime;
  previousTime = currentTime;

  clearScreen()

  if (!gameOver && !waitingToStart) {
    player.update(gameSpeed, frameTimeDelta);
    ground.update(gameSpeed, frameTimeDelta);
    cactusController.update(gameSpeed, frameTimeDelta);
    score.update(frameTimeDelta);
    updateGameSpeed(frameTimeDelta);
  }

  if (!gameOver && cactusController.collideWith(player)) {
    gameOver = true;
    score.setHighScore();
    setupGameReset();
  }

  player.draw();
  ground.draw();
  cactusController.draw();
  score.draw();

  if (gameOver) {
    showGameOver();
  }

  if (waitingToStart) {
    showStartGameText();
  }

  requestAnimationFrame(gameLoop);
}

setScreen();
window.addEventListener('resize', () => setTimeout(setScreen, 500));
if (screen.orientation) {
  screen.orientation.addEventListener('change', setScreen);
}

requestAnimationFrame(gameLoop);

window.addEventListener('keyup', reset, {once: true});
window.addEventListener('touchstart', reset, {once: true});