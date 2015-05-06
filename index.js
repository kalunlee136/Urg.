var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  //ignore terminal's message telling you to use sendFile instead.
  //if you switch, it will crash the server. 	
  res.sendFile(__dirname + '/index.html'); 
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message',msg);
  });

  //socket.on('bot message', function(){
  //  io.emit('bot message',"aww... that sucks..");
  //});

  //socket.on ('is typing', function(data){
  //	io.emit('typing', {nickname: data});
  //});

});

console.log(port);
http.listen(port, function(){
  console.log('listening on *:3000');
});

