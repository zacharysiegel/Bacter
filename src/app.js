/**
 * NPM Version: 5.6.0
 *    Update npm code: <npm install npm@latest -g>
 * Node.js Version: 9.4.0
 */

/**
 * socket.emit('ID', data) // Emit to specific client
 * socket.broadcast.emit('ID', data); // Emit to all other clients
 * io.sockets.emit('ID', data); // Emit to all clients
 * socket.to('ROOM').emit('ID', data); // Emit to all clients in a room except sender
 * io.in('ROOM').emit('ID', data); // Emit to all clients in a room (including sender)
 * socket.to('SOCKET.ID').emit('ID', data); // Emit to only specific client
 * socket.on('ID', function(parameter) {});
 * io.sockets.sockets returns an array of the socket objects of all connected clients
 * io.engine.clients returns an array of the socket.id strings of all connected clients
 */

// Minimist -- Parse command line arguments into array
const argv = require('minimist')(process.argv.slice(2)); // 0th argv is path/to/node, 1st argv is .js file

// Express
const port = argv.port || process.env.PORT || 80; // process.env.PORT is fed by Heroku; 80 is default http port
const express = require('express');
let app = express();
let server = app.listen(port, error => {
   if (error) {
      console.error(error);
   } else {
      console.log('Listening on port ' + port + '\n');
      run_app();
   }
});
app.use(express.static('./public')); // Set path to static data

// Import Configurations
let config;
try { // Production code in try
   config = require('../config/config.json');
} catch (ex) {
   config = require('../../config/config.json');
}
if (config.project_state !== 'production' && config.project_state !== 'development') {
   console.error('Non-Enumerated Value -- config.project_state should be "production" or "development"');
}

// Bacter Modules
const Games = require('./Games.js');
const SocketListener = require('./SocketListener.js');

/**
 * Run the processes of the server
 *    run_app() is called after Express succeeds in listening to the specified port
 */
function run_app() {
   let games = new Games();
   let listener = new SocketListener(server, config);

   games.setGamesInterval(1000, listener.io); // io is a reference to the io object, so the parameter in setGamesInterval will refer to the same object
   listener.listen(games);
}
