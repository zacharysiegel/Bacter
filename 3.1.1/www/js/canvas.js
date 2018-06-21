var cnv;
var center = {
   x: undefined,
   y: undefined
};

class CanvasCont extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         width: props.width ? props.width : window.innerWidth, // Width defaults to window width but can be set by props.width
         height: props.height ? props.height : window.innerHeight // Height defaults to window height but can be set by props.height
      };
      this.style = {
         zIndex: '-2' // Canvas is furthest back (-2); Shade is -1; UI is 1
      };
      let body = document.body; // Set body style for canvas to fill screen
      body.style.overflow = 'hidden';
      body.style.margin = 'none';
      body.style.padding = 'none';
      body.style.border = 'none';
      body.style.outline = 'none';
   }

   componentDidMount() { // Runs only after initial mount
      cnv = createCanvas(this.state.width, this.state.height); // Create p5 canvas
      cnv.parent('#canvascont'); // Set CanvasCont as p5 canvas parent
   }
   componentWillReceiveProps(next) {
      let nextWidth = next.width ? next.width : window.innerWidth;
      let nextHeight = next.height ? next.height : window.innerHeight
      if (nextWidth !== this.state.width || nextHeight !== this.state.height) { // If new dimensions are inequal, create new canvas element
         cnv = createCanvas(nextWidth, nextHeight); // Create p5 canvas
         cnv.parent('#canvascont'); // Set CanvasCont as p5 canvas parent
      }
      this.setState({ // Resize when re-rendered
         width: nextWidth, // Width defaults to window width but can be set by props.width
         height: nextHeight // Height defaults to window height but can be set by props.height
      });
   }
   render() {
      let style = {};
      for (let i in this.props.style) {
         style[i] = this.props.style[i];
      }
      style.zIndex = this.style.zIndex;
      return (
         <div id='canvascont' className='canvas' style={style}></div> // Container for p5's (createCanvas(), parent())
      );
   }
};