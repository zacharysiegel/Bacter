var menus = {
   create: {
      header: 'Game Creation Options',
      button: 'Create',
      options: [ 'Game Title', 'Password', 'World Type', 'World Width', 'World Height', 'Player Minimum', 'Player Cap', 'Team Count', 'Leaderboard Length', 'Game Mode' ],
      values:  [ 'text',       'text',     'list',       'number',      'number',       'number',         'number',     'number',     'number',             'list'      ]
   },
   join: {
      header: 'Join Game Options',
      button: 'Join',
      options: [ 'Screen Name', 'Password', 'Color', 'Skin',    '1st Ability', '2nd Ability', '3rd Ability', 'Team', 'Auto Assign' ],
      values:  [ 'text',        'text',     'list',  '3 radio', '2 radio',     '2 radio',     '2 radio',     'list', '1 radio'     ]
   },
   spectate: {
      header: 'Spectate Game Options',
      button: 'Spectate',
      options: [ 'Screen Name', 'Password' ],
      values:  [ 'text',        'text'     ]
   },
   respawn: {
      header: 'Spawn Options',
      button: 'Spawn',
      options: [ 'Color', 'Skin',    '1st Ability', '2nd Ability', '3rd Ability', 'Team', 'Auto Assign', 'Leave Game' ],
      values:  [ 'list',  '3 radio', '2 radio',     '2 radio',     '2 radio',     'list', '1 radio'    , 'button'     ]
   },
   pauseGame: {
      header: 'Pause Options',
      button: 'Apply',
      options: [ 'Color', 'Skin',    'Name Labels', 'Messages', 'Leave Game' ],
      values:  [ 'list',  '3 radio', '1 radio',     '1 radio',  'button'     ]
   },
   pauseSpectate: {
      header: 'Pause Options',
      button: 'Apply',
      options: [ 'Name Labels', 'Messages', 'Leave Game' ],
      values:  [ '1 radio',     '1 radio',  'button'     ]
   },
   pauseTutorial: {
      header: 'Pause Options',
      button: 'Back',
      options: [ 'Leave Tutorial' ],
      values:  [ 'button'     ]
   }
};

function renderMenu(type, data) {
   if (state.indexOf('Menu') !== -1 && type !== state.slice(0, -4)) { // If current state is a menu and menu to be rendered is a different menu, unmount menu and re-render
      ReactDOM.unmountComponentAtNode(eid('cont')); // Must first unmount component so Menu() will construct new instance rather than re-rendering (easier than re-constructing in componentWillReceiveProps() when rendering a menu from another menu)
   }
   ReactDOM.render(<Menu type={type} data={data} />, eid('cont')); // Render instance of Menu component class in container with id 'cont'
   state = type + 'Menu'; // Game state - not component state
}
