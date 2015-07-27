





$(document).ready(function(){

  var rooms = {};
  var currentRoom;
  var friends = [];

  var app = {

    server: 'https://api.parse.com/1/classes/chatterbox',

    send: function (message) {
      var body = JSON.stringify(message);
      $.ajax({
        url: this.server,
        type: 'POST',
        contentType: 'application/json',
        data: body
      });
    },

    fetch: function () {
      var app = this;
      $.ajax({
        url: this.server,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
          app.packageMessages(data);
        }
      });
    },
    
    clearMessages: function() {
      $('#chats').empty();
    },

    addMessage: function (message) {
      $('#chats').append($('<p></p>').text(message));
    },

    clearRooms: function() {
      for (var roomName in rooms) {
        rooms[roomName] = [];
      }
    },

    addRoom: function (room) {
      $('#roomSelect').append($('<a></a>').text(room));
    },

    packageMessages: function (data) {
      var results = data.results;
      var user, text, time, $message;
      var room;

      this.clearRooms();

      var app = this;
      _(results).each(function(result){
        user = result.username;
        text = result.text;
        time = result.updatedAt;
        room = result.roomname || 'nameless';
        $message = {
          user: user,
          text: text,
          time: moment(time).fromNow()
        };
        app.sortMessage(room, $message);
      });

      this.updateRoomLinks();
      currentRoom = currentRoom || this.getFirstRoom();
      this.displayMessages();
    
    },

    sortMessage: function (roomName, message) {
      rooms[roomName] = rooms[roomName] || [];
      rooms[roomName].push(message); 
    },

    updateRoomLinks: function() {
      var $rooms = $('.rooms');
      $rooms.empty();
      for (var roomName in rooms) {
        if (roomName === currentRoom) {
          $rooms.append($('<a class="room current" href="#"></a>').text(roomName));
        } else {
          $rooms.append($('<a class="room" href="#"></a>').text(roomName));
        }
      }
      this.addListeners();
    },

    getFirstRoom: function() {
      if (Object.keys(rooms)[0]) {
        return Object.keys(rooms)[0];
      } else {
        return 'Lobby';
      }
    },

    displayMessages: function() {
      var log = rooms[currentRoom];
      var $messages = $('.messages');
      var user, text, time, $line;
      $messages.empty();

      for (var i = 0; i < log.length; i++) {
        user = log[i].user;
        text = log[i].text;
        time = log[i].time;
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
      this.addFriendingListener();
    },

    addListeners: function () {
      var app = this;
      $('.room').on('click', function(){
        currentRoom = $(this).text();
        app.displayMessages();
      });
    },

    addFriendingListener: function() {
      $('.user').on('click', function() {
        friends.push($(this).text());
      });  
    },

    triggerSend: function() {
      var msg = {
        username: $('.username').val() || 'Anon',
        text: $('.message-text').val(),
        roomname: $('.room-name').val() || currentRoom
      };
      this.send(msg);
      $('.message-text').val('');
    }

  }; // app

  $('#submit').on('click', function() {
    app.triggerSend();
  });

  $('.message-text').on('keypress', function(e){
    if (e.which === 13) {
      e.preventDefault();
      app.triggerSend();
    }
  });

  app.fetch();
  setInterval(app.fetch.bind(app), 2000);

});
