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
      header: 'Respawn Options',
      button: 'Respawn',
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
      button: 'Apply',
      options: [ 'Leave Game' ],
      values:  [ 'button'     ]
   }
};

function renderMenu(typE, datA) {
   if (state.indexOf('Menu') !== -1 && typE !== state.slice(0, -4)) { // If current state is a menu and menu to be rendered is a different menu, unmount menu and re-render
      ReactDOM.unmountComponentAtNode($('cont')); // Must first unmount component so Menu() will construct new instance rather than re-rendering (easier than re-constructing in componentWillReceiveProps() when rendering a menu from another menu)
   }
   ReactDOM.render(<Menu type={typE} data={datA} />, $('cont')); // Render instance of Menu component class in container with id 'cont'
   state = typE + 'Menu'; // Game state - not component state
}

class Menu extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         instances: [], // Array of instances which should be displayed
         values: Array(menus[props.type].options.length).fill(''), // Array of input values; includes all possible inputs, not just those rendered
         issues: Array(menus[props.type].options.length + 1).fill([]) // +1 because issues includes issues which do not apply to any one instance
      }; // Component state - not game state
      this.type = props.type;
      this.data = props.data;

      this.instantiate = this.instantiate.bind(this);
      this.update = this.update.bind(this);
      this.issue = this.issue.bind(this);
      if (this.type === 'join' || this.type === 'spectate' || this.type === 'respawn') {
         game = props.data;
      } // join, spectate, and respawn are the only menu types which use the data property
      this.instantiate(); // Set initial instances
   }

   instantiate() { // Set initial instances of menus; called only inside constructor (do not use setState(), change state literally)
      let insts = menus[this.type].options.map(op => op.toLowerCase()); // Set instances to all possible options to start
      switch (this.type) {
         case 'create':
            insts.splice(insts.indexOf('player minimum'), 1); // Remove player min (ffa is selected by default)
            insts.splice(insts.indexOf('team count'), 1); // Remove team count (ffa is selected by default)
            break;
         case 'join':
            if (!this.data.info.protected || this.data.info.host === socket.id) // If the game is not password-protected; If player is host (If player just created the game and is now joining his own game)
               insts.splice(insts.indexOf('password'), 1); // Remove the password input (there is no password necessary) (may be confusing if not removed)
            switch (this.data.info.mode) { // Data is game object; instances of join menu are determined by game mode
               case 'ffa':
                  insts.splice(insts.indexOf('team'), 1); // Remove team selection (not team mode)
                  insts.splice(insts.indexOf('auto assign'), 1); // Remove auto assign to team (not team mode)
                  break;
               case 'skm':
                  insts.splice(insts.indexOf('color'), 1); // Remove color selection (color set by team selection)
                  break;
               case 'srv':
                  insts.splice(insts.indexOf('team'), 1); // Remove team selection (not team mode)
                  insts.splice(insts.indexOf('auto assign'), 1); // Remove auto assign to team (not team mode)
                  break;
               case 'ctf':
                  insts.splice(insts.indexOf('color'), 1); // Remove color selection (color set by team selection)
                  break;
               case 'inf':
                  insts.splice(insts.indexOf('color'), 1); // Remove color selection (color set by assigned infected status)
                  insts.splice(insts.indexOf('team'), 1); // Remove team selection (not team mode)
                  insts.splice(insts.indexOf('auto assign'), 1); // Remove auto assign to team (not team mode)
                  break;
               case 'kth':
                  insts.splice(insts.indexOf('team'), 1); // Remove team selection (not team mode)
                  insts.splice(insts.indexOf('auto assign'), 1); // Remove auto assign to team (not team mode)
                  break;
            }
            break;
         // case 'spectate': break; // All possible optons are always used in spectate menu
         case 'respawn':
            switch (this.data.info.mode) { // Data is game object; instances of join menu are determined by game mode
               case 'ffa':
                  insts.splice(insts.indexOf('team'), 1); // Remove team selection (not team mode)
                  insts.splice(insts.indexOf('auto assign'), 1); // Remove auto assign to team (not team mode)
                  break;
               case 'skm':
                  insts.splice(insts.indexOf('color'), 1); // Remove color selection (color set by team selection)
                  break;
               case 'srv':
                  insts.splice(insts.indexOf('team'), 1); // Remove team selection (not team mode)
                  insts.splice(insts.indexOf('auto assign'), 1); // Remove auto assign to team (not team mode)
                  break;
               case 'ctf':
                  insts.splice(insts.indexOf('color'), 1); // Remove color selection (color set by team selection)
                  break;
               case 'inf':
                  insts.splice(insts.indexOf('color'), 1); // Remove color selection (color set by assigned infected status)
                  insts.splice(insts.indexOf('team'), 1); // Remove team selection (not team mode)
                  insts.splice(insts.indexOf('auto assign'), 1); // Remove auto assign to team (not team mode)
                  break;
               case 'kth':
                  insts.splice(insts.indexOf('team'), 1); // Remove team selection (not team mode)
                  insts.splice(insts.indexOf('auto assign'), 1); // Remove auto assign to team (not team mode)
                  break;
            }
            break;
         case 'pauseGame':
            switch (this.data.info.mode) { // Data is game object; instances of join menu are determined by game mode
               case 'skm': // If players are sorted into teams/groups
               case 'ctf':
               case 'inf':
                  insts.splice(insts.indexOf('color'), 1); // Remove color selection (color set automatically)
                  break;
            }
            break;
         // case 'pauseSpectate': break; // All possible optons are always used in pause spectate menu
         // case 'pauseTutorial': break; // All possible optons are always used in pause tutorial menu
      }
      this.state.instances = insts; // Only set state value literally in constructor, else use setState()
   }
   update(instance, valuE) { // The purpose of update is to update the state of the menu depending on input values
      let value = valuE;
      let insts = menus[this.type].options.map(op => op.toLowerCase()); // Set local instances to lowercase options
      let vals = this.state.values;
      let index = menus[this.type].options.indexOf(capitalize(instance));
      let elt = $(instance + ' input'); // DOM node of instance input
      let wInput = $('world width input'); // Width input DOM node
      let hInput = $('world height input'); // Height input DOM node
      let pmInput = $('player minimum input'); // Player minimum input DOM node
      let tcInput = $('team count input'); // Team count input DOM node
      let teamInput = $('team input'); // Team selections input DOM node
      let wI = menus[this.type].options.indexOf('World Width'); // Width input index (options and state values)
      let hI = menus[this.type].options.indexOf('World Height'); // Height input index (options and state values)
      let pmI = menus[this.type].options.indexOf('Player Minimum'); // Player minimum input index (options and state values)
      let tcI = menus[this.type].options.indexOf('Team Count'); // Team count input index (options and state values)
      if (menus[this.type].values[index] === 'number') { // Special editorial actions for number inputs only
         value = parseFloat(value) ? parseFloat(value) : 0;
         if (value % 1 !== 0) { // If value is not an integer, set it to the greatest integer
            value = floor(value);
         }
      }
      vals[index] = value; // Update input value
      switch (instance) {
         case 'world width':
            vals[hI] = value; // Set world height value to given world width value (hI is hInput index in options array)
            break;
         case 'world height':
            vals[wI] = value; // Set world width value to given world height value (wI is wInput index in options array)
            break;
         case 'player minimum':
            if (tcInput && parseFloat(vals[tcI]) > value) // If team count is greater than player minimum
               vals[tcI] = value; // Reduce team count to player minimum value (tcI is tcInput index in options array)
            break;
         case 'team count':
            if (pmInput && parseFloat(vals[pmI]) > value) // If player minimum is greater than team count
               vals[pmI] = value; // Reduce player minimum to team count (pmI is pmInput index in options array)
            break;
         case 'game mode': // Updates based upon game mode input changes
            // Set displayed instances and special attributes
            if (wInput) wInput.min = 300; // Set default width minimum value
            if (hInput) hInput.min = 300; // Set default height minimum value
            switch (value) {
               case 'ffa':
                  insts.splice(insts.indexOf('player minimum'), 1); // Remove player min
                  insts.splice(insts.indexOf('team count'), 1); // Remove team count
                  break;
               case 'skm':
                  insts.splice(insts.indexOf('player minimum'), 1); // Remove player min
                  insts.splice(insts.indexOf('leaderboard length'), 1); // Remove leaderboard length
                  break;
               case 'srv':
                  insts.splice(insts.indexOf('team count'), 1); // Remove team count
                  break;
               case 'ctf':
                  insts.splice(insts.indexOf('leaderboard length'), 1); // Remove leaderboard length
                  if (wInput) wInput.min = 700; // Dimensional minimums increase in ctf mode
                  if (hInput) hInput.min = 700;
                  break;
               case 'inf':
                  insts.splice(insts.indexOf('team count'), 1); // Remove team count
                  break;
               case 'kth':
                  insts.splice(insts.indexOf('team count'), 1); // Remove team count
                  break;
            }
            this.setState({ instances: insts });
            break;
         case 'auto assign':
            if (value) teamInput.disabled = true; // If auto assign is selected, disable team selection input
            else teamInput.disabled = false;
            break;
      }
      for (let i = 0; i < vals.length; i++) {
         if (vals[i] === 0) // If number (only number because of type comparison in ===) input value is 0 or empty (if empty would have already converted to 0)
            vals[i] = ''; // Replace with an empty string so placeholder is rendered instead of 0
      }
      this.setState({ values: vals }); // Update values in state
   }
   issue(issues) { // issues: Array[ { instance: 'message' } ]
      let iss = issues;
      let count = iss.length;
      let stateIssues = []; // Issues array to be stored in state: Array1[ Array2[ 'message0', ..., 'messageN' ] ] (index of Array1 refers to instance as in options array) (different format than incoming issues)
      for (let i = 0; i < menus[this.type].options.length; i++) {
         let instance = menus[this.type].options[i].toLowerCase(); // Save instance value from options into instance variable
         stateIssues.push([]); // There exists an issues array for each possible option
         for (let j = 0; j < count; j++) {
            if (getKeys(iss[j])[0] === instance) { // If instance of issue is instance from options array
               stateIssues[i].push(iss[j][instance]); // Add issue to messages array within instance index of state issues array
               iss.splice(j, 1); // Remove issue from inputted issues array so it is not unnecessarily looped through
               count--; // count must be reduced since length of iss is reduced
               j--; // j must be reduced since the entire array is shifted back after splicing, so j need not be incremented (always do this after splicing iterated array)
            }
         }
      }
      if (iss.length) { // If there are any remaining issues (issues with instance '' which do not apply to any single input)
         stateIssues.push([]); // Add an option non-specific array to the end of state issues to be rendered at the end of the menu
         for (let i = 0; i < count; i++) { // count is the number of remaining issues
            let key = getKeys(iss[i])[0];
            stateIssues[stateIssues.length - 1].push(iss[i][key]); // Add reamining issues to last index of state issues array because they are displayed after all other issues at the bottom of the menu
         }
      }
      this.setState({ issues: stateIssues });
   }

   render() {
      let rows = [];
      for (let i = 0; i < menus[this.type].options.length; i++) {
         let instance = menus[this.type].options[i].toLowerCase(); // instance: name of input for identification purposes
         if (this.state.instances.indexOf(instance) === -1) { // If local instance is not found within stated instances of the menu
            continue; // it should not be rendered in the menu
         } // Allows menus[type].xxxx[i] to be used in this loop without having to check if it should exist within the menu
         let input;
         if (menus[this.type].values[i] === 'text') {
            input = <Text   key={instance} menuType={this.type} instance={instance} value={this.state.values[i]} update={this.update} submit={submit.bind(this)} />; // menuType: which menu is to be rendered
         } else if (menus[this.type].values[i] === 'number') {
            input = <Num    key={instance} menuType={this.type} instance={instance} value={this.state.values[i]} update={this.update} submit={submit.bind(this)} />;
         } else if (menus[this.type].values[i] === 'list') {
            input = <List   key={instance} menuType={this.type} instance={instance} value={this.state.values[i]} update={this.update} submit={submit.bind(this)} />; // instance: name of list to tell what to render
         } else if (menus[this.type].values[i].indexOf('radio') !== -1) { // If 'radio' is anywhere within string
            input = <Radios key={instance} menuType={this.type} instance={instance} value={this.state.values[i]} update={this.update} submit={submit.bind(this)} count={parseInt(menus[this.type].values[i])} />;
         } else if (menus[this.type].values[i] === 'button') {
            input = <Button key={instance} menuType={this.type} instance={instance} />; // Button does not need update since it has no internal value
         } else {
            input = menus[this.type].values[i];
         }
         let issues = this.state.issues[i].map((iss, ix) => (
            <p key={ix} 
            style={ { 
               color: 'red', 
               display: (this.state.issues[i].length ? 'block' : 'none'), 
               margin: '5px 0px 3px 0px'
            } }>{iss}</p>
         ));
         let row = (
            <tr className='menurow' key={instance}>
               <td className='menucell' key={0} style={ { textAlign: 'right' } }>{menus[this.type].options[i]}</td>
               <td className='menucell' key={1} style={ { textAlign: 'left' } }>
                  {input}
                  {issues}
               </td>
            </tr>
         );
         rows.push(row);
      }
      if (this.state.issues[this.state.issues.length - 1].length) { // If there are non-specific issues, display them in an additional row at the bottom of the menu
         let row = (
            <tr className='menurow' key={'nonspecissues'}>
               <td className='menucell' key={0}></td>
               <td className='menucell' key={1} style={ { textAlign: 'left' } }>
                  {this.state.issues[this.state.issues.length - 1].map((iss, ix) => (
                     <p key={ix} 
                     style={ { 
                        color: 'red', 
                        display: 'block', 
                        margin: '5px 0px 3px 0px'
                     } }>{iss}</p>
                  ))}
               </td>
            </tr>
         );
         rows.push(row);
      }

      return ( // CanvasCont: zIndex = '-2'; Shade: z-index = '-1'; Menu: zIndex = '1'; (Unpredictable behavior if shade is 0)
         <div id='menu'>
            <Shade />
            <CanvasCont />
            <div id={this.type + 'Header'} className='header' style={ { zIndex: '1', opacity: '.95' } }>
               <h2 className='headertext'>{menus[this.type].header}</h2>
            </div>
            <div className='content' style={ { zIndex: '1' } }>
               <table id={this.type + 'Table'} className='menutable'>
                  <tbody id='Menu Body'>
                     {rows}
                  </tbody>
               </table>
               <MenuSubmit menuType={this.type} values={this.state.values} submit={submit.bind(this)} />
            </div>
            <MenuFooter menuType={this.type} submit={submit.bind(this)} />
         </div>
      );
   }
}

class Text extends React.Component { // Each input-type component renders a table row containing the input type
   constructor(props) {
      super(props);
      this.state = {
         value: props.value,
         focused: false, // If the user is focused on the field
         backgroundColor: 'rgb(255, 255, 255)' // Initialize backgroundColor style in state so it can be edited and re-rendered with React
      };
      this.style = {};
      this.menuType = props.menuType;
      this.instance = props.instance;
      // this.index = menus[this.menuType].options.indexOf(capitalize(this.instance)); // Not currently in use

      this.applyInstance = this.applyInstance.bind(this);
      this.handleFocus = this.handleFocus.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleKeyDown = this.handleKeyDown.bind(this);
   }
   applyInstance() {
      switch (this.instance) {
         case 'password':
            if (this.menuType === 'join') // Caution: password instance exists in create and join menus
               socket.emit('Ask Permission', { pass: this.state.value, info: game.info }); // Add player to permissed list on server (if there is no password for game)
            break;
      }
   }

   handleFocus(e) {
      if (e.type === 'focus') {
         this.setState({ focused: true, backgroundColor: 'rgb(230, 230, 230)' });
      } else if (e.type === 'blur') {
         this.setState({ focused: false, backgroundColor: 'rgb(255, 255, 255)' });
      }
   }
   handleChange(e) { // e.target is dom element of target
      this.props.update(this.instance, e.target.value);
      if (this.instance === 'password' && this.menuType === 'join') {
         socket.emit('Ask Permission', { pass: e.target.value, info: game.info }); // Add player to permissed list on server (if correct password)
      }
   }
   handleKeyDown(e) {
      if (e.keyCode === 13) // If ENTER key is down
         this.props.submit(this.menuType);
   }

   componentWillMount() {
      this.applyInstance();
   }
   componentDidMount() {
      this.props.update(this.instance, this.state.value);
   }
   componentWillReceiveProps(next) {
      this.setState({ value: next.value });
   }
   render() {
      let style = {};
      for (let i in this.style) {
         style[i] = this.style[i];
      }
      style.backgroundColor = this.state.backgroundColor;

      return (
         <input 
            id={this.instance + ' input'} 
            className='menuinput' 
            type='text' 
            value={this.state.value} 
            autoComplete='off' 
            style={style} 
            onFocus={this.handleFocus} 
            onBlur={this.handleFocus} 
            onChange={this.handleChange} 
            onKeyDown={this.handleKeyDown}
         ></input>
      );
   }
}

class Num extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         value: props.value, // Actuall value of the input field
         focused: false, // If the user is focused on the field
         backgroundColor: 'rgb(255, 255, 255)',
         display: 'table-row' // Indicates whether 'display: none' property will be set on the container table row
      };
      this.style = {};
      this.menuType = props.menuType; // Type of menu rendered inside
      this.instance = props.instance; // Name of input
      // this.index = menus[this.menuType].options.indexOf(capitalize(this.instance)); // Not currently in use
      this.placeholder = null;

      this.applyInstance = this.applyInstance.bind(this);
      this.handleFocus = this.handleFocus.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleKeyDown = this.handleKeyDown.bind(this);
   }
   applyInstance() {
      switch (this.instance) {
         case 'world width':
            this.placeholder = Defaults.worldwidth;
            this.min = 300;
            this.max = 100000;
            break;
         case 'world height':
            this.placeholder = Defaults.worldheight;
            this.min = 300;
            this.max = 100000;
            break;
         case 'player minimum':
            this.placeholder = Defaults.playermin;
            this.min = 2;
            break;
         case 'player cap':
            this.placeholder = Defaults.playercap;
            this.min = 2;
            break;
         case 'leaderboard length':
            this.placeholder = Defaults.boardlength;
            this.min = 1;
            this.max = 20;
            break;
         case 'team count':
            this.placeholder = Defaults.teamcount;
            this.min = 2;
            this.max = teamColors.length;
            break;
      }
   }

   handleFocus(e) {
      if (e.type === 'focus') { // If focus in
         this.setState({ focused: true, backgroundColor: 'rgb(230, 230, 230)' }); // Darken
      } else if (e.type === 'blur') { // If focus out
         this.setState({ focused: false, backgroundColor: 'rgb(255, 255, 255)' }); // Lighten
      }
   }
   handleChange(e) {
      let val = e.target.value; // Create local, editable value
      if (e.target.value % 1 !== 0) // If value is not an integer
         val = floor(val); // Set value to greatest integer
      this.props.update(this.instance, val); // Update local value and rest of menu if applicable
   }
   handleKeyDown(e) {
      if (e.keyCode === 13) // If ENTER key is down
         this.props.submit(this.menuType);
   }

   componentWillMount() { // Runs on initial mount, not every update
      this.applyInstance();
   }
   componentDidMount() {
      this.props.update(this.instance, this.state.value);
   }
   componentWillReceiveProps(next) {
      this.setState({ value: next.value });
   }
   render() {
      let style = {};
      for (let i in this.style) {
         style[i] = this.style[i];
      }
      style.backgroundColor = this.state.backgroundColor;

      return (
         <input 
            id={this.instance + ' input'} 
            className='menuinput' 
            type='number' 
            value={this.state.value} 
            placeholder={this.placeholder} 
            min={this.min} 
            max={this.max} 
            autoComplete='off' 
            style={style} 
            onFocus={this.handleFocus} 
            onBlur={this.handleFocus} 
            onChange={this.handleChange} 
            onKeyDown={this.handleKeyDown}
         ></input>
      );
   }
}

class List extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         value: props.value,
         options: [],
         focused: false,
         backgroundColor: 'rgb(255, 255, 255)'
      };
      this.style = {};
      this.menuType = props.menuType;
      this.instance = props.instance;
      // this.index = menus[this.menuType].options.indexOf(capitalize(this.instance)); // Not currently in use

      this.applyInstance = this.applyInstance.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleFocus = this.handleFocus.bind(this);
      this.handleKeyDown = this.handleKeyDown.bind(this);
   }

   applyInstance() {
      let info = []; // Info array holds meta data for option elements to be created later
      let unset = true; // If value is unset initially, will set value to first in list
      switch (this.instance) {
         case 'world type':
            info = [
               { value: 'rectangle', inner: 'Square' },
               { value: 'ellipse',   inner: 'Circle' }
            ];
            break;
         case 'game mode':
            for (let i in modes) {
               let mode = modes[i];
               let disabled = false;
               if (i === 'ctf' || i === 'inf' || i === 'kth') disabled = true;
               info.push({ value: i, inner: modes[i], disabled: disabled });
            }
            break;
         case 'color':
            for (let i in orgColors[game.world.color]) { // Renders all colors as a ffa game; If it is a team mode, rendering should be blocked in Menu.render()
               let color = i; // Key: Color name: String
               let rgb = orgColors[game.world.color][i]; // Value: RGB: Object
               info.push({ value: color, inner: color[0].toUpperCase() + color.slice(1), 
                  style: { backgroundColor: 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')' }
               });
            }
            if (this.menuType === 'respawn') {
               for (let i = 0; i < info.length; i++) {
                  if (org.color === info[i].value) {
                     this.setState({ value: info[i].value });
                     unset = false;
                     break;
                  }
               }
            }
            break;
         case 'team':
            if (getSrc().src === 'title') { // If in title, set game value to game in games array
               for (let i = 0; i < games.length; i++) { // Update game on-load (Normally occurs in thesocket.js @ socket.on('Game')); Used for team option updates
                  if (games[i].info.host === game.info.host) { // Identify game
                     game = games[i]; // Set game to updated game from server array
                     break;
                  }
               }
            }
            for (let i = 0; i < game.teams.length; i++) { // If is not a team mode, rendering should be blocked in Menu.render()
               info.push({ value: teamColors[i], inner: teamColors[i][0].toUpperCase() + teamColors[i].slice(1) + ': ' + game.teams[i].length });
            }
            if (this.menuType === 'join') { // Team auto-selection in join menu
               let lengths = game.teams.map((team) => team.length); // Array which records the number of players on each team
               let min = { [0]: lengths[0] }; // min is an object whose only key is the index of the smallest team and whose value is the size of that team (start with first team by default)
               for (let i = 0; i < info.length; i++) { // Must keep track of index of minimum team within teams array, so index is key within min
                  if (min[i] > lengths[i+1]) {
                     delete min[i]; // Remove previous team key-value pair (it is not minimum size)
                     min[i+1] = lengths[i+1];
                  }
               }
               for (let i in min) { // For-in loop only used so key in min object can be accessed
                  this.setState({ value: info[parseInt(i)].value }); // i is of type string, so parseInt must be used to make type number
                  unset = false;
               }
            } else if (this.menuType === 'respawn') { // Team auto-selection in respawn menu
               for (let i = 0; i < info.length; i++) {
                  if (org.team === teamColors[i]) {
                     this.setState({ value: info[i].value });
                     unset = false;
                     break;
                  }
               }
            }
            break;
      }
      if (unset) this.setState({ value: info[0].value }); // If no value has been set, set first option to select element's value
      let ops = info.map((inf) => <option key={inf.value} value={inf.value} disabled={inf.disabled} style={inf.style}>{inf.inner}</option>); // Create option elements from info
      this.setState({ options: ops });
   }

   handleChange(e) {
      this.props.update(this.instance, e.target.value); // Update local value and menu based on current instance and value
   }
   handleFocus(e) {
      if (e.type === 'focus') { // e.type: the type of event (focus or blur); typeof e.type is DOMString:
         this.setState({ focused: true,  backgroundColor: 'rgb(230, 230, 230)' });
      } else if (e.type === 'blur') {
         this.setState({ focused: false, backgroundColor: 'rgb(255, 255, 255)' });
      }
   }
   handleKeyDown(e) {
      if (e.keyCode === 13) // If ENTER key is down
         this.props.submit(this.menuType);
   }

   componentWillMount() { // Does not run when component is merely changed, only on initial mount
      this.applyInstance();
   }
   componentDidMount() {
      this.props.update(this.instance, this.state.value); // Update internal values of this and other inputs
   }
   componentWillReceiveProps(next) {
      this.setState({ value: next.value });
   }
   render() {
      let style = {};
      for (let i in this.style) {
         style[i] = this.style[i];
      }
      style.backgroundColor = this.state.backgroundColor;

      return (
         <select
            id={this.instance + ' input'} 
            className='menuinput' 
            value={this.state.value} 
            style={style} 
            onChange={this.handleChange} 
            onFocus={this.handleFocus} 
            onBlur={this.handleFocus} 
            onKeyDown={this.handleKeyDown}
            >{this.state.options}
         </select>
      );
   }
}

class Radios extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         value: props.value, // Value is represented as index of radio which is selected (only one is selected at once) (null if none are selected)
         selections: Array(props.count).fill(false) // Boolean array to show selection state of radios
      };
      this.count = props.count;
      this.menuType = props.menuType;
      this.instance = props.instance;
      // this.index = menus[this.menuType].options.indexOf(capitalize(this.instance)); // Not currently in use

      this.applyInstance = this.applyInstance.bind(this);
   }

   applyInstance() { // this.props.update should not be run within applyInstance since component is not yet mounted
      switch (this.instance) {
         case 'skin':
            this.set = skins; // Set is an array of text to be displayed next to the radio inputs
            if (this.menuType === 'respawn' || this.menuType === 'pauseGame') { // Placed outside and after above for loop so the above will occur by defualt and this will overwrite if applicable
               for (let i = 0; i < skins.length; i++) {
                  if (org && org.skin === skins[i]) {
                     let sels = this.state.selections; // Create copy of state selections array
                     sels.fill(false); // Set entire array to false
                     sels[i] = true; // Set current skin to value true
                     this.setState({ value: org.skin, selections: sels });
                     break;
                  }
               }
            }
            break;
         case '1st ability':
            this.set = firsts; // Defined in config.js
            if (this.menuType === 'respawn') {
               let index;
               let sels = this.state.selections; // Create copy of state selections array
               sels.fill(false);
               if (ability.extend.activated)
                  index = 0; // Set index value of selected radio in radios
               else if (ability.compress.activated)
                  index = 1; // Set index value of selected radio in radios
               sels[index] = true;
               this.setState({ value: this.set[index], selections: sels });
            }
            break;
         case '2nd ability':
            this.set = seconds; // Defined in config.js
            if (this.menuType === 'respawn') {
               let index;
               let sels = this.state.selections; // Create copy of state selections array
               sels.fill(false);
               if (ability.immortality.activated)
                  index = 0; // Set index value of selected radio in radios
               else if (ability.freeze.activated)
                  index = 1; // Set index value of selected radio in radios
               sels[index] = true;
               this.setState({ value: this.set[index], selections: sels });
            }
            break;
         case '3rd ability':
            this.set = thirds; // Defined in config.js
            if (this.menuType === 'respawn') {
               let index;
               let sels = this.state.selections; // Create copy of state selections array
               sels.fill(false);
               if (ability.neutralize.activated)
                  index = 0; // Set index value of selected radio in radios
               else if (ability.toxin.activated)
                  index = 1; // Set index value of selected radio in radios
               sels[index] = true;
               this.setState({ value: this.set[index], selections: sels });
            }
            break;
         case 'auto assign':
            this.set = ['']; // Do not display any text adjacent to name label radio
            if (this.menuType === 'respawn') {
               if (ability.auto)
                  this.setState({ value: 'auto assign', selections: [true] });
               else
                  this.setState({ value: '', selections: [false] });
            }
            break;
         case 'name labels':
            this.set = ['']; // Do not display any text adjacent to name label radio
            if (Labels) // If name labels setting is on
               this.setState({ value: this.instance, selections: [true] }); // Set value of Radios to instance value ('name labels') and select the radio
            else
               this.setState({ value: '', selections: [false] }); // Set value of Radios to '' (no value) and deselect the radio
            break;
         case 'messages':
            this.set = ['']; // Do not display any text adjacent to name label radio
            if (Messages) // If messages setting is on
               this.setState({ value: this.instance, selections: [true] }); // Set value of Radios to instance value ('messages') and select the radio
            else
               this.setState({ value: '', selections: [false] }); // Set value of Radios to '' (no value) and deselect the radio
            break;
      }
   }

   handleClick(index) {
      let selections = this.state.selections.slice(); // Copy state selections array into selections
      let newValue = !selections[index]; // Flip selected radio value
      selections.fill(false); // Set all selections to false
      selections[index] = newValue; // Apply new value to selections array
      let val;
      if (this.set.length === 1 && this.set[0] === '') // If there is no text labeling radio, and there is only one radio in a set, set value to instance
         val = selections[index] ? this.instance : ''; // If radio is selected, set value to instance; If deselected, value is empty string
      else
         val = selections[index] ? this.set[index] : ''; // If radio is selected, set value to radio label; If deselected, value is empty string
      this.props.update(this.instance, val); // Update state value
      this.setState({ selections: selections }); // Update selections
   }

   componentWillMount() {
      this.applyInstance();
   }
   componentDidMount() { // Does not run when component is merely changed
      this.props.update(this.instance, this.state.value);
   }
   componentWillReceiveProps(next) {
      this.setState({ value: next.value });
   }
   render() {
      let radios = [];
      for (let i = 0; i < this.count; i++) {
         radios.push(<Radio key={i} instance={this.instance} order={i} value={this.state.selections[i]} onClick={() => this.handleClick(i)} />); // Uses arrow function syntax so 'i' can be passed rather than event parameter
      }
      let elts = radios.map((radio, index) => ( // Add spacers under radio buttons; Last spacer is twice as high
         <div key={index} onKeyDown={this.handleKeyDown}>
            {radio}
            <p className='menuradiotext'>{this.set[index] ? (this.set[index][0].toUpperCase() + this.set[index].slice(1)) : null}</p>
            <div style={ { display: 'block', height: ((index === radios.length - 1) ? '6px' : '3px') } }></div>
         </div>
      )); // If this.set[index] is empty, do not render text (inner HTML of <p> is null)

      return (
         <div id={this.instance + ' input'} value={this.state.value}>
            {elts}
         </div>
      );
   }
}

class Radio extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         value: props.value
      };
      this.style = {};
      this.instance = props.instance;
      this.order = props.order; // Index of radio within radio group (for identification purposes)
   }

   componentWillReceiveProps(next) {
      this.setState({ value: next.value });
   }
   render() {
      let style = {};
      if (this.state.value)
         style.backgroundColor = 'rgb(190, 190, 190)';
      else
         style.backgroundColor = 'rgb(255, 255, 255)';
      return (
         <div
            id={this.instance + ' input ' + this.order} 
            className='menuradio' 
            type='radio' 
            style={style} 
            onClick={this.props.onClick}
         ></div>
      );
   }
}

class Button extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         down: false, // Is mouse down?
         backgroundColor: 'rgb(240, 240, 240)' // Initialize backgroundColor style in state so it can be edited and re-rendered with React
      };
      this.style = {};
      this.menuType = props.menuType;
      this.instance = props.instance;
      // this.index = menus[this.menuType].options.indexOf(capitalize(this.instance)); // Not currently in use

      this.handleClick = this.handleClick.bind(this); // Bind this. reference value to class functions
      this.handleMouseOver = this.handleMouseOver.bind(this);
      this.handleMouseOut = this.handleMouseOut.bind(this);
      this.handleMouseUp = this.handleMouseUp.bind(this);
      this.handleMouseDown = this.handleMouseDown.bind(this);
   }

   handleClick() {
      switch (this.instance) {
         case 'leave game':
            org.clearIntervals(); // Copied from die()
            ability = new Ability({ player: socket.id }); // Reset ability object
            if (getSrc().src === 'game') { // No game object in pause tutorial menu
               socket.emit('Leave Game', game);
               for (let i = 0; i < game.board.list.length; i++) {
                  if (game.board.list[i].player == socket.id) { // Find player in leaderboard
                     game.board.list.splice(i, 1); // Remove player from leaderboard
                     orderBoard(game.board.list); // Sort the list
                     socket.emit('Board', game.board); // Send updated board to server
                     break;
                  }
               }
            }
            if (getSrc().src === 'tutorial') {
               tutorial.clear(); // Clear tutorial intervals
            }
            org = undefined; // Clear org variable
            renderTitle();
            title = new Title();
            break;
      }
   }
   handleMouseOver() {
      let page = document.body.parentNode;
      if (!mouseDown || !this.state.down) { // If the mouse was lifted not over the button, state should not be down, but won't be detected as such by the button, hence mouseDown defined elsewhere
         this.setState({
            down: false,
            backgroundColor: 'rgb(220, 220, 220)'
         });
      } else {
         if (this.state.down) {
            this.setState({ backgroundColor: 'rgb(200, 200, 200)' });
            mouseDown = true;
         }
      }
   }
   handleMouseOut() {
      this.setState({ backgroundColor: 'rgb(240, 240, 240)' });
   }
   handleMouseUp() {
      this.style.backgroundColor = 'rgb(220, 220, 220)';
      this.setState({ down: false });
   }
   handleMouseDown() {
      this.setState({ backgroundColor: 'rgb(200, 200, 200)' });
      this.setState({ down: true });
   }

   componentWillMount() {
      let page = document.body.parentNode;
      if (!mouseDown) this.setState({ down: false });
   }
   render() {
      let style = {};
      for (let i in this.style) {
         style[i] = this.style[i];
      }
      style.backgroundColor = this.state.backgroundColor;

      return (
         <button
            id={this.instance + ' input'} 
            className='menubutton' 
            type='button' 
            style={style} 
            onMouseOver={this.handleMouseOver} 
            onMouseOut={this.handleMouseOut} 
            onMouseDown={this.handleMouseDown} 
            onMouseUp={this.handleMouseUp} 
            onClick={this.handleClick}
         ></button>
      );
   }
}

class MenuSubmit extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         down: false, // Is mouse down?
         backgroundColor: 'rgb(240, 240, 240)', // Initialize backgroundColor style in state so it can be edited and re-rendered with React
         left: (window.innerWidth - 95) / 2 + 'px' // Submit width is 95px
      };
      this.menuType = props.menuType;

      this.handleClick = this.handleClick.bind(this);
      this.handleMouseOver = this.handleMouseOver.bind(this);
      this.handleMouseOut = this.handleMouseOut.bind(this);
      this.handleMouseDown = this.handleMouseDown.bind(this);
      this.handleMouseUp = this.handleMouseUp.bind(this);
   }

   handleClick(e) { // Submit functions based upon menu type
      this.props.submit(this.menuType);
   }
   handleMouseOver(e) {
      let page = document.body.parentNode;
      if (!mouseDown || !this.state.down) { // If the mouse was lifted not over the button, state should not be down, but won't be detected as such by the button, hence mouseDown defined elsewhere
         this.setState({ down: false, backgroundColor: 'rgb(220, 220, 220)' });
      } else {
         if (this.state.down) {
            this.setState({ backgroundColor: 'rgb(200, 200, 200)' });
            mouseDown = true;
         }
      }
   }
   handleMouseOut(e) {
      this.setState({ backgroundColor: 'rgb(240, 240, 240)' });
   }
   handleMouseDown(e) {
      this.setState({
         down: true,
         backgroundColor: 'rgb(200, 200, 200)'
      });
   }
   handleMouseUp(e) {
      this.setState({
         down: false,
         backgroundColor: 'rgb(240, 240, 240)'
      });
   }

   componentWillMount() {
      let page = document.body.parentNode;
      if (!mouseDown) this.setState({ down: false });
   }
   componentWillReceiveProps(next) {
      this.setState({ left: (window.innerWidth - 95) / 2 + 'px' }); // Center submit button on the screen
   }
   render() {
      let style = {};
      style.backgroundColor = this.state.backgroundColor;
      style.left = this.state.left;

      return (
         <button 
            id={this.menuType + 'Button'} 
            className='menusubmit' 
            type='button' 
            style={style} 
            onClick={this.handleClick} 
            onMouseOver={this.handleMouseOver} 
            onMouseOut={this.handleMouseOut} 
            onMouseDown={this.handleMouseDown} 
            onMouseUp={this.handleMouseUp}
         ><p style={ { margin: 0 } }>{menus[this.menuType].button}</p>
         </button>
      );
   }
}

class MenuFooter extends React.Component {
   constructor(props) {
      super(props);
      this.state = {};
      this.style = {
         zIndex: '1',
         position: 'absolute',
         opacity: '.95'
      };
      this.menuType = props.menuType;

      this.handleClick = this.handleClick.bind(this);
   }

   handleClick() { // Click is handled on footer rather than back text so click applies to entire footer
      switch (this.menuType) {
         case 'create':
            renderTitle();
            break;
         case 'join':
            if (game.info.host == socket.id) { // If player is host (If player is joining directly after creating the game)
               socket.emit('Game Ended', game);
               renderTitle();
            } else {
               renderBrowser();
            }
            break;
         case 'spectate':
            renderBrowser();
            break;
         case 'pauseSpectate': // Do not use submit() so changes are not saved when using back button
         case 'respawn':
            state = 'spectate';
            ReactDOM.render(<CanvasCont />, $('cont'));
            break;
         case 'pauseGame': {
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
            ReactDOM.render(<CanvasCont />, $('cont'));
            break;
         }
         case 'pauseTutorial':
            state = 'tutorial';
            ReactDOM.render(<CanvasCont />, $('cont'));
            break;
      }
   }

   render() {
      let style = {};
      for (let i in this.style) {
         style[i] = this.style[i];
      }

      return (
         <div id='footerDiv' style={style} onClick={this.handleClick}>
            <footer id='footer' className='menufooter'>
               <p className='menufootertext'>&larr; Back</p>
            </footer>
         </div>
      );
   }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////// SUBMIT ///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////                                                                                                                                                      ////////
////////                                                                                                                                                      ////////
////////                                                                                                                                                      ////////
////////                                                                                                                                                      ////////
////////                                                                                                                                                      ////////
////////                                                                                                                                                      ////////
////////                                                                                                                                                      ////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function submit(menuType) {
   let issues = []; // Array of objects [ { [instance]: 'error message' } ] (instance of input to render error message next to)
   let ok = true; // Check for inputs' validities
   let tInput = $('game title input');
   let pInput = $('password input');
   let typeInput = $('world type input');
   let widthInput = $('world width input');
   let heightInput = $('world height input');
   let pcInput = $('player cap input');
   let pmInput = $('player minimum input');
   let boardLengthInput = $('leaderboard length input');
   let tcInput = $('team count input');
   let modeInput = $('game mode input');
   let snInput = $('screen name input');
   let cInput = $('color input');
   let teamInput = $('team input');
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
   skin = skin ? skin : 'none'; // If no skin is selected, set value of skin to 'none'
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
            let color = 'black'; // $('World color input').value.toLowerCase(); // Only black world is enabled
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
         if (skins.indexOf(capitalize(skin)) === -1 && skin !== 'none') { // If the skin value is not 'none' or any other possible skin (should never occur)
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
                  socket.emit('Board', game.board); // Must be before spawn because only runs when first entering server, and spawn() runs on respawn as well
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
                  if (game.info.mode == 'skm' || game.info.mode == 'ctf') { // If is a team game
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
                           socket.emit('Teams', { teams: game.teams, host: game.info.host }); // Update server teams; host is for identification
                           break;
                        }
                     }
                  }
                  // Color
                  var color;
                  if (game.info.mode === 'inf') { // If inf mode
                     color = teamColorDef.green; // All players healthy by default
                  } else if (game.info.mode !== 'skm' && game.info.mode !== 'ctf') { // If is not a team game
                     color = $('color input').value.toLowerCase();
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
                  socket.emit('Board', game.board); // Must be before spawn because only runs when first entering server, and spawn() runs on respawn as well
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
         if (skins.indexOf(capitalize(skin)) === -1 && skin !== 'none') // Skins
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
               if (org.team != team) { // Only add player to team if not already on team
                  game.teams[teamColors.indexOf(team)].push(socket.id); // Add player to selected team
                  game.teams[teamColors.indexOf(org.team)].splice(game.teams[teamColors.indexOf(org.team)].indexOf(socket.id), 1);
                  socket.emit('Teams', { teams: game.teams, host: game.info.host }); // Host is for identification
               }
            }
            // Color
            if (game.info.mode === 'inf') { // If inf mode
               color = teamColorDef.green; // All players healthy by default
            } else if (game.info.mode != 'skm' && game.info.mode != 'ctf') { // If is not a team mode 
               color = $('color input').value.toLowerCase();
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
         if (skins.indexOf(capitalize(skin)) === -1 || skin === 'none') // Skins
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
            ReactDOM.render(<CanvasCont />, $('cont'));
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
            ReactDOM.render(<CanvasCont />, $('cont'));
         } else {
            this.issue(issues);
         }
         break;
      case 'pauseTutorial':
         if (ok) {
            state = 'tutorial';
            ReactDOM.render(<CanvasCont />, $('cont'));
         } else {
            this.issue(issues);
         }
         break;
   }
}