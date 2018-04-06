# BACTER Change Log

	NOTE: Logs before version 1.1.2 are incomplete or inaccurate

## 1.0.0
	Initial Build

## 1.1.0
	ADDED spectate mode
	ADDED password protection option to games
	ADDED denial of movement over world border
	ADDED server browser information
	ADDED cannot spawn over opponent org
	CHANGED frame rate (increased)
	FIXED chooseAbilities() translation issue
	BALANCED ability durations and cooldowns

## 1.1.1
	FIXED spore/secrete lag issue
	FIXED flicker issue
	FIXED server crash issue

## 1.1.2
	ADDED cannot spawn outside world boundary
	ADDED heroku support
	ADDED Procfile
	ADDED app.json
	ADDED .profile
	CHANGED world border width (smaller)
	FIXED npm initialization
	FIXED server browser row coloration

## 2.0.0
	ADDED neutralize
	ADDED toxin
	ADDED shoot skillshot mechanic
	ADDED shoot ability timers
	ADDED world dots (decoration)
	ADDED dot eat/replace mechanic
	ADDED footer with online clients counter
	REMOVED stimulate
	REMOVED poison
	REMOVED 'you are dead' text
	CHANGED stunt mechanic to halt natural death as well as birth (effective freze)
	CHANGED poison mechanic (accelerated death --> decelerated birth)
	CHANGED cell width (7px --> 6px);
	CHANGED movement speed (2.5px/frame --> 2px/frame)
	CHANGED spore frame rate (increased)
	CHANGED secrete timer animation
	CHANGED org aesthetics (stroke on cells to fill gaps)
	CHANGED browser aesthetics
	FIXED spore lag issue
	FIXED join/spectate click mousedown script
	FIXED browser row bug
	FIXED favicon issue
	BALANCED secretion duration (decreased)
	BALANCED extend/compress durations (decreased)
	BALANCED stimulate/poison factors (increased)
	BALANCED ability cooldowns

## 2.1.0
	ADDED leaderboard
	ADDED kill/death counters
	ADDED screen names
	ADDED screen name label when targeting
	ADDED more org colors
	ADDED space bar spawn in ability choosing menu
	REMOVED dots
	FIXED spawn without picking three abilities
	FIXED index death/crash bug
	FIXED render layering bug

## 2.1.1
	CHANGED runs per second of growth interval (100 --> 80)
	CHANGED host server info to show screen name of host
	FIXED spawn crash bug
	FIXED two death bug
	FIXED cannot spawn over opponent org
	FIXED leaderboard cover end of long name

## 2.1.2
	ADDED popunder advertising

## 2.2.0
	ADDED game creation options menu
	ADDED join game options menu
	ADDED spectate game options menu
	ADDED respawn options menu
	ADDED pause options menus
	ADDED world size customization
	ADDED world color customization
	ADDED player cap customization
	ADDED leaderboard length customization
	ADDED player color customization
	ADDED player grid texture customization
	ADDED ability selection to join and respawn menus
	ADDED leave game option
	ADDED player name labels
	ADDED player name label toggle option
	ADDED leader column to browser
	ADDED player cap column to browser
	ADDED peacock color option to white world
	ADDED burnt color option to white world
	ADDED forest color option to white world
	REMOVED ability selection screen
	REMOVED password entry column from browser
	REMOVED display of spectators in leaderboard
	REMOVED turquoise color
	REMOVED kiwi color
	CHANGED 'Screen Name' to 'Player' in leaderboard head
	CHANGED stunt ability name to 'freeze' (no mechanical change)
	CHANGED game 'name' to 'title'
	CHANGED header height (36px --> 32px)
	CHANGED password protection security (more secure)
	CHANGED browser re-rendering (no reload)
	CHANGED browser updating method
	CHANGED browser aesthetics
	CHANGED skill tooltip and timer aesthetics
	FIXED browser event listener stacking
	FIXED spawn over toxin and secretions
	FIXED non-removal of passwords on server after game close
	FIXED premature showing of game in browser
	FIXED game closure recurrance issue
	FIXED spore color initialization issue
	FIXED death crossover issue
	BALANCED extend time (4000ms --> 4500ms)
	BALANCED compress time (3000ms --> 3500ms)
	BALANCED immortality cooldown (4000ms --> 3500ms)

## 3.0.0
	ADDED skirmish game mode
	ADDED game mode column to browser
	ADDED tag ability (ctf + inf)
	ADDED rectangular world option
	ADDED elliptical world option
	ADDED circles skin
	ADDED game backdrop color
	ADDED menu responsivity (restructure depending on selections)
	ADDED window resizing functionality when in game
	ADDED name label character limit (20)
	REMOVED world border movement block
	REMOVED leader column from browser
	CHANGED menu buttons' cursors to pointer
	CHANGED lake color (lighter)
	CHANGED pink color name to petal
	CHANGED skin selection style in menus
	CHANGED name label positioning function (square approx. --> circle approx.)
	FIXED spectate random positioning after death
	FIXED extend and compress non-cancelation
	FIXED closed game spectate attempt bug
	FIXED rare rapid growth bug
	FIXED game closure menu bug
	BALANCED spore range (2200ms --> 1900ms)