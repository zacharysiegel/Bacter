class Games {
   /**
    * Construct a new Games instance
    * @param config A configuration object (Converted from ../config.json)
    */
   constructor(config) {
      this.config = config;
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

   createGame(game, host, io) {
      this.list.push(game);

      if (this.config.project_state === 'development') console.log('                                               Game Created: ' + this.list[this.count - 1].info.title + ' (' + this.list[this.count - 1].info.host + ')');

      const game_index = this.getGameIndexByHost(host);

      this.intervals.push(setInterval(() => { // Send updated game to all players

         this.list[game_index].count = this.list[game_index].players.lenth; // Calculate and update player count
         io.to(this.list[game_index].info.title).volatile.binary(false).emit('game', this.list[game_index]); // Send updated game info to clients in game room
      }, this.config.render_frequency));
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

   /**
    * Determine the location in {games}.list of the game with the given host or -1 if not found
    * @param {String} host
    * @return {Number} The index of the game in {games}.list which is hosted by 'host' or -1 if not found
    */
   getGameIndexByHost(host) {
      for (let g = 0; g < this.count; g++) {
         if (this.list[g].info.host === host) {
            return g;
         }
      }
      return -1;
   }
}

module.exports = Games;
