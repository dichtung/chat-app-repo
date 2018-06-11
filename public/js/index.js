var socket = io();

socket.on('connect', function() {
  console.log('Connected to server');


});

socket.on('disconnect', function() {
  console.log('Disconnected from server!');
});

socket.on('newMessage',function(message){
  console.log('New message', message);
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message){
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current Location</a>');
  li.text(`${message.from}: `);
  a.attr('href',message.url);
  li.append(a);
  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function(){
    messageTextbox.val('');
  });
});


var locationButton = jQuery('#send-location');
locationButton.on('click', function(e){
  if(!navigator.geolocation){
    return alert('Geolocation not available in this browser!');
  }
  locationButton.attr('disabled','disabled').text('Sending ...');
  navigator.geolocation.getCurrentPosition(function(position){
    socket.emit('createLocationMessage',{
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
    locationButton.removeAttr('disabled').text('Send Location');
  },function(){
    locationButton.removeAttr('disabled').text('Send Location');
    alert('Unable to fetch location.');
  });
});
