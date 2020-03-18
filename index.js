
	// WorldChat Online main chat server controller
	// Copyright (c) @shaunakg
	// Licensed under the MIT License

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const webport = process.env.PORT || 8080;
var message_history = [];
var latest_ip;

const privUsers = [
    "admin",
    "developer",
    "system/regulation-enforcement",
    "system/information"
];

app.get('/', function(req, res){
    console.log("Request to index by: " + (req.headers['x-forwarded-for'] || req.connection.remoteAddress));
    res.sendFile(__dirname + "/index.html");
});

app.get('/chat.html', function (req, res) {
    console.log("Request to chat by: " + (req.headers['x-forwarded-for'] || req.connection.remoteAddress))
    latest_ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress);
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

io.emit("client-action", [0]);

io.on('connection', function(socket){

    socket.on('chat message', function(msg){

        if (privUsers.includes(msg[0].toLowerCase())) {
            let admin_msg = [privUsers[2].toUpperCase(), "Sorry, your user ID is not allowed. Please change it by pressing the button in the top right of the screen."];
            console.log("[" + admin_msg[0] + "] " + admin_msg[1]);
            message_history.push(admin_msg);
            socket.emit('chat message', admin_msg);
        } else {
            console.log("[" + msg[0] + "] " + msg[1]);
            message_history.push(msg);
            io.emit('chat message', msg);
        }
    });

    socket.on('client-starting-package', function (package) {
        socket.emit('server-starting-package', [privUsers, latest_ip]);
    });

});

setInterval(function () {
    io.emit("chat message", [privUsers[3], "(Automated reminder) Remember, don't trust people with usernames like 'AppDeveloper', 'TheAdmin', etc. Here is a list of actual administrative users: " + privUsers.join(", ") + "."]);
}, 300000);

http.listen(webport, function(){
    console.log('listening on *:' + webport);
});
