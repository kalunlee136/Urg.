/* Important things to know about socket.io/express/node.js

Use socket.emit for sending client-only messages 
Use app.use for allowing access of external files. 
  Then continue with the normal procedure to insert those files.
*/


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000; //Heroku uses different ports other than 3000.
                                     //This makes it flexible to any port used. 

app.get('/', function(req, res){
  //IMPORTANT: ignore terminal's message telling you to use sendfile instead.
  //if you switch, it will nor work. 	
  res.sendFile(__dirname + '/index.html');

});

// rooms which are currently available in chat
var rooms = [];

//Basically the main "class" of the socket. Everything in here is ran after the server is turned on.
//What is actually happening: 
//You create a web socket(io.on) and the socket parameter contains your object socket
//you bind event handlers to it (they are the socket.on functions).


io.on('connection', function(socket){

  socket.on('adduser', function(username){
      name = username;
      // store the username in the socket session for this client
      socket.username = username;
      // store the room name in the socket session for this client
      socket.room = username;
      // send client to room 1
      socket.join(username);
    });
   

  //receives message from the user and displays it on the chat.
  socket.on('chat message', function(msg){
    socket.emit('chat message',msg);    
  });

  //picks a random message and sends it to the chat as a response. 
  socket.on('bot message',function(msg){
    var i = getRandomInt(0,bot_response.length);
    socket.emit('bot message',bot_response[i]; 
  });

 

});




//multiple responses the bot can use.
var bot_response = ['I Care', 
                    'You’re not alone in this',
                    'I’m not going to leave/abandon you',
                    'Do you want a hug?',
                    'I love you (if you mean it).',
                    'It will pass, we can ride it out together.',
                    'When all this is over, I’ll still be here (if you mean it) and so will you.',
                    'May the strength of the past reflect in your future.',
                    ' "God does not play dice with the universe.” – A. Einstein',
                    '“A miracle is simply a do-it-yourself project.” – S. Leek',
                    'I understand your pain and I empathize',
                    'I’m sorry you’re in so much pain. I am not going to leave you. I am going to take care of myself so you don’t need to worry that your pain might hurt me.',
                    'I can’t really fully understand what you are feeling, but I can offer my compassion.'
                    ];


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


http.listen(port, function(){
  console.log('listening on *:3000');
});

