# Wavesurfer-EQ
Wavesurfer automatic equalizer project: includes server config, HTML file, wavesurfer config

server.js: Activates server with nodejs using express. Activates scripts based off of socket.io. Evaluates ML EQ (dark, bright) score from results.txt file. 
           Saves previous scores into saved.txt. Saves evaluates EQ parameters to params.txt

index.html: Client-side. Interacts with server with socket.io. Calls functions to obtain parameters for wavesurfer.js waveforms. Provides user interface.

main.js: Sets up wavesurfer.js waveform and filters. Obtains filter frequency gain from params.txt file generated by server.js

params.txt: Gain parameters for wavesurfer.js filters at certain frequencies. Written by server.js.

results.txt: ML algorithm resulting scores. Generated by Josh's ML algorithm. Result is obtained with SCP.

saved.txt: Gain parameters of previous EQ iteration. Saved to observe if score decreased or increased.

send.sh: Bash script to begin SCP and ML algorithm

iotOrig.wav: File to be initially recorded by user. Does NOT become altered.

iotSend.wav: File to be recorded when beginning EQ. Is sent to Josh's desktop through SCP.