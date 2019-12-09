let connection;

class Connection {
    /**
     * All static fields defined below:
     * (static) Connection.connections;
     */

    constructor() {
        this.socket = this.connect(); // this.connect forewards the return value of io()
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
        this.socket.on('games', ({ list, connections }) => {
            Game.games = list;
            Connection.connections = connections;
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
                    World.render(Game.game.world);
                    for (let i = 0; i < Game.game.info.player_count; i++) {
                        Abilities.renderToxin(Game.game.abilities[i]);
                    }
                    for (let i = 0; i < Game.game.info.player_count; i++) {
                        Abilities.renderSecretions(Game.game.abilities[i]);
                    }
                    for (let i = 0; i < Game.game.info.player_count; i++) {
                        Abilities.renderNeutralize(Game.game.abilities[i]);
                    }
                    Org.renderAll(); // Render orgs
                    for (let i = 0; i < Game.game.info.player_count; i++) {
                        Abilities.renderSpores(Game.game.abilities[i]);
                    }
                    HUD.render();
                    Board.render(Game.game.board);
                    translate(org.off.x, org.off.y);

                    Game.message.update();
                    Game.message.render(); // Render messages outside translation
                    if (Game.state === 'game') {
                        org.move(); // Move goes at the end so player does not render his movements before others
                    }
                    break;
                case 'spectate':
                case 'pauseSpectateMenu':
                case 'respawnMenu':
                    translate(-org.off.x, -org.off.y);
                    World.render(Game.game.world);
                    for (let i = 0; i < Game.game.info.player_count; i++) {
                        Abilities.renderToxin(Game.game.abilities[i]);
                    }
                    for (let i = 0; i < Game.game.info.player_count; i++) {
                        Abilities.renderSecretions(Game.game.abilities[i]);
                    }
                    for (let i = 0; i < Game.game.info.player_count; i++) {
                        Abilities.renderNeutralize(Game.game.abilities[i]);
                    }
                    Org.renderAll(); // Orgs render over neutralize and toxin but under other abilities
                    for (let i = 0; i < Game.game.info.player_count; i++) {
                        Abilities.renderSpores(Game.game.abilities[i]);
                    }
                    Board.render(Game.game.board);
                    translate(org.off.x, org.off.y);

                    Game.message.update();
                    Game.message.render(); // Render messages outside translation
                    if (Game.state === 'spectate') {
                        org.move(); // Move is after messages so everything has same offset
                    }
                    break;
            }
        });
    }

    // Control Flow Listeners
    listen_force_spawn() {
        this.socket.on('force spawn', () => {
            if (!Game.game.rounds.util) { // assert Game.game.rounds.util
                console.error('Invalid State :: {Connection}.listen_force_spawn :: Game is not utilizing the rounds system but is forcing spawns');
                return;
            }
            const former_state = Game.state; // Cache the current state because Control.spawn will change Game.state to 'game', and the following if condition will break

            Control.spawn(org.color, org.skin, org.team, true); // Respawn all players on round start
            org.spawn = false;
            org.ready = true; // org.ready ensures that org will only be forcibly respawned once

            if (former_state === 'pauseSpectateMenu' || former_state === 'respawnMenu') { // If the pause spectate or respawn menus are rendered
                Game.state = former_state;
                Menu.renderMenu('pauseGame', Game.game); // Move to the pause game menu
            }

        });
    }

    listen_game_ended() {
        this.socket.on('game ended', (game) => {
            Title.render();
            title = Title.create();

            if (game.info.host !== this.socket.id) { // Don't alert host (he already knows)
                alert('The game has ended');
            }
        });
    }

    listen_spectate() {
        this.socket.on('spectate', () => {
            Control.spectate(org.color, org.skin, org.team, org.cursor);
        });
    }

    // Ability Listeners
    listen_tag() {
        this.socket.on('Tag', () => {
            ability.tag.value = true;
            clearTimeout(ability.tag.timeout);
            if (Game.state !== 'tutorial') this.emit('ability', ability); // Server does not store ability for tutorial
            if (Game.game.info.mode === '') {
                ability.tag.timeout = setTimeout(() => {
                    ability.tag.value = false;
                    if (Game.state !== 'tutorial') this.emit('ability', ability); // Server does not store ability for tutorial
                }, ability.tag.time);
            }
        });
    }

    listen_extend() {
        this.socket.on('Extend', () => {
            ability.extend.value = true;
            clearTimeout(ability.extend.timeout);
            ability.extend.start = new Date();
            if (Game.state !== 'tutorial') this.emit('ability', ability); // Server does not store ability for tutorial
            ability.extend.timeout = setTimeout(() => { // End ability
                ability.extend.value = false;
                ability.extend.end = new Date();
                ability.extend.cooling = true;
                if (Game.state !== 'tutorial') this.emit('ability', ability); // Server does not store ability for tutorial
            }, ability.extend.time);
        });
    }

    listen_compress() {
        this.socket.on('Compress', () => {
            ability.compress.value = true;
            clearTimeout(ability.compress.timeout);
            if (Game.state !== 'tutorial') this.emit('ability', ability); // Server does not store ability for tutorial
            ability.compress.timeout = setTimeout(() => {
                ability.compress.value = false;
                if (Game.state !== 'tutorial') this.emit('ability', ability); // Server does not store ability for tutorial
            }, ability.compress.time);
        });
    }

    listen_immortality() {
        this.socket.on('Immortality', () => {
            ability.immortality.value = true;
            clearTimeout(ability.immortality.timeout);
            ability.immortality.start = new Date();
            if (Game.state !== 'tutorial') this.emit('ability', ability); // Server does not store ability for tutorial
            ability.immortality.timeout = setTimeout(() => { // End ability
                ability.immortality.value = false;
                ability.immortality.end = new Date();
                ability.immortality.cooling = true;
                if (Game.state !== 'tutorial') this.emit('ability', ability); // Server does not store ability for tutorial
            }, ability.immortality.time);
        });
    }

    listen_freeze() {
        this.socket.on('Freeze', () => {
            ability.freeze.value = true;
            clearTimeout(ability.freeze.timeout);
            if (Game.state !== 'tutorial') this.emit('ability', ability); // Server does not store ability for tutorial
            ability.freeze.timeout = setTimeout(() => { // End ability
                ability.freeze.value = false;
                if (Game.state !== 'tutorial') this.emit('ability', ability); // Server does not store ability for tutorial
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
            if (Game.state !== 'tutorial') this.emit('ability', ability); // Server does not store ability for tutorial
            ability.neutralize.timeout = setTimeout(() => {
                ability.neutralize.value = false;
                ability.neutralize.end = new Date();
                ability.neutralize.cooling = true;
                if (Game.state !== 'tutorial') this.emit('ability', ability); // Server does not store ability for tutorial
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
            if (Game.state !== 'tutorial') this.emit('ability', ability); // Server does not store ability for tutorial
            ability.toxin.timeout = setTimeout(() => {
                ability.toxin.value = false;
                ability.toxin.end = new Date();
                ability.toxin.cooling = true;
                if (Game.state !== 'tutorial') this.emit('ability', ability); // Server does not store ability for tutorial
            }, ability.toxin.time);
        });
    }

    // listen_speed() {
    //    this.socket.on('Speed', () => { // Not updated
    //       ability.speed.value = true;
    //       org.speed *= ability.speed.factor;
    //       clearTimeout(ability.speed.timeout);
    //       if (Game.state !== 'tutorial') this.emit('ability', ability); // Server does not store ability for tutorial
    //       ability.speed.timeout = setTimeout(() => { // End ability
    //          org.speed /= ability.speed.factor;
    //          ability.speed.value = false;
    //          if (Game.state !== 'tutorial') this.emit('ability', ability); // Server does not store ability for tutorial
    //       }, ability.speed.time);
    //    });
    // }
    // listen_slow() {
    //    this.socket.on('Slow', () => { // Not updated
    //       ability.slow.value = true;
    //       org.speed /= ability.slow.factor; // Divide speed by factor
    //       clearTimeout(ability.slow.timeout);
    //       if (Game.state !== 'tutorial') this.emit('ability', ability); // Server does not store ability for tutorial
    //       ability.slow.timeout = setTimeout(() => { // End ability
    //          org.speed *= ability.slow.factor; // Multiply speed by factor to reset to original
    //          ability.slow.value = false;
    //          if (Game.state !== 'tutorial') this.emit('ability', ability); // Server does not store ability for tutorial
    //       }, ability.slow.time);
    //    });
    // }
    // listen_stimulate() {
    //    this.socket.on('Stimulate', () => {
    //       ability.stimulate.value = true;
    //       clearTimeout(ability.stimulate.timeout);
    //       ability.stimulate.start = new Date();
    //       if (Game.state !== 'tutorial') this.emit('ability', ability); // Server does not store ability for tutorial
    //       ability.stimulate.timeout = setTimeout(() => { // End ability
    //          ability.stimulate.value = false;
    //          ability.stimulate.end = new Date();
    //          ability.stimulate.cooling = true;
    //          if (Game.state !== 'tutorial') this.emit('ability', ability); // Server does not store ability for tutorial
    //       }, ability.stimulate.time);
    //    });
    // }
    // listen_poison() {
    //    this.socket.on('Poison', () => {
    //       ability.poison.value = true;
    //       clearTimeout(ability.poison.timeout);
    //       if (Game.state !== 'tutorial') this.emit('ability', ability); // Server does not store ability for tutorial
    //       ability.poison.timeout = setTimeout(() => { // End ability
    //          ability.poison.value = false;
    //          if (Game.state !== 'tutorial') this.emit('ability', ability); // Server does not store ability for tutorial
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
    // emit_test(data) {
    //     this.socket.binary(false).emit('Test', data || 'Test Successful', result => {
    //         console.log('Callback: ' + result);
    //     });
    // }

    /**
     * Emit a generic event to the server
     * @param {String} event The name of the event to be emitted to the server
     * @param {Object} data (Optional) The data to be sent to the server with the event
     * @param {Function} callback (Optional) The callback function to be called by the server's event listener function
     */
    emit(event, data=undefined, callback=undefined) {
        this.socket.binary(false).emit(event, data, callback);
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
     * Emit the 'check permission' event to the server
     * @param  {Function} granted The callback function to be called if the client is granted access
     * @param  {Function} denied  The callback function to be called if the client is denied access
     */
    emit_check_permission(granted, denied) {
        this.socket.binary(false).emit('check permission', Game.game.info.title, result => {
            if (result === 'permission granted') {
                granted();
            } else if (result === 'permission denied') {
                denied();
            } else {
                console.error('Non-Enumerated Value :: Connection.emit_check_permission :: Result must be "permission granted" or "permission denied"');
            }
        });
    }

    /**
     * Emit the 'respawn' event to the server
     * @param {String} host The host of the current player's game
     * @param {Object} compressedOrg The compressed version of the player's org
     * @param {Ability} ability The current player's {Ability}
     */
    emit_respawn(host, compressedOrg, ability) {
        connection.socket.binary(false).emit('respawn', { host: host, org: compressedOrg, ability: ability }, Control.enter);
    }

    /**
     * Emit the 'join player' event to the server
     * @param {Object} info The game's .info object
     * @param {Object} compressedOrg The compressed version of the player's org
     * @param {Ability} ability The current player's {Ability}
     */
    emit_join_player(info, compressedOrg, ability) {
        connection.socket.binary(false).emit('join player', { info: info, org: compressedOrg, ability: ability }, Control.enter);
    }

    /**
     * Emit the 'board' event to the server
     *    Overwrite the server's copy of the board
     * @param {Board} board The Board instance to be sent to the server
     */
    emit_board(board) {
        this.socket.binary(false).emit('board', { list: board.list, host: board.host });
    }

    /**
     * Emit the 'org' event to the server
     *    Overwrite the server's copy of this user's org
     *     cells: //
     *     off: //
     *     cursor:
     *     color:
     *     skin:
     *     team:
     *     coefficient:
     *     range:
     * }
     * @param {Array} cells The Org's cells collection
     *                Only the following attributes of org need to be updated
     * @param { x, y } offset The offset of the Org's position to the screen
     *                 Latency is decreased by only sending necessary data
     * @param { x, y } cursor The location of the player's cursor in the screen
     * @param { r, g, b} color The Org's color
     * @param {String} skin The Org's skin
     * @param {String} team The Org's team
     * @param {Number} coefficient The Org's growth coefficient (changes with compress/extend)
     * @param {Number} range The Org's living range (changes with compress/extend)
     */
    emit_org(cells, offset, cursor, color, skin, team, coefficient, range) {
        // this.socket.volatile.binary(false).emit('org', data); // Volatile emits from client are not currently supported by socketio
        this.socket.binary(false).emit('org', data);
    }
}
