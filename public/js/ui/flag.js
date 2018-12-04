var Flag = function(X, Y, coloR) {
   // Attributes
   this.x = X;
   this.y = Y;
   this.color = coloR;
   this.carried = false; // True: flag is being carried by a player; False: flag is dropped
   this.carrier = undefined;
   this.height = 20;
   this.width = 9;

   // Helper Functions
   this.detectPickup = () => {
      if (!this.carried) { // If flag is unposessed
         if (org.pos.x - org.col > this.x - this.width / 2
          && org.pos.x + org.col < this.x + this.width / 2
          && org.pos.y - org.col > this.y - this.height / 2
          && org.pos.y + org.col < this.y + this.height / 2) { // If org collides with flag
            this.pickup(socket.id); // Org picks up flag
         }
      }
   };
   this.pickup = carrier => {
      this.carried = true; // Org picks up flag
      this.carrier = carrier;
      socket.emit('Flag', { flag: this, host: game.info.host });
   };
};