'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
.use((req, res) => res.sendFile(INDEX, { root: __dirname }))
.use(express.static(__dirname + '/public'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

const users = {} ;

io.on('connection',socket=>{
    socket.on('new-user-joined', name=>{
       // console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
        console.log(`User ${name} joined the chat`)
    });
    socket.on('submit', message=>{
        var name = users[socket.id];
        socket.broadcast.emit('receive',{message:message, name: name});
        console.log(`User ${name}: ${message}`)
    });

    socket.on('disconnect', message=>{
        var name = users[socket.id];
        socket.broadcast.emit('left', name);
        console.log(`User ${name} left the chat`)
        delete users[socket.id];
    });

});
