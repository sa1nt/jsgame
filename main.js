class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.enemy1 = new Enemy(this);
    this.enemy2 = new Enemy(this);
    this.enemy3 = new Enemy(this);

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

  render() {
    this.enemy1.update();
    this.enemy1.draw();
    this.enemy2.update();
    this.enemy2.draw();
    this.enemy3.update();
    this.enemy3.draw();
  }
}

window.addEventListener('load', function() {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const game = new Game(canvas, ctx);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx);
    window.requestAnimationFrame(animate);
  }
  animate();
});
