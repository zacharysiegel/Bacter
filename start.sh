#!/bin/bash

# Check if arguments include appropriate options
echo " $@ " | grep -q -- \ --help\ 
help=$?
echo " $@ " | grep -q -- \ -b\ 
b=$?
echo " $@ " | grep -q -- \ --build\ 
build=$?
echo $@ | grep -q -- .
args=$?
if [[ $help -ne 0 && $b -ne 0 && $build -ne 0 && $args -eq 0 ]] # If no valid options/arguments are supplied, but there are still options/arguments, exit 1 and print illegal argument
then
   echo "Illegal Argument(s) Provided"
   exit 1
fi

# Respond to inclusion of options
if test $help -eq 0
then
   echo "Usage: ./start.sh [OPTION]..."
   echo "Start the local application"
   echo
   echo "Miscellaneous:"
   echo "  -b, --build    Build JavaScript files before starting application"
   echo "  -h, --help     Display this help text"
   exit 0
fi
if test $b -eq 0 -o $build -eq 0
then
   ./build.sh # User can specify -b or --build in order to build JavaScript before starting the application
   echo
fi

# authbind (I believe) creates a file named 'localhost:80' which blocks express from listening on port 80
test -e localhost:80 && rm localhost:80

if cat ./src/config.json | grep -- project_state | grep -q -- production # If the "project_state" property in ./src/config.json is set to "production"
then
   echo "Project state is set to production"
   echo "JavaScript is ES2015-compatible"
   authbind node ./src/build/app.js # Production
else
   echo "Project state is set to development"
   authbind node ./src/app.js # Development (ES2015-Compliant code is not needed in development)
fi

exit 0
