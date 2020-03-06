let express = require('express');
let socket = require('socket.io');
//app setup

let app = express();

let server = app.listen(4000, () => {
    console.log('listening on 4000');
});

let io = socket(server);

let code = Math.floor(Math.random() * (999999-100000) + 100000);

console.log(code);

io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('code', (data) => {
        if(data==code){
            socket.emit('code', socket.id);
            console.log('poprawny');
        }
    })
});

