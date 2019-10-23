class Cell {
   constructor(x, y, org) {
      this.player = org.player;
      this.width = _cellwidth;
      this.height = _cellwidth; // this.width should equal this.height
      this.x = x; // Cell Center's x coordinate
      this.y = y; // Cell Center's y coordinate
      this.color = org.color; // ^ Causes errors when sending cells to server in 'org update'
      this.org_cursor = org.cursor; // org.cursor is stored because if the entire org was stored, the cell would be recursive (org contains cell)
   }

   /**
    * Check if two cells are equivalent
    * @param rhs Cell to be checked against this one (this is lhs)
    * @param tol The tolerance to be used in x and y positional comparison
    *    Default value is .1
    */
   equals(rhs, tol) {
      if (!tol) tol = .001; // Default tolerance to be used in x/y position equality
      return (rhs instanceof Cell) && (this.player === rhs.player) && (this.x - tol < rhs.x && rhs.x < this.x + tol) && (this.y - tol < rhs.y && rhs.y < this.y + tol);
   }

   /**
    * The distance to the org's cursor
    * @returns {Number} The distance from the cursor to the org's center
    */
   get r() {
      return sqrt(this.r2);
   }

   /**
    * The sum of the squares of the x and y distances to the org's cursor
    * @returns {Number} The square of the distance from the cursor to the cell
    */
   get r2() {
      return sq(this.x - this.org_cursor.x) + sq(this.y - this.org_cursor.y);
   }

   // d() {
   //    return sqrt(sq(this.x - org.cursor.x) + sq(this.y - org.cursor.y)); // Distance from target (Position in world)
   // }
}
