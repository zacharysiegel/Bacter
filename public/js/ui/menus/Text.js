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
