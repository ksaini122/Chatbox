'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;

const server = express()
.use(express.static(__dirname + '/public/css'))
.use(express.static(__dirname + '/public/js'))
.get('/', (req,res)=>res.sendFile(__dirname+'/public/index.html'))
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
