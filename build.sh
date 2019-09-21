#!/bin/bash

# Prepares files for program execution
#    Builds JavaScript files using Babel into a backwards-compatible bundle
#    Copies current configuration files into build directory

echo "Copying Configurations..."
cp ./src/config.json ./src/build/config.json

# If the folders containing built files do not exist, create them
[[ ! -d ./src/build ]] && mkdir ./src/build
[[ ! -d ./public/bundle ]] && mkdir ./public/bundle
# Remove the formerly built files if they exist
[[ -e ./src/build/* ]] && rm -r ./src/build/* # Server-Side
[[ -e ./public/bundle/* ]] && rm -r ./public/bundle/* # Client-Side

# Build Client-Side JavaScript into ES2015-compatible code
echo "Building Client-Side JavaScript..."
./node_modules/.bin/babel -o ./public/bundle/bundle.js -s true -- ./public/js ./public/lib/z.js # Package all files in /js directory into bundle.js file with source map in /bundle directory
# Build Server-Side JavaScript into ES2015-compatible code
echo "Building Server-Side JavaScript..."
./node_modules/.bin/babel -d ./src/build/ -- ./src/*.js

# Lint the bundle for errors
# ./node_modules/.bin/eslint ./public/bundle/bundle.js

exit 0
