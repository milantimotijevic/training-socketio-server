const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log('Connection established');

    socket.on('send tweet', function(data) {
        io.emit('update tweets', data);
    });
});

server.listen('3000');