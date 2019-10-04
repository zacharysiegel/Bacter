class Games {
   constructor() {
      // this.map = {}; // Will convert games array into a hash table in the future
      this.list = [];
      this.securities = []; // Contains PermissedList objects; Will convert securities array into a hash table in the future
      this.intervals = [];
      this.shrinkIntervals = [];
      this.connections = 0;
      this.games_interval;
   }
   
   get count() { // count will not be recalculated unless this.games changes length (see memoized getters)
      return this.list.length;
   }
   
   createGame(game, socket, io) {
      this.list.push(game);
      
      if (config.project_state === 'development') console.log('                                               Game Created: ' + games.list[games.length - 1].info.title + ' (' + games.list[games.length - 1].info.host + ')');
      
      this.intervals.push(setInterval(() => { // Send updated game to all players
         for (let i = 0; i < games.length; i++) { // Game interval
            if (games.list[i].info.host === socket.id) { // Find game of specific host
               this.list[i].info.count = games.list[i].players.length; // Calculate and update player count
               io.to(games.list[i].info.title).emit('Game', games.list[i]); // Send updated game info to clients in game room
               break;
            }
         }
      }, config.render_frequency));
   }
   
   setGamesInterval(delay=1000, io) {
      this.games_interval = setInterval(() => {
         io.sockets.volatile.emit('Games', {
            games: this.list,
            connections: this.connections
         });
      }, delay); // Every delay, send a copy of the games array to all clients
   }

   clearGamesInterval() {
      clearInterval(this.games_interval);
   }
}

module.exports = Games;
