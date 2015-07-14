// YOUR CODE HERE:
var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';
app.init = function () {};
app.send = function (message) {
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
app.fetch = function () {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      packageMessages(data);
    }
  });
};
app.clearMessages = function() {
  $('#chats').empty();
};

app.addMessage = function(message) {
  $('#chats').append($('<p></p>').text(message));
};

app.addRoom = function(room) {
  $('#roomSelect').append($('<a></a>').text(room));
}

$(document).ready(function(){

  var rooms = {};
  var currentRoom;
  var friends = [];

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
      room = result.roomname || 'general';
      // $message = $('<p></p>').text(user + ': ' + text + ' ' + time);

      $message = {
        user: user,
        text: text,
        time: moment(time).fromNow()
      };

      sortMessage(room, $message);
    });


    updateRoomLinks();

    currentRoom = currentRoom || getFirstRoom();
    displayMessages();

  };

  fetchMessages();
  setInterval(fetchMessages, 2000);
  // Sorts messages by room name and stores message to appropriate room
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
    $('.current-room').text('Current Room: ' + currentRoom);
    var $messages = $('<div class="messages"></div>');
    var user, text, time, $line;

    for (var i = 0; i < arr.length; i++) {
      user = arr[i].user;
      text = arr[i].text;
      time = arr[i].time;
      $line = $('<div class="line"></div>');
      $line.append($('<a class="user" href="#"></a>').text(user));

      if (friends.indexOf(user) !== -1) {
        $line.append($('<span class="friend-text"></span>').text(text));
      } else {
        $line.append($('<span class="text"></span>').text(text));
      }

      $line.append($('<span class="time"></span>').text(time));

      $messages.append($line);
    }

    $('.messages').replaceWith($messages);
    getUserText();
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
      username: $('.username').val(),
      text: $('.text').val(),
      roomname: $('.roomOption').val() || currentRoom
    };
    
    sendMessage(msg);
    // $('.username').val('');
    $('.text').val('');
    // $('.roomOption').val('');
  });

  $('.text').on('keypress', function(e){
    if (e.which === 13) {
      e.preventDefault();
      var msg = {
        username: $('.username').val(),
        text: $('.text').val(),
        roomname: $('.roomOption').val() || currentRoom
      };
      
      sendMessage(msg);
      // $('.username').val('');
      $('.text').val('');
      // $('.roomOption').val('');
    }
  });

  var getUserText = function() {
    $('.user').on('click', function() {
      friends.push($(this).text());
    });  
  };
  

});


