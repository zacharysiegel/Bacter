var games = [];
var state;
var mouseDown = false;

function setup() {
   state = 'setup';
   noCanvas(); // Canvas settings
   rectMode(CENTER); // "
   ellipseMode(RADIUS); // "
   angleMode(DEGREES); // "
   textAlign(LEFT); // "

   connectSocket();
   let page = document.body.parentNode; // Edit global variable mouseDown to determine if mouse is down or up anywhere on the page
   let md = () => mouseDown = true; // "
   page.removeEventListener('mousedown', md); // "
   page.addEventListener('mousedown', md); // "
   let mu = () => mouseDown = false; // "
   page.removeEventListener('mouseup', mu); // "
   page.addEventListener('mouseup', mu); // "
   var socketInterval = setInterval(() => { // Create instance of Ability, but socket object must exist first, so loop until socket exists
      ability = new Ability({ player: socket.id }); // Create new instance of Ability
      if (socket.id) { // If socket.id has loaded
         clearInterval(socketInterval); // End the loop
      }
   }, 50);
   center = { // Set coordinates of center of window (and canvas)
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
   };
   renderTitle();
   title = new Title();
}

/**
 * Initialize game
 * @param  object game_ game object holding all game-wide info
 * @param  object data: {
 *                         spectate: boolean true: initialize as spectator, false: initialize as player
 *                      }
 * @return void
 */
function initialize(game_, data) {
   ReactDOM.render(<CanvasCont />, Z.eid('cont'));
   game = game_;
   if (data.spectate !== true) { // Field can be left undefined
      spawn({ color: data.color, skin: data.skin, team: data.team });
   } else if (data.spectate === true) {
      spectate({ color: data.color, skin: data.skin, team: data.team });
   }
}

/**
 * Event listener called when user presses a key
 * @return boolean false: disables default behaviors
 */
function keyPressed() {
   switch (keyCode) {
      case Controls.ability1.code: // X by default
         if ((state == 'game' || state == 'tutorial') && org.alive == true) {
            if (ability.extend.activated == true && ability.extend.can == true) {
               extend(org.player); // Extend self
            } else if (ability.compress.activated == true && ability.compress.can == true) {
               shoot(0, 1);
               // for (let i = 0; i < game.info.count; i++) {
               //    if (org.target == game.players[i]) { // Find targeted org
               //       compress(org.target); // Compress targeted org
               //       break;
               //    }
               // }
            } else if (ability.tag.activated == true && ability.tag.can == true) {
               shoot(0, 1);
            }
            // if (ability.speed.activated == true) { // Speed/Slow; OLD
            //    speed(org.player);
            // } else if (ability.slow.activated == true) {
            //    slow(org.target);
            // }
         }
         break;
      case Controls.ability2.code: // C by default
         if ((state == 'game' || state == 'tutorial') && org.alive == true) {
            if (ability.immortality.activated == true && ability.immortality.can == true) {
               immortality(org.player); // Immortalize self
            } else if (ability.freeze.activated == true && ability.freeze.can == true) {
               shoot(1, 1);
               // for (let i = 0; i < game.info.count; i++) {
               //    if (org.target == game.players[i]) { // Find targeted org
               //       freeze(org.target); // Freeze targeted org
               //       break;
               //    }
               // }
            }
         }
         break;
      case Controls.ability3.code: // V by default
         if ((state == 'game' || state == 'tutorial') && org.alive == true) {
            // if (ability.stimulate.activated == true && ability.stimulate.can == true) { // Stimulate/Poison OLD
            //    stimulate(org.player); // Stimulate self
            // } else if (ability.poison.activated == true && ability.poison.can == true) {
            //    shoot(2, 1);
            //    // for (let i = 0; i < game.info.count; i++) {
            //    //    if (org.target == game.players[i]) { // Find targeted org
            //    //       poison(org.target); // Poison targeted org
            //    //       break;
            //    //    }
            //    // }
            // }
            if (ability.neutralize.activated == true && ability.neutralize.can == true) {
               neutralize(org.player);
            } else if (ability.toxin.activated == true && ability.toxin.can == true) {
               toxin(org.player);
            }
         }
         break;
      case Controls.ability4.code: // SPACE by default
         if ((state === 'game' || state === 'tutorial') && org.alive) {
            if (ability.spore.value == false && ability.secrete.value == false) {
               spore();
            } else if (ability.spore.value == true && ability.secrete.value == false) {
               secrete();
            }
         }
         break;
      case Controls.respawn.code: // R by default
         if (state == 'spectate' && org.alive == false && org.spawn == true) {
            if (game.players.length < game.info.cap) {
               socket.emit('Spectator Left', game.info);
               Menu.renderMenu('respawn', game); // Load respawn menu
            } else {
               alert('Game is at maximum player capacity');
               // Return to spectate mode
            }
         }
         break;
      case Controls.pause.code: { // ESC by default
         switch (state) { // Used as the back key for menus (variable pause key may be used as well)
            case 'createMenu':
            case 'browser':
               renderTitle(); // unmountComponentAtNode() is unnecessary since ReactDOM.render() clears container before rendering
               break;
            case 'joinMenu':
               if (game.info.host === socket.id) { // If player is host (If player is joining directly after creating the game)
                  socket.emit('Game Ended', game);
                  renderTitle();
               } else {
                  Browser.renderBrowser();
               }
               break;
            case 'spectateMenu':
               Browser.renderBrowser();
               break;
            case 'game':
               Menu.renderMenu('pauseGame', game);
               break;
            case 'spectate':
               Menu.renderMenu('pauseSpectate', game);
               break;
            case 'tutorial':
               Menu.renderMenu('pauseTutorial', tutorial);
               break;
            case 'pauseSpectateMenu': // Cannot access instance of <Menu> component class to bind as this keyword in submit()
            case 'respawnMenu': // Respawn is included because 'back' for respawn should return to spectate
               state = 'spectate';
               ReactDOM.render(<CanvasCont />, Z.eid('cont'));
               break;
            case 'pauseGameMenu':
               let skip = false;
               for (let i = 0; i < game.players.length; i++) {
                  if (game.players[i] === socket.id) { // If still is a player
                     state = 'game';
                     skip = true;
                     break;
                  }
               }
               if (!skip) {
                  for (let i = 0; i < game.spectators.length; i++) {
                     if (game.spectators[i] === socket.id) {
                        state = 'spectate'; // Must include spectate possibility in pause game; even though a spectator could never open pause game menu, he could be killed while in menu
                        break;
                     }
                  }
               }
               ReactDOM.render(<CanvasCont />, Z.eid('cont'));
               break;
            case 'pauseTutorialMenu':
               state = 'tutorial';
               ReactDOM.render(<CanvasCont />, Z.eid('cont'));
               break;
         }
         break;
      }
   }
   // Hard key codes are separate from variable codes, so in the case of overlap, hard codes will always run
   switch (keyCode) {
      case 27 !== Controls.pause.code ? 27 : '': // ESCAPE only if variable pause key is not ESCAPE (keyCode cannot be a string)
         switch (state) { // Used as the back key for menus (variable pause key may be used as well)
            case 'createMenu':
            case 'browser':
               renderTitle(); // unmountComponentAtNode() is unnecessary since ReactDOM.render() clears container before rendering
               break;
            case 'joinMenu':
               if (game.info.host === socket.id) { // If player is host (If player is joining directly after creating the game)
                  socket.emit('Game Ended', game);
                  renderTitle();
               } else {
                  Browser.renderBrowser();
               }
               break;
            case 'spectate':
               Browser.renderBrowser();
               break;
            case 'pauseSpectateMenu': // Cannot access instance of <Menu> component class to bind as this keyword in submit()
            case 'respawnMenu': // Respawn is included because 'back' for respawn should return to spectate
               state = 'spectate';
               ReactDOM.render(<CanvasCont />, Z.eid('cont'));
               break;
            case 'pauseGameMenu':
               let skip = false;
               for (let i = 0; i < game.players.length; i++) {
                  if (game.players[i] === socket.id) { // If still is a player
                     state = 'game';
                     skip = true;
                     break;
                  }
               }
               if (!skip) {
                  for (let i = 0; i < game.spectators.length; i++) {
                     if (game.spectators[i] === socket.id) {
                        state = 'spectate'; // Must include spectate possibility in pause game; even though a spectator could never open pause game menu, he could be killed while in menu
                        break;
                     }
                  }
               }
               ReactDOM.render(<CanvasCont />, Z.eid('cont'));
               break;
            case 'pauseTutorialMenu':
               state = 'tutorial';
               ReactDOM.render(<CanvasCont />, Z.eid('cont'));
               break;
         }
         break;
   }
}

/**
 * Event listener called when any mouse button is clicked
 *    Not currently in use
 * @return boolean false should disable default behaviors
 */
function mouseClicked() {
   if (mouseButton == LEFT) {
      // if (state == 'game') { // DO NOT DELETE (Click detection is very long)
      //    { // Targeting
      //       org.target = undefined; // Clear target if click not on opponent org
      //       for (let i = 0; i < game.info.count; i++) {
      //          if (game.orgs[i].player == org.player) { // If org is player's org
      //             continue; // Cannot target oneself
      //          }
      //          if (mouseX + org.off.x >= game.orgs[i].clickbox.left && mouseX + org.off.x <= game.orgs[i].clickbox.right && mouseY + org.off.y >= game.orgs[i].clickbox.top && mouseY + org.off.y <= game.orgs[i].clickbox.bottom) { // If clicked another org
      //             org.target = game.orgs[i].player;
      //             break;
      //          }
      //       }
      //    }
      // }
      return false; // Supposedly negates default behavior
   } else if (mouseButton == RIGHT) {
      return false; // Supposedly negates default behavior
   } else if (mouseButton == CENTER) {
      return false; // Supposedly negates default behavior
   }
}

/**
 * Event listener for when the browser's window frame is resized
 *    Resizes the canvas to match the window
 *    Resizes the world to match the canvas
 *    Updates variables to match changes
 * @return void
 */
function windowResized() {
   center = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
   };
   let src = getSrc();
   if (state === 'title' || state === 'browser' || state === 'tutorial') {
      src.resize(0, 0, window.innerWidth, window.innerHeight);
   } else if (state === 'game' || state === 'spectate') {
      org.off.x = org.pos.x - center.x; // Reposition org (camera) correctly
      org.off.y = org.pos.y - center.y;
      ReactDOM.render(<CanvasCont />, Z.eid('cont'));
   } else if (state.indexOf('Menu') !== -1) {
      let type = state.slice(0, -4); // To make state string, 'Menu' is concatenated to the end of menu type, remove 'Menu' from state to get menu type
      let data = (type === 'join' || type === 'spectate' || type === 'respawn') ? game : null; // Only join, spectate, and respawn menus use game variable as data
      Menu.renderMenu(type, data); // <div id='cont'><Menu type={} data={} /></div>
      if (src.src === 'title') { // ^^ Cut out Menu at end of state string for menu type; Send game as data if src is 'game'; Send tutorial as data is src is 'tutorial'
         src.resize(0, 0, window.innerWidth, window.innerHeight);
      } else if (src.src === 'game') { // If menu during game (player or spectator)
         org.off.x = org.pos.x - center.x; // Reposition org (camera) correctly
         org.off.y = org.pos.y - center.y;
      } else if (src.src === 'tutorial') {
         src.resize(0, 0, window.innerWidth, window.innerHeight);
      } // Resize the content of the canvas in the background of menus
   }
}
