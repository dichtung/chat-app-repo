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
