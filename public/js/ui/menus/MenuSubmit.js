class MenuSubmit extends React.Component { // Button for submitting menu information
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
