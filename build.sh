#!/bin/bash

# Remove the formerly built files if they exist
[[ -e ./src/build/* ]] && rm -r ./src/build/* # Server-Side
[[ -e ./public/bundle/* ]] && rm -r ./public/bundle/* # Client-Side

# Build Client-Side JavaScript into ES2015-compatible code
echo "Building Client-Side JavaScript..."
./node_modules/.bin/babel ./public/js -o ./public/bundle/bundle.js -s # Package all files in /js directory into bundle.js file with source map in /bundle directory
# Build Server-Side JavaScript into ES2015-compatible code
echo "Building Server-Side JavaScript..."
./node_modules/.bin/babel ./src/*.js -d ./src/build/
echo "Copying Configurations..."
cp ./src/config.json ./src/build/config.json

# Lint the bundle for errors
# ./node_modules/.bin/eslint ./public/bundle/bundle.js

exit 0
