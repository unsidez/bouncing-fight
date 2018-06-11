const io = require('socket.io-client');
const socket = io('http://localhost:3000');

const objectToMap = obj => {
    const map = new Map();

    for (const k of Object.keys(obj)) {
        map.set(k, obj[k]);
    }
    return map;
};

socket.on('connect', () => {
    console.log('connected');
    socket.emit('player_joined', {
        name: 'John Doe',
        position: { x: 2, y: 4 }
    });
    socket.emit('players_position', {});
});

socket.on('player_joined', data => {
    console.log(data);
});

socket.on('players_position', players => {
    console.log(objectToMap(players));
});

socket.on('disconnect', () => {});
