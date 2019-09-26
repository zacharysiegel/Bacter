# Bacter

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
#### a3.2.0 - Presentability
      ✓ Populate README.md
      ✓ Add timeout for 'Permission Denied' and 'Permission Granted' to be closed regardless of server response to 'Check Permission'
      ✓ Improve build and start scripts (rename run.sh to start.sh)
      ✓ Encapsulate z.js into class Z
         ✓ Update occurances of z.js functions to Z.[function()]
      ✓ Update React lifecycle functions
      ✓ Add '4th Ability' row to Join Game Options menu with Spore checkbox always checked
      FIX game is closed when try to enter game - This error is not in a3.1.2
      FIX ability timers are black circle in tutorial - This error is not in a3.1.2
         Abilities are ineffectual
         Shoot works, kills cells, timer works, but ability not work
         Freeze timer works
      Fix bot does not appear in compress section of tutorial
      Fix white background when server closes from host leaving game
      Fix 'there is an issue with the skin detection' in respawn menu
      Fix game doesn't appear in browser if all players are dead
      Fix browser button inconsistent row background
      Fix crash when player kills himself with shoot
      Fix press enter in color picker joins game
      Fix name labels do not show while spectating
#### a3.3.0 - Capture the Flag
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
#### a3.4.0 - Infection
      INF
         Round system
            Randomize teams each round
         ✓ No friendly fire
         ✓ Tag
         Boost ability
#### a3.5.0 - King of the Hill
      KTH
         Round system
         Score counting - time
         Hill placement
#### a3.3.0 Quick Match
      Images for ability tooltips
      Add controls settings menu
         Ability keys
         Respawn key
         Pause key
      Add info menu
      Add popup info box
      Custom select menu
      ? Player minimum browser column
      Sparks skin
         On birth, release sparks particle effect
      Fix ctf base world corner rendering bug
#### aX.X.0 - Visual Enhancement
      Polygon skin
         Random number of vertices
         Random radians between using perlin noise
         Fill color
      Small square skin
         In effect, it is an inverted ghost skin
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
      Customize menu alerts
      Customize death alert
      Customize game ended alert
      Transparent pause menu
      Add music
      Add SFX
      Centralize hit detections and such at host
      Graphical overhaul
         World border
            If substance, can remove
         World substance
         Spore animations
         Secrete animations
            Inner circle expands through interval
         X Animation over selected abilities in chooseAbilities()
         Graphics settings/Performance levels
## Issues:
      Leaderboard flicker on new spectator bug (not big deal)
      Spectator has not yet been added to spectators array
