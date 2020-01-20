
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const webport = process.env.PORT || 8080;
var message_history = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.get('/chat.html', function (req, res) {
    res.sendFile(__dirname + "/chat.html");
})

app.get('/index.css', function(req, res){
    res.sendFile(__dirname + '/index.css', headers = {
        'Content-Type' : 'text/css'
    });
});

app.get('/chat.css', function(req, res){
    res.sendFile(__dirname + '/chat.css', headers = {
        'Content-Type' : 'text/css'
    });
});

app.get('/jquery-1.11.1.js', function(req, res){
    res.sendFile(__dirname + '/jquery-1.11.1.js');
});

io.on('connection', function(socket){

    socket.on('chat message', function(msg){
        console.log("[" + msg[0] + "] " + msg[1]);
        message_history.push(msg);
        io.emit('chat message', msg);
    });

});

http.listen(webport, function(){
    console.log('listening on *:' + webport);
})
