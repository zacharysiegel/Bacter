function submit(menuType) {
   let issues = []; // Array of objects [ { [instance]: 'error message' } ] (instance of input to render error message next to)
   let ok = true; // Check for inputs' validities
   let tInput = eid('game title input');
   let pInput = eid('password input');
   let typeInput = eid('world type input');
   let widthInput = eid('world width input');
   let heightInput = eid('world height input');
   let pcInput = eid('player cap input');
   let pmInput = eid('player minimum input');
   let boardLengthInput = eid('leaderboard length input');
   let tcInput = eid('team count input');
   let modeInput = eid('game mode input');
   let snInput = eid('screen name input');
   let cInput = eid('color input');
   let teamInput = eid('team input');
   let gametitle = tInput ? tInput.value : null; // Reading values is ok, but do not edit direct to the DOM
   let password = pInput ? pInput.value : null;
   let type = typeInput ? typeInput.value.toLowerCase() : null;
   let width = widthInput ? parseFloat(widthInput.value) : null;
   let height = heightInput ? parseFloat(heightInput.value) : null;
   let cap = pcInput ? parseFloat(pcInput.value) : null;
   let minimum = pmInput ? parseFloat(pmInput.value) : null;
   let show = boardLengthInput ? parseFloat(boardLengthInput.value) : null;
   let teamCount = tcInput ? parseFloat(tcInput.value) : null;
   let mode = modeInput ? modeInput.value : null;
   let name = snInput ? snInput.value : null;
   let color = cInput ? cInput.value.toLowerCase() : null;
   let first = this.state.values[menus[this.type].options.indexOf('1st Ability')]; // this value must be instance of Menu component (bind this in submit property in menuSubmit rendering)
   let second = this.state.values[menus[this.type].options.indexOf('2nd Ability')]; // Value of second ability input
   let third = this.state.values[menus[this.type].options.indexOf('3rd Ability')]; // Valeu of third ability input
   first = first ? first.toLowerCase() : ''; // toLowerCase() is separated so entire getting of first value need not be repeated in ternary expression
   second = second ? second.toLowerCase() : '';
   third = third ? third.toLowerCase() : '';
   let skin = this.state.values[menus[this.type].options.indexOf('Skin')]; // this value must be instance of Menu component (bind this in submit property in menuSubmit rendering)
   skin = skin || 'none'; // If no skin is selected, set value of skin to 'none'
   let team = teamInput ? teamInput.value.toLowerCase() : null;
   let auto = this.state.values[menus[this.type].options.indexOf('Auto Assign')]; // this value must be instance of Menu component (bind this in submit property in menuSubmit rendering)
   auto = auto ? true : false; // Set auto assign to Boolean value
   let label = this.state.values[menus[this.type].options.indexOf('Name Labels')]; // this value must be instance of Menu component (bind this in submit property in menuSubmit rendering)
   label = label === 'name labels' ? true : false; // Set label to Boolean value
   let message = this.state.values[menus[this.type].options.indexOf('Messages')]; // this value must be instance of Menu component (bind this in submit property in menuSubmit rendering)
   message = message === 'messages' ? true : false; // Set messages to Boolean value
   switch (menuType) {
      case 'create':
         { // Game Title
            if (tInput) { // If title input exists
               if (!gametitle) { // If empty
                  ok = false;
                  issues.push({ ['game title']: 'Title cannot be left blank' });
                  // alert('Title cannot be left blank');
               } else {
                  for (let i = 0; i < games.length; i++) {
                     if (gametitle === games[i].info.title) { // Find matching title to another game
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
               if (width != height) {
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
            let color = 'black'; // eid('World color input').value.toLowerCase(); // Only black world is enabled
            createGame({
               title: gametitle,
               password: password,
               type: type,
               width: width,
               height: height,
               color: color,
               cap: cap,
               show: show,
               mode: mode,
               teamCount: teamCount,
               min: minimum
            });
            renderMenu('join', game); // Pass in game data for certain menu information
         } else {
            this.issue(issues);
         }
         break;
      case 'join':
         { // Screen Name
            if (!name) { // If screen name input is left empty
               ok = false;
               issues.push({ ['screen name']: 'Screen name cannot be left empty' });
               // alert('Screen name cannot be left empty');
            }
            for (let i = 0; i < game.info.count; i++) { // Requires game to be updated (in renderMenu(datA))
               if (name == game.board.list[i].name) { // Name cannot match another player's name
                  ok = false;
                  issues.push({ ['screen name']: 'Name matches that of another player' });
                  // alert('Name matches that of another player');
                  break;
               }
            }
         }
         // Skins
         if (skins.indexOf(skin) === -1 && skin !== 'none') { // If the skin value is not 'none' or any other possible skin (should never occur)
            ok = false;
            issues.push({ skin: 'There is an issue with the skin selection' });
         }
         { // Abilities
            if (game.info.mode === 'ffa' || game.info.mode === 'skm' || game.info.mode === 'srv' || game.info.mode === 'ctf' || game.info.mode === 'kth') { // FFA, SKM, SRV, CTF, and KTH all use standard ability set
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
            if (game.info.mode == 'skm' || game.info.mode == 'ctf') { // If is a team game
               if (!auto) {
                  for (let i = 0; i < game.teams.length; i++) {
                     if (i === teamColors.indexOf(team)) { // If i is selected team
                        continue;
                     }
                     if (game.teams[teamColors.indexOf(team)].length > game.teams[i].length) { // If there are more players on selected team than another
                        if (org && typeof team === 'string' && org.team === team) { // If player is already on selected team
                           break; // Allow spawn
                        }
                        ok = false;
                        issues.push({ ['auto assign']: 'Cannot join ' + team + ' team because it already has more players than ' + teamColors[i] });
                        // alert('Cannot join ' + team + ' team because it already has more players than ' + teamColors[i]);
                        break;
                     }
                  }
                  if (org && org.team !== team && game.teams[teamColors.indexOf(org.team)].length === game.teams[teamColors.indexOf(team)].length) {
                     ok = false;
                     issues.push({ ['auto assign']: 'Cannot join ' + team + ' team because it will have more players than ' + org.team });
                     // alert('Cannot join ' + team + ' team because it will have more players than ' + org.team);
                  }
               }
            }
         } { // Player Cap
            if (game.players.length >= game.info.cap) {
               ok = false;
               issues.push({ ['player cap']: 'Game is at maximum player capacity' });
               // alert('Game is at maximum player capacity');
            }
         } { // Game Closed
            let closed = true;
            for (let i = 0; i < games.length; i++) {
               if (games[i].info.host == game.info.host) {
                  closed = false;
                  break;
               }
            }
            if (closed) {
               ok = false;
               // issues.push({ ['']: 'The game has closed' }); // Empty quotes for game closed instance because it is not specific to a single input
               alert('The game has closed');
               renderTitle();
            }
         } { // Password
            socket.emit('Check Permission', { title: game.info.title, type: 'join' });
            socket.on('Permission Denied', deniedJoin.bind(this)); // Call bound function so this.issues() can be called from within
            socket.on('Permission Granted', grantedJoin.bind(this));

            function deniedJoin() {
               ok = false;
               if (password == '' || typeof password != 'string') {
                  ok = false;
                  issues.push({ ['password']: 'A password is required for this game' });
                  // alert('A password is required for this game');
               } else {
                  ok = false;
                  issues.push({ ['password']: 'Password is invalid' });
                  // alert('Password is invalid');
               }
               socket.removeListener('Permission Denied', deniedJoin.bind(this));
            }

            function grantedJoin() { // Function is defined locally so it cannot be called from the global scope (slightly better security)
               if (ok) { // Inside 'Permission Granted' so can only be triggered once 'Permission Granted' has been received
                  // Leaderboard
                  let already = false;
                  for (let i = 0; i < game.board.list.length; i++) {
                     if (game.board.list[i].player == socket.id) {
                        already = true;
                        break;
                     }
                  }
                  if (!already) {
                     game.board.list.push({
                        player: socket.id,
                        name: name,
                        kills: 0,
                        deaths: 0,
                        score: 0,
                        wins: 0
                     });
                  }
                  orderBoard(game.board.list);
                  socket.emit('Board', { list: game.board.list, host: game.board.host }); // Must be before spawn because only runs when first entering server, and spawn() runs on respawn as well
                  // Abilities
                  if (game.info.mode === 'ffa' || game.info.mode === 'skm' || game.info.mode === 'srv' || game.info.mode === 'ctf' || game.info.mode === 'kth') { // FFA, SKM, SRV, CTF, and KTH all use standard ability set
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
                  } else if (game.info.mode === 'inf') {
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
                     for (let i = 0; i < ability.shoot.value.length; i++) {
                        if (i == ability.tag.i) {
                           ability.shoot.can[i] = true;
                        } else {
                           ability.shoot.can[i] = false;
                        }
                        ability.shoot.value[i] = false;
                     }
                  }
                  // Team
                  if (game.info.mode === 'skm' || game.info.mode === 'ctf') { // If is a team game
                     ability.auto = auto; // auto variable is Boolean
                     if (auto) { // If auto assign is selected
                        let indices = [];
                        let minimum = Infinity;
                        for (let i = 0; i < game.teams.length; i++) { // Find team(s) with the fewest players and store their indices within game.teams array into indices array
                           if (game.teams[i].length < minimum) { // If length is less than minimum
                              minimum = game.teams[i].length; // Set length as new minimum
                              indices = [i]; // Clear indices and push i
                           } else if (game.teams[i].length == minimum) {
                              indices.push(i);
                           }
                        }
                        team = teamColors[indices[floor(random(0, indices.length))]]; // Set team to the team with the fewest players; If there are multiple, choose one at random
                     }
                     for (let i = 0; i < teamColors.length; i++) {
                        if (team === teamColors[i]) {
                           game.teams[i].push(socket.id); // Add player to selected team
                           console.log(state);
                           socket.emit('Teams', { teams: game.teams, host: game.info.host }); // Update server teams; host is for identification
                           break;
                        }
                     }
                  }
                  // Color
                  var color;
                  if (game.info.mode === 'inf') { // If inf mode
                     color = teamColorDef.green; // All players healthy by default
                  } else if (game.info.mode !== 'skm' && game.info.mode !== 'ctf' && eid('color input')) { // If is not a team game and there is a color input field
                     color = eid('color input').value.toLowerCase();
                  } else {
                     color = teamColorDef[team]; // Color must be after Team
                  }
                  // Initialize
                  clearInterval(title.interval);
                  if (game.rounds.util) {
                     if (game.rounds.waiting) {
                        initialize(game, { spectate: false, color: orgColors[game.world.color][color], skin: skin, team: team });
                     } else {
                        initialize(game, { spectate: true, color: orgColors[game.world.color][color], skin: skin, team: team });
                     }
                  } else {
                     initialize(game, { spectate: false, color: orgColors[game.world.color][color], skin: skin, team: team });
                  }
               } else {
                  this.issue(issues);
               }
            }
            socket.removeListener('Permission Granted', grantedJoin.bind(this));
         }
         break;
      case 'spectate':
         { // Game Closed
            let closed = true;
            for (let i = 0; i < games.length; i++) {
               if (games[i].info.host === game.info.host) {
                  closed = false;
                  break;
               }
            }
            if (closed) {
               ok = false;
               // issues.push({ ['']: 'The game has closed' });
               alert('The game has closed');
               renderTitle();
            }
         } { // Screen Name
            if (!name) {
               ok = false;
               issues.push({ ['screen name']: 'Screen name cannot be left empty' });
               // alert('Screen name cannot be left empty');
            }
            for (let i = 0; i < game.info.count; i++) { // Requires game to be updated (in renderMenu(datA))
               if (name === game.board.list[i].name) { // Name cannot match another player's name
                  ok = false;
                  issues.push({ ['screen name']: 'Name matches that of another player' });
                  // alert('Name matches that of another player');
                  break;
               }
            }
         } { // Password
            socket.emit('Check Permission', { title: game.info.title, type: 'spectate' });
            socket.on('Permission Denied', deniedSpectate.bind(this));
            socket.on('Permission Granted', grantedSpectate.bind(this));

            function deniedSpectate() {
               ok = false;
               if (!password) {
                  ok = false;
                  issues.push('A password is required for this game');
                  // alert('A password is required for this game');
               } else {
                  ok = false;
                  issues.push('Password is invalid');
                  // alert('Password is invalid');
               }
               socket.removeListener('Permission Denied', deniedSpectate.bind(this));
               this.issue(issues);
            }

            function grantedSpectate() {
               if (ok) { // Inside 'Permission Granted' so can only be triggered once 'Permission Granted' has been received
                  // Leaderboard
                  let already = false;
                  for (let i = 0; i < game.board.list.length; i++) {
                     if (game.board.list[i].player === socket.id) {
                        already = true;
                        break;
                     }
                  }
                  if (!already) {
                     game.board.list.push({ // Add player to leaderboard
                        player: socket.id,
                        name: name,
                        kills: 0,
                        deaths: 0,
                        score: 0,
                        wins: 0
                     });
                  }
                  orderBoard(game.board.list);
                  socket.emit('Board', { list: game.board.list, host: game.board.host }); // Must be before spawn because only runs when first entering server, and spawn() runs on respawn as well
                  // Initialize
                  clearInterval(title.interval);
                  initialize(game, { spectate: true, color: undefined, skin: undefined });
               } else {
                  this.issue(issues);
               }
               socket.removeListener('Permission Granted', grantedSpectate.bind(this));
            }
         }
         break;
      case 'respawn':
         if (skins.indexOf(skin) === -1 && skin !== 'none') // Skins
            ok = false;
            issues.push({ skin: 'There is an issue with the skin selection' });
         { // Abilities
            if (game.info.mode === 'ffa' || game.info.mode === 'skm' || game.info.mode === 'srv' || game.info.mode === 'ctf' || game.info.mode === 'kth') { // FFA, SKM, SRV, CTF, and KTH all use standard ability set
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
            if (game.info.mode === 'skm' || game.info.mode === 'ctf') { // If is a team game
               ability.auto = auto; // auto variable is Boolean
               if (!auto) { // If auto assign is not selected
                  for (let i = 0; i < game.teams.length; i++) {
                     if (i === teamColors.indexOf(team)) {
                        continue;
                     }
                     if (game.teams[teamColors.indexOf(team)].length > game.teams[i].length) { // If chosen team has greater players than another team
                        if (org && org.team === team && typeof team === 'string') { // If player is already on loaded team
                           break; // Allow respawn
                        } else {
                           ok = false; // Disallow respawn
                           issues.push({ ['team input']: 'Cannot join ' + team + ' team because it already has more players than ' + teamColors[i] });
                           // alert('Cannot join ' + team + ' team because it already has more players than ' + teamColors[i]);
                           break;
                        }
                     }
                     if (org && org.team !== team && game.teams[teamColors.indexOf(org.team)].length === game.teams[teamColors.indexOf(team)].length) { // If chosen team has equal players as current team (and is not current team)
                        ok = false; // Disallow respawn
                        issues.push({ ['team input']: 'Cannot join ' + team + ' team because it will have more players than ' + org.team });
                        // alert('Cannot join ' + team + ' team because it will have more players than ' + org.team);
                     }
                  }
               } else { // If auto assign is selected
                  let indices = [];
                  let minimum = Infinity;
                  for (let i = 0; i < game.teams.length; i++) { // Find team(s) with the fewest players and store their indices within game.teams array into indices array
                     let l = game.teams[i].length;
                     if (game.teams[i].indexOf(socket.id) != -1) { // If player is on given team
                        l--; // Do not include player as part of the team, so if even numbers before, will replace back on the same team and not add extra to other team
                     }
                     if (l < minimum) { // If length is less than minimum
                        minimum = l; // Set length as new minimum
                        indices = [i]; // Clear indices and push i
                     } else if (l == minimum) {
                        indices.push(i);
                     }
                  }
                  team = teamColors[indices[floor(random(0, indices.length))]]; // Set team to the team with the fewest players; If there are multiple, choose one at random
               }
            }
         } { // Game Closed
            let closed = true;
            for (let i = 0; i < games.length; i++) {
               if (games[i].info.host == game.info.host) {
                  closed = false;
                  break;
               }
            }
            if (closed == true) {
               ok = false;
               // issues.push({ ['']: 'The game has closed' });
               alert('The game has closed');
               renderTitle();
            }
         }
         if (ok) {
            socket.emit('Spectator Spawned', game);
            // Abilities
            if (game.info.mode === 'ffa' || game.info.mode === 'skm' || game.info.mode === 'srv' || game.info.mode === 'ctf' || game.info.mode === 'kth') { // FFA, SKM, SRV, CTF, and KTH all use standard ability set
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
            } else if (game.info.mode === 'inf') {
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
            if (game.info.mode === 'skm' || game.info.mode === 'ctf') { // If is a team game
               if (org.team !== team) { // Only add player to team if not already on team
                  game.teams[teamColors.indexOf(team)].push(socket.id); // Add player to selected team
                  game.teams[teamColors.indexOf(org.team)].splice(game.teams[teamColors.indexOf(org.team)].indexOf(socket.id), 1);
                  console.log(state);
                  socket.emit('Teams', { teams: game.teams, host: game.info.host }); // Host is for identification
               }
            }
            // Color
            if (game.info.mode === 'inf') { // If inf mode
               color = teamColorDef.green; // All players healthy by default
            } else if (game.info.mode !== 'skm' && game.info.mode !== 'ctf') { // If is not a team mode 
               color = eid('color input').value.toLowerCase();
            } else {
               color = teamColorDef[team]; // Color must be after Team
            }
            // Initialize
            initialize(game, { spectate: false, color: orgColors[game.world.color][color], skin: skin, team: team });
         } else {
            this.issue(issues);
         }
         break;
      case 'pauseGame':
         if (skins.indexOf(skin) === -1 || skin === 'none') // Skins
            issues.push({ skin: 'There is an issue with the skin selection' });
         { // Game Closed
            let closed = true;
            for (let i = 0; i < games.length; i++) {
               if (games[i].info.host === game.info.host) {
                  closed = false;
                  break;
               }
            }
            if (closed) {
               ok = false;
               // issues.push({ ['']: 'The game has closed' });
               alert('The game has closed');
               renderTitle();
            }
         }
         if (ok) {
            if (game.info.mode !== 'skm' && game.info.mode !== 'ctf') { // If is not a team mode
               org.color = orgColors[game.world.color][color]; // Set org color
            } // Cannot change team in pause menu
            org.skin = skin; // Set org skin
            Labels = label; // Set labels setting (Boolean)
            Messages = message; // Set messages setting (Boolean)
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
            ReactDOM.render(<CanvasCont />, eid('cont'));
         } else {
            this.issue(issues);
         }
         break;
      case 'pauseSpectate':
         { // Game Closed
            let closed = true;
            for (let i = 0; i < games.length; i++) {
               if (games[i].info.host === game.info.host) {
                  closed = false;
                  break;
               }
            }
            if (closed) {
               ok = false;
               // issues.push({ ['']: 'The game has closed' });
               alert('The game has closed');
               renderTitle();
            }
         }
         if (ok) {
            Labels = label; // Set name labels setting (Boolean)
            Messages = message; // Set messages setting (Boolean)
            state = 'spectate';
            ReactDOM.render(<CanvasCont />, eid('cont'));
         } else {
            this.issue(issues);
         }
         break;
      case 'pauseTutorial':
         if (ok) {
            state = 'tutorial';
            ReactDOM.render(<CanvasCont />, eid('cont'));
         } else {
            this.issue(issues);
         }
         break;
   }
}