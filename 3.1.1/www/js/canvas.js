var cnv;
var center = {
   x: undefined,
   y: undefined
};

class CanvasCont extends React.Component {
   constructor(props) {
      super(props);
      this.state = {};
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
      cnv = createCanvas(window.innerWidth, window.innerHeight); // Create p5 canvas
      cnv.parent('#canvascont'); // Set CanvasCont as p5 canvas parent
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