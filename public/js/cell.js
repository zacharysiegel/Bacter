let Cell = function(_x, _y, _org) {
    this.player = org.player;
    this.width = _cellwidth;
    this.height = _cellwidth; // this.width should equal this.height
    this.x = _x; // Cell Center's x coordinate
    this.y = _y; // Cell Center's y coordinate
    this.color = org.color;
    this.org = _org; // The org to which this cell belongs
    /**
     *
     */
    this.r = () => sqrt(sq(this.x - this.org.x()) + sq(this.y - this.org.y())); // @returns The distance from the cursor to the org's center
    this.r2 = () => sq(this.x - this.org.x()) + sq(this.y - this.org.y()); // @returns The square of the distance from the cursor to the cell
    this.d = org => sqrt(sq(this.x - org.pos.x) + sq(this.y - org.pos.y)); // Distance from target (Position in world)
};