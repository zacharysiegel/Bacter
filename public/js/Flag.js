class Flag {
   constructor(X, Y, coloR) {
      this.x = X;
      this.y = Y;
      this.color = coloR;
      this.carried = false; // True: flag is being carried by a player; False: flag is dropped
      this.carrier = undefined;
      this.height = 20;
      this.width = 9;
   }

   /**
    * Checks if the player's org has collided with the flag
    */
   detectPickup() {
      if (!this.carried) { // If flag is unposessed
         if (org.cursor.x - org.col > this.x - this.width / 2
            && org.cursor.x + org.col < this.x + this.width / 2
            && org.cursor.y - org.col > this.y - this.height / 2
            && org.cursor.y + org.col < this.y + this.height / 2) { // If org collides with flag
            return true;
         }
      }
      return false;
   }

   pickup(carrier) {
      this.carried = true; // Org picks up flag
      this.carrier = carrier;
      connection.socket.binary(false).emit('Flag', { flag: this, host: Game.game.info.host });
   }
}
