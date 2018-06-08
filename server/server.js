const path = require('path');
const express = require('express');

var app = express();
var publicPath = path.join(__dirname,'..','public');
const port = process.env.PORT || 3000;
//static middleware to serve up public folder
app.use(express.static(publicPath));


app.listen(port, ()=>{
  console.log(`Server listening on port ${port}`);
});
