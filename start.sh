#!/bin/bash

# Starts the server
# @option --help                     Prints help message and exits with code 0
# @option -b / --build               Runs ./build.sh before starting the server

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

if grep -- project_state ./src/config/config.json | grep -q -- production # If the "project_state" property in ./src/config.json is set to "production"
then
    echo "Project state is set to production"
    echo "JavaScript is ES2015-compatible"
    echo

    node ./src/build/app.js # Production
else
    echo "Project state is set to development"
    echo
    node ./src/app.js # Development (ES2015-Compliant code is not needed in development)
fi

exit 0
