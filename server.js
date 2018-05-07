// serves up public directory
const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '/');
const port = process.env.PORT || 3001;    // for heroku setup, in case that happens

var app = express();                // express is used through app
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// app.use(express.static(publicPath));
app.use(express.static(__dirname + '/'));
app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(client) {
  console.log('Client connected');

  client.on('join', function(data){
    console.log(data);
  });

  client.on('rec', function(data){
    console.log(data);
    console.log("*Insert rec script"); /////////// replace with recording script
    // will emit finish message when user done rec to update waveform
    io.emit('read', 'done');
  });

  client.on('typeSel', function(data){
    console.log("EQ type selected: " + data);
    console.log("*Insert rec script");      //////////// replace with recording script
    console.log("*Insert transmit script"); /////////// replace with transmission script

    // will emit after RECEIVING ML score, placed here to emulate timing difference
    io.emit('read', 'done');
  });

});


// not app.listen!!!
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
