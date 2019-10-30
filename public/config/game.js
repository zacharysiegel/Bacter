config.game = {
   skins: [ 'grid', 'circles', 'ghost' ],

   modes: {
      ffa: 'Free for All',
      skm: 'Skirmish',
      srv: 'Survival',
      ctf: 'Capture the Flag',
      inf: 'Infection',
      kth: 'King of the Hill'
   },

   firsts:  [ 'Extend',      'Compress' ],
   seconds: [ 'Immortality', 'Freeze'   ],
   thirds:  [ 'Neutralize',  'Toxin'    ],
   fourths: [ 'Spore' ],   // There is only one 4th ability, but we use an array to remain consistant with other abilities

   ability_count: 4,       // Number of abilities
   org_frequency: 70,      // Org update frequency
   render_frequency: 40,   // Rendering update frequency
   default_range: 50,      // Org default maximum size
   cell_width: 6,          // Width of single cell (pixels)
   move_speed: 1.7,        // Crosshair movement speed
   spectate_speed: 2.5,    // Crosshair movement speed in spectate mode
   round_delay: 10000,     // Delay time (in milliseconds) before survival round starts
   dummy_count: 10,        // Number of dummy orgs in title screen
   margin_width: 25,       // Title screen margin

   defaults: {
      world_width:  800,
      world_height: 800,
      player_cap:   16,
      player_min:   2, // TODO: Reset to 4
      board_length: 10,
      team_count:   2
   }
};
