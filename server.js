var express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

var users = {};
var id = {};
var connect = {};

io.on('connection', function(socket){
    console.log('user connected');

    socket.on('new message', function (msg) {
        io.emit('new message', [msg, socket.id, id])
    });

    socket.on('new user', function (user) {
        if (user in users) {
            if(connect[user]) {
                io.emit('new user', false);
            } else {
                socket.id = users[user];
                io.emit('old user', socket.id);
            }

        } else {
            connect[user] = true;
            id[socket.id] = user;
            users[user] = socket.id;
            io.emit('new user', true)
        }
    });

    socket.on('disconnect', function () {
        connect[id[socket.id]] = false;
        io.emit('disconnect', socket.id);
        console.log('user disconnected')
    })
});

http.listen(3000,function(){
    console.log('listen on *:3000');
});