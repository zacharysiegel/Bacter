let mouseDown = false;

function setup() { // p5 function runs on window.onload (I think)
    Game.state = 'setup';
    noCanvas(); // Canvas settings
    rectMode(CENTER); // "
    ellipseMode(RADIUS); // "
    angleMode(DEGREES); // "
    textAlign(LEFT); // "

    connection = new Connection();

    let page = document.body.parentNode; // Edit global variable mouseDown to determine if mouse is down or up anywhere on the page
    let md = () => mouseDown = true; // "
    page.removeEventListener('mousedown', md); // "
    page.addEventListener('mousedown', md); // "
    let mu = () => mouseDown = false; // "
    page.removeEventListener('mouseup', mu); // "
    page.addEventListener('mouseup', mu); // "

    let socketInterval = setInterval(() => { // Create instance of Ability, but socket object must exist first, so loop until socket exists
        ability = new Ability(connection.socket.id); // Create new instance of Ability
        if (connection.socket.id) { // If connection.socket.id has loaded
            clearInterval(socketInterval); // End the loop
        }
    }, 50);
    center = { // Set coordinates of center of window (and canvas)
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    };
    Title.render();
    title = Title.create();
}

/**
 * Initialize game
 * @param  {Object} game game object holding all game-wide info
 * @param  {Object} data: {
 *                           spectate: boolean true: initialize as spectator, false: initialize as player
 *                        }
 * @return void
 */
function initialize(game, data) {
    ReactDOM.render(<CanvasCont />, Z.eid('root'));
    Game.game = game;
    if (data.spectate !== true) { // Field can be left undefined
        Control.spawn({ color: data.color, skin: data.skin, team: data.team });
    } else if (data.spectate === true) {
        Control.spectate({ color: data.color, skin: data.skin, team: data.team });
    }
}


/**
 * Get the source object for the current state of the game
 * @return {Object|*|Game|Game|Menu.props.data}
 */
function getSrc() {
    let src;
    switch (Game.state) {
        case 'game':
        case 'spectate':
        case 'respawnMenu':
        case 'pauseGameMenu':
        case 'pauseSpectateMenu':
            src = Game.game;
            break;
        case 'title':
        case 'browser':
        case 'createMenu':
        case 'joinMenu':
        case 'spectateMenu':
            src = title;
            break;
        case 'tutorial':
        case 'pauseTutorialMenu':
            src = tutorial;
            break;
    }
    return src;
}

/**
 * Event listener called when user presses a key
 * @return boolean false: disables default behaviors
 */
function keyPressed() {
    switch (keyCode) {
        case config.settings.controls.ability1.code: // X by default
            if ((Game.state === 'game' || Game.state === 'tutorial') && org.alive) {
                if (ability.extend.activated === true && ability.extend.can) {
                    ability.use_extend(org.player); // Extend self
                } else if (ability.compress.activated && ability.compress.can) {
                    ability.use_shoot(0, 1);
                    // for (let i = 0; i < Game.game.info.count; i++) {
                    //    if (org.target == Game.game.players[i]) { // Find targeted org
                    //       ability.compress(org.target); // Compress targeted org
                    //       break;
                    //    }
                    // }
                } else if (ability.tag.activated === true && ability.tag.can === true) {
                    ability.use_shoot(0, 1);
                }
                // if (ability.speed.activated == true) { // Speed/Slow; OLD
                //    ability.speed(org.player);
                // } else if (ability.slow.activated == true) {
                //    ability.slow(org.target);
                // }
            }
            break;
        case config.settings.controls.ability2.code: // C by default
            if ((Game.state === 'game' || Game.state === 'tutorial') && org.alive) {
                if (ability.immortality.activated && ability.immortality.can) {
                    ability.use_immortality(org.player); // Immortalize self
                } else if (ability.freeze.activated && ability.freeze.can) {
                    ability.use_shoot(1, 1);
                    // for (let i = 0; i < Game.game.info.count; i++) {
                    //    if (org.target == Game.game.players[i]) { // Find targeted org
                    //       ability.freeze(org.target); // Freeze targeted org
                    //       break;
                    //    }
                    // }
                }
            }
            break;
        case config.settings.controls.ability3.code: // V by default
            if ((Game.state === 'game' || Game.state === 'tutorial') && org.alive) {
                // if (ability.stimulate.activated == true && ability.stimulate.can == true) { // Stimulate/Poison OLD
                //    ability.stimulate(org.player); // Stimulate self
                // } else if (ability.poison.activated == true && ability.poison.can == true) {
                //    ability.shoot(2, 1);
                //    // for (let i = 0; i < Game.game.info.count; i++) {
                //    //    if (org.target == Game.game.players[i]) { // Find targeted org
                //    //       ability.poison(org.target); // Poison targeted org
                //    //       break;
                //    //    }
                //    // }
                // }
                if (ability.neutralize.activated && ability.neutralize.can) {
                    ability.use_neutralize(org.player);
                } else if (ability.toxin.activated && ability.toxin.can) {
                    ability.use_toxin(org.player);
                }
            }
            break;
        case config.settings.controls.ability4.code: // SPACE by default
            if ((Game.state === 'game' || Game.state === 'tutorial') && org.alive) {
                if (! ability.spore.value && ! ability.secrete.value) {
                    ability.use_spore();
                } else if (ability.spore.value && ! ability.secrete.value) {
                    ability.use_secrete();
                }
            }
            break;
        case config.settings.controls.respawn.code: // R by default
            if (Game.state === 'spectate' && ! org.alive && org.spawn) {
                if (Game.game.players.length < Game.game.info.cap) {
                    // connection.socket.binary(false).emit('Spectator Left', Game.game.info);
                    Menu.renderMenu('respawn', Game.game); // Load respawn menu
                } else {
                    alert('Game is at maximum player capacity'); // TODO: Convert to message
                    // Return to spectate mode after alert
                }
            }
            break;
        case config.settings.controls.pause.code: { // ESC by default
            switch (Game.state) { // Used as the back key for menus (variable pause key may be used as well)
                case 'createMenu':
                case 'browser':
                    Title.render(); // unmountComponentAtNode() is unnecessary since ReactDOM.render() clears container before rendering
                    break;
                case 'joinMenu':
                    if (Game.game.info.host === connection.socket.id) { // If player is host (If player is joining directly after creating the game)
                        connection.emit('game ended', Game.game);
                        Title.render();
                    } else {
                        Browser.renderBrowser();
                    }
                    break;
                case 'spectateMenu':
                    Browser.renderBrowser();
                    break;
                case 'game':
                    Menu.renderMenu('pauseGame', Game.game);
                    break;
                case 'spectate':
                    Menu.renderMenu('pauseSpectate', Game.game);
                    break;
                case 'tutorial':
                    Menu.renderMenu('pauseTutorial', tutorial);
                    break;
                case 'pauseSpectateMenu': // Cannot access instance of <Menu> component class to bind as this keyword in submit()
                case 'respawnMenu': // Respawn is included because 'back' for respawn should return to spectate
                    Game.state = 'spectate';
                    ReactDOM.render(<CanvasCont />, Z.eid('root'));
                    break;
                case 'pauseGameMenu': {
                    let skip = false;
                    for (let i = 0; i < Game.game.players.length; i++) {
                        if (Game.game.players[i] === connection.socket.id) { // If still is a player
                            Game.state = 'game';
                            skip = true;
                            break;
                        }
                    }
                    if (!skip) {
                        for (let i = 0; i < Game.game.spectators.length; i++) {
                            if (Game.game.spectators[i] === connection.socket.id) {
                                Game.state = 'spectate'; // Must include spectate possibility in pause game; even though a spectator could never open pause game menu, he could be killed while in menu
                                break;
                            }
                        }
                    }
                    ReactDOM.render(<CanvasCont/>, Z.eid('root'));
                    break;
                }
                case 'pauseTutorialMenu':
                    Game.state = 'tutorial';
                    ReactDOM.render(<CanvasCont />, Z.eid('root'));
                    break;
            }
            break;
        }
    }
    // Hard key codes are separate from variable codes, so in the case of overlap, hard codes will always run
    switch (keyCode) {
        case 27 !== config.settings.controls.pause.code ? 27 : '': { // ESCAPE only if variable pause key is not ESCAPE (keyCode cannot be a string)
            switch (Game.state) { // Used as the back key for menus (variable pause key may be used as well)
                case 'createMenu':
                case 'browser':
                    Title.render(); // unmountComponentAtNode() is unnecessary since ReactDOM.render() clears container before rendering
                    break;
                case 'joinMenu':
                    if (Game.game.info.host === connection.socket.id) { // If player is host (If player is joining directly after creating the game)
                        connection.emit('game ended', Game.game);
                        Title.render();
                    } else {
                        Browser.renderBrowser();
                    }
                    break;
                case 'spectate':
                    Browser.renderBrowser();
                    break;
                case 'pauseSpectateMenu': // Cannot access instance of <Menu> component class to bind as this keyword in submit()
                case 'respawnMenu': // Respawn is included because 'back' for respawn should return to spectate
                    Game.state = 'spectate';
                    ReactDOM.render(<CanvasCont/>, Z.eid('root'));
                    break;
                case 'pauseGameMenu': {
                    let skip = false;
                    for (let i = 0; i < Game.game.players.length; i++) {
                        if (Game.game.players[i] === connection.socket.id) { // If still is a player
                            Game.state = 'game';
                            skip = true;
                            break;
                        }
                    }
                    if (!skip) {
                        for (let i = 0; i < Game.game.spectators.length; i++) {
                            if (Game.game.spectators[i] === connection.socket.id) {
                                Game.state = 'spectate'; // Must include spectate possibility in pause game; even though a spectator could never open pause game menu, he could be killed while in menu
                                break;
                            }
                        }
                    }
                    ReactDOM.render(<CanvasCont/>, Z.eid('root'));
                    break;
                }
                case 'pauseTutorialMenu':
                    Game.state = 'tutorial';
                    ReactDOM.render(<CanvasCont/>, Z.eid('root'));
                    break;
            }
        }
            break;
    }
}

/**
 * Event listener called when any mouse button is clicked (p5)
 *    Not currently in use
 * @return boolean false should disable default behaviors
 */
// function mouseClicked() {
//    if (mouseButton === LEFT) {
//       if (Game.state == 'game') { // DO NOT DELETE
//          { // Targeting
//             org.target = undefined; // Clear target if click not on opponent org
//             for (let i = 0; i < Game.game.info.count; i++) {
//                if (Game.game.orgs[i].player == org.player) { // If org is player's org
//                   continue; // Cannot target oneself
//                }
//                if (mouseX + org.off.x >= Game.game.orgs[i].clickbox.left && mouseX + org.off.x <= Game.game.orgs[i].clickbox.right && mouseY + org.off.y >= Game.game.orgs[i].clickbox.top && mouseY + org.off.y <= Game.game.orgs[i].clickbox.bottom) { // If clicked another org
//                   org.target = Game.game.orgs[i].player;
//                   break;
//                }
//             }
//          }
//       }
//       return false; // Supposedly negates default behavior
//    } else if (mouseButton === RIGHT) {
//       return false; // Supposedly negates default behavior
//    } else if (mouseButton ===CENTER) {
//       return false; // Supposedly negates default behavior
//    }
// }

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
    if (Game.state === 'title' || Game.state === 'browser' || Game.state === 'tutorial') {
        src.resize(0, 0, window.innerWidth, window.innerHeight);
    } else if (Game.state === 'game' || Game.state === 'spectate') {
        org.off.x = org.cursor.x - center.x; // Reposition org (camera) correctly
        org.off.y = org.cursor.y - center.y;
        ReactDOM.render(<CanvasCont />, Z.eid('root'));
    } else if (Game.state.indexOf('Menu') !== -1) {
        let type = Game.state.slice(0, -4); // To make Game.state string, 'Menu' is concatenated to the end of menu type, remove 'Menu' from Game.state to get menu type
        let data = (type === 'join' || type === 'spectate' || type === 'respawn') ? Game.game : null; // Only join, spectate, and respawn menus use game variable as data
        Menu.renderMenu(type, data); // <div id='root'><Menu type={} data={} /></div>
        if (src.src === 'title') { // ^^ Cut out Menu at end of Game.state string for menu type; Send game as data if src is 'game'; Send tutorial as data is src is 'tutorial'
            src.resize(0, 0, window.innerWidth, window.innerHeight);
        } else if (src.src === 'game') { // If menu during game (player or spectator)
            org.off.x = org.cursor.x - center.x; // Reposition org (camera) correctly
            org.off.y = org.cursor.y - center.y;
        } else if (src.src === 'tutorial') {
            src.resize(0, 0, window.innerWidth, window.innerHeight);
        } // Resize the content of the canvas in the background of menus
    }
}
