var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000; //Heroku uses different ports other than 3000.
                                     //This makes it flexible to any port used. 


app.get('/', function(req, res){
  //IMPORTANT: ignore terminal's message telling you to use sendfile instead.
  //if you switch, it will crash the server. 	
  res.sendFile(__dirname + '/index.html'); 
});

var usernames = {};

var rooms = ['room1','room2','room3']; 

//Basically the main "class" of the socket. Everything in here is ran after the server is turned on.
//What is actually happening: 
//You create a web socket(io.on) and the socket parameter contains your object socket
//you bind event handlers to it (they are the socket.on functions).

io.on('connection', function(socket){

  //receives message from the user and displays it on the chat.
  socket.on('chat message', function(msg){
    io.emit('chat message',msg);
  });

  //pulls message from cleverbot and displays it on the chat. 
  socket.on('bot message',function(msg){
    io.emit('bot message',"aww that sucks");
  });

  //add user to his own room, similar to running a single chat client on its own thread.
  //Used to create distinct chat instances instead of everyone sharing the same one. 
  socket.on('adduser',function(username){
    socket.username = username;
    socket.room = username;
    usernames[username] = username;
    socket.join(username);
    socket.emit('updatechat','SERVER',"You have connected to the room");
    socket.broadcast.to(username).emit('updatechat','SERVER',username + 'has connected to this room');
  });

  //logic to run when the user disconnects from the chat. 
  socket.on('disconnect',function(){
    //remove the username from global usernames list
    delete usernames[socket.username];
    //update list of users in chat, client-side
    io.emit('updateusers',usernames);
    //echo globally that this client has left
    socket.broadcast.emit('updatechat','SERVER',socket.username + 'has disconnected');
    socket.leave(socket.room);
  });
 

});

//runs as soon as the server is turned on
http.listen(port, function(){
  console.log('listening on *:3000');
});

