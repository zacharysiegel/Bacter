let title; // Initialize in global scope -- Convert this to a static field on class Title later

class Title {
   /**
    * Create a new Title object (Factory constructor)
    *    The main purpose of this function is to ensure the previous title interval is cleared before creating a new one
    * @return {Title} A new Title instance
    */
   static create() {
      if (title) clearInterval(title.interval); // Clear the previous title interval before creating the new one
      return new Title();
   }

   constructor() {
      Game.state = 'title';
      this.src = 'title'; // Specifiy that this instance is the source object for the title screen
      this.margin = config.game.margin_width; // Set the margin width to that specified in config file
      this.world = new World({ width: window.innerWidth - this.margin * 2, height: window.innerHeight - this.margin * 2, type: 'rectangle', color: 'black', x: this.margin, y: this.margin });

      this.orgs = []; // Spawn org bots
      this.abilities = [];
      let quadrants = [];
      for (let i = 0; i < config.game.dummy_count; i++) {
         let colors = [];
         for (let j in config.colors.orgs.black) {
            colors.push(config.colors.orgs.black[j]);
         }
         let color = colors[Math.floor(Math.random() * colors.length)];
         let arr = config.game.skins.slice();
         arr.push('none');
         let skin = arr[Math.floor(Math.random() * arr.length)];
         let xoff;
         let yoff;
         let quadrant;
         do {
            quadrant = Math.random();
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
         } while (Z.freq(quadrants, quadrant) > Math.floor(config.game.dummy_count / 4) + 1);
         let min_x = this.world.x + config.game.cell_width + this.world.width / 2 * xoff;
         let min_y = this.world.y + config.game.cell_width + this.world.height / 2 * yoff;
         let max_x = this.world.x - config.game.cell_width + this.world.width / 2 * (xoff + 1);
         let max_y = this.world.y - config.game.cell_width + this.world.height / 2 * (yoff + 1);
         let cursor = {
            x: min_x + Math.random() * (max_x - min_x),
            y: min_y + Math.random() * (max_y - min_y)
         };
         this.orgs[i] = new Org({
            player: i,
            color: color,
            skin: skin,
            team: null,
            cursor: cursor,
         });
         this.orgs[i].cells[0] = new Cell(this.orgs[i].cursor.x, this.orgs[i].cursor.y, this.orgs[i]); // Title must exist to create new Cell()
         this.orgs[i].count++;
         this.abilities[i] = new Ability(i);
      }

      this.menu = new TitleMenu(this.world.x + this.world.width / 2, this.world.y + this.world.height / 2); // Create the title screen menu

      /**
       * Interval to run title screen animations
       * @return void
       */
      this.interval = setInterval(() => {
         // Render
         background(this.world.backdrop.r, this.world.backdrop.g, this.world.backdrop.b); // Background

         fill(this.world.backdrop.r - 20, this.world.backdrop.g - 20, this.world.backdrop.b - 20); // Shadows
         noStroke();
         rect(this.world.x + this.world.width / 2 + 7, this.world.y + this.world.height / 2 + 6, this.world.width, this.world.height); // World

         fill(this.world.background.r, this.world.background.g, this.world.background.b); // World
         stroke(this.world.border.color.r, this.world.border.color.g, this.world.border.color.b);
         strokeWeight(1);
         rect(this.world.x + this.world.width / 2, this.world.y + this.world.height / 2, this.world.width, this.world.height);

         Org.renderAll(); // Orgs

         // Calculate
         for (let i = 0; i < this.orgs.length; i++) {
            this.orgs[i].grow();
         }
      }, config.game.org_frequency);
   }

   /**
    * Resize the title screen to fit the window dimensions
    * @param  {Number} x offset in x-direction from left of window
    * @param  {Number} y offset in y-direction from top of window
    * @param  {Number} w screen width (pixels)
    * @param  {Number} h screen height (pixels)
    * @return {void}
    */
   resize(x, y, w, h) {
      center.x = window.innerWidth / 2;
      center.y = window.innerHeight / 2;
      let old_x = this.world.x - this.margin;
      let old_y = this.world.y - this.margin;
      for (let i = 0; i < this.orgs.length; i++) {
         this.orgs[i].cursor.x = (this.orgs[i].cursor.x - this.margin - old_x) / this.world.width * (w - this.margin * 2) + (this.margin + x); // Reposition org correctly
         this.orgs[i].cursor.y = (this.orgs[i].cursor.y - this.margin - old_y) / this.world.height * (h - this.margin * 2) + (this.margin + y); // Must be before new world creation so can find percentage of former world size
         this.orgs[i].cells = [];
         this.orgs[i].cells[0] = new Cell(this.orgs[i].cursor.x, this.orgs[i].cursor.y, this.orgs[i]);
         this.orgs[i].count = 1;
      }
      this.world = new World({ width: w - this.margin * 2, height: h - this.margin * 2, type: 'rectangle', color: 'black', x: x + this.margin, y: y + this.margin });
      if (Game.state === 'title') {
         Title.render();
      } else if (Game.state === 'browser') {
         Browser.renderBrowser();
      }
   }

   static render() {
      Game.state = 'title';

      if (org) org.clearIntervals(); // If global org variable exists (such as after exiting a game) clear its interval(s) so as to not interfere with title animations
      ability = new Ability(connection.socket.id); // Reset the ability object

      let a = ReactDOM.render( // Title rendering placed within ReactDOM.render() so Title() can be used for title and retain this. namespace
         <div id='title'>
            <CanvasCont />
            <TitleMenu />
         </div>
         , Z.eid('root')); // TitleMenu will not retain its this. namespace
   }
}
