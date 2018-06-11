var moment = require('moment');

var timestamp = 123123;
var date = moment(timestamp);

console.log(date.format('MMM Do YYYY , h:mm a'));
