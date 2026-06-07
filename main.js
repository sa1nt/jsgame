class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.enemyPool = [];
    this.numberOfEnemies = 50;

    this.createEnemyPool();
    this.enemyTimer = 0;
    this.enemyInterval = 1000;

    this.start();

    window.addEventListener('resize', e => {
      console.log(e);
      this.resize(e.target.innerWidth, e.target.innerHeight);
    });
  }

  start() {
    this.resize(window.innerWidth, window.innerHeight);
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
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

  render(deltaTime) {
    this.handleEnemies(deltaTime);
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
