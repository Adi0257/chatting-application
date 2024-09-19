// node server for sockit for connections
// const io = require('socket.io')(8000);
const users = {};
const io = require('socket.io')(8000, {
    cors: {
      origin: "http://127.0.0.1:5500",
      methods: ["GET", "POST"]
    }
  });
  

io.on('connection', socket =>{
    //if any new user joins , let other users connect it to other people
    socket.on('new-user-joined', name => {
        // console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    });

    // if someone sends a message, broadcast it to other people
    socket.on('send', message =>{
        socket.broadcast.emit('receive',{message: message, name: users[socket.id]})
    });

    // if someone leaves a chat, broadcast it to other people
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    });
});