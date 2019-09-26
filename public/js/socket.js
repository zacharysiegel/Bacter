class Socket {
   /**
    * All static fields defined below:
    * (static) Socket.socket;
    * (static) Socket.gamesInterval;
    * (static) Socket.connections;
    */
   
   /**
    * Connect client to websocket and listen for messages from server
    * @return {void}
    */
   static connect() {
      Socket.socket = io(window.location.origin + ':80');
      
      
      Socket.socket.on('Games', data => {
         games = data.games;
         Socket.connections = data.connections;
         if (state === 'browser') Browser.renderBrowser();
      });

      Socket.socket.on('Enter', () => enter()); // "enter" is defined in run.js; Begin growth

      Socket.socket.on('Force Spawn', () => {
         die(false); // 'false' parameter tells server not to emit 'Spectate' back to client
         for (let i = 0; i < game.spectators.length; i++) {
            if (game.spectators[i] === Socket.socket.id) { // If player is spectator
               Socket.socket.emit('Spectator Left', game.info); // Remove spectator from spectators array
            }
         }
         if (state === 'pauseSpectateMenu') {
            Menu.renderMenu('pauseGame', game); // Move to correct menu if on spectate menu
         } else if (state === 'respawnMenu') {
            Menu.renderMenu('pauseGame', game);
            menus.pauseGame.submit();
         }
         spawn({ color: org.color, skin: org.skin, team: org.team }); // Respawn all players on round start
         org.spawn = false;
         org.ready = true; // org.ready ensures that org will only be forcibly respawned once
      });

      Socket.socket.on('Game', (_game) => {
         game = _game;
         if (ability.spore.value === true) {
            ability.spore.interval();
         }
         for (let i = 0; i < 3; i++) {
            if (ability.shoot.value[i] === true) {
               ability.shoot.interval[i]();
            }
         }
         switch (state) {
            case 'game':
            case 'pauseGameMenu':
               {
                  translate(-org.off.x, -org.off.y);
                  renderWorld();
                  for (let i = 0; i < game.info.count; i++) {
                     renderToxin(game.abilities[i]);
                  }
                  for (let i = 0; i < game.info.count; i++) {
                     renderSecretions(game.abilities[i]);
                  }
                  for (let i = 0; i < game.info.count; i++) {
                     renderNeutralize(game.abilities[i]);
                  }
                  renderOrgs();
                  for (let i = 0; i < game.info.count; i++) {
                     renderSpores(game.abilities[i]);
                  }
                  renderUI();
                  renderLeaderboard();
                  translate(org.off.x, org.off.y);
               }
               renderMessages(); // Render messages outside translation
               if (state === 'game') {
                  move(); // Move goes at the end so player does not render his movements before others
               }
               break;
            case 'spectate':
            case 'pauseSpectateMenu':
            case 'respawnMenu':
               {
                  translate(-org.off.x, -org.off.y);
                  renderWorld();
                  for (let i = 0; i < game.info.count; i++) {
                     renderToxin(game.abilities[i]);
                  }
                  for (let i = 0; i < game.info.count; i++) {
                     renderSecretions(game.abilities[i]);
                  }
                  for (let i = 0; i < game.info.count; i++) {
                     renderNeutralize(game.abilities[i]);
                  }
                  renderOrgs(); // Orgs render over neutralize and toxin but under other abilities
                  for (let i = 0; i < game.info.count; i++) {
                     renderSpores(game.abilities[i]);
                  }
                  renderLeaderboard();
                  translate(org.off.x, org.off.y);
               }
               renderMessages();
               if (state === 'spectate') {
                  move(); // Move is after messages so everything has same offset
               }
               break;
         }
      });

      Socket.socket.on('Game Ended', function(game) {
         if (game.info.host !== Socket.socket.id) { // Don't alert host (he already knows)
            alert('The game has ended');
         }
         renderTitle();
      });

      Socket.socket.on('Spectate', () => spectate({ color: org.color, pos: org.pos, skin: org.skin, team: org.team }));

      // Abilities
      Socket.socket.on('Tag', () => {
         ability.tag.value = true;
         clearTimeout(ability.tag.timeout);
         Socket.socket.emit('Ability', ability);
         if (game.info.mode === '') {
            ability.tag.timeout = setTimeout(() => {
               ability.tag.value = false;
               Socket.socket.emit('Ability', ability);
            }, ability.tag.time);
         }
      });

      Socket.socket.on('Extend', () => {
         ability.extend.value = true;
         clearTimeout(ability.extend.timeout);
         ability.extend.start = new Date();
         Socket.socket.emit('Ability', ability);
         ability.extend.timeout = setTimeout(() => { // End ability
            ability.extend.value = false;
            ability.extend.end = new Date();
            ability.extend.cooling = true;
            Socket.socket.emit('Ability', ability);
         }, ability.extend.time);
      });

      Socket.socket.on('Compress', () => {
         ability.compress.value = true;
         clearTimeout(ability.compress.timeout);
         Socket.socket.emit('Ability', ability);
         ability.compress.timeout = setTimeout(() => {
            ability.compress.value = false;
            Socket.socket.emit('Ability', ability);
         }, ability.compress.time);
      });

      Socket.socket.on('Immortality', () => {
         ability.immortality.value = true;
         clearTimeout(ability.immortality.timeout);
         ability.immortality.start = new Date();
         Socket.socket.emit('Ability', ability);
         ability.immortality.timeout = setTimeout(() => { // End ability
            ability.immortality.value = false;
            ability.immortality.end = new Date();
            ability.immortality.cooling = true;
         }, ability.immortality.time);
      });

      Socket.socket.on('Freeze', () => {
         ability.freeze.value = true;
         clearTimeout(ability.freeze.timeout);
         Socket.socket.emit('Ability', ability);
         ability.freeze.timeout = setTimeout(() => { // End ability
            ability.freeze.value = false;
            Socket.socket.emit('Ability', ability);
         }, ability.freeze.time);
      });

      Socket.socket.on('Neutralize', () => {
         ability.neutralize.value = true;
         ability.neutralize.start = new Date();
         clearTimeout(ability.neutralize.timeout);
         ability.neutralize.x = org.pos.x;
         ability.neutralize.y = org.pos.y;
         Socket.socket.emit('Ability', ability);
         ability.neutralize.timeout = setTimeout(() => {
            ability.neutralize.value = false;
            ability.neutralize.end = new Date();
            ability.neutralize.cooling = true;
            Socket.socket.emit('Ability', ability);
         }, ability.neutralize.time);
      });

      Socket.socket.on('Toxin', () => {
         ability.toxin.value = true;
         ability.toxin.start = new Date();
         clearTimeout(ability.toxin.timeout);
         ability.toxin.x = org.pos.x;
         ability.toxin.y = org.pos.y;
         Socket.socket.emit('Ability', ability);
         ability.toxin.timeout = setTimeout(() => {
            ability.toxin.value = false;
            ability.toxin.end = new Date();
            ability.toxin.cooling = true;
            Socket.socket.emit('Ability', ability);
         }, ability.toxin.time);
      });
      
      // Socket.socket.on('Speed', () => { // Not updated
      //    ability.speed.value = true;
      //    org.speed *= ability.speed.factor;
      //    clearTimeout(ability.speed.timeout);
      //    Socket.socket.emit('Ability', ability);
      //    ability.speed.timeout = setTimeout(() => { // End ability
      //       org.speed /= ability.speed.factor;
      //       ability.speed.value = false;
      //       Socket.socket.emit('Ability', ability);
      //    }, ability.speed.time);
      // });

      // Socket.socket.on('Slow', () => { // Not updated
      //    ability.slow.value = true;
      //    org.speed /= ability.slow.factor; // Divide speed by factor
      //    clearTimeout(ability.slow.timeout);
      //    Socket.socket.emit('Ability', ability);
      //    ability.slow.timeout = setTimeout(() => { // End ability
      //       org.speed *= ability.slow.factor; // Multiply speed by factor to reset to original
      //       ability.slow.value = false;
      //       Socket.socket.emit('Ability', ability);
      //    }, ability.slow.time);
      // });
      
      // Socket.socket.on('Stimulate', () => {
      //    ability.stimulate.value = true;
      //    clearTimeout(ability.stimulate.timeout);
      //    ability.stimulate.start = new Date();
      //    Socket.socket.emit('Ability', ability);
      //    ability.stimulate.timeout = setTimeout(() => { // End ability
      //       ability.stimulate.value = false;
      //       ability.stimulate.end = new Date();
      //       ability.stimulate.cooling = true;
      //       Socket.socket.emit('Ability', ability);
      //    }, ability.stimulate.time);
      // });

      // Socket.socket.on('Poison', () => {
      //    ability.poison.value = true;
      //    clearTimeout(ability.poison.timeout);
      //    Socket.socket.emit('Ability', ability);
      //    ability.poison.timeout = setTimeout(() => { // End ability
      //       ability.poison.value = false;
      //       Socket.socket.emit('Ability', ability);
      //    }, ability.poison.time);
      // });
   }
}
