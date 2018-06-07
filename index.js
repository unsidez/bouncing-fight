const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const _gravity = 0.1;

class Player {
  constructor() {
    this.x = 150;
    this.y = 400 / 2;
    this.velocity = 0;
    this.lift = -5;

    this.px = 0;
    this.py = 0;
    this.targetX = 0;
    this.targetY = 0;

    this.firedBullets = 0;

    this.enableBindings();
  }

  enableBindings() {
    document.addEventListener('keyup', (event) => {
       switch (event.keyCode) {
          case 32:
            return this.jump();
          default:
             break;
        }
    });

    document.addEventListener('mousemove', (event) => {
      this.targetX = event.pageX;
      this.targetY = event.pageY;
    });

    document.addEventListener('click', () => {
      this.fire();
    });
  }

  update() {
    this.velocity += _gravity;
    //this.y += this.velocity;

    this.render();
  }

  render() {
    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
    ctx.moveTo(150,150);
    ctx.fill();

    ctx.strokeStyle="#FF0000";

    /**
     * Rethink mouse movement algorithm
     */
    var tx = this.targetX - this.x,
        ty = this.targetY - this.y,
        dist = Math.sqrt(tx * tx + ty * ty);

      var radians = Math.atan2(-ty,-tx);

      this.px = this.x + 50 * Math.cos(radians);
      this.py = this.y +  50 * Math.sin(radians);

      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.px, this.py);
      ctx.closePath();
      ctx.stroke();
    /**
     * End of it
     */
  }

  jump() {
    this.velocity += this.lift;
  }

  fire() {
    this.firedBullets += 1;
  }
}

const player = new Player();




function gameLoop() {
  ctx.clearRect(0, 0, 400, 400);
  player.update();

  ctx.rect(30, 350, 150, 10);
  ctx.fill();

  requestAnimationFrame(gameLoop);
}

gameLoop();
