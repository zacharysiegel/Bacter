# BACTER

## Movement:
   Crosshair is centered in the screen  
   Org spawns on the crosshair (in center screen)  
   Org is attracted to the crosshair:  
   Rate of growth increases as cells approach target  
      (Rate of growth decreases further from target)  
   Rate of death decreases as cells approach target  
      (Rate of death increases further from target)  

## Abilities:
   Spore: (Ultimate)  
      All exposed (membranal) cells jettison from org away from the center of org  
   Secrete: (Ultimate)  
      All non-enclosed (by friendly cells) cells secrete acid into adjacent 8 (or 4) regions  
   X Stimulate (OLD):  
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
   Freeze: (Formerly Stunt):  
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
   Tag:  
      Shoot single spore to pop on enemy  
   Stimulate (NEW):  
      Increases birth/death rate  
      Increases movement speed  
   ? Cloak:  
      Temporarily become invisible to opponents  
         - Usage of abilities denied while stealthed  
         - OR Usage of an ability disables cloak  
   ? Hook:  
      Send line skill shot to another to opponent  
      On hit, pulls opponent toward player  

## Game Modes:
   Free For All (FFA)  
      Boast the most kills and the least deaths  
      Leaderboard tracks kills, deaths, and k:d  
   Skirmish (SKM)  
      Players are sorted into teams  
         Players cannot harm teammates  
      Leaderboard tracks team kills, team deaths, team k:d  
   Survival (SRV)  
      Last man standing wins  
      World border slowly creeps in  
      What's done is done: Cannot respawn until game is completed  
      Leaderboard tracks wins, kills  
   Capture the Flag (CTF)  
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
   Infection (INF)  
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
   King of the Hill (KTH)  
      Players spawn on outsides of map  
      Region in center of the map  
         Region is same shape as map  
      When player enters empty region, player becomes king  
         Region stroke becomes very wide to idicate capture  
         If player leaves region, he loses kingship  
            Closest player to center becomes new king  
         Score is 1 : 3 seconds as king  
      Leaderboard tracks score and round wins  
   ? Freeze Tag (FZT)  
      Use tag ability with freeze item art and similar  
   ? Territories (TRT)  
      Players are assigned a small circular territory at spawn  

## Issues:
   Leaderboard flicker on new spectator bug (not big deal)  
      Spectator has not yet been added to spectators array  

## To-Do:
   a3.2.0 - Capture the Flag  
      ✓ Populate README.md  
      ✓ Add timeout for 'Permission Denied' and 'Permission Granted' to be closed regardless of server response to 'Check Permission'  
      Fix 'there is an issue with the skin detection' in respawn menu  
      Fix game doesn't appear in browser if all players are dead  
      Fix browser button inconsistent row background  
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
   a3.3.0 - Infection  
      INF  
         Round system  
            Randomize teams each round  
         ✓ No friendly fire  
         ✓ Tag  
         Boost ability  
   a3.4.0 - King of the Hill  
      KTH  
         Round system  
         Score counting - time  
         Hill placement  
   a3.3.0 Quick Match  
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
   aX.1.0 - Visual Enhancement  
      Polygon skin  
         Random number of vertices  
         Random radians between using perlin noise  
         Fill color  
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
