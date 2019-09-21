# Gameplay Guide

## Movement:
      Crosshair is centered in the screen
      Org spawns on the crosshair (in center screen)
      Org is attracted to the crosshair:
      Rate of growth increases as cells approach target
         (Rate of growth decreases further from target)
      Rate of death decreases as cells approach target
         (Rate of death increases further from target)

## Abilities:
      Each player has four abilities:
         At spawn, the player chooses three abilities with two options for each.
            Each of these three abilities has an offensive and a defensive option.
            The two options for an ability are more-or-less inverses of each other.
            The pairs of abilities are listed here with the defensive option first
               Extend       --  Compress
               Immortality  --  Freeze
               Neutralize   --  Toxin
         Every player can use the fourth ability (Spore) regardless of the abilities he chooses at spawn.
      Details for each ability are listed below
         The game modes which support an ability are listed next to the ability name
#### Extend (FFA, SKM, SRV)
      Increases the organism's equilibrium radius
      Increases the number of cells in an organism
         Harder to be killed
         Increases the number of cells jettisoned by Spore
      Default key binding: x
#### Compress (FFA, SKM, SRV)
      Decreases the organism's equilibrium radius
      Decreases the number of cells in an organism
         Easier to kill a Compressed enemy
      The effect is delivered to an enemy be shooting a border cell toward the player's cursor
         'Pop' the ejected spore by reactivating the ability (re-press the key)
      Default key binding: x
#### Immmortality (FFA, SKM, SRV)
      Halts the organism's cell's natural death
         Cells may still die from secretions from spores
      Leaves trail of cells behind
         Allows for clever Spore usage
         Blocks movement of opponents through trail
      Default key binding: c
#### Freeze (FFA, SKM, SRV)
      Halts all natural processes (both birth and death) of an enemy cell
      In effect, this ability freezes the affected organism, halting all movement
      The effect is delivered to an enemy be shooting a border cell toward the player's cursor
         'Pop' the ejected spore by reactivating the ability (re-press the key)
      Default key binding: c
#### Neutralize (FFA, SKM, SRV)
      Neutralize all acid in a circular area surrounding the organism
         In reality, this would occur by secreting a base
      Immortalizes cells within the alkaline radius from acidic secretions
      The neutral area is a circle around the center of mass of the organism
         In the future, several smaller circles may be created around each cell in the organism
      Default key binding: v
#### Toxin (FFA, SKM, SRV)
      Kill all enemy cells in a circular area surrounding the organism
         In reality, this is analagous to the organism secreting an acid
      Immortalizes cells within the alkaline radius from acidic secretions
      The neutral area is a circle around the center of mass of the organism
         In the future, several smaller circles may be created around each cell in the organism
      Default key binding: v
#### Spore (FFA, SKM, SRV)
      All exposed (membranal) cells jettison from org away from the center of org
      All ejected spores secrete acid into the surrounding region
         'Pop' spores by reactivating the ability (re-press the key)
      Default key binding: [Spacebar]

## Game Modes:
#### Free For All (FFA)
      Boast the most kills and the least deaths
      Leaderboard tracks kills, deaths, and k:d
#### Skirmish (SKM)
      Players are sorted into teams
         Players cannot harm teammates
      Leaderboard tracks team kills, team deaths, team k:d
#### Survival (SRV)
      Last man standing wins
      World border slowly creeps in
      What's done is done: Cannot respawn until game is completed
      Leaderboard tracks wins, kills
#### Capture the Flag (CTF) (Unreleased)
      Players are sorted into teams
         Players cannot harm teammates
      Spawn in random positions
      Each team has a colored base at corner of map
         Players capture single flag and return to base for capture
            Pick up flag by making contact with flag on body
         Flag returns to center of map after capture
         Flag drops at location of flag bearer on death
      Uses standard ability set
      X Tag ability (2-Flag CTF)
         X Shoot single spore and pop on enemy
         X If spore is on friendly side, send to jail
         X Safe zone around flag protects carrier
         X If holding the flag, throws the flag
      Leaderboard tracks captures (score) and round wins
#### Infection (INF) (Unreleased)
      Players sorted into infected and healthy
         One infected per eight healthy, round up
      Infected players are red, Healthy players are green
      Tag ability for infected
         Shoots single spore to pop on enemy
         On hit, healthy org dies, new infected org spawns
      Stimulate ability for healthy
         Increases birth/death rate
         Increases movement speed
      Infected players are zoomed in, so have less visibility to equalize power of tag
      Last man standing wins
      Leaderboard tracks wins
#### King of the Hill (KTH) (Unreleased)
      Players spawn on outsides of map
      Region in center of the map
         Region is same shape as map
      When player enters empty region, player becomes king
         Region stroke becomes very wide to idicate capture
         If player leaves region, he loses kingship
            Closest player to center becomes new king
         Score is 1 : 3 seconds as king
      Leaderboard tracks score and round wins
