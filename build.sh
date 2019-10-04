#!/bin/bash

# Prepares files for program execution
#    Builds public JavaScript files using Babel into a backwards-compatible bundle in public/build
#    Builds server-side JavaScript files into src/build (not a bundle)

# If the folders containing built files do not exist, create them
[[ ! -d ./src/build ]] && mkdir ./src/build
[[ ! -d ./public/build ]] && mkdir ./public/build

# Remove the formerly built files if they exist
[[ -e ./src/build/* ]] && rm -r ./src/build/* # Server-Side
[[ -e ./public/build/* ]] && rm -r ./public/build/* # Client-Side

# Build Client-Side JavaScript into ES2015-compatible code
echo "Building Client-Side JavaScript..."
./node_modules/.bin/babel -o ./public/build/bundle.js -s true -- ./public/js # Package all files in /js directory into bundle.js file with source map in /bundle directory
./node_modules/.bin/babel -d ./public/build/ -- ./public/lib/z.js ./public/lib/break-on.js

# Build Server-Side JavaScript into ES2015-compatible code
echo "Building Server-Side JavaScript..."
./node_modules/.bin/babel -d ./src/build/ -- ./src/*.js

# Lint the bundle for errors
# ./node_modules/.bin/eslint ./public/build/bundle.js

exit 0
