class Enemy {
  constructor(game) {
    this.game = game;

    this.width = 50;
    this.height = 50;

    this.x;
    this.y;

    this.speedX = 0;
    this.speedY = Math.random() * 2 + 1;

    this.lives;

    this.active = false;
  }

  start() {
    this.x = Math.random() * this.game.width;
    this.y = -this.height;
    this.lives = 2;
    this.active = true;
  }

  reset() {
    this.active = false;
  }

  isAlive() {
    return this.lives > 0;
  }

  update() {
    if (this.active) {
      // makes enemies float in from the top of the screen
      if (this.y < 0) {
        this.y += 5;
      }

      // forces enmies to always stay fully on the screen
      if (this.x > this.game.width - this.width) {
        this.x = this.game.width - this.width;
      }

      this.x += this.speedX;
      this.y += this.speedY;

      // check collision
      if (this.game.checkCollision(this, this.game.mouse) 
          && this.game.mouse.pressed
          && !this.game.mouse.fired) {
        this.lives--;
        this.game.mouse.fired = true;
      }
      if (!this.isAlive()) {
        this.reset();
        this.game.score++;
      }

      if (this.y > this.game.height) {
        this.reset();
        this.game.playerLives--;
      }
    }
  }

  draw() {
    if (this.active) {
      this.game.ctx.strokeRect(this.x, this.y, this.width, this.height);

      this.game.ctx.fillText(this.lives, this.x + this.width * 0.5, this.y + this.height * 0.5);
    }
  }
}
