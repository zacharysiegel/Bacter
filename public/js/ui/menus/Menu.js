class Menu extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         instances: [], // Array of instances which should be displayed
         values: Array(config.menus[props.type].options.length).fill(''), // Array of input values; includes all possible inputs, not just those rendered
         issues: Array(config.menus[props.type].options.length + 1).fill([]) // +1 because issues includes issues which do not apply to any one instance
      }; // Component state - not game state
      this.type = props.type;
      this.data = props.data;

      this.instantiate = this.instantiate.bind(this);
      this.update = this.update.bind(this);
      this.issue = this.issue.bind(this);
      if (this.type === 'join' || this.type === 'spectate' || this.type === 'respawn') {
         Game.game = props.data;
      } // join, spectate, and respawn are the only menu types which use the data property
      this.instantiate(); // Set initial instances
   }
   
   static renderMenu(type, data) {
      if (Game.state.indexOf('Menu') !== -1 && type !== Game.state.slice(0, -4)) { // If current state is a menu and menu to be rendered is a different menu, unmount menu and re-render
         ReactDOM.unmountComponentAtNode(Z.eid('root')); // Must first unmount component so Menu() will construct new instance rather than re-rendering (easier than re-constructing in componentWillReceiveProps() when rendering a menu from another menu)
      }
      ReactDOM.render(<Menu type={type} data={data} />, Z.eid('root')); // Render instance of Menu component class in container with id 'root'
      Game.state = type + 'Menu'; // Game state - not component state
   }

   /**
    * Set initial instances of menus; called only inside constructor -> (do not use setState(), change state literally)
    * @return {void}
    */
   instantiate() {
      let insts = config.menus[this.type].options.map(op => op.toLowerCase()); // Set instances to all possible options to start
      switch (this.type) {
         case 'create':
            insts.splice(insts.indexOf('player minimum'), 1); // Remove player min (ffa is selected by default)
            insts.splice(insts.indexOf('team count'), 1); // Remove team count (ffa is selected by default)
            break;
         case 'join':
            if (!this.data.info.secured || this.data.info.host === connection.socket.id) // If the game is not password-secured; If player is host (If player just created the game and is now joining his own game)
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
         case 'spectate':
            if (!this.data.info.secured || this.data.info.host === connection.socket.id) // If the game is not password-secured; If player is host (If player just created the game and is now joining his own game)
               insts.splice(insts.indexOf('password'), 1); // Remove the password input (there is no password necessary) (may be confusing if not removed)
            break;
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

   /**
    * Update the state of the menu depending on input values
    *    Changes the state of Menu when sub-components' states change
    * @param {String} instance The instance of the sub-component being modified
    * @param {String} value The new value to be set to the sub-component
    * @return {void}
    */
   update(instance, value) {
      let insts = config.menus[this.type].options.map(op => op.toLowerCase()); // Set local instances to lowercase options
      let vals = this.state.values;
      let index = config.menus[this.type].options.indexOf(Z.capitalize(instance));
      let elt = Z.eid(instance + ' input'); // DOM node of instance input
      let wInput = Z.eid('world width input'); // Width input DOM node
      let hInput = Z.eid('world height input'); // Height input DOM node
      let pmInput = Z.eid('player minimum input'); // Player minimum input DOM node
      let tcInput = Z.eid('team count input'); // Team count input DOM node
      let teamInput = Z.eid('team input'); // Team selections input DOM node
      let wI = config.menus[this.type].options.indexOf('World Width'); // Width input index (options and state values)
      let hI = config.menus[this.type].options.indexOf('World Height'); // Height input index (options and state values)
      let pmI = config.menus[this.type].options.indexOf('Player Minimum'); // Player minimum input index (options and state values)
      let tcI = config.menus[this.type].options.indexOf('Team Count'); // Team count input index (options and state values)
      if (config.menus[this.type].values[index] === 'number') { // Special editorial actions for number inputs only
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
            teamInput.disabled = !!value;
            break;
      }
      for (let i = 0; i < vals.length; i++) {
         if (vals[i] === 0) // If number (only number because of type comparison in ===) input value is 0 or empty (if empty would have already converted to 0)
            vals[i] = ''; // Replace with an empty string so placeholder is rendered instead of 0
      }
      this.setState({ values: vals }); // Update values in state
   }

   /**
    * Display issues upon submission
    * @param {Array} issues An array containing error messages for each instance's issues
    * @return {void}
    */
   issue(issues) { // issues: Array[ { instance: 'message' } ]
      let count = issues.length;
      let stateIssues = []; // Issues array to be stored in state: Array1[ Array2[ 'message0', ..., 'messageN' ] ] (index of Array1 refers to instance as in options array) (different format than incoming issues)
      for (let i = 0; i < config.menus[this.type].options.length; i++) {
         let instance = config.menus[this.type].options[i].toLowerCase(); // Save instance value from options into instance variable
         stateIssues.push([]); // There exists an issues array for each possible option
         for (let j = 0; j < count; j++) {
            if (Z.getKeys(issues[j])[0] === instance) { // If instance of issue is instance from options array
               stateIssues[i].push(issues[j][instance]); // Add issue to messages array within instance index of state issues array

               issues.splice(j, 1); // Remove issue from inputted issues array so it is not unnecessarily looped through
               count--; // count must be reduced since length of issues is reduced
               j--; // j must be reduced since the entire array is shifted back after splicing, so j need not be incremented (always do this after splicing iterated array)
            }
         }
      }
      stateIssues.push([]); // Add an option non-specific array to the end of state issues to be rendered at the end of the menu; Buffer of empty array is necessary
      if (issues.length) { // If there are any remaining issues (issues with instance '' which do not apply to any single input)
         for (let i = 0; i < count; i++) { // count is the number of remaining issues
            let key = Z.getKeys(issues[i])[0];
            stateIssues[stateIssues.length - 1].push(issues[i][key]); // Add reamining issues to last index of state issues array because they are displayed after all other issues at the bottom of the menu
         }
      }
      this.setState({ issues: stateIssues });
   }

   render() {
      let rows = [];
      for (let i = 0; i < config.menus[this.type].options.length; i++) {
         let instance = config.menus[this.type].options[i].toLowerCase(); // instance: name of input for identification purposes
         if (this.state.instances.indexOf(instance) === -1) { // If local instance is not found within stated instances of the menu
            continue; // it should not be rendered in the menu
         } // Allows config.menus[type].xxxx[i] to be used in this loop without having to check if it should exist within the menu
         let input;
         if (config.menus[this.type].values[i] === 'text') {
            input = <Text   key={instance} menuType={this.type} instance={instance} value={this.state.values[i]} update={this.update} submit={submit.bind(this)} />; // menuType: which menu is to be rendered
         } else if (config.menus[this.type].values[i] === 'number') {
            input = <Num    key={instance} menuType={this.type} instance={instance} value={this.state.values[i]} update={this.update} submit={submit.bind(this)} />;
         } else if (config.menus[this.type].values[i] === 'list') {
            input = <List   key={instance} menuType={this.type} instance={instance} value={this.state.values[i]} update={this.update} submit={submit.bind(this)} />; // instance: name of list to tell what to render
         } else if (config.menus[this.type].values[i].indexOf('radio') !== -1) { // If 'radio' is anywhere within string
            input = <Radios key={instance} menuType={this.type} instance={instance} value={this.state.values[i]} update={this.update} submit={submit.bind(this)} count={parseInt(config.menus[this.type].values[i])} />;
         } else if (config.menus[this.type].values[i] === 'button') {
            input = <Button key={instance} menuType={this.type} instance={instance} />; // Button does not need update since it has no internal value
         } else {
            input = config.menus[this.type].values[i];
         }
         let issues = this.state.issues[i].map((issues, ix) => (
            <p key={ix} 
            style={ { 
               color: 'red', 
               display: (this.state.issues[i].length ? 'block' : 'none'), 
               margin: '5px 0px 3px 0px'
            } }>{issues}</p>
         ));
         let row = (
            <tr className='menurow' key={instance}>
               <td className='menucell' key={0} style={ { textAlign: 'right' } }>{config.menus[this.type].options[i]}</td>
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
                  {this.state.issues[this.state.issues.length - 1].map((issues, ix) => (
                     <p key={ix} 
                     style={ { 
                        color: 'red', 
                        display: 'block', 
                        margin: '5px 0px 3px 0px'
                     } }>{issues}</p>
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
               <h2 className='headertext'>{config.menus[this.type].header}</h2>
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
