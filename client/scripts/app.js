// YOUR CODE HERE:

$(document).ready(function(){

  var rooms = {};
  var currentRoom;


  var fetchMessages = function() {
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        // console.log(data);
        packageMessages(data);
      }
    });
  };

  var packageMessages = function (data) {
    var results = data.results;
    var user, text, time, $message;
    var room;

    clearRooms();

    _(results).each(function(result){
      user = result.username;
      text = result.text;
      time = result.updatedAt;
      room = result.roomname;
      // $message = $('<p></p>').text(user + ': ' + text + ' ' + time);
      $message = user + ': ' + text + ' ' + time;
      sortMessage(room, $message);
    });


    updateRoomLinks();

    currentRoom = currentRoom || getFirstRoom();
    displayMessages();

  };

  fetchMessages();
  setInterval(fetchMessages, 2000);
  // Sorts messages by room name 
  var sortMessage = function(roomName, message) {
    rooms[roomName] = rooms[roomName] || [];
    rooms[roomName].push(message); 
  };

  var clearRooms = function() {
    for (var roomName in rooms) {
      rooms[roomName] = [];
    }
  };

  var updateRoomLinks = function() {
    var linkBar = $("<div class='rooms'></div>");

    for (var roomName in rooms) {
      linkBar.append($('<a class="room" href="#"></a>').text(roomName));
    }
    $('.rooms').replaceWith(linkBar);
    addListeners();
  };

  var getFirstRoom = function() {
    for (var roomName in rooms) {
      return roomName;
    }
  };

  var displayMessages = function() {
    var arr = rooms[currentRoom];
    var $messages = $('<div class="messages"></div>');

    for (var i = 0; i < arr.length; i++) {
      $messages.append($('<p></p>').text(arr[i]));
    }

    $('.messages').replaceWith($messages);
  };


  // On room name click, go to that room and display those messages
  var addListeners = function () {
    $('.room').on('click', function(){
      currentRoom = $(this).text();
      displayMessages();
    });
  };

  var sendMessage = function(message) {
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(message),
      success: function(data) {
        console.log('Success!');
      } 
    });
  };

  $('#submit').on('click', function() {
    var msg = {
      username: 'lol',
      text: $('input').val(),
      roomname: currentRoom
    };
    
    sendMessage(msg);
  });

});


