#!/bin/bash

# Starts the server
# @option --help                     Prints help message and exits with code 0
# @option -b / --build               Runs ./build.sh before starting the server

function command_exists {
    type -P "$1" 1> /dev/null 2> /dev/null;
}

# Check for options/arguments
for ((i=1; i<=$#; i++)); do
    if [[ ${!i} = "--help" ]]; then
        help="true"

    elif [[ ${!i} = "-b" || ${!i} = "--build" ]]; then
        build="true"

    else
        echo "Unrecognized Argument/Option '${!i}'"
        exit 1
    fi
done;

# Respond to inclusion of options/arguments
if [[ $help = "true" ]]; then
    echo "Usage: ./start.sh [OPTION]..."
    echo "Start the local application"
    echo
    echo "Miscellaneous:"
    echo "  -b, --build    Build JavaScript files before starting application"
    echo "  --help         Display this help text"
    exit 0
fi
if [[ $build = "true" ]]; then
    ./build.sh # User can specify -b or --build in order to build JavaScript before starting the application
    echo
fi

# authbind (I believe) creates a file named 'localhost:80' which blocks express from listening on port 80
test -e localhost:80 && rm localhost:80

if grep -- project_state ./src/config/config.json | grep -q -- production # If the "project_state" property in ./src/config.json is set to "production"
then
    echo "Project state is set to production"
    echo "JavaScript is ES2015-compatible"
    echo

    if command_exists authbind # authbind may not be present on the Heroku machine
    then
        authbind node ./src/build/app.js # Production
    else # try without authbind
        echo "[WARN] :: The 'authbind' program is not present"
        node ./src/build/app.js
    fi
else
    echo "Project state is set to development"
    echo
    authbind node ./src/app.js # Development (ES2015-Compliant code is not needed in development)
fi

exit 0
