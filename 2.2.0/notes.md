# BACTER

## Movement:
	Target is centered in the screen
	Org spawns on target (in center screen)
	Rate of growth increases as cells approach target
		(Rate of growth decreases further from target)
	Rate of death decreases as cells approach target
		(Rate of death increases further from target)

## Abilities:
	Spore: (Ultimate)
		All exposed (membranal) cells jettison from org away from the center of org
	Secrete: (Ultimate)
		All non-enclosed (by friendly cells) cells secrete acid into adjacent 8 (or 4) regions
	X Stimulate:
		Accelerated Birth
		Effectively increases movement speed
	X Poison:
		X Accelerated Death
		Decelerated Birth
		Effectively decreases movement speed
	Immmortality:
		Halt Natural Death
			May still die from secretions
		Leaves trail of cells behind
			Allows for clever spore/secrete
			Blocks movement of opponents through trail
	Freeze (Formerly Stunt):
		Halt Birth and Death
		Effectively freezes org, halting movement
	X Speed:
		Increase Movement Speed
	X Slow:
		Slow Movement Speed
	Extend:
		Increase Living Range
		Increases Surface Area
			Increases Spore Count
	Compress:
		Decrease Living Range
		Decreases Surface Area
			Decreases Spore Count
	Neutralize:
		Neutralize all acid in a circular area surrounding the organism
			- By secreting a base
		Immortalizes cells within alkaline radius from acidic secretions
		Rendering - Circle around org
			X Circle around each cell
		No shoot
	Toxin: 
		Kill all enemy cells in a circular area surrounding the organism
			- By secreting a self-immune toxin
		Rendering - Circle around org
			X Circle around each cell
		No shoot
	? Cloak:
		Temporarily become invisible to opponents
			- Usage of abilities denied while stealthed
			- OR Usage of an ability disables cloak

## Game Modes (Coming Soon):
	Deathmatch Classic
		Boast the most kills and the least deaths (Constant-Action Brawl)
		Leaderboard tracks kills, deaths, and k:d
	Team Deathmatch
		Players are sorted into teams
		Players cannot harm teammates
		Leaderboard tracks team kills, team deaths, team k:d, kills, deaths, and k:d
	Survivor
		Last man standing wins
		What's done is done: Cannot respawn until game is completed
		Leaderboard tracks wins, kills, and deaths
	Compact (Survivor Sub-Mode)
		Akin to a battle royale game, the borders of the world slowly creep into the center until a lone survivor claims victory
		What's done is done: Cannot respawn until game is completed
		Leaderboard tracks wins, kills, and deaths

## To-Do:
	2.2.0 - Menus and Settings
		✔ Re-render browser instead of reload
			✔ Back button
			✔ Game Ended
		✔ Add leader column to browser
		✔ Add player cap column to browser
		✔ Add New Game Settings Menu
			✔ Enter game name
			✔ Square Dimensions
			✔ Player cap
			✔ World Color (Black or White)
			✔ Leaderboard Length
			✔ Placeholders show default - Apply value if left blank
		✔ Remove password column from browser
		✔ Add Join Game Settings Menu
			✔ Screen name
			✔ Password
			✔ Choose Color
			✔ Choose Abilities
			✔ Grid Texture
		✔ Add Spectate Menu
			✔ Screen name
			✔ Password
		✔ Permissed array in server passwords
		✔ Change all 'name' references to title
		✔ Change stunt to freeze
		✔ Add Respawn Menu
			✔ Choose Color
				✔ Default color in list is current org color
			✔ Choose Abilities
			✔ Grid Texture
		✔ Remove chooseAbilities() screen
		✔ Improve skill tooltip aesthetics on white
		✔ Improve kill tracking to last hit rather than finishing blow
		✔ Add new set of org colors for white world
		✔ Cannot spawn on toxin, secretion, or shoot secretion
		✔ Change browser from update games on every change to periodic interval to re-render browser
		✔ Add pause menu
			✔ Add 'Leave Game' option
		✔ Screen name labels on orgs
			✔ Option to turn off in pause menu
	3.0.0 - Game Modes
		Circular World option
			Add to new game settings
		Circular cells option
			Add to join game settings and pause
		Add Game Modes
			Add to new game settings
				Team colors (if applicable)
				Team count (if applicable)
			Add to join game settings
				Team (if applicable)
					Team color background of list
					Auto-assign (square button in row below team list that disables team list when selected)
			Deathmatch Classic
			Team Deathmatch
			Survivor
			Compact
		Add substance to the world (background)
			Decoration
				Add option to Create Game Settings Menu
				? Grid
				? Dots
			Pickups that lower cooldowns
			Pickups that increase radius
		Add controls customization
		windowResized() functionality in-game
		GitHub versioning improvement
		Leaderboard flicker on new spectator bug
	3.1.0 - Visual Enhancement
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
			Animation over selected abilities in chooseAbilities()
			Graphics settings/Performance levels