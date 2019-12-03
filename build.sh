#!/bin/bash

# Prepares files for program execution
#    Builds public JavaScript files using Babel into a backwards-compatible bundle in public/build
#    Builds server-side JavaScript files into src/build (not a bundle)
#    TODO: JS-Obfuscator

# If the folders containing built files do not exist, create them
println="false"
if [[ ! -d ./src/build ]]; then
  mkdir ./src/build
  echo "Created directory ./src/build"
  println="true"
fi
if [[ ! -d ./public/build ]]; then
  mkdir ./public/build
  echo "Created directory ./public/build"
  println="true"
fi

# Remove the formerly built files if they exist; If directory does not exist, there is an error above
if [[ $(ls ./src/build) ]]; then # If ./src/build/ is not empty
  rm -r ./src/build/* # Server-Side
  echo "Removed all contents of directory ./src/build"
  println="true"
fi
if [[ $(ls ./public/build/) ]]; then # If ./src/build/ is not empty
  rm -r ./public/build/* # Client-Side
  echo "Removed all contents of directory ./public/build"
  println="true"
fi
[[ $println = "true" ]] && echo

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
