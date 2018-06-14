const socket = io();

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const _gravity = 0.1;

const _playerList = {};

class Player {
    constructor(id, x, y, control = false) {
        /*this.x = 150;
    this.y = 400 / 2;*/
        this.id = id;
        this.x = x;
        this.y = y;
        this.control = control;

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
        document.addEventListener('keyup', event => {
            switch (event.keyCode) {
                case 32:
                    return this.jump();
                default:
                    break;
            }
        });

        document.addEventListener('mousemove', event => {
            this.targetX = event.pageX;
            this.targetY = event.pageY;
        });

        document.addEventListener('click', () => {
            this.fire();
        });
    }

    update() {
        this.velocity += _gravity;
        this.y += this.velocity;

        if (this.y > 300) {
            this.velocity -= 1;
        }

        this.render();
    }

    render() {
        ctx.beginPath();
        ctx.fillStyle = '#ffffff';
        ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
        ctx.moveTo(150, 150);
        ctx.fill();

        ctx.strokeStyle = '#FF0000';

        /**
         * Rethink mouse movement algorithm
         */
        var tx = this.targetX - this.x,
            ty = this.targetY - this.y,
            dist = Math.sqrt(tx * tx + ty * ty);

        var radians = Math.atan2(-ty, -tx);

        this.px = this.x + 50 * Math.cos(radians);
        this.py = this.y + 50 * Math.sin(radians);

        ctx.strokeStyle = 'red';
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
        if (this.control) {
            this.velocity += this.lift;
            socket.emit('get_players_position');
        }
    }

    fire() {
        this.firedBullets += 1;
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, 400, 400);

    Object.keys(_playerList).map(player => {
        _playerList[player].update();
    });

    ctx.rect(30, 350, 150, 10);
    ctx.fill();

    requestAnimationFrame(gameLoop);
}

gameLoop();

const objectToMap = obj => {
    const map = new Map();

    for (const k of Object.keys(obj)) {
        map.set(k, obj[k]);
    }
    return map;
};

socket.on('connect', () => {
    socket.emit('player_joined', {
        name: Math.round(Math.random() * 100)
    });
    //socket.emit('players_position', {});
});

socket.on('player_joined', data => {
    _playerList[data.id] = new Player(
        data.id,
        data.position.x,
        data.position.y,
        true
    );
    socket.emit('get_players_position');
});

socket.on('players_position', data => {
    const map = objectToMap(data);

    map.forEach((player, id) => {
        if (id === socket.id) {
            return;
        }
        _playerList[id] = new Player(
            player.id,
            player.position.x,
            player.position.y
        );
    });
});

socket.on('player_left', data => {
    delete _playerList[data.id];
});
