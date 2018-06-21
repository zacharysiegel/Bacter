var tutorial;

function renderTutorial() {
   clearInterval(title.interval);
   ReactDOM.render(<CanvasCont />, $('cont'));
   state = 'tutorial';
}

var Tutorial = function() {
   this.src = 'tutorial';
   this.task = 'move';
   this.taskTimeout = undefined;
   this.margin = _margin;
   this.world = new World({ width: window.innerWidth - this.margin * 2, height: window.innerHeight - this.margin * 2, type: 'rectangle', color: 'black', x: this.margin, y: this.margin }); { // Org
      let colors = [];
      for (let j in orgColors.black) {
         if (j != 'sun' && j != 'sky') { // No bright colors which would obscure the crosshair in tutorial to minimize confusion
            colors.push(orgColors.black[j]);
         }
      }
      let color = random(colors);
      org = new Org({ player: socket.id, color: color, skin: 'none', spectate: false, pos: { x: center.x, y: center.y }, title: false });
      org.cells[0] = new Cell(org.pos.x, org.pos.y, org); // Create first cell in org
      org.count++;
   }
   this.orgs = [org];
   this.abilities = [ability];
   this.ointerval = setInterval(() => {
      for (let i = 0; i < this.orgs.length; i++) {
         grow(this.orgs[i]);
         if (org.count == 0) {
            this.orgs[i].cells[0] = new Cell(org.pos.x, org.pos.y, org); // Create first cell in org
            this.orgs[i].count++;
         }
      }
   }, _ofrequency); // 70ms
   this.rinterval = setInterval(() => {
      { // Render
         // Background
         background(this.world.backdrop.r, this.world.backdrop.g, this.world.backdrop.b);

         // Shadows
         { // World
            fill(this.world.backdrop.r - 20, this.world.backdrop.g - 20, this.world.backdrop.b - 20);
            noStroke();
            rect(this.world.x + this.world.width / 2 + 7, this.world.y + this.world.height / 2 + 6, this.world.width, this.world.height);
         } { // Messages
            if (Messages == true) {
               textFont('Helvetica');
               textStyle(NORMAL);
               let message = getMessage();
               if (message != undefined) {
                  let breaks = freq(message, '\n');
                  let width = messageWidth(message);
                  rect(5 + 25 + width / 2, 4 + 25 + 9 * breaks, 25 + width, 26 + 18 * breaks);
               }
            }

         }

         // World
         fill(this.world.background.r, this.world.background.g, this.world.background.b);
         stroke(this.world.border.color.r, this.world.border.color.g, this.world.border.color.b);
         strokeWeight(1);
         rect(this.world.x + this.world.width / 2, this.world.y + this.world.height / 2, this.world.width, this.world.height);

         // Game
         renderToxin(ability);
         renderSecretions(ability);
         renderNeutralize(ability);
         renderOrgs();
         renderSpores(ability);
         if (this.task != 'move' && this.task != 'survive') {
            translate(-org.off.x, -org.off.y);
            renderUI();
            translate(org.off.x, org.off.y);
         }
         noFill(); // Crosshair
         stroke(this.world.border.color.r, this.world.border.color.g, this.world.border.color.b);
         strokeWeight(1);
         line(org.pos.x - 4, org.pos.y, org.pos.x + 4, org.pos.y);
         line(org.pos.x, org.pos.y - 4, org.pos.x, org.pos.y + 4);
         renderMessages(); // Render messages outside translation
      } { // Calculate
         if (this.stopped == false) {
            if (ability.spore.value == true) {
               ability.spore.interval();
            }
            for (let i = 0; i < 3; i++) {
               if (ability.shoot.value[i] == true) {
                  ability.shoot.interval[i]();
               }
            }
            if (state == 'tutorial') {
               move();
            }
         }
         this.detect();
      }
   }, _rfrequency); // 40ms
   this.clear = function() {
      clearInterval(this.ointerval);
      clearInterval(this.rinterval);
   };
   this.stopped = false;
   this.stopdate = undefined;
   this.stop = function() {
      this.stopped = true;
      this.stopdate = new Date();
      clearInterval(this.ointerval);
   };
   this.resize = function(x, y, w, h) {
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
      if (state === 'tutorial') renderTutorial(); // Only render if state is 'tutorial'; otherwise, will render over pause menu
   };
   this.detect = function() {
      switch (this.task) {
         case 'move':
            {
               if (keyIsDown(Controls.left1.code) || keyIsDown(Controls.left2.code) || keyIsDown(Controls.up1.code) || keyIsDown(Controls.up2.code) || keyIsDown(Controls.right1.code) || keyIsDown(Controls.right2.code) || keyIsDown(Controls.down1.code) || keyIsDown(Controls.down2.code)) { // If a directional key is pressed
                  this.task = 'fullscreen';
                  if (this.taskTimeout == undefined) {
                     this.taskTimeout = setTimeout(() => {
                        this.taskTimeout = undefined;
                        this.task = 'survive';
                     }, 3500);
                  }
               }
               break;
            }
         case 'survive':
            {
               if (this.taskTimeout == undefined) {
                  this.taskTimeout = setTimeout(() => {
                     this.taskTimeout = undefined;
                     this.task = 'extend';
                     ability.extend.activated = true;
                     ability.extend.can = true;
                     socket.emit('Ability', ability);
                  }, 4500);
               }
               break;
            }
         case 'extend':
            {
               if (keyIsDown(Controls.ability1.code)) {
                  if (this.taskTimeout == undefined) {
                     this.taskTimeout = setTimeout(() => {
                        this.taskTimeout = undefined;
                        ability.extend.activated = false;
                        ability.extend.can = false;
                        this.task = 'immortality';
                        ability.immortality.activated = true;
                        ability.immortality.can = true;
                        socket.emit('Ability', ability);
                     }, ability.extend.time);
                  }
               }
               break;
            }
         case 'immortality':
            {
               if (keyIsDown(Controls.ability2.code)) {
                  if (this.taskTimeout == undefined) {
                     this.taskTimeout = setTimeout(() => {
                        this.taskTimeout = undefined;
                        ability.immortality.activated = false;
                        ability.immortality.can = false;
                        this.task = 'neutralize';
                        ability.neutralize.activated = true;
                        ability.neutralize.can = true;
                        socket.emit('Ability', ability);
                     }, ability.immortality.time);
                  }
               }
               break;
            }
         case 'neutralize':
            {
               if (keyIsDown(Controls.ability3.code)) {
                  if (this.taskTimeout == undefined) {
                     this.taskTimeout = setTimeout(() => {
                        this.taskTimeout = undefined;
                        ability.neutralize.activated = false;
                        ability.neutralize.can = false;
                        this.task = 'shoot';
                        ability.compress.activated = true;
                        ability.compress.can = true;
                        ability.freeze.activated = true;
                        ability.freeze.can = true;
                        socket.emit('Ability', ability);
                     }, ability.neutralize.time);
                  }
               }
               break;
            }
         case 'shoot':
            {
               if (this.taskTimeout == undefined) {
                  this.taskTimeout = setTimeout(() => {
                     this.taskTimeout = undefined;
                     ability.freeze.activated = false;
                     ability.freeze.can = false;
                     this.task = 'compress';
                     ability.compress.activated = true; // Redundancy
                     ability.compress.can = true; // Redundancy
                  }, 10000);
               }
               break;
            }
         case 'compress':
            {
               if (this.orgs.length == 1) {
                  let colors = [];
                  for (let j in orgColors.black) {
                     if (j != 'sun' && j != 'lime')
                        colors.push(orgColors.black[j]);
                  }
                  let color = random(colors);
                  let pos;
                  do {
                     pos = { x: random(this.world.width), y: random(this.world.height) };
                  } while (sqrt(sq(pos.x - org.pos.x) + sq(pos.y - org.pos.y)) < _range + 30); // _range + 20 is maximum extend range
                  this.orgs.push(new Org({ player: 'bot' + 1, color: color, skin: 'none', spectate: false, pos: pos, title: false }));
                  this.orgs[1].cells[0] = new Cell(this.orgs[1].pos.x, this.orgs[1].pos.y, this.orgs[1]); // Create first cell in org
                  this.orgs[1].count++;
                  this.abilities[1] = new Ability({ player: 'bot' + 1 });
               }
               if (ability.compress.applied == true) {
                  if (this.taskTimeout == undefined) {
                     this.taskTimeout = setTimeout(() => {
                        this.taskTimeout = undefined;
                        ability.compress.activated = false;
                        ability.compress.can = false;
                        ability.freeze.activated = true;
                        ability.freeze.can = true;
                        this.task = 'freeze';
                     }, ability.compress.time);
                  }
               }
               break;
            }
         case 'freeze':
            {
               if (ability.freeze.applied == true) {
                  if (this.taskTimeout == undefined) {
                     this.taskTimeout = setTimeout(() => {
                        this.taskTimeout = undefined;
                        ability.freeze.activated = false;
                        ability.freeze.can = false;
                        ability.toxin.activated = true;
                        ability.toxin.can = true;
                        this.task = 'toxin';
                     }, ability.freeze.time);
                  }
               }
               break;
            }
         case 'toxin':
            {
               if (keyIsDown(Controls.ability3.code)) {
                  if (this.taskTimeout == undefined) {
                     this.taskTimeout = setTimeout(() => {
                        this.taskTimeout = undefined;
                        ability.toxin.activated = false;
                        ability.toxin.can = false; // All ability can values are reset to true after task change by cooldown; not a problem at the moment; can = false is useless at the moment
                        this.task = 'spore';
                        ability.spore.activated = true;
                        ability.spore.can = true;
                        ability.secrete.activated = true; // .can = false
                        socket.emit('Ability', ability);
                     }, ability.toxin.time);
                  }
               }
               break;
            }
         case 'spore':
            {
               let current = new Date();
               if (ability.secrete.value == true) {
                  if (this.stopped == true) {
                     this.stopped = false;
                     this.ointerval = setInterval(() => { // Restart
                        for (let i = 0; i < this.orgs.length; i++) {
                           grow(this.orgs[i]);
                           if (org.count == 0) {
                              this.orgs[i].cells[0] = new Cell(org.pos.x, org.pos.y, org); // Create first cell in org
                              this.orgs[i].count++;
                           }
                        }
                     }, _ofrequency); // 70ms
                     ability.spore.end = new Date();
                     ability.secrete.start = new Date();
                  }
                  if (this.taskTimeout == undefined) {
                     this.taskTimeout = setTimeout(() => {
                        this.taskTimeout = undefined;
                        ability.spore.activated = false;
                        ability.spore.can = false;
                        ability.secrete.activated = false;
                        ability.secrete.can = false;
                        this.task = 'done';
                     }, ability.secrete.time);
                  }
               } else if (ability.spore.value == true && current - ability.spore.start >= ability.spore.time / 2) {
                  if (this.stopped == false) {
                     clearInterval(ability.spore.interval);
                     clearTimeout(ability.spore.timeout);
                     this.stop();
                  }
               }
               break;
            }
      }
   };
};