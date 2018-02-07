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
	Stunt:
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
	? Cloak
		Temporarily become invisible to opponents
			- Usage of abilities denied while stealthed
			- OR Usage of an ability disables cloak

## Bugs/Fixes:

## To-Do:
	2.1.0
		✔ Remove ability.index
		✔ Remove org.index
		✔ Fix Index Bug
		Add Leaderboard
			Add screen names
			Add screen name labels to orgs
		? Increase grow frames 100 --> 50
		Add substance to the world (background)
			Decoration
				? Grid
				? Dots
			Pickups that lower cooldowns
		Add 'pause' overlay menu
			Add 'Leave Game' option
			Add Settings menu
			ESC key
		? Add timers to red/green abilty markers
		Balance secretion radii on shoot and spore
		? Org border
		? Host does not play
			Centralized hit detections and such
		Add music
		Add SFX
		Add targeting info UI
		Add screen names which display on org in game
			Setting to turn off 'show names'
		? Do not automatically join game after creation
			? Countdown before join game
	3.0.0
		Graphical overhaul
			World border
				If substance, can remove
			World substance
			Spore animations
			Secrete animations
				Inner circle expands through interval
			Animation over selected abilities in chooseAbilities()
			Graphics settings/Performance levels