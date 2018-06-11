var expect = require('expect');

var {generateMessage} = require('./message');
describe('generateMessage()' ,() => {
  it('shoud generate correct message object', ()=> {
    var from = 'Nikola';
    var text = 'Hello everybody';
    var message = generateMessage(from, text);
    expect(message).toInclude({from,text});
    expect(message.createdAt).toBeA('number');
  });
});

var {generateLocationMessage} = require('./message')
describe('generateLocationMessage', ()=>{
  it('should generate correct location object', () => {
    var from = 'Nikola';
    var latitude = 45;
    var longitude = 35;
    var message = generateLocationMessage(from, latitude, longitude);
    expect(message).toInclude({
      from,
      url:`https://www.google.com/maps?q=${latitude},${longitude}`
    });
    expect(message.createdAt).toBeA('number');
  });
});
