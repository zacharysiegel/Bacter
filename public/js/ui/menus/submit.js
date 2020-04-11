function submit(menuType) {
    let issues = []; // Array of objects [ { [instance]: 'error message' } ] (instance of input to render error message next to)
    let ok = true; // Check for inputs' validities
    let tInput = Z.eid('game title input');
    let pInput = Z.eid('password input');
    let shapeInput = Z.eid('world shape input');
    let widthInput = Z.eid('world width input');
    let heightInput = Z.eid('world height input');
    let pcInput = Z.eid('player cap input');
    let pmInput = Z.eid('player minimum input');
    let boardLengthInput = Z.eid('leaderboard length input');
    let tcInput = Z.eid('team count input');
    let modeInput = Z.eid('game mode input');
    let snInput = Z.eid('screen name input');
    let cInput = Z.eid('color input');
    let teamInput = Z.eid('team input');
    let gametitle = tInput ? tInput.value : null; // Reading values is ok, but do not edit direct to the DOM
    let password = pInput ? pInput.value : null;
    let secured = !!password; // If password is non-null, secured is true
    let shape = shapeInput ? shapeInput.value.toLowerCase() : null;
    let width = widthInput ? parseFloat(widthInput.value) : null;
    let height = heightInput ? parseFloat(heightInput.value) : null;
    let cap = pcInput ? parseFloat(pcInput.value) : null;
    let minimum = pmInput ? parseFloat(pmInput.value) : null;
    let show = boardLengthInput ? parseFloat(boardLengthInput.value) : null;
    let teamCount = tcInput ? parseFloat(tcInput.value) : null;
    let mode = modeInput ? modeInput.value : null;
    let name = snInput ? snInput.value : null;
    let color = cInput ? cInput.value.toLowerCase() : null;
    let first = this.state.values[config.menus[this.type].options.indexOf('1st Ability')]; // this value must be instance of Menu component (bind this in submit property in menuSubmit rendering)
    let second = this.state.values[config.menus[this.type].options.indexOf('2nd Ability')]; // Value of second ability input
    let third = this.state.values[config.menus[this.type].options.indexOf('3rd Ability')]; // Valeu of third ability input
    first = first ? first.toLowerCase() : ''; // toLowerCase() is separated so entire getting of first value need not be repeated in ternary expression
    second = second ? second.toLowerCase() : '';
    third = third ? third.toLowerCase() : '';
    let skin = this.state.values[config.menus[this.type].options.indexOf('Skin')]; // this value must be instance of Menu component (bind this in submit property in menuSubmit rendering)
    skin = skin || 'none'; // If no skin is selected, set value of skin to 'none'
    let team = teamInput ? teamInput.value.toLowerCase() : null;
    let auto = this.state.values[config.menus[this.type].options.indexOf('Auto Assign')]; // this value must be instance of Menu component (bind this in submit property in menuSubmit rendering)
    auto = !!auto; // Set auto assign to Boolean value
    let label = this.state.values[config.menus[this.type].options.indexOf('Name Labels')]; // this value must be instance of Menu component (bind this in submit property in menuSubmit rendering)
    label = label === 'name labels'; // Set label to Boolean value
    let message = this.state.values[config.menus[this.type].options.indexOf('Messages')]; // this value must be instance of Menu component (bind this in submit property in menuSubmit rendering)
    message = message === 'messages'; // Set messages to Boolean value

    switch (menuType) {
        case 'create':
        { // Game Title
            if (tInput) { // If title input exists
                if (!gametitle) { // If empty
                    ok = false;
                    issues.push({ ['game title']: 'Title cannot be left blank' });
                    // alert('Title cannot be left blank');
                } else {
                    for (let game in Game.games.values()) {
                        if (gametitle === game.info.title) { // Find matching title to another game
                            ok = false;
                            issues.push({ ['game title']: 'Title matches that of another game' });
                            // alert('Title matches that of another game');
                            break;
                        }
                    }
                }
            }
        } { // World Width and Height
            if (widthInput && heightInput) { // If width and height inputs exist
                if (!width && width !== 0) { // If width input is empty
                    width = parseFloat(widthInput.placeholder); // Set width to default (rendered in placeholder)
                }
                if (!height && height !== 0) { // If height input is empty
                    height = parseFloat(heightInput.placeholder); // Set height to default (rendered in placeholder)
                }
                if (width < parseFloat(widthInput.min) || height < parseFloat(heightInput.min)) {
                    ok = false;
                    issues.push({ ['world width']: 'Dimensions must be at least ' + widthInput.min + ' x ' + heightInput.min + ' px' });
                    issues.push({ ['world height']: 'Dimensions must be at least ' + widthInput.min + ' x ' + heightInput.min + ' px' });
                    // alert('Dimensions must be at least ' + widthInput.min + ' x ' + heightInput.min + ' px');
                } else if (width > parseFloat(widthInput.max) || height > parseFloat(heightInput.max)) {
                    ok = false;
                    issues.push({ ['world width']: 'Dimensions can be at most ' + widthInput.max + ' x ' + heightInput.max + ' px' });
                    issues.push({ ['world height']: 'Dimensions can be at most ' + widthInput.max + ' x ' + heightInput.max + ' px' });
                    // alert('Dimensions can be at most ' + widthInput.max + ' x ' + heightInput.max + ' px');
                }
                if (width % 1 !== 0 || height % 1 !== 0) {
                    ok = false;
                    issues.push({ ['world width']: 'Width and height must be whole numbers' });
                    issues.push({ ['world height']: 'Width and height must be whole numbers' });
                    // alert('Width and height must be whole numbers');
                }
                if (width !== height) {
                    ok = false;
                    issues.push({ ['world width']: 'Width and height must be equivalent' });
                    issues.push({ ['world height']: 'Width and height must be equivalent' });
                    // alert('Width and height must be equivalent');
                }
            }
        } { // Player Cap
            if (pcInput) { // If player cap input exists
                if (!cap && cap !== 0) { // If player cap input is left empty
                    cap = parseFloat(pcInput.placeholder); // Set cap to default as rendered as placeholder
                } else if (cap < parseFloat(pcInput.min)) {
                    ok = false;
                    issues.push({ ['player cap']: 'Player cap must be at least ' + parseFloat(pcInput.min) });
                    // alert('Player cap must be at least ' + parseFloat(pcInput.min));
                } else if (cap % 1 !== 0) {
                    ok = false;
                    issues.push({ ['player cap']: 'Player cap must be a whole number' });
                    // alert('Player cap must be a whole number');
                } else if (pmInput ? cap < parseFloat(pmInput.value) : false) { // If player minimum input exists and player cap is less than player minimum value
                    ok = false;
                    issues.push({ ['player cap']: 'Player cap cannot be less than player minimum' });
                    // alert('Player cap cannot be less than player minimum');
                }
            }
        } { // Player Minimum
            if (pmInput) { // If player minimum input exists
                if (!minimum && minimum !== 0) { // If player minimum input is left empty
                    minimum = parseFloat(pmInput.placeholder); // Set player minimum to default rendered as placeholder
                } else if (minimum < parseFloat(pmInput.min)) {
                    ok = false;
                    issues.push({ ['player minimum']: 'Player minimum must be at least ' + parseFloat(pmInput.min) });
                    // alert('Player minimum must be at least ' + parseFloat(pmInput.min));
                } else if (minimum % 1 !== 0) {
                    ok = false;
                    issues.push({ ['player minimum']: 'Player minimum must be a whole number' });
                    // alert('Player minimum must be a whole number');
                }
            }
        } { // Leaderboard Length
            if (boardLengthInput) { // If leaderboard length input exists
                if (!show && show !== 0) { // If input is left blank
                    show = parseFloat(boardLengthInput.placeholder);
                } else if (show < parseFloat(boardLengthInput.min)) {
                    ok = false;
                    issues.push({ ['leaderboard length']: 'Leaderboard length must be at least ' + parseFloat(boardLengthInput.min) });
                    // alert('Leaderboard length must be at least ' + parseFloat(boardLengthInput.min));
                } else if (show > parseFloat(boardLengthInput.max)) {
                    ok = false;
                    issues.push({ ['leaderboard length']: 'Leaderboard length can be at most ' + parseFloat(boardLengthInput.max) });
                    // alert('Leaderboard length can be at most ' + parseFloat(boardLengthInput.max));
                } else if (show % 1 !== 0) {
                    ok = false;
                    issues.push({ ['leaderboard length']: 'Leaderboard length must be a whole number' });
                    // alert('Leaderboard length must be a whole number');
                }
            }
        } { // Team Count
            if (tcInput) { // If team count input exists
                if (!teamCount && teamCount !== 0) { // If team count input is left empty
                    teamCount = parseFloat(tcInput.placeholder); // Set team count to default rendered as placeholder
                } else if (teamCount < parseFloat(tcInput.min)) {
                    ok = false;
                    issues.push({ ['team count']: 'Team count must be at least ' + parseFloat(tcInput.min) });
                    // alert('Team count must be at least ' + parseFloat(tcInput.min));
                } else if (teamCount > parseFloat(tcInput.max)) {
                    ok = false;
                    issues.push({ ['team count']: 'Team count can be at most ' + parseFloat(tcInput.max) });
                    // alert('Team count can be at most ' + parseFloat(tcInput.max));
                } else if (teamCount % 1 !== 0) {
                    ok = false;
                    issues.push({ ['team count']: 'Team count must be a whole number' });
                    // alert('Team count must be a whole number');
                } else if (teamCount > parseFloat(pcInput.value)) {
                    ok = false;
                    issues.push({ ['team count']: 'Player cap cannot be less than the number of teams' });
                    // alert('Player cap cannot be less than the number of teams');
                }
            }
        }
            if (ok) {
                let color = 'black'; // Z.eid('World color input').value.toLowerCase(); // Only black world is enabled

                Game.game = new Game(
                    gametitle,
                    shape,
                    width,
                    height,
                    color,
                    cap,
                    show,
                    mode,
                    teamCount,
                    minimum,
                    !!password, // convert existance of password to Boolean
                );
                connection.emit_create_game();
                connection.emit_create_password(password);

                Menu.renderMenu('join', Game.game); // Pass in game data for certain menu information
            } else {
                this.issue(issues); // this keyword refers to Menu (after binding denied/grantedJoin in submit and submit in MenuSubmit props)
            }
            break;
        case 'join':
        { // Screen Name
            if (!name) { // If screen name input is left empty
                ok = false;
                issues.push({ ['screen name']: 'Screen name cannot be left empty' });
                // alert('Screen name cannot be left empty');
            }
            for (let i = 0; i < Game.game.info.player_count; i++) { // Requires game to be updated (in Menu.renderMenu(datA))
                if (name === Game.game.board.list[i].name) { // Name cannot match another player's name
                    ok = false;
                    issues.push({ ['screen name']: 'Name matches that of another player' });
                    // alert('Name matches that of another player');
                    break;
                }
            }
        }
            // Skins
            if (config.game.skins.indexOf(skin) === -1 && skin !== 'none') { // If the skin value is not 'none' or any other possible skin (should never occur)
                ok = false;
                issues.push({ skin: 'There is an issue with the skin selection' });
            }
        { // Abilities
            if (Game.game.info.mode === 'ffa' || Game.game.info.mode === 'skm' || Game.game.info.mode === 'srv' || Game.game.info.mode === 'ctf' || Game.game.info.mode === 'kth') { // FFA, SKM, SRV, CTF, and KTH all use standard ability set
                if (!first) {
                    ok = false;
                    issues.push({ ['1st ability']: 'Select a first ability' });
                } else if (first !== 'extend' && first !== 'compress') {
                    ok = false;
                    issues.push({ ['1st ability']: 'There is an issue with the first ability selection' });
                }
                if (!second) {
                    ok = false;
                    issues.push({ ['2nd ability']: 'Select a second ability' });
                } else if (second !== 'immortality' && second !== 'freeze') {
                    ok = false;
                    issues.push({ ['2nd ability']: 'There is an issue with the second ability selection' });
                }
                if (!third) {
                    ok = false;
                    issues.push({ ['3rd ability']: 'Select a third ability' });
                } else if (third !== 'neutralize' && third !== 'toxin') {
                    ok = false;
                    issues.push({ ['3rd ability']: 'There is an issue with the third ability selection' });
                }
            }
        } { // Team
            if (Game.game.info.mode === 'skm' || Game.game.info.mode === 'ctf') { // If is a team game
                if (!auto) {
                    for (let i = 0; i < Game.game.teams.length; i++) {
                        if (i === config.colors.teams.indexOf(team)) { // If i is selected team
                            continue;
                        }
                        if (Game.game.teams[config.colors.teams.indexOf(team)].length > Game.game.teams[i].length) { // If there are more players on selected team than another
                            if (org && typeof team === 'string' && org.team === team) { // If player is already on selected team
                                break; // Allow spawn
                            }
                            ok = false;
                            issues.push({ ['auto assign']: 'Cannot join ' + team + ' team because it already has more players than ' + config.colors.teams[i] });
                            // alert('Cannot join ' + team + ' team because it already has more players than ' + config.colors.teams[i]);
                            break;
                        }
                    }
                    if (org && org.team !== team && Game.game.teams[config.colors.teams.indexOf(org.team)].length === Game.game.teams[config.colors.teams.indexOf(team)].length) {
                        ok = false;
                        issues.push({ ['auto assign']: 'Cannot join ' + team + ' team because it will have more players than ' + org.team });
                        // alert('Cannot join ' + team + ' team because it will have more players than ' + org.team);
                    }
                }
            }
        } { // Player Cap
            if (Game.game.players.length >= Game.game.info.cap) {
                ok = false;
                issues.push({ ['player cap']: 'Game is at maximum player capacity' });
                // alert('Game is at maximum player capacity');
            }
        } { // Game Closed
            const closed = ! Game.exists(Game.game.info.host); // If the game doesn't exist, it has been closed
            if (closed) { // If game does not exist, it has been closed; return user to the title screen
                ok = false;
                // issues.push({ ['']: 'The game has closed' }); // Empty quotes for game closed instance because it is not specific to a single input
                alert('The game has closed');
                Title.render();
                break;
            }
        } { // Password
            const deniedJoin = () => {
                if (!password) {
                    issues.push({ ['password']: 'A password is required for this game' });
                    // alert('A password is required for this game');
                } else {
                    issues.push({ ['password']: 'Password is invalid' });
                    // alert('Password is invalid');
                }
                this.issue(issues); // this keyword refers to Menu (after binding denied/grantedJoin in submit and submit in MenuSubmit props)
            };

            const grantedJoin = () => { // Function is defined locally so it cannot be called from the global scope (slightly better security)
                // Leaderboard
                let already_in_game = false;
                for (let i = 0; i < Game.game.board.list.length; i++) { // Search for player id in game
                    if (Game.game.board.list[i].id === connection.socket.id) {
                        already_in_game = true;
                        break;
                    }
                }
                if (!already_in_game) {
                    let entry = new BoardEntry(connection.socket.id, name);
                    Game.game.board.list.push(entry); // Add player to the leaderboard
                }
                Board.order(Game.game.board);
                connection.emit_board(Game.game.board); // Must be before spawn because only runs when first entering server, and spawn() runs on respawn as well
                // Abilities
                if (Game.game.info.mode === 'ffa' || Game.game.info.mode === 'skm' || Game.game.info.mode === 'srv' || Game.game.info.mode === 'ctf' || Game.game.info.mode === 'kth') { // FFA, SKM, SRV, CTF, and KTH all use standard ability set
                    ability.tag.activated = false;
                    ability.tag.can = false;
                    if (first === 'extend') {
                        ability.extend.activated = true;
                        ability.extend.can = true;
                        ability.compress.activated = false;
                        ability.compress.can = false;
                    } else if (first === 'compress') {
                        ability.compress.activated = true;
                        ability.compress.can = true;
                        ability.extend.activated = false;
                        ability.extend.can = false;
                    }
                    if (second === 'immortality') {
                        ability.immortality.activated = true;
                        ability.immortality.can = true;
                        ability.freeze.activated = false;
                        ability.freeze.can = false;
                    } else if (second === 'freeze') {
                        ability.freeze.activated = true;
                        ability.freeze.can = true;
                        ability.immortality.activated = false;
                        ability.immortality.can = false;
                    }
                    if (third === 'neutralize') {
                        ability.neutralize.activated = true;
                        ability.neutralize.can = true;
                        ability.toxin.activated = false;
                        ability.toxin.can = false;
                    } else if (third === 'toxin') {
                        ability.toxin.activated = true;
                        ability.toxin.can = true;
                        ability.neutralize.activated = false;
                        ability.neutralize.can = false;
                    }
                    ability.spore.activated = true;
                    ability.spore.can = true;
                    ability.secrete.activated = true;
                    ability.secrete.can = false;
                    for (let i = 0; i < ability.shoot.value.length; i++) {
                        ability.shoot.can[i] = true;
                        ability.shoot.value[i] = false;
                    }
                } else if (Game.game.info.mode === 'inf') {
                    ability.tag.activated = true;
                    ability.tag.can = true;
                    ability.extend.activated = false;
                    ability.extend.can = false;
                    ability.compress.activated = false;
                    ability.compress.can = false;
                    ability.immortality.activated = false;
                    ability.immortality.can = false;
                    ability.freeze.activated = false;
                    ability.freeze.can = false;
                    ability.neutralize.activated = false;
                    ability.neutralize.can = false;
                    ability.toxin.activated = false;
                    ability.toxin.can = false;
                    ability.spore.activated = false;
                    ability.spore.can = false;
                    ability.secrete.activated = false;
                    ability.secrete.can = false;
                    for (let i = 0; i < config.game.ability_count - 1; i++) { // Only loop through standard abilities (ability.shoot.values.length = config.game.ability_count - 1)
                        if (i === ability.tag.i) {
                            ability.shoot.can[i] = true;
                        } else {
                            ability.shoot.can[i] = false;
                        }
                        ability.shoot.value[i] = false;
                    }
                }
                // Team
                if (Game.game.info.mode === 'skm' || Game.game.info.mode === 'ctf') { // If is a team game
                    ability.auto = auto; // auto variable is Boolean
                    if (auto) { // If auto assign is selected
                        let indices = [];
                        let minimum = Infinity;
                        for (let i = 0; i < Game.game.teams.length; i++) { // Find team(s) with the fewest players and store their indices within Game.game.teams array into indices array
                            if (Game.game.teams[i].length < minimum) { // If length is less than minimum
                                minimum = Game.game.teams[i].length; // Set length as new minimum
                                indices = [i]; // Clear indices and push i
                            } else if (Game.game.teams[i].length === minimum) {
                                indices.push(i);
                            }
                        }
                        const team_index = indices[Math.floor(Math.random() * indices.length)];
                        team = config.colors.teams[team_index]; // Set team to the team with the fewest players; If there are multiple, choose one at random
                    }
                    for (let i = 0; i < config.colors.teams.length; i++) {
                        if (team === config.colors.teams[i]) {
                            Game.game.teams[i].push(connection.socket.id); // Add player to selected team
                            connection.emit('teams', { teams: Game.game.teams, host: Game.game.info.host }); // Update server teams; host is for identification
                            break;
                        }
                    }
                }
                // Color
                let color;
                if (Game.game.info.mode === 'inf') { // If inf mode
                    color = config.colors.teamsDef.green; // All players healthy by default
                } else if (Game.game.info.mode !== 'skm' && Game.game.info.mode !== 'ctf' && Z.eid('color input')) { // If is not a team game and there is a color input field
                    color = Z.eid('color input').value.toLowerCase();
                } else {
                    color = config.colors.teamsDef[team]; // Color must be after Team
                }
                // Initialize
                clearInterval(title.interval);
                if (Game.game.rounds.util) {
                    if (Game.game.rounds.waiting) {
                        Game.start(Game.game, false, config.colors.orgs[Game.game.world.color][color], skin, team);
                    } else {
                        Game.start(Game.game, true, config.colors.orgs[Game.game.world.color][color], skin, team);
                    }
                } else {
                    Game.start(Game.game, false, config.colors.orgs[Game.game.world.color][color], skin, team);
                }
            };

            if (ok) {
                connection.emit_check_permission(grantedJoin, deniedJoin);
            } else {
                this.issue(issues); // this keyword refers to Menu (after binding denied/grantedJoin in submit and submit in MenuSubmit props)
            }
        }
            break;
        case 'spectate':
        { // Game Closed
            const closed = ! Game.exists(Game.game.info.host); // If game doesn't exist, it has been closed
            if (closed) { // If closed, return user to the title screen
                ok = false;
                // issues.push({ ['']: 'The game has closed' });
                alert('The game has closed');
                Title.render();
                break;
            }
        } { // Screen Name
            if (!name) {
                ok = false;
                issues.push({ ['screen name']: 'Screen name cannot be left empty' });
                // alert('Screen name cannot be left empty');
            }
            for (let i = 0; i < Game.game.info.player_count; i++) { // Requires game to be updated (in Menu.renderMenu(datA))
                if (name === Game.game.board.list[i].name) { // Name cannot match another player's name
                    ok = false;
                    issues.push({ ['screen name']: 'Name matches that of another player' });
                    // alert('Name matches that of another player');
                    break;
                }
            }
        } { // Password
            const deniedSpectate = () => {
                if (!password) {
                    issues.push({ ['password']: 'A password is required for this game' });
                    // alert('A password is required for this game');
                } else {
                    issues.push({ ['password']: 'Password is invalid' });
                    // alert('Password is invalid');
                }
                this.issue(issues);
            };

            /**
             * Let player into the game if he is granted permission
             */
            const grantedSpectate = () => {
                // Leaderboard
                let already_in_game = false;
                for (let i = 0; i < Game.game.board.list.length; i++) {
                    if (Game.game.board.list[i].id === connection.socket.id) {
                        already_in_game = true;
                        break;
                    }
                }
                if (!already_in_game) {
                    let entry = new BoardEntry(connection.socket.id, name);
                    Game.game.board.list.push(entry); // Add spectator to the leaderboard
                }
                Board.order(Game.game.board);
                connection.emit_board(Game.game.board); // Must be before spawn because only runs when first entering server, and spawn() runs on respawn as well
                // Initialize
                clearInterval(title.interval);
                Game.start(Game.game, true);
            };

            if (ok) {
                connection.emit_check_permission(grantedSpectate, deniedSpectate);
            } else {
                this.issue(issues); // this keyword refers to Menu (after binding denied/grantedJoin in submit and submit in MenuSubmit props)
            }
        }
            break;
        case 'respawn':
            if (config.game.skins.indexOf(skin) === -1 && skin !== 'none') { // Skins; If the skin value is not 'none' or any other possible skin (should never occur)
                ok = false;
                issues.push({ skin: 'There is an issue with the skin selection' });
            }
        { // Abilities
            if (Game.game.info.mode === 'ffa' || Game.game.info.mode === 'skm' || Game.game.info.mode === 'srv' || Game.game.info.mode === 'ctf' || Game.game.info.mode === 'kth') { // FFA, SKM, SRV, CTF, and KTH all use standard ability set
                if (!first) {
                    ok = false;
                    issues.push({ ['1st ability']: 'Select a first ability' });
                } else if (first !== 'extend' && first !== 'compress') {
                    ok = false;
                    issues.push({ ['1st ability']: 'There is an issue with the first ability selection' });
                }
                if (!second) {
                    ok = false;
                    issues.push({ ['2nd ability']: 'Select a second ability' });
                } else if (second !== 'immortality' && second !== 'freeze') {
                    ok = false;
                    issues.push({ ['2nd ability']: 'There is an issue with the second ability selection' });
                }
                if (!third) {
                    ok = false;
                    issues.push({ ['3rd ability']: 'Select a third ability' });
                } else if (third !== 'neutralize' && third !== 'toxin') {
                    ok = false;
                    issues.push({ ['3rd ability']: 'There is an issue with the third ability selection' });
                }
            }
        } { // Team
            if (Game.game.info.mode === 'skm' || Game.game.info.mode === 'ctf') { // If is a team game
                ability.auto = auto; // auto variable is Boolean
                if (!auto) { // If auto assign is not selected
                    for (let i = 0; i < Game.game.teams.length; i++) {
                        if (i === config.colors.teams.indexOf(team)) {
                            continue;
                        }
                        if (Game.game.teams[config.colors.teams.indexOf(team)].length > Game.game.teams[i].length) { // If chosen team has greater players than another team
                            if (org && org.team === team && typeof team === 'string') { // If player is already on loaded team
                                break; // Allow respawn
                            } else {
                                ok = false; // Disallow respawn
                                issues.push({ ['team input']: 'Cannot join ' + team + ' team because it already has more players than ' + config.colors.teams[i] });
                                // alert('Cannot join ' + team + ' team because it already has more players than ' + config.colors.teams[i]);
                                break;
                            }
                        }
                        if (org && org.team !== team && Game.game.teams[config.colors.teams.indexOf(org.team)].length === Game.game.teams[config.colors.teams.indexOf(team)].length) { // If chosen team has equal players as current team (and is not current team)
                            ok = false; // Disallow respawn
                            issues.push({ ['team input']: 'Cannot join ' + team + ' team because it will have more players than ' + org.team });
                            // alert('Cannot join ' + team + ' team because it will have more players than ' + org.team);
                        }
                    }
                } else { // If auto assign is selected
                    let indices = [];
                    let minimum = Infinity;
                    for (let i = 0; i < Game.game.teams.length; i++) { // Find team(s) with the fewest players and store their indices within Game.game.teams array into indices array
                        let l = Game.game.teams[i].length;
                        if (Game.game.teams[i].indexOf(connection.socket.id) !== -1) { // If player is on given team
                            l--; // Do not include player as part of the team, so if even numbers before, will replace back on the same team and not add extra to other team
                        }
                        if (l < minimum) { // If length is less than minimum
                            minimum = l; // Set length as new minimum
                            indices = [i]; // Clear indices and push i
                        } else if (l === minimum) {
                            indices.push(i);
                        }
                    }
                    team = config.colors.teams[indices[floor(random(0, indices.length))]]; // Set team to the team with the fewest players; If there are multiple, choose one at random
                }
            }
        } { // Game Closed
            let closed = ! Game.exists(Game.game.info.host); // If game doesn't exist, it has been closed
            if (closed) {
                ok = false;
                // issues.push({ ['']: 'The game has closed' });
                alert('The game has closed');
                Title.render();
                break;
            }
        }
            if (ok) {
                // Abilities
                if (Game.game.info.mode === 'ffa' || Game.game.info.mode === 'skm' || Game.game.info.mode === 'srv' || Game.game.info.mode === 'ctf' || Game.game.info.mode === 'kth') { // FFA, SKM, SRV, CTF, and KTH all use standard ability set
                    if (first === 'extend') {
                        ability.extend.activated = true;
                        ability.extend.can = true;
                        ability.compress.activated = false;
                        ability.compress.can = false;
                    } else if (first === 'compress') {
                        ability.compress.activated = true;
                        ability.compress.can = true;
                        ability.extend.activated = false;
                        ability.extend.can = false;
                    }
                    if (second === 'immortality') {
                        ability.immortality.activated = true;
                        ability.immortality.can = true;
                        ability.freeze.activated = false;
                        ability.freeze.can = false;
                    } else if (second === 'freeze') {
                        ability.freeze.activated = true;
                        ability.freeze.can = true;
                        ability.immortality.activated = false;
                        ability.immortality.can = false;
                    }
                    if (third === 'neutralize') {
                        ability.neutralize.activated = true;
                        ability.neutralize.can = true;
                        ability.toxin.activated = false;
                        ability.toxin.can = false;
                    } else if (third === 'toxin') {
                        ability.toxin.activated = true;
                        ability.toxin.can = true;
                        ability.neutralize.activated = false;
                        ability.neutralize.can = false;
                    }
                    ability.spore.activated = true;
                    ability.spore.can = true;
                    ability.secrete.activated = true;
                    ability.secrete.can = false;
                } else if (Game.game.info.mode === 'inf') {
                    ability.extend.activated = false;
                    ability.extend.can = false;
                    ability.compress.activated = false;
                    ability.compress.can = false;
                    ability.immortality.activated = false;
                    ability.immortality.can = false;
                    ability.freeze.activated = false;
                    ability.freeze.can = false;
                    ability.neutralize.activated = false;
                    ability.neutralize.can = false;
                    ability.toxin.activated = false;
                    ability.toxin.can = false;
                    ability.spore.activated = false;
                    ability.spore.can = false;
                    ability.secrete.activated = false;
                    ability.secrete.can = false;
                }
                // Team
                if (Game.game.info.mode === 'skm' || Game.game.info.mode === 'ctf') { // If is a team game
                    if (org.team !== team) { // Only add player to team if not already on team
                        Game.game.teams[config.colors.teams.indexOf(team)].push(connection.socket.id); // Add player to selected team
                        Game.game.teams[config.colors.teams.indexOf(org.team)].splice(Game.game.teams[config.colors.teams.indexOf(org.team)].indexOf(connection.socket.id), 1);
                        connection.emit('teams', { teams: Game.game.teams, host: Game.game.info.host }); // Host is for identification
                    }
                }
                // Color
                if (Game.game.info.mode === 'inf') { // If inf mode
                    color = config.colors.teamsDef.green; // All players healthy by default
                } else if (Game.game.info.mode !== 'skm' && Game.game.info.mode !== 'ctf') { // If is not a team mode
                    color = Z.eid('color input').value.toLowerCase();
                } else {
                    color = config.colors.teamsDef[team]; // Color must be after Team
                }
                // Initialize
                Game.start(Game.game, false, config.colors.orgs[Game.game.world.color][color], skin, team);
            } else {
                this.issue(issues); // this keyword refers to Menu (after binding denied/grantedJoin in submit and submit in MenuSubmit props)
            }
            break;
        case 'pauseGame':
            if (config.game.skins.indexOf(skin) === -1 && skin !== 'none') { // Skins
                ok = false;
                issues.push({ skin: 'There is an issue with the skin selection' }); // If the skin value is not 'none' or any other possible skin (should never occur)
            }
        { // Game Closed
            const closed = ! Game.exists(Game.game.info.host); // If game doesn't exist, it has been closed
            if (closed) { // If closed, return user to the title screen
                ok = false;
                // issues.push({ ['']: 'The game has closed' });
                alert('The game has closed');
                Title.render();
                break;
            }
        }
            if (ok) {
                if (Game.game.info.mode !== 'skm' && Game.game.info.mode !== 'ctf') { // If is not a team mode
                    org.color = config.colors.orgs[Game.game.world.color][color]; // Set org color
                } // Cannot change team in pause menu
                org.skin = skin; // Set org skin
                config.settings.labels = label; // Set labels setting (Boolean)
                config.settings.messages = message; // Set messages setting (Boolean)
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
                ReactDOM.render(<CanvasCont />, Z.eid('root'));
            } else {
                this.issue(issues); // this keyword refers to Menu (after binding denied/grantedJoin in submit and submit in MenuSubmit props)
            }
            break;
        case 'pauseSpectate':
        { // Game Closed
            const closed = ! Game.exists(Game.game.info.host); // If game does not exist, it has been closed
            if (closed) { // If closed, return user to the title screen
                ok = false;
                // issues.push({ ['']: 'The game has closed' });
                alert('The game has closed');
                Title.render();
                break;
            }
        }
            if (ok) {
                config.settings.labels = label; // Set name labels setting (Boolean)
                config.settings.messages = message; // Set messages setting (Boolean)
                Game.state = 'spectate';
                ReactDOM.render(<CanvasCont />, Z.eid('root'));
            } else {
                this.issue(issues); // this keyword refers to Menu (after binding submit in MenuSubmit props)
            }
            break;
        case 'pauseTutorial':
            if (ok) {
                Game.state = 'tutorial';
                ReactDOM.render(<CanvasCont />, Z.eid('root'));
            } else {
                this.issue(issues); // this keyword refers to Menu (after binding submit in MenuSubmit props)
            }
            break;
        default:
            console.error('Non-Enumerated Value :: submit :: Game.state has an invalid value');
            break;
    }
}
