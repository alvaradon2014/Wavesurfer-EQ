'use strict';

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

function getParams() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var myObj = JSON.parse(this.responseText);
      if (myObj != undefined) {
      document.getElementById("f32").innerHTML = myObj[0];
      document.getElementById("f64").innerHTML = myObj[1];
      document.getElementById("f125").innerHTML = myObj[2];
      document.getElementById("f250").innerHTML = myObj[3];
      document.getElementById("f500").innerHTML = myObj[4];
      document.getElementById("f1k").innerHTML = myObj[5];
      document.getElementById("f2k").innerHTML = myObj[6];
      document.getElementById("f4k").innerHTML = myObj[7];
      document.getElementById("f8k").innerHTML = myObj[8];
      document.getElementById("f16k").innerHTML = myObj[9];
    }}
  };
  xmlhttp.open("GET", "params.txt", true);
  xmlhttp.send();


}

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
    setTimeout(function() {
      wavesurfer.load('iotOrig.wav');
      }, 1500);

    // Equalizer
    wavesurfer.on('ready', function () {

      var timeline = Object.create(WaveSurfer.Timeline);

      timeline.init({
        wavesurfer: wavesurfer,
        container: '#waveform-timeline'
      });

        // EQ options
          // first half: freqs changed automatically, second half: variable by user
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

        // Grab EQ parameters, parse for float
        var f32 = parseFloat(document.getElementById("f32").innerHTML);
        var f64 = parseFloat(document.getElementById("f64").innerHTML);
        var f125= parseFloat(document.getElementById("f125").innerHTML);
        var f250 = parseFloat(document.getElementById("f250").innerHTML);
        var f500 = parseFloat(document.getElementById("f500").innerHTML);
        var f1k = parseFloat(document.getElementById("f1k").innerHTML);
        var f2k = parseFloat(document.getElementById("f2k").innerHTML);
        var f4k = parseFloat(document.getElementById("f4k").innerHTML);
        var f8k = parseFloat(document.getElementById("f8k").innerHTML);
        var f16k = parseFloat(document.getElementById("f16k").innerHTML);
        console.log(f32);

        // Default filters, get overwritten when score and type are received
        var EQfilters = autoEQ.map(function (band) {
            var filter = wavesurfer.backend.ac.createBiquadFilter();
            filter.type = band.type;
            filter.Q.value = 1;
            filter.frequency.value = band.f;

            if(filter.frequency.value == 32){
              filter.gain.value = f32;
            } else if(filter.frequency.value == 64){
              filter.gain.value = f64;
            } else if(filter.frequency.value == 125){
              filter.gain.value = f125;
            } else if(filter.frequency.value == 250){
              filter.gain.value = f250;
            } else if(filter.frequency.value == 500){
              filter.gain.value = f500;
            } else if(filter.frequency.value == 1000){
              filter.gain.value = f1k;
            } else if(filter.frequency.value == 2000){
              filter.gain.value = f2k;
            } else if(filter.frequency.value == 4000){
              filter.gain.value = f4k;
            } else if(filter.frequency.value == 8000){
              filter.gain.value = f8k;
            } else if(filter.frequency.value == 16000){
              filter.gain.value = f16k;
            }
            return filter;
          });

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
            // Make ABSOLUTE sure that paramters are obtained before audio loads
            getParams();
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
