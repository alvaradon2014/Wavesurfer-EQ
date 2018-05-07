'use strict';

// Create an instance
var wavesurfer = Object.create(WaveSurfer);

// Init & load audio file
document.addEventListener('DOMContentLoaded', function () {
    // Init
var wavesurfer = WaveSurfer.create({
        container: document.querySelector('#waveform'),
        waveColor: 'violet',
        progressColor: 'purple'
    });

    // Load audio
    wavesurfer.load('Odesza - Above The Middle.mp3');

    // Equalizer
    wavesurfer.on('ready', function () {

      var timeline = Object.create(WaveSurfer.Timeline);

      timeline.init({
        wavesurfer: wavesurfer,
        container: '#waveform-timeline'
      });

        // EQ options
        var autoEQ = [
            {
                f: 32,
                type: 'lowshelf'
            }, {
                f: 64,
                type: 'peaking'
            }, {
                f: 125,
                type: 'peaking'
            }, {
                f: 250,
                type: 'peaking'
            }, {
                f: 500,
                type: 'peaking'
            }, {
                f: 1000,
                type: 'peaking'
            }, {
                f: 2000,
                type: 'peaking'
            }, {
                f: 4000,
                type: 'peaking'
            }, {
                f: 8000,
                type: 'peaking'
            }, {
                f: 16000,
                type: 'highshelf'
            },
            {
                f: 31,
                type: 'lowshelf'
            }, {
                f: 66,
                type: 'peaking'
            }, {
                f: 124,
                type: 'peaking'
            }, {
                f: 252,
                type: 'peaking'
            }, {
                f: 505,
                type: 'peaking'
            }, {
                f: 1001,
                type: 'peaking'
            }, {
                f: 2002,
                type: 'peaking'
            }, {
                f: 4004,
                type: 'peaking'
            }, {
                f: 8008,
                type: 'peaking'
            }, {
                f: 16001,
                type: 'highshelf'
            }
        ];

        // Grab EQ type and score
        var type = document.getElementById("EQtype").value;
        var score = document.getElementById("demo").innerHTML;

        // Format score for comparison
        var scoreFloat = parseFloat(score);
        var scoreRound = Math.round(scoreFloat * 100);

        if (type == 'bright') {
        // Create bright EQ parameters
        // add if statement based on score

          if(scoreRound < 35){
            console.log("EQ type: " + type + ", Score: " + scoreFloat);
            // Create filters
            var EQfilters = autoEQ.map(function (band) {
                var filter = wavesurfer.backend.ac.createBiquadFilter();
                filter.type = band.type;
                filter.Q.value = 1;
                filter.frequency.value = band.f;
            // bad score: cut 4k and under, boost 8k and above
            if ((filter.frequency.value == 32) || (filter.frequency.value == 64) || (filter.frequency.value == 125) || (filter.frequency.value == 250) || (filter.frequency.value == 500) || (filter.frequency.value == 1000) || (filter.frequency.value == 2000)) {
                  filter.gain.value = -5;
                } else if (filter.frequency.value == 4000) {
                  filter.gain.value = 0;
                } else if ((filter.frequency.value == 8000) || (filter.frequency.value == 16000)) {
                  filter.gain.value = 5;
                }
                return filter;
              });
          } else if(scoreRound < 60){
            console.log("EQ type: " + type + ", Score: " + score);
            // Create filters
            var EQfilters = autoEQ.map(function (band) {
                var filter = wavesurfer.backend.ac.createBiquadFilter();
                filter.type = band.type;
                filter.Q.value = 1;
                filter.frequency.value = band.f;
            // meh score: cut 2k and under
            if ((filter.frequency.value == 32) || (filter.frequency.value == 64) || (filter.frequency.value == 125) || (filter.frequency.value == 250) || (filter.frequency.value == 500) || (filter.frequency.value == 1000)) {
                  filter.gain.value = -5;
                } else {
                  filter.gain.value = 0;
                }
                return filter;
              });
          } else if(scoreRound < 80){
            console.log("EQ type: " + type + ", Score: " + score);
            // Create filters
            var EQfilters = autoEQ.map(function (band) {
                var filter = wavesurfer.backend.ac.createBiquadFilter();
                filter.type = band.type;
                filter.Q.value = 1;
                filter.frequency.value = band.f;
            // good score: boost 4k and up
            if ((filter.frequency.value == 4000) || (filter.frequency.value == 8000) || (filter.frequency.value == 1600)) {
                  filter.gain.value = 5;
                } else {
                  filter.gain.value = 0;
                }
                return filter;
              });
          } else if(scoreRound > 80){
            console.log("EQ type: " + type + ", Score: " + score);
            console.log("You're good!");
          }

        } else if (type == 'dark') {

        // Create dark EQ parameters
        // add switch statement based on score

          if(scoreRound < 35){
            console.log("EQ type: " + type + ", Score: " + score);
            // Create filters
            var EQfilters = autoEQ.map(function (band) {
                var filter = wavesurfer.backend.ac.createBiquadFilter();
                filter.type = band.type;
                filter.Q.value = 1;
                filter.frequency.value = band.f;
            // bad score: cut 500 and above, boost 250 and under
            if ((filter.frequency.value == 500) || (filter.frequency.value == 1000) || (filter.frequency.value == 2000) || (filter.frequency.value == 4000) || (filter.frequency.value == 8000) || (filter.frequency.value == 16000)) {
                  filter.gain.value = -5;
                } else if ((filter.frequency.value == 250) || (filter.frequency.value == 125) || (filter.frequency.value == 64) || (filter.frequency.value == 32)) {
                  filter.gain.value = 5;
                }
                return filter;
              });
          } else if(scoreRound < 60){
            console.log("EQ type: " + type + ", Score: " + score);
            // Create filters
            var EQfilters = autoEQ.map(function (band) {
                var filter = wavesurfer.backend.ac.createBiquadFilter();
                filter.type = band.type;
                filter.Q.value = 1;
                filter.frequency.value = band.f;
            // meh score: cut 1k and above
            if ((filter.frequency.value == 1000) || (filter.frequency.value == 2000) || (filter.frequency.value == 4000) || (filter.frequency.value == 8000) || (filter.frequency.value == 16000)) {
                  filter.gain.value = -5;
                } else {
                  filter.gain.value = 0;
                }
                return filter;
              });
          } else if(scoreRound < 80){
            console.log("EQ type: " + type + ", Score: " + score);
            // Create filters
            var EQfilters = autoEQ.map(function (band) {
                var filter = wavesurfer.backend.ac.createBiquadFilter();
                filter.type = band.type;
                filter.Q.value = 1;
                filter.frequency.value = band.f;
            // good score: boost 500 and under
            if ((filter.frequency.value == 500) || (filter.frequency.value == 250) || (filter.frequency.value == 125) || (filter.frequency.value == 64) || (filter.frequency.value == 32)) {
                  filter.gain.value = 5;
                } else {
                  filter.gain.value = 0;
                }
                return filter;
              });
          } else if(scoreRound > 80){
            console.log("EQ type: " + type + ", Score: " + score);
            console.log("You're good!");
          }
        } else {
          // Create filters
          var EQfilters = autoEQ.map(function (band) {
              var filter = wavesurfer.backend.ac.createBiquadFilter();
              filter.type = band.type;
              filter.Q.value = 1;
              filter.frequency.value = band.f;
              filter.gain.value = 0;
              return filter;
            });
        }

        // Connect filters to wavesurfer
        wavesurfer.backend.setFilters(EQfilters);

        // User variable EQ
        // Bind filters to vertical range sliders
        var container = document.querySelector('#equalizer');
        EQfilters.forEach(function (filter) {
          if((filter.frequency.value == 31) || (filter.frequency.value == 66) || (filter.frequency.value == 124) || (filter.frequency.value == 252) || (filter.frequency.value == 505) || (filter.frequency.value == 1001) || (filter.frequency.value == 2002) || (filter.frequency.value == 4004) || (filter.frequency.value == 8008) || (filter.frequency.value == 16001)){
            var input = document.createElement('input');
            wavesurfer.util.extend(input, {
                type: 'range',
                min: -40,
                max: 40,
                value: 0,
                title: filter.frequency.value
            });
            input.style.display = 'inline-block';
            input.setAttribute('orient', 'vertical');
            wavesurfer.drawer.style(input, {
                'webkitAppearance': 'slider-vertical',
                width: '50px',
                height: '150px'
            });
            container.appendChild(input);

            var onChange = function (e) {
                filter.gain.value = ~~e.target.value;
            };

            input.addEventListener('input', onChange);
            input.addEventListener('change', onChange);
          }
        });

    });

    // Log errors
    wavesurfer.on('error', function (msg) {
        console.log(msg);
    });

    // Bind play/pause button
    document.querySelector(
        '[data-action="play"]'
    ).addEventListener('click', wavesurfer.playPause.bind(wavesurfer));

    // Progress bar
    (function () {
        var progressDiv = document.querySelector('#progress-bar');
        var progressBar = progressDiv.querySelector('.progress-bar');

        var showProgress = function (percent) {
            progressDiv.style.display = 'block';
            progressBar.style.width = percent + '%';
        };

        var hideProgress = function () {
            progressDiv.style.display = 'none';
        };

        wavesurfer.on('loading', showProgress);
        wavesurfer.on('ready', hideProgress);
        wavesurfer.on('destroy', hideProgress);
        wavesurfer.on('error', hideProgress);
    }());
});

// Web Sockets Functions
// Sharing user-selected EQ type to backend
function getEQtype() {
  var x = document.getElementById("EQtype").value;
  console.log(x);

  var socket = io.connect('http://localhost:3001');
  socket.on('connect', function(data){
    socket.emit('typeSel', x);
  });
}

function getScore() {
  var type = document.getElementById("EQtype").value;
  var i;
  switch(type) {

    case 'bright':
        i = 0;
        break;

    case 'dark':
        i = 1;
        break;

    case 'harmonic':
        i = 2;
        break;

    case 'distortion':
        i = 3;
        break;
  };
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var myObj = JSON.parse(this.responseText);
      if (myObj[i] != undefined)
      document.getElementById("demo").innerHTML = myObj[i];
    }
  };
  xmlhttp.open("GET", "fake.txt", true);
  xmlhttp.send();
}
