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
