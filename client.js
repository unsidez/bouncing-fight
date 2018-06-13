/* Client script to test realtime interactions */
const io = require('socket.io-client');
const socket = io('http://localhost:3000');

const _playerList = {};

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
    _playerList[data.id] = { ...data, control: true };
    socket.emit('get_players_position');
    console.log('player_joined', data);
});

socket.on('players_position', data => {
    const map = objectToMap(data);
    console.log('map -> ', map);

    map.forEach((player, id) => {
        if (id === socket.id) {
            return;
        }
        _playerList[id] = { ...player };
    });
    console.log('player_list', Object.keys(_playerList));
});

socket.on('player_left', data => {
    delete _playerList[data.id];
});
