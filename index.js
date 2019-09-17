
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var message_history = [];

app.get('/', function(req, res){
    console.log("New request to index.html");
    res.sendFile(__dirname + '/index.html');
});

app.get('/stylesheet.css', function(req, res){
    res.sendFile(__dirname + '/stylesheet.css', headers = {
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

http.listen(8080, function(){
    console.log('listening on *:8080');
})