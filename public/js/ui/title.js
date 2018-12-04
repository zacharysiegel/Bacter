var title; // Initialize in global scope
var Title = function() {
   state = 'title';
   this.src = 'title';
   this.margin = _margin;
   this.world = new World({ width: window.innerWidth - this.margin * 2, height: window.innerHeight - this.margin * 2, type: 'rectangle', color: 'black', x: this.margin, y: this.margin });
   this.orgs = [];
   this.abilities = [];
   let quadrants = [];
   for (let i = 0; i < _dummies; i++) {
      let colors = [];
      for (let j in orgColors.black) {
         colors.push(orgColors.black[j]);
      }
      let color = random(colors);
      let arr = skins.slice();
      arr.push('none');
      let skin = random(arr);
      let xoff;
      let yoff;
      let quadrant;
      do {
         quadrant = random();
         if (quadrant < .25) {
            quadrant = 1;
            xoff = 0;
            yoff = 0;
         } else if (quadrant < .5) {
            quadrant = 2;
            xoff = 1;
            yoff = 0;
         } else if (quadrant < .75) {
            quadrant = 3;
            xoff = 1;
            yoff = 1;
         } else if (quadrant < 1) {
            quadrant = 4;
            xoff = 0;
            yoff = 1;
         }
         quadrants[i] = quadrant;
      } while (freq(quadrants, quadrant) > floor(_dummies / 4) + 1);
      let pos = {
         x: random(this.world.x + _cellwidth + this.world.width / 2 * xoff, this.world.x - _cellwidth + this.world.width / 2 * (xoff + 1)), // 80 is edge buffer
         y: random(this.world.y + _cellwidth + this.world.height / 2 * yoff, this.world.y - _cellwidth + this.world.height / 2 * (yoff + 1))
      };
      this.orgs[i] = new Org({ player: i, color: color, skin: skin, team: null, pos: pos, title: true });
      this.orgs[i].cells[0] = new Cell(this.orgs[i].pos.x, this.orgs[i].pos.y, this.orgs[i]); // Title must exist to create new Cell()
      this.orgs[i].count++;
      this.abilities[i] = new Ability({ player: i });
   }
   this.menu = new TitleMenu(this.world.x + this.world.width / 2, this.world.y + this.world.height / 2);

   /**
    * Interval to run title screen animations
    * @return void
    */
   this.interval = setInterval(() => {
      { // Render
         // Background
         background(this.world.backdrop.r, this.world.backdrop.g, this.world.backdrop.b);

         // Shadows
         fill(this.world.backdrop.r - 20, this.world.backdrop.g - 20, this.world.backdrop.b - 20);
         noStroke();
         rect(this.world.x + this.world.width / 2 + 7, this.world.y + this.world.height / 2 + 6, this.world.width, this.world.height); // World

         // World
         fill(this.world.background.r, this.world.background.g, this.world.background.b);
         stroke(this.world.border.color.r, this.world.border.color.g, this.world.border.color.b);
         strokeWeight(1);
         rect(this.world.x + this.world.width / 2, this.world.y + this.world.height / 2, this.world.width, this.world.height);

         // Orgs
         renderOrgs();
      } { // Calculate
         for (let i = 0; i < this.orgs.length; i++) {
            this.orgs[i].grow();
         }
      }
   }, _orgfrequency);

   /**
    * Resize the title screen to fit the window dimensions
    * @param  number x offset in x-direction from left of window
    * @param  number y offset in y-direction from top of window
    * @param  number w screen width (pixels)
    * @param  number h screen height (pixels)
    * @return void
    */
   this.resize = (x, y, w, h) => {
      center.x = window.innerWidth / 2;
      center.y = window.innerHeight / 2;
      let old_x = this.world.x - this.margin;
      let old_y = this.world.y - this.margin;
      for (let i = 0; i < this.orgs.length; i++) {
         this.orgs[i].pos.x = (this.orgs[i].pos.x - this.margin - old_x) / this.world.width * (w - this.margin * 2) + (this.margin + x); // Reposition org correctly
         this.orgs[i].pos.y = (this.orgs[i].pos.y - this.margin - old_y) / this.world.height * (h - this.margin * 2) + (this.margin + y); // Must be before new world creation so can find percentage of former world size
         this.orgs[i].cells = [];
         this.orgs[i].cells[0] = new Cell(this.orgs[i].pos.x, this.orgs[i].pos.y, this.orgs[i]);
         this.orgs[i].count = 1;
      }
      this.world = new World({ width: w - this.margin * 2, height: h - this.margin * 2, type: 'rectangle', color: 'black', x: x + this.margin, y: y + this.margin });
      if (state === 'title') {
         renderTitle();
      } else if (state === 'browser') {
         renderBrowser();
      }
   };
};

class TitleMenu extends React.Component {
   constructor(props) {
      super(props);
   }

   handleClick(btn) {
      switch (btn) {
         case 'host':
            renderMenu('create');
            break;
         case 'join':
            renderBrowser();
            break;
         case 'tutorial':
            renderTutorial();
            tutorial = new Tutorial();
            break;
      }
   }

   render() {
      let x = center.x;
      let y = center.y;
      let mWidth = 170; // Menu Width
      let mHeight = 150;
      let bWidth = mWidth * 2 / 3; // Button Width
      let bHeight = 25;
      let style = {
         menu: {
            left: (x - mWidth / 2) + 'px',
            top: (y - mHeight / 2) + 'px'
         },
         host: {
            left: (x - bWidth / 2) + 'px',
            top: (y - mHeight / 2 + 29) + 'px'
         },
         join: {
            left: (x - bWidth / 2) + 'px',
            top: (y - mHeight / 2 + 29 + bHeight * 3 / 2) + 'px'
         },
         tutorial: {
            left: (x - bWidth / 2) + 'px',
            top: (y - mHeight / 2 + 29 + bHeight * 3 / 2 * 2) + 'px'
         }
      };
      return (
         <div id='Title Menu' style={style.menu}>
            <div id='Title Host Button' className='Title Menu Button' onClick={() => this.handleClick('host')} style={style.host}>Host</div>
            <div id='Title Join Button' className='Title Menu Button' onClick={() => this.handleClick('join')} style={style.join}>Join</div>
            <div id='Title Tutorial Button' className='Title Menu Button' onClick={() => this.handleClick('tutorial')} style={style.tutorial}>Tutorial</div>
         </div>
      ); // handleClick does not need to be bound if arrow function is used; without using arrow function, 'host'/'join'/'tutorial' properties could not be sent
   }
}

function renderTitle() {
   state = 'title';
   if (org) org.clearIntervals(); // If global org variable exists (such as after exiting a game) clear its interval(s) so as to not interfere with title animations
   ability = new Ability({ player: socket.id });
   let a = ReactDOM.render( // Title rendering placed within ReactDOM.render() so Title() can be used for title and retain this. namespace
      <div id='title'>
         <CanvasCont />
         <TitleMenu />
      </div>
   , eid('cont')); // TitleMenu will not retain its this. namespace
}

var Shade = function() { // White layer behind menus allows user to see background but unfocuses it
   let style = {
      position: 'fixed',
      left: '0px',
      top: '0px',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgb(255, 255, 255)',
      opacity: '.5',
      zIndex: '-1'
   };
   return (
      <div id="shade" style={style}></div>
   );
};