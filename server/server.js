const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const publicPath = path.join(__dirname,'..','public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket) => {
  console.log('New user connected!');

  socket.on('disconnect', () =>{
    console.log('Disconnected from server!');
  });

  socket.on('createMessage', (message)=>{
    console.log('Create message',message);
  });
  socket.emit('newMessage', {
    from: 'John',
    text: 'Hey. What is going on.',
    createdAt: new Date().toString().slice(16,24)
  });

});

server.listen(port, ()=>{
  console.log(`Server listening on port ${port}`);
});
