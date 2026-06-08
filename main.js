class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.enemyPool = [];
    this.numberOfEnemies = 50;
    this.winningScore = 3;
    this.gameOver = true;

    this.score = 0; 

    this.playerLives;
    
    this.beginMessage1 = 'Run!';
    this.beginMessage2 = 'Or get eaten!';
    this.beginMessage3 = 'Press ENTER or tap R to start';

    this.createEnemyPool();
    this.enemyTimer = 0;
    this.enemyInterval = 1000;

    this.mouse = {
      x: undefined,
      y: undefined,
      height: 1,
      width: 1,
      pressed: false,
      fired: false,
    };

    this.resize(window.innerWidth, window.innerHeight);
    this.resetButton = document.getElementById('resetButton');
    this.resetButton.addEventListener('click', e => {
      this.start();
    });

    this.fullscreenElement = document.getElementById('fullScreenButton');
    this.fullscreenElement.addEventListener('click', e => {
      this.toggleFullScreen();
    });

    window.addEventListener('resize', e => {
      console.log(e);
      this.resize(e.target.innerWidth, e.target.innerHeight);
    });
    window.addEventListener('mousedown', e => {
      // e.preventDefault();
      this.mouse.x = e.x;
      this.mouse.y = e.y;
      this.mouse.pressed = true;
      this.mouse.fired = false;
    });
    window.addEventListener('mouseup', e => {
      // e.preventDefault();
      this.mouse.x = e.x;
      this.mouse.y = e.y;
      this.mouse.pressed = false;
    });
    window.addEventListener('touchstart', e => {
      console.log(e);
      // e.preventDefault();
      this.mouse.x = e.changedTouches[0].pageX;
      this.mouse.y = e.changedTouches[0].pageY;
      this.mouse.pressed = true;
      this.mouse.fired = false;
    });
    window.addEventListener('touchend', e => {
      console.log(e);
      // e.preventDefault();
      this.mouse.x = e.changedTouches[0].pageX;
      this.mouse.y = e.changedTouches[0].pageY;
      this.mouse.pressed = false;
    });
    window.addEventListener('keyup', e => {
      if (e.key === 'Enter' || e.key.toLowerCase() === 'r') {
        this.start();
      } else if (e.key.toLowerCase() === 'f') {
        this.toggleFullScreen();
      }
    });
  }

  start() {
    this.resize(window.innerWidth, window.innerHeight);
    this.score = 0;
    this.playerLives = 3;
    this.gameOver = false;
    this.enemyPool.forEach(enemy => enemy.reset());
    for (let i = 0; i < 2; i++) {
      const enemy = this.getEnemy();
      if (enemy) {
        enemy.start();
      }
    }
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;

    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = 'white';

    this.ctx.font = '40px Bangers';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
  }

  toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  checkCollision(rect1, rect2) {
    return(rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y);
  }

  createEnemyPool() {
    for (let i = 0; i < this.numberOfEnemies; i++) {
      const e = new Enemy(this);
      this.enemyPool.push(e);
    }
  }

  getEnemy() {
    for (let i = 0; i < this.enemyPool.length; i++) {
      if (!this.enemyPool[i].active) {
        return this.enemyPool[i];
      }
    }
    return null;
  }

  handleEnemies(deltaTime) {
    let enemy = null;
    if (this.enemyTimer < this.enemyInterval) {
      this.enemyTimer += deltaTime;
    } else {
      this.enemyTimer = 0;
      enemy = this.getEnemy();
    }

    if (enemy) {
      enemy.start();
    }
  }

  triggerGameOver() {
    if (!this.gameOver) {
      this.gameOver = true;
    }
    if (this.playerLives < 1) {
      this.beginMessage1 = 'Game Over!';
      this.beginMessage2 = 'The crew was eaten!';
    } else if (this.score >= this.winningScore) {
      this.beginMessage1 = 'Well Done!';
      this.beginMessage2 = 'You escaped the swarm!';
    }
  }

  drawStatusText() {
    this.ctx.save();
    // save and restore required not to mess ctx settings in other places
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${this.score}`, 20, 35);
    for (let i = 0; i < this.playerLives; i++) {
      this.ctx.fillText('♥', 20 + 30 * i, 70);
    }

    if (this.playerLives < 1 || this.score >= this.winningScore) {
      this.triggerGameOver();
    }
    if (this.gameOver) {
      this.ctx.textAlign = 'center';
      this.ctx.font = '70px Bangers';
      this.ctx.fillText(this.beginMessage1, this.width * 0.5, this.height * 0.5 - 25);

      this.ctx.font = '20px Bangers';
      this.ctx.fillText(this.beginMessage2, this.width * 0.5, this.height * 0.5 + 25);
      this.ctx.fillText(this.beginMessage3, this.width * 0.5, this.height * 0.5 + 50);
    }
    this.ctx.restore();
  }

  render(deltaTime) {
    this.drawStatusText();
    if (!this.gameOver) {
      this.handleEnemies(deltaTime);
    }
    this.enemyPool.forEach(enemy => {
      enemy.update();
      enemy.draw();
    });
  }
}

window.addEventListener('load', function() {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const game = new Game(canvas, ctx);

  let lastTime = 0;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(deltaTime);
    window.requestAnimationFrame(animate);
  }
  animate();
});
