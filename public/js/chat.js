var socket = io();

function scrollToBottom(){
  //Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  //Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();
  if(clientHeight + scrollTop +newMessageHeight+ lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }

}

socket.on('connect', function() {
  // var params = jQuery.deparam(window.location.search);
  var text = decodeURIComponent(window.location.search.replace(/\+/g, '%20'));
  var params = {
    name: text.slice(text.indexOf('?name=')+6,text.indexOf('&room=')),
    room: text.slice(text.indexOf('&room=')+6)
  };

  socket.emit('join',params, function(err){
    if(err){
      alert(err);
      window.location.href = '/';
    }else{
      console.log('No error occurred!');
    }
  });
});

socket.on('disconnect', function() {

});

socket.on('updateUserList', function(users){
  var ol = jQuery('<ol></ol>');

  users.forEach(function (user){
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ol);
});

socket.on('newMessage',function(message){
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template,{
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function (message){
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template,{
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

jQuery('#text-box-field').on('keyup', function(){
  if(jQuery('#text-box-field').val().length === 0){
    jQuery('#send-message-button').attr('disabled','disabled');
  }else{
    jQuery('#send-message-button').removeAttr('disabled');
  }
});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  var messageTextbox = jQuery('[name=message]');
  if(messageTextbox.val() !== ''){
    socket.emit('createMessage', {
      text: messageTextbox.val()
    }, function(){
      messageTextbox.val('');
    });
  }
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
