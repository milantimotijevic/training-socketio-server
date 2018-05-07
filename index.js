const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const request = require('request');

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.post('/login', function(req, res) {
    request.post('http://localhost:8080/login',
        {json: {tweetText: data}},
        function(err, resp, body) {
            if(!err && resp.statusCode === 200) {
                res.status(200).json(body);
            } else {
                res.status(400).json({error: 'login failed'});
            }
        }
    );
});

io.set('authorization', function (handshake, callback) {
    callback(null, true);
});

io.on('connection', function(socket) {
    console.log('Connection established');
    const token = socket.handshake.query.token;
    request.get('http://localhost:8080/validatelogin/' + token,
        function(err, resp, body) {
            if(body === false) {
                socket.disconnect();
            }
        }
    );


    socket.on('send tweet', function(data) {
        request.post('http://localhost:8080/validatetweet',
            {json: {tweetText: data}},
            function(err, resp, body) {
                if(!err && resp.statusCode === 200) {
                    io.emit('update tweets', data);
                }
            }
            );
    });
});


server.listen('3000');