// serves up public directory
const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '/');
const port = process.env.PORT || 3001;    // for heroku setup, in case that happens

var shell = require('shelljs');
var fs = require('fs');

var app = express();                // express is used through app
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/'));
app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(client) {
  console.log('Client connected');

  client.on('join', function(data){
    console.log(data);
  });

  client.on('firstRec', function(data){
    console.log(data);
    console.log("Recording...");
    shell.exec('arecord --channels=1 --device=plughw:1,0 --duration=4 --format S16_LE --rate 44100 --vumeter=mono iotOrig.wav');
    // will emit after RECEIVING ML score, placed here to emulate timing difference
    io.emit('read', 'done');
  });

  client.on('typeSel', function(data){
    console.log("EQ type selected: " + data);
    setTimeout(function(){
    console.log("Recording...");
    shell.exec('arecord --channels=1 --device=plughw:1,0 --duration=4 --format S16_LE --rate 44100 --vumeter=mono iotSend.wav');
  },500);
    setTimeout(function(){
    console.log("Sending file...");
    shell.exec('bash send.sh');
  },4700);
    // get EQ parameters from previous iteration (set to 0 by default)
    setTimeout(function(){
    var array = fs.readFileSync('params.txt').toString().split('\n');
    var params = new Array(10);
    var i;
    for(i = 1; i < 11; i++){
        params[i-1] = parseFloat(array[i]);
    }

    // read ML score from text file
    var scoreArr = fs.readFileSync('results.txt').toString().split('\n');
    var pastArr = fs.readFileSync('saved.txt').toString().split('\n');

    // set EQ parameters
      // bright type
      if (data == 'bright') {
        // Format score for comparison
        var score = scoreArr[1];
        var scoreFloat = parseFloat(score);
        var scoreRound = Math.round(scoreFloat * 100);

        var prevScore = pastArr[1];
        var prevScoreFloat = parseFloat(prevScore);
        var prevScoreRound = Math.round(prevScoreFloat * 100);

        console.log(scoreFloat);

        if (prevScoreRound >= scoreRound) {
          // if score worsens, stick with previous result
          var f32 = params[0];
          var f64 = params[1];
          var f125 = params[2];
          var f250 = params[3];
          var f500 = params[4];
          var f1k = params[5];
          var f2k = params[6];
          var f4k = params[7];
          var f8k = params[8];
          var f16k = params[9];
        } else if(scoreRound < 35){
          // bad score: cut 2k and under, boost 8k and up
          var f32 = params[0] - 1;
          var f64 = params[1] - 1;
          var f125 = params[2] - 1;
          var f250 = params[3] - 1;
          var f500 = params[4] - 1;
          var f1k = params[5] - 1;
          var f2k = params[6] - 1;

          var f4k = params[7];

          var f8k = params[8] + 1;
          var f16k = params[9] + 1;

        } else if(scoreRound < 60){
          // meh score: cut 2k and under
          var f32 = params[0] - 1;
          var f64 = params[1] - 1;
          var f125 = params[2] - 1;
          var f250 = params[3] - 1;
          var f500 = params[4] - 1;
          var f1k = params[5] - 1;
          var f2k = params[6] - 1;

          var f4k = params[7];
          var f8k = params[8];
          var f16k = params[9];

        } else if(scoreRound < 80){
          // good score: boost 4k and up
          var f32 = params[0];
          var f64 = params[1];
          var f125 = params[2];
          var f250 = params[3];
          var f500 = params[4];
          var f1k = params[5];
          var f2k = params[6];

          var f4k = params[7] + 1;
          var f8k = params[8] + 1;
          var f16k = params[9] + 1;

        } else if(scoreRound > 80){
          // all done! keep current EQ parameters
          var f32 = params[0];
          var f64 = params[1];
          var f125 = params[2];
          var f250 = params[3];
          var f500 = params[4];
          var f1k = params[5];
          var f2k = params[6];
          var f4k = params[7];
          var f8k = params[8];
          var f16k = params[9];
        }

        // dark type
      } else if (data == 'dark') {
        // Format score for comparison
        var score = scoreArr[0];
        var scoreFloat = parseFloat(score);
        var scoreRound = Math.round(scoreFloat * 100);
        console.log(scoreFloat);

        if(scoreRound < 35){
          // bad score: boost 250 and under, cut 500 and above
          var f32 = params[0] + 1;
          var f64 = params[1] + 1;
          var f125 = params[2] + 1;
          var f250 = params[3] + 1;

          var f500 = params[4] - 1;
          var f1k = params[5] - 1;
          var f2k = params[6] - 1;
          var f4k = params[7] - 1;
          var f8k = params[8] - 1;
          var f16k = params[9] - 1;

        } else if(scoreRound < 60){
          // meh score: cut 1k and above
          var f32 = params[0];
          var f64 = params[1];
          var f125 = params[2];
          var f250 = params[3];
          var f500 = params[4];

          var f1k = params[5] - 1;
          var f2k = params[6] - 1;
          var f4k = params[7] - 1;
          var f8k = params[8] - 1;
          var f16k = params[9] - 1;

        } else if(scoreRound < 80){
          // good score: boost 500 and under
          var f32 = params[0] + 1;
          var f64 = params[1] + 1;
          var f125 = params[2] + 1;
          var f250 = params[3] + 1;
          var f500 = params[4] + 1;

          var f1k = params[5];
          var f2k = params[6];
          var f4k = params[7];
          var f8k = params[8];
          var f16k = params[9];

        } else if(scoreRound > 80){
          // all done! keep current EQ parameters
          var f32 = params[0];
          var f64 = params[1];
          var f125 = params[2];
          var f250 = params[3];
          var f500 = params[4];
          var f1k = params[5];
          var f2k = params[6];
          var f4k = params[7];
          var f8k = params[8];
          var f16k = params[9];
        }

      }

      var stream = fs.createWriteStream("params.txt");
      stream.once('open', function(fd) {
        stream.write("[" + "\n")
        stream.write(f32 +",\n");
        stream.write(f64 +",\n");
        stream.write(f125 +",\n");
        stream.write(f250 +",\n");
        stream.write(f500 +",\n");
        stream.write(f1k +",\n");
        stream.write(f2k +",\n");
        stream.write(f4k +",\n");
        stream.write(f8k +",\n");
        stream.write(f16k +"\n");
        stream.write("]")
        stream.end();
      });
    },6000);
    // will emit after RECEIVING ML score, placed here to emulate timing difference
    setTimeout(function() {
      io.emit('read', 'done');
      // save scores for comparison in next iteration
      var scoreArr = fs.readFileSync('results.txt').toString().split('\n');
      var streamScore = fs.createWriteStream("saved.txt");
      streamScore.once('open', function(fd) {
        streamScore.write(scoreArr[0] + "\n")
        streamScore.write(scoreArr[1] +",\n");
        streamScore.end();
      });
    }, 8000);
  });

});


// not app.listen!!!
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
