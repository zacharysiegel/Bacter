# Notes

## Abilities:
#### X Stimulate (OLD):
      Accelerated Birth
      Effectively increases movement speed
#### X Poison:
      X Accelerated Death
      Decelerated Birth
      Effectively decreases movement speed
#### X Speed:
      Increase Movement Speed
#### X Slow:
      Slow Movement Speed
#### Stimulate: (CTF)
      Increases birth/death rate
      Increases movement speed
#### Tag: (CTF)
      Shoot single spore to pop on enemy
#### ? Cloak:
      Temporarily become invisible to opponents
         - Usage of abilities denied while stealthed
         - OR Usage of an ability disables cloak
#### ? Hook:
      Send line skill shot to another to opponent
      On hit, pulls opponent toward player

## Game Modes:
#### ? Freeze Tag (FZT)
      Use freeze ability only
      Freezes org indefinately until:
         ? Teammate makes contact
         ? Teammate tags with tag ability
            Could be same ability key as freeze or second tag ability
#### ? Territories (TRT)
      Players are assigned a small circular territory at spawn

## To-Do:
#### a3.1.3 - Presentability
      ✓ Improve documentation
         ✓ README.md
         ✓ New license
         ✓ Gameplay Guide
         ✓ Usage Guide
      ✓ Add timeout for 'Permission Denied' and 'Permission Granted' to be closed regardless of server response to 'Check Permission'
      ✓ Improve build and start scripts (rename run.sh to start.sh)
      ✓ Encapsulate z.js into class Z
         ✓ Update occurances of z.js functions to Z.[function()]
      ✓ Update React lifecycle functions
      ✓ Add '4th Ability' row to Join Game Options menu with Spore checkbox always checked
      ✓ Encapsulate game.js into class Game
         ✓ static game variable (game -> Game.game)
      ✓ Encapsulate permission stuff into Permissions class
      ✓ Encapsulate server-side game info into Games class
      ✓ Encapsulate socket.io emit listeners into SocketListener class
      ✓ Encapsulate cell.js into class Cell
      ✓ Encapsulate flag.js into class Flag
      ✓ Cell.equals comparison with tolerance
      ✓ Compartmentalize server into modules
      ✓ Optimize Org.getRegionInfo
         ✓ Convert all regions to sets (no order + no duplication)
      ✓ On mouse over list inputs, change pointer to click
      ✓ On mouse over radio inputs, change pointer to click
      ✓ Fix no break out of submit menu switch
      ✓ Fix occasional client doesn't receive 'Games' interval emission
      ✓ Fix frequent client reconnection
      ✓ Fix org update on title screen
      ✓ Fix unnecessary 'check permission' emit before issue(issue) is invoked
      ✓ Fix flag socket reception bug
      ✓ FIX game is closed when try to enter game
         ✓ games is empty array
         ✓ grantedJoin is not called
         ✓ org.cell is recursively defined -- causes problems when sent through socketio
         ✓ socket.on('Create Game') not called when Game.createGame is called
         ✓ socket.emit (client) doesnt work inside setInterval
      ✓ FIX screen is white when entering game
      ✓ FIX title screen org life
      ✓ FIX incorrect movement
      ✓ FIX cpu/ram strain on title screen after few seconds
      ✓ FIX ability timers are black circle in tutorial
      ✓ FIX Pause game menu resets color and skin values
      ✓ FIX freeze on second user's connection
      ✓ FIX 'Game Closed' on join
      FIX Game.game is not updated when player leaves game
         Still 2 players
         Still 2 orgs
         Count still 2
         Still 2 abilities
         Only board.list is 1
      FIX 'There is an issue with skin selection' in spectate join menu
      FIX Title background is white after game closes forcibly
      FIX Tutorial white ghost
      FIX Orgs overlap
      FIX Abilities are ineffectual against tutorial bots
         Shoot works, kills cells, timer works, but ability not work
      Clean up code
         Compartmentalize submit.js
         Compartmentalize config.js
            Convert to JSON
         Encapsulate messages.js into class Messages
         Encapsulate org.js into class Org
         Convert Games class (server-side) to array of Game class instances
#### a3.1.4 - Optimization
    Store games in map where host socket.id is key
    Rename game.info.count to game.info.player_count
    Add field game.info.user_count
    Add field game.info.spectator_count
        Getter with user - player subtraction
    In each cell in an organism, store a pointer to the 4/8 surrounding cells
        Convert org.cells to a map
    Write a removePlayer function within game
        Code consistency and reuse and easier debugging
        Call in listen_leave_game
    Write a removeSpectator function within game
        Code consistency and reuse and easier debugging
        Call in listen_leave_game
    Optimize Org.birth
    Optimize Org.naturalDeath
        Store in each cell a number corresponding to its index in its org's cells array
            This allows for O(1) cell lookup in org's cells array
            Currently O(n)
            Optimizes more than just Org.naturalDeath, so for loops can be removed across project
            A map can also be used (normal JS object)
                Each cell must have a unique string identifier to use as a key
                    key: `x,y` , value: {Cell}
                    The above format allows each cell to easily point to the surrounding cells without knowing if they exist
    Optimize Org.renderAll
        Start from exposed cell and render a rectangle across until reaching another exposed cell
    Create a maximum distance away from world border which a spectator can move
    Fix cannot respawn after dying in tutorial
    Fix bot does not appear in compress section of tutorial
    Fix white background when server closes from host leaving game
    Fix 'there is an issue with the skin detection' in respawn menu
    Fix game doesn't appear in browser if all players are dead
    Fix browser button inconsistent row background
    Fix crash when player kills himself with shoot
    Fix press enter in color picker joins game
    Fix name labels do not show while spectating
    Fix create game submit button runs submit twice
#### a3.2.0 - Capture the Flag
      Fix ctf base world corner rendering bug
      CTF
         ✓ Round system
            Round end at 3 captures
         ✓ No friendly fire
         ✓ Tag
         ✓ Larger minimum world
         ✓ Random spawn
         ✓ Color team bases
         Flag placement
         Base collision detection
#### a3.3.0 - Infection
      INF
         Round system
            Randomize teams each round
         ✓ No friendly fire
         ✓ Tag
         Boost ability
#### a3.4.0 - King of the Hill
      KTH
         Round system
         Score counting - time
         Hill placement
#### aX.X.X
      Flow -- Static type checker for JavaScript
         npm install --save-dev flow-bin
         npm install --save-dev @babel/preset-flow
      OR TypeScript -- Compiled JavaScript
         npm install --save-dev typescript
         npx tsc --init
      Enumify -- Enums for JavaScript
         Enum for Game.state
      RethinkDB -- Realtime database
      Convert 'games' array into hash table
      Convert 'securities' array into hash table
      Encrypt passwords when sending to server
         Client encrypts password, sends to server
         Server encrypts encrypted password, sends to client
         Client decrypts doubly-encrypted password, sends to server
         Server decrypts encrypted password, stores value as hash (bCrypt)
      Add controls settings menu
         Ability keys
         Respawn key
         Pause key
         Pass in callback function for the menu to call when clicking 'back' or 'submit'
      Polygon skin
         Random number of vertices
         Random radians between using perlin noise
         Fill color
      Small square skin
         In effect, it is an inverted ghost skin
      Sparks skin
         On birth, release sparks particle effect
      ? Player minimum browser column
      Players / Player Maximum column
      Fullscreen button
      Mouse click, in, and out behavior correction
         Do not change background color on mouse down, only on mouse hover
      More applicable freeze tooltip art
      Images for tooltip art
         Higher detail/resolution
      Add substance to the world (background)
         Pickups that lower cooldowns
         Pickups that increase radius
      Spores decelerate over time (Friction)
         Constant acceleration - Integrate
      When spores die, shrink radius
         Delete spore when radius is less than one pixel
      When secretions end, shrink radius
         Delete when radius is less than one pixel
      Images for ability tooltips
      Add info menu
      Add popup info box
      Custom select menu
      Customize menu alerts
      Customize death alert
      Customize game ended alert
      Transparent pause menu
      Add music
      Add SFX
      ? Centralize hit detections and such at host
      Graphical overhaul
         World border
            If substance, can remove
         World substance
         Spore animations
         Secrete animations
            Inner circle expands through interval
         X Animation over selected abilities in chooseAbilities()
         Graphics settings/Performance levels
