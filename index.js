//  node server
const http = require("http");
const socketIO = require("socket.io");

const httpServer = http.createServer();
const io = new socketIO.Server(httpServer, {
  cors: {
    origin: "*"
  }
});

httpServer.listen(8000, ()=>{console.log("server started")});

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
