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
               if (i === 'ctf' || i === 'inf' || i === 'kth') disabled = true; // CTF, INF, and KTH modes are currently not available
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
            if (this.menuType === 'respawn' || this.menuType === 'pauseGame') {
               for (let i = 0; i < info.length; i++) {
                  let color;
                  for (let j in orgColors[game.world.color]) {
                     if (orgColors[game.world.color][j] === org.color) {
                        color = j;
                        break;
                     }
                  }
                  if (color === info[i].value) {
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
            } else if (this.menuType === 'respawn' || this.menuType === 'pauseGame') { // Team auto-selection in respawn menu
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
