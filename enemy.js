class Enemy {
  constructor(game) {
    this.game = game;

    this.width = 50;
    this.height = 50;

    this.x = Math.random() * this.game.width;
    this.y = -this.height;

    this.speedX = 0;
    this.speedY = Math.random() * 4 + 1;

    this.active = false;
  }

  start() {
    this.x = Math.random() * this.game.width;
    this.y = -this.height;
    this.active = true;
  }

  reset() {
    this.active = false;
  }

  update() {
    if (this.active) {
      // makes enemies float in from the top of the screen
      if (this.y < 0) {
        this.y += 5;
      }


      this.x += this.speedX;
      this.y += this.speedY;

      if (this.y > this.game.height) {
        this.reset();
      }
    }
  }

  draw() {
    if (this.active) {
      this.game.ctx.fillStyle = 'red';
      this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}
