let connection;

class Connection {
   /**
    * All static fields defined below:
    * (static) Connection.connections;
    */

   constructor() {
      this.socket = this.connect(); // this.connect returns the same value as io()
      this.listen();
   }

   /**
    * Connect client to websocket and listen for messages from server
    * @return {Socket} The return value of io() (synonym to io.connect()) is piped through connect
    */
   connect() {
      return io({
         forceNew: true,
         transports: ['websocket']
      });
   }

   /**
    * Initialize socket event listeners
    * @return {void}
    */
   listen() {
      this.socket.on('connect', () => {
         // Data Congruence
         this.listen_games();
         this.listen_game();

         // Control Flow
         this.listen_game_ended();
         this.listen_spectate();
         this.listen_enter();
         this.listen_force_spawn();

         // Abilities
         this.listen_tag();
         this.listen_extend();
         this.listen_compress();
         this.listen_immortality();
         this.listen_freeze();
         this.listen_neutralize();
         this.listen_toxin();
         // this.listen_speed();
         // this.listen_slow();
         // this.listen_stimulate();
         // this.listen_poison();

         // Errors
         this.listen_error();
         this.listen_timeout();
      });
   }

   // Data Congruence Listeners
   listen_games() {
      this.socket.on('Games', data => {
         Game.games = data.games;
         Connection.connections = data.connections;
         if (Game.state === 'browser') Browser.renderBrowser();
      });
   }
   listen_game() {
      this.socket.on('game', (game) => {
         Game.game = game;
         if (ability.spore.value === true) {
            ability.spore.interval();
         }
         for (let i = 0; i < 3; i++) {
            if (ability.shoot.value[i] === true) {
               ability.shoot.interval[i]();
            }
         }
         switch (Game.state) {
            case 'game':
            case 'pauseGameMenu':
               translate(-org.off.x, -org.off.y);
               renderWorld();
               for (let i = 0; i < Game.game.info.count; i++) {
                  renderToxin(Game.game.abilities[i]);
               }
               for (let i = 0; i < Game.game.info.count; i++) {
                  renderSecretions(Game.game.abilities[i]);
               }
               for (let i = 0; i < Game.game.info.count; i++) {
                  renderNeutralize(Game.game.abilities[i]);
               }
               Org.renderAll(); // Render orgs
               for (let i = 0; i < Game.game.info.count; i++) {
                  renderSpores(Game.game.abilities[i]);
               }
               renderUI();
               renderLeaderboard();
               translate(org.off.x, org.off.y);

               renderMessages(); // Render messages outside translation
               if (Game.state === 'game') {
                  move(); // Move goes at the end so player does not render his movements before others
               }
               break;
            case 'spectate':
            case 'pauseSpectateMenu':
            case 'respawnMenu':
            {
               translate(-org.off.x, -org.off.y);
               renderWorld();
               for (let i = 0; i < Game.game.info.count; i++) {
                  renderToxin(Game.game.abilities[i]);
               }
               for (let i = 0; i < Game.game.info.count; i++) {
                  renderSecretions(Game.game.abilities[i]);
               }
               for (let i = 0; i < Game.game.info.count; i++) {
                  renderNeutralize(Game.game.abilities[i]);
               }
               Org.renderAll(); // Orgs render over neutralize and toxin but under other abilities
               for (let i = 0; i < Game.game.info.count; i++) {
                  renderSpores(Game.game.abilities[i]);
               }
               renderLeaderboard();
               translate(org.off.x, org.off.y);
            }
               renderMessages();
               if (Game.state === 'spectate') {
                  move(); // Move is after messages so everything has same offset
               }
               break;
         }
      });
   }

   // Control Flow Listeners
   listen_enter() {
      this.socket.on('enter', () => {
         enter(); // "enter" is defined in run.js; enter starts the org life interval
      });
   }
   listen_force_spawn() {
      this.socket.on('Force Spawn', () => {
         die(false); // 'false' parameter tells server not to emit 'Spectate' back to client
         for (let i = 0; i < Game.game.spectators.length; i++) {
            if (Game.game.spectators[i] === this.socket.id) { // If player is spectator
               this.socket.binary(false).emit('Spectator Left', Game.game.info); // Remove spectator from spectators array
            }
         }
         if (Game.state === 'pauseSpectateMenu') {
            Menu.renderMenu('pauseGame', Game.game); // Move to correct menu if on spectate menu
         } else if (Game.state === 'respawnMenu') {
            Menu.renderMenu('pauseGame', Game.game);
            menus.pauseGame.submit();
         }
         spawn({ color: org.color, skin: org.skin, team: org.team }); // Respawn all players on round start
         org.spawn = false;
         org.ready = true; // org.ready ensures that org will only be forcibly respawned once
      });
   }
   listen_game_ended() {
      this.socket.on('game ended', function(game) {
         if (game.info.host !== this.socket.id) { // Don't alert host (he already knows)
            alert('The game has ended');
         }
         Title.render();
      });
   }
   listen_spectate() {
      this.socket.on('Spectate', () => {
         spectate({ color: org.color, cursor: org.cursor, skin: org.skin, team: org.team });
      });
   }

   // Ability Listeners
   listen_tag() {
      this.socket.on('Tag', () => {
         ability.tag.value = true;
         clearTimeout(ability.tag.timeout);
         this.socket.binary(false).emit('Ability', ability);
         if (Game.game.info.mode === '') {
            ability.tag.timeout = setTimeout(() => {
               ability.tag.value = false;
               this.socket.binary(false).emit('Ability', ability);
            }, ability.tag.time);
         }
      });
   }
   listen_extend() {
      this.socket.on('Extend', () => {
         ability.extend.value = true;
         clearTimeout(ability.extend.timeout);
         ability.extend.start = new Date();
         this.socket.binary(false).emit('Ability', ability);
         ability.extend.timeout = setTimeout(() => { // End ability
            ability.extend.value = false;
            ability.extend.end = new Date();
            ability.extend.cooling = true;
            this.socket.binary(false).emit('Ability', ability);
         }, ability.extend.time);
      });
   }
   listen_compress() {
      this.socket.on('Compress', () => {
         ability.compress.value = true;
         clearTimeout(ability.compress.timeout);
         this.socket.binary(false).emit('Ability', ability);
         ability.compress.timeout = setTimeout(() => {
            ability.compress.value = false;
            this.socket.binary(false).emit('Ability', ability);
         }, ability.compress.time);
      });
   }
   listen_immortality() {
      this.socket.on('Immortality', () => {
         ability.immortality.value = true;
         clearTimeout(ability.immortality.timeout);
         ability.immortality.start = new Date();
         this.socket.binary(false).emit('Ability', ability);
         ability.immortality.timeout = setTimeout(() => { // End ability
            ability.immortality.value = false;
            ability.immortality.end = new Date();
            ability.immortality.cooling = true;
         }, ability.immortality.time);
      });
   }
   listen_freeze() {
      this.socket.on('Freeze', () => {
         ability.freeze.value = true;
         clearTimeout(ability.freeze.timeout);
         this.socket.binary(false).emit('Ability', ability);
         ability.freeze.timeout = setTimeout(() => { // End ability
            ability.freeze.value = false;
            this.socket.binary(false).emit('Ability', ability);
         }, ability.freeze.time);
      });
   }
   listen_neutralize() {
      this.socket.on('Neutralize', () => {
         ability.neutralize.value = true;
         ability.neutralize.start = new Date();
         clearTimeout(ability.neutralize.timeout);
         ability.neutralize.x = org.cursor.x; // Center of toxin is the cursor (not center of mass)
         ability.neutralize.y = org.cursor.y;
         this.socket.binary(false).emit('Ability', ability);
         ability.neutralize.timeout = setTimeout(() => {
            ability.neutralize.value = false;
            ability.neutralize.end = new Date();
            ability.neutralize.cooling = true;
            this.socket.binary(false).emit('Ability', ability);
         }, ability.neutralize.time);
      });
   }
   listen_toxin() {
      this.socket.on('Toxin', () => {
         ability.toxin.value = true;
         ability.toxin.start = new Date();
         clearTimeout(ability.toxin.timeout);
         ability.toxin.x = org.cursor.x; // Center of toxin is the cursor (not center of mass)
         ability.toxin.y = org.cursor.y;
         this.socket.binary(false).emit('Ability', ability);
         ability.toxin.timeout = setTimeout(() => {
            ability.toxin.value = false;
            ability.toxin.end = new Date();
            ability.toxin.cooling = true;
            this.socket.binary(false).emit('Ability', ability);
         }, ability.toxin.time);
      });
   }
   // listen_speed() {
   //    this.socket.on('Speed', () => { // Not updated
   //       ability.speed.value = true;
   //       org.speed *= ability.speed.factor;
   //       clearTimeout(ability.speed.timeout);
   //       this.socket.binary(false).emit('Ability', ability);
   //       ability.speed.timeout = setTimeout(() => { // End ability
   //          org.speed /= ability.speed.factor;
   //          ability.speed.value = false;
   //          this.socket.binary(false).emit('Ability', ability);
   //       }, ability.speed.time);
   //    });
   // }
   // listen_slow() {
   //    this.socket.on('Slow', () => { // Not updated
   //       ability.slow.value = true;
   //       org.speed /= ability.slow.factor; // Divide speed by factor
   //       clearTimeout(ability.slow.timeout);
   //       this.socket.binary(false).emit('Ability', ability);
   //       ability.slow.timeout = setTimeout(() => { // End ability
   //          org.speed *= ability.slow.factor; // Multiply speed by factor to reset to original
   //          ability.slow.value = false;
   //          this.socket.binary(false).emit('Ability', ability);
   //       }, ability.slow.time);
   //    });
   // }
   // listen_stimulate() {
   //    this.socket.on('Stimulate', () => {
   //       ability.stimulate.value = true;
   //       clearTimeout(ability.stimulate.timeout);
   //       ability.stimulate.start = new Date();
   //       this.socket.binary(false).emit('Ability', ability);
   //       ability.stimulate.timeout = setTimeout(() => { // End ability
   //          ability.stimulate.value = false;
   //          ability.stimulate.end = new Date();
   //          ability.stimulate.cooling = true;
   //          this.socket.binary(false).emit('Ability', ability);
   //       }, ability.stimulate.time);
   //    });
   // }
   // listen_poison() {
   //    this.socket.on('Poison', () => {
   //       ability.poison.value = true;
   //       clearTimeout(ability.poison.timeout);
   //       this.socket.binary(false).emit('Ability', ability);
   //       ability.poison.timeout = setTimeout(() => { // End ability
   //          ability.poison.value = false;
   //          this.socket.binary(false).emit('Ability', ability);
   //       }, ability.poison.time);
   //    });
   // }

   // Error Listeners
   listen_error() {
      this.socket.on('connect_error', error => {
         console.error('An error occurred in the web socket connection', error);
      });
   }
   listen_timeout() {
      this.socket.on('connect_timeout', error => {
         console.error('Connection to the web socket timed out', error);
      });
   }

   // Emissions
   emit_test(data) {
      this.socket.binary(false).emit('Test', data || 'Test Successful', result => {
         console.log('Callback: ' + result);
      });
   }

   /**
    * Emit the 'create game' event to the server
    *    Adds Game.game to the server-side games.list array
    */
   emit_create_game() {
      this.socket.binary(false).emit('create game', Game.game);
   }
   emit_create_password(password) {
      if (Game.game.info.secured) { // If game is secured by a password
         this.socket.binary(false).emit('create password', { pass: password, info: Game.game.info }); // Encrypt this in the future
      }
   }
   /**
    * Emit the 'Check Permission' event to the server
    * @param  {Function} granted The callback function to be called if the client is granted access
    * @param  {Function} denied  The callback function to be called if the client is denied access
    */
    emit_check_permission(granted, denied) {
       this.socket.binary(false).emit('Check Permission', { title: Game.game.info.title }, result => {
          if (result === 'permission granted') {
             granted();
          } else if (result === 'permission denied') {
             denied();
          } else {
             console.error('Non-Enumerated Value :: Connection.emit_check_permission :: Result must be "permission granted" or "permission denied"');
          }
       });
   }
}
