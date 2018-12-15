#!/bin/sh

# Execute this file to build the source files and start the server

./src/build.sh
node ./src/app.js
