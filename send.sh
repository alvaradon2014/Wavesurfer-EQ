#!/bin/bash
scp iotSend.wav joshua@IP_ADDRESS:/home/joshua/gits/IoEqualizers-CNN/
ssh joshua@IP_ADDRESS << EOF
  cd ~/gits/IoEqualizers-CNN/
  python3 predict_cnn.py model iotSend.wav
EOF
scp joshua@IP_ADDRESS:/home/joshua/gits/IoEqualizers-CNN/results.txt ~/Desktop/IoT-Audio
