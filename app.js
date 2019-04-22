let canvas, canvasContext, playerScore1, playerScore2, isUserControlling, isPlaying;
const FRAME_PER_SECOND = 25, PADDLE_STEP = 20, WINNING_SCORE = 5;

const ball = {
  centerX: 10,
  centerY: 20,
  radius: 10,
  speedX: 10,
  speedY: 10
};

const paddleLeft = {
  x: 0,
  y: 250,
  width: 10,
  height: 100
};

const paddleRight = {
  x: 790,
  y: 250,
  width: 10,
  height: 100
};

const move = () => {
  if(isPlaying) {
    ball.centerX += ball.speedX;
    ball.centerY += ball.speedY;

    if((ball.centerX + ball.radius) >= canvas.width) {
      if((ball.centerY + ball.radius) >= paddleRight.y 
        && (ball.centerY - ball.radius) <= (paddleRight.y + paddleRight.height)) {
          ball.speedX = -ball.speedX;
          ball.speedY = (ball.centerY - (paddleRight.y + paddleRight.height / 2)) / 5;
      } else {
        playerScore1++;
        resetBall();
      }
    }

    if((ball.centerX - ball.radius) <= 0) {
      if((ball.centerY + ball.radius) >= paddleLeft.y 
        && (ball.centerY - ball.radius) <= (paddleLeft.y + paddleLeft.height)) {
          ball.speedX = -ball.speedX;
          ball.speedY = (ball.centerY - (paddleLeft.y + paddleLeft.height / 2)) / 5;
      } else {
        playerScore2++;
        resetBall();
      }
    }

    if((ball.centerY + ball.radius) >= canvas.height || (ball.centerY - ball.radius) <= 0) {
      ball.speedY = -ball.speedY;
    }

    if(!isUserControlling) {
      if(ball.centerY > ((paddleRight.y + paddleRight.height / 2) + 5)) {
        paddleRight.y += 5;
      } else if(ball.centerY < ((paddleRight.y + paddleRight.height / 2) - 5)) {
        paddleRight.y -= 5;
      }
    }
  }
};

const resetBall = () => {
  if(playerScore1 >= WINNING_SCORE || playerScore2 >= WINNING_SCORE) {
    isPlaying = false;
  }

  ball.centerX = canvas.width / 2;
  ball.centerY = canvas.height / 2;
  ball.speedX = -ball.speedX;
  ball.speedY = -ball.speedY;
};

const draw = () => {
  //Draw Board
  drawRectangle('black', 0, 0, canvas.width, canvas.height);

  if(isPlaying) {
    //Draw Ball
    drawCircle('white', ball.centerX, ball.centerY, ball.radius);

    //Draw Left Paddle
    drawRectangle('white', paddleLeft.x, paddleLeft.y, paddleLeft.width, paddleLeft.height);

    //Draw Right Paddle
    drawRectangle('white', paddleRight.x, paddleRight.y, paddleRight.width, paddleRight.height);
  } else {
    canvasContext.fillStyle = 'white';
    canvasContext.fillText('click to play again...', 300, 500);
    
    let message = '';
    if(playerScore1 >= WINNING_SCORE) {
      message = 'Left player won!';
    } else {
      message = 'Right player won!'
    }
    canvasContext.fillText(message, 300, 100);
  }

  //Draw Score
  canvasContext.fillStyle = 'white';
  canvasContext.fillText(playerScore1, 100, 100);
  canvasContext.fillText(playerScore2, canvas.width - 100, 100);
  
};

const drawCircle = (fillColor, centerX, centerY, radius) => {
  canvasContext.fillStyle = fillColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
};

const drawRectangle = (fillColor, x, y, width, height) => {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillRect(x, y, width, height);
};

const init = () => {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  playerScore1 = playerScore2 = 0;
  isUserControlling = false;
  isPlaying = true;
};

window.addEventListener('load', () => {
  init();
  setInterval(() => {
    move();
    draw();
  }, 1000 / FRAME_PER_SECOND);

  canvas.addEventListener('click', () => {
    if(!isPlaying) {
      init();
    }
  });
});

window.addEventListener('keypress', (e) => {
  if(e.keyCode === 119) {
    paddleLeft.y -= PADDLE_STEP;
  } else if(e.keyCode === 115) {
    paddleLeft.y += PADDLE_STEP;
  } else if(e.keyCode === 56) {
    paddleRight.y -= PADDLE_STEP;
    isUserControlling = true;
  } else if(e.keyCode === 50) {
    paddleRight.y += PADDLE_STEP;
    isUserControlling = true;
  } 
});

window.addEventListener('keyup', (e) => {
  isUserControlling = false;
});