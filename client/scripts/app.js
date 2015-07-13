// YOUR CODE HERE:
var fetchMessages = function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      displayMessages(data);
    }
  });
};

var displayMessages = function (data) {
  var results = data.results;
  var user, text, time, $message;
  var $messages = $('<div class="messages"></div>');
  _(results).each(function(result){
    user = result.username;
    text = result.text;
    time = result.updatedAt;
    $message = $('<p></p>').text(user + ': ' + text + ' ' + time);
    $messages.append($message);
  });
  $('.messages').replaceWith($messages);
};

fetchMessages();
setInterval(fetchMessages, 2000);