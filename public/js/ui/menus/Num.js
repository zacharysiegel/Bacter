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
      // this.index = menus[this.menuType].options.indexOf(Z.capitalize(this.instance)); // Not currently in use
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
