var title; // Initialize in global scope
var Title = function() {
   state = 'title';
   this.src = 'title';
   this.cnv = createCanvas(window.innerWidth, window.innerHeight);
   this.canvas = this.cnv.elt; // HTML Node is stored in p5 canvas' .elt property
   this.canvas.style.visibility = 'visible';
   this.canvas.style.zIndex = '-1';
   center = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
   };
   document.body.appendChild(canvas);
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
            grow(this.orgs[i]);
         }
      }
   }, _ofrequency);
   this.resize = function(x, y, w, h) {
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
      if (state == 'title') {
         this.menu = new TitleMenu(this.world.x + this.world.width / 2, this.world.y + this.world.height / 2);
      }
   };
   this.return = function() {
      cnvClear();
      this.menu = new TitleMenu(center.x, center.y);
      state = 'title';
   };
};

var TitleMenu = function(X, Y) {
   let former = document.getElementById('Title Menu');
   if (former != null) {
      document.body.removeChild(former);
   }
   this.x = X;
   this.y = Y;
   this.width = 170;
   this.height = 150;
   this.r = 1;
   this.background = { r: 10, g: 10, b: 10 };
   this.borderColor = { r: 255, g: 255, b: 255 };
   this.elt = document.createElement('div'); // Menu Block
   this.elt.id = 'Title Menu';
   this.elt.style.position = 'fixed';
   this.elt.style.left = (this.x - this.width / 2) + 'px';
   this.elt.style.top = (this.y - this.height / 2) + 'px';
   this.elt.style.backgroundColor = 'rgb(' + this.background.r + ', ' + this.background.g + ', ' + this.background.b + ')';
   this.elt.style.borderColor = 'rgb(' + this.borderColor.r + ', ' + this.borderColor.g + ', ' + this.borderColor.b + ')';
   this.elt.style.borderWidth = '1px';
   this.elt.style.borderStyle = 'solid';
   this.elt.style.width = this.width + 'px';
   this.elt.style.height = this.height + 'px';
   this.elt.style.maxWidth = this.width + 'px';
   this.elt.style.maxHeight = this.height + 'px';
   this.elt.style.borderRadius = this.r + 'px';
   this.host = document.createElement('div'); // Host Button
   this.host.id = 'Title Host Button';
   this.host.style.cursor = 'pointer';
   this.host.width = this.width / 3 * 2;
   this.host.height = 25;
   this.host.style.width = this.host.width + 'px';
   this.host.style.height = this.host.height + 'px';
   this.host.style.position = 'fixed';
   this.host.style.left = (this.x - this.host.width / 2) + 'px';
   this.host.style.top = (this.y - this.height / 2 + 29) + 'px';
   this.host.style.backgroundColor = 'rgb(' + this.background.r + ', ' + this.background.g + ', ' + this.background.b + ')';
   this.host.style.borderWidth = '0px';
   this.host.style.color = 'rgb(' + this.borderColor.r + ', ' + this.borderColor.g + ', ' + this.borderColor.b + ')';
   this.host.style.textAlign = 'center';
   this.host.style.fontFamily = '_bacter';
   this.host.style.fontSize = '29px';
   this.host.innerHTML = 'Host';
   this.host.addEventListener('click', function() {
      renderMenu('create');
   });
   this.join = document.createElement('div'); // Host Button
   this.join.id = 'Title Host Button';
   this.join.style.cursor = 'pointer';
   this.join.width = this.width / 3 * 2;
   this.join.height = 25;
   this.join.style.width = this.host.width + 'px';
   this.join.style.height = this.host.height + 'px';
   this.join.style.position = 'fixed';
   this.join.style.left = (this.x - this.host.width / 2) + 'px';
   this.join.style.top = (this.y - this.height / 2 + 29 + this.host.height * 3 / 2) + 'px';
   this.join.style.backgroundColor = 'rgb(' + this.background.r + ', ' + this.background.g + ', ' + this.background.b + ')';
   this.join.style.borderWidth = '0px';
   this.join.style.color = 'rgb(' + this.borderColor.r + ', ' + this.borderColor.g + ', ' + this.borderColor.b + ')';
   this.join.style.textAlign = 'center';
   this.join.style.fontFamily = '_bacter';
   this.join.style.fontSize = '29px';
   this.join.innerHTML = 'Join';
   this.join.addEventListener('click', function() {
      renderBrowser();
   });
   this.tutorial = document.createElement('div'); // Host Button
   this.tutorial.id = 'Title Host Button';
   this.tutorial.style.cursor = 'pointer';
   this.tutorial.width = this.width / 3 * 2;
   this.tutorial.height = 25;
   this.tutorial.style.width = this.host.width + 'px';
   this.tutorial.style.height = this.host.height + 'px';
   this.tutorial.style.position = 'fixed';
   this.tutorial.style.left = (this.x - this.host.width / 2) + 'px';
   this.tutorial.style.top = (this.y - this.height / 2 + 29 + this.host.height * 3 / 2 * 2) + 'px';
   this.tutorial.style.backgroundColor = 'rgb(' + this.background.r + ', ' + this.background.g + ', ' + this.background.b + ')';
   this.tutorial.style.borderWidth = '0px';
   this.tutorial.style.color = 'rgb(' + this.borderColor.r + ', ' + this.borderColor.g + ', ' + this.borderColor.b + ')';
   this.tutorial.style.textAlign = 'center';
   this.tutorial.style.fontFamily = '_bacter';
   this.tutorial.style.fontSize = '29px';
   this.tutorial.innerHTML = 'Tutorial';
   this.tutorial.addEventListener('click', function() {
      tutorial = new Tutorial();
   });
   this.elt.appendChild(this.host);
   this.elt.appendChild(this.join);
   this.elt.appendChild(this.tutorial);
   document.body.appendChild(this.elt);
};

function renderTitle() {
   // Initialize Title
   if (title != undefined) {
      clearInterval(title.interval);
   }
   title = new Title();
}

var Shade = function() {
   this.elt = document.createElement('div');
   this.elt.id = 'shade';
   this.elt.style.position = 'fixed';
   this.elt.style.left = '0px';
   this.elt.style.top = '0px';
   this.elt.style.width = '100%';
   this.elt.style.height = '100%';
   this.elt.style.backgroundColor = 'rgb(255, 255, 255)';
   this.elt.style.opacity = '.5';
   this.elt.style.zIndex = '0';
   let style = {
      position: 'fixed',
      left: '0px',
      top: '0px',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgb(255, 255, 255)',
      opacity: '.5',
      zIndex: '0'
   };
   // return (
   //    <div id="shade" style={style}>
         
   //    </div>
   // );
};

function cnvClear() { // Clears all elements in body except canvases
   let body = document.body;
   for (let i = 0; i < body.children.length; i++) {
      if (body.children[i].tagName == 'CANVAS' || body.children[i].id === 'cont') {
         continue;
      } else {
         ReactDOM.unmountComponentAtNode(body.children[i]);
         if (body.children.length) {
            body.removeChild(body.children[i]);
         }
         i--;
      }
   }
   let cont = document.getElementById('cont');
   for (let i = 0; i < cont.children.length; i++) {
      if (cont.children[i].tagName == 'CANVAS') {
         continue;
      } else {
         ReactDOM.unmountComponentAtNode(cont); // React component must be unmounted by ReactDOM at the component's container
         if (cont.children.length) { // If React component was unmounted, child will already have been removed
            cont.removeChild(cont.children[i]);
         }
         i--;
      }
   }
   return document.getElementsByTagName('CANVAS')[0];
}