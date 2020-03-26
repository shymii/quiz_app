let randomQ = [];

for(i=0; i<5; i++){
    let random = Math.floor(Math.random() * 6) + 1;
    if(!randomQ.includes(random)){
        randomQ.push(random);
    } else{
        i--;
    }
}

let express = require('express');
let socket = require('socket.io');

//app setup

let app = express();

let server = app.listen(4000, () => {
    console.log('listening on 4000');
});

app.use(express.static('public'));

let io = socket(server);

let code = 0;

let players = [];

let socketList = [];

let category = '';



console.log(code);



io.on('connection', (socket) => {
    console.log(socket.id);
    socketList.push(socket);

    socket.on('gencode', (data) => {
        code = data;
        players.filter(player => {player!=socket});
        console.log(players);
        console.log(code);
    })

    socket.on('disconnall', () => {
        socketList.forEach(socket => socket.disconnect(true))
        players = [];
        socketList = [];
    })

    socket.on('code', (data) => {
        if(data==code){
            socket.emit('code', socket.id);
            console.log('poprawny');
        }
    });

    socket.on('login', data => {
        if(players.length >= 3){
            socket.disconnect(true);
            console.log('access denied');
        } else {
            players.push(data);
            console.log(players);
            if(players.length == 3){
                console.log('trzech');
            }
        }
    });

    socket.on('cata', () => {
        category = 'categoryA';
        io.sockets.emit('randomNums', randomQ);
        io.sockets.emit('category', category);
    })

    socket.on('catb', () => {
        category = 'categoryB';
        io.sockets.emit('randomNums', randomQ);
        io.sockets.emit('category', category);
    })

    socket.on('catc', () => {
        category = 'categoryC';
        io.sockets.emit('randomNums', randomQ);
        io.sockets.emit('category', category);
    })

    socket.on('start', () => {
        io.sockets.emit('login', players);
    })
});


