const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

var {generateMessage, generateLocationMessage} = require('./utils/message');
var {isRealString} = require('./utils/validation')

const publicPath = path.join(__dirname,'..','public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket) => {

  socket.on('join', (params, callback) =>{
    if(!isRealString(params.name) || !isRealString(params.room)){
      callback('Name and room name are required.');
    }

    socket.join(params.room);

    socket.emit('newMessage', generateMessage('Admin',`${params.name}, welcome to the room: "${params.room}"! Enjoy.`));
    socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined the room!`));


    callback();
  });




  socket.on('createMessage', (message,callback)=>{
    io.emit('newMessage',generateMessage(message.from,message.text));
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Location: ', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () =>{});

});

server.listen(port, ()=>{
  console.log(`Server listening on port ${port}`);
});
