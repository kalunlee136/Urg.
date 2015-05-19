//client.js
	
	  //retrieves messages submitted through the form, after presing send. 
	  //returns false so the form doesnt close down.
	  //does not send messages if user input is empty/none.

	  var socket = io();

	  socket.on('connect', function(){
		// call the server-side function 'adduser' and send one parameter (value of prompt)
		socket.emit('adduser', prompt("What's your name?"));
	  });

	  $('form').submit(function(){
	  	if($('#m').val() != ''){
		    socket.emit('chat message', $('#m').val());
		    socket.emit('bot message',$('#m').val());
		    $('#m').val('');
		}
	    return false;
	  });
	  
	  //retrieves messages, appends them to the <ul>
	  //then adds a "user is typing" line
	  //and runs the bot's response.
	  socket.on('chat message', function(msg){
	    $('#messages').append($('<li>').text("You: "+ msg));
	    $('#speak').show();
	  });

	  //waits 5 seconds then adds the bot's message and hides the "user is typing" line.
	  socket.on('bot message',function(m){
	  	  	setTimeout(function(){
		  	  $('#messages').append($('<li>'+'Billy Bot: '+ m + '</li>'));
		  	  $('#speak').hide();
		  	},2000);
	  	 });	
