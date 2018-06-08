const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 3000;

const players = new Map();

const mapToObject = map => {
    const obj = Object.create(null);
    for (let [k, v] of map.entries()) {
        obj[k] = v;
    }
    return obj;
};

io.on('connection', socket => {
    console.log('player connected');
    // { name, position }
    socket.on('player_joined', data => {
        players.set(socket.id, data);
        io.emit('player_joined', { id: socket.id, ...data });
    });

    socket.on('players_position', () => {
        io.emit('players_position', mapToObject(players));
    });

    socket.on('update_player_position', position => {
        const data = players.get(socket.id);

        data.position = position;

        io.emit('players_position', mapToObject(players));
    });

    socket.on('disconnect', () => {
        const data = players.get(socket.id);
        players.delete(socket.id);
        io.emit('player_left', { id: socket.id, ...data });
    });
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
