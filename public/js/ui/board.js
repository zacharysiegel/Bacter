var Board = function(datA) {
   let data = datA;
   this.host = Socket.socket.id; // Cannot call Game.game.info.host since game is not fully constructed yet; World() can only be called by host, so Socket.socket.id is ok
   this.list = [
         // {
         //    player: undefined, // ID of player
         //    name: undefined, // Screen name of player
         //    kills: undefined, // Kills as defined by number of enemy cells killed
         //    deaths: undefined, // Deaths as defined by number of org deaths
         //    ratio: undefined, // Ratio of kills to deaths
         //    score: undefined, // Flag captures (ctf), time score (kth)
         //    wins: undefined // Round wins (srv, ctf, inf, kth)
         // }
      ],
      this.count = undefined;
   if (data.mode == 'skm' || data.mode == 'ctf') { // If is a team Game.game
      this.show = data.teamCount; // Maximum number of players shown in leaderboard (Top __)
   } else {
      this.show = data.show;
   }
   this.x = undefined; // width - (nameWidth + oneWidth + twoWidth) / 2 - marginRight
   this.y = undefined; // marginTop
   this.marginRight = 15;
   this.marginTop = 13;
   this.text = {
      marginLeft: 5,
      marginTop: 15,
      size: 11,
      font: 'Helvetica',
      boldFont: 'Verdana',
      color: { r: 0, g: 0, b: 0 }
   };
   this.nameWidth = 170;
   this.oneWidth = 46;
   this.twoWidth = 46;
   this.threeWidth = 46;
   this.rowHeight = 22;
   this.tableWeight = 1;
   this.headWeight = 1;
   this.cellWeight = 1;
   this.headColor = { r: 200, g: 200, b: 200 };
   this.cellColor = { r: 245, g: 245, b: 245 };
   this.stroke = { r: 0, g: 0, b: 0 };
};

function orderBoard(lisT) {
   lisT.sort(function(a, b) { // Sorts in descending order of K:D ratio
      let N;
      if (Game.game.info.mode == 'ffa' || Game.game.info.mode == 'skm') {
         N = b.kills - a.kills; // If a.kills is greater than b.kills, value will be negative, so will sort a before b
         if (N == 0) {
            N = a.deaths - b.deaths; // If b.deaths is greater than a.deaths, value will be positive, so will sort b before a
         }
      } else if (Game.game.info.mode == 'srv') {
         N = b.kills - a.kills;
         if (N == 0) {
            N = b.wins - a.wins;
         }
      } else if (Game.game.info.mode == 'ctf' || Game.game.info.mode == 'kth') {
         N = b.score - a.score;
         if (N == 0) {
            N = b.wins - a.wins;
         }
      } else if (Game.game.info.mode == 'inf') {
         N = b.wins - a.wins;
      }
      return N;
   });
   return lisT;
}

function renderLeaderboard() {
   translate(org.off.x, org.off.y); // Settings for entire board
   rectMode(CORNER);
   Game.game.board.y = Game.game.board.marginTop;
   noFill();
   stroke(Game.game.board.stroke.r, Game.game.board.stroke.g, Game.game.board.stroke.b);
   strokeWeight(Game.game.board.tableWeight);
   textSize(Game.game.board.text.size);
   textFont(Game.game.board.text.font);
   textStyle(BOLD);
   if (Game.game.info.mode == 'ffa') {
      Game.game.board.x = width - (Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth + Game.game.board.threeWidth) - Game.game.board.marginRight;
      fill(Game.game.board.headColor.r, Game.game.board.headColor.g, Game.game.board.headColor.b); // Header
      stroke(Game.game.board.stroke.r, Game.game.board.stroke.g, Game.game.board.stroke.b);
      strokeWeight(Game.game.board.headWeight);
      rect(Game.game.board.x, Game.game.board.y, Game.game.board.nameWidth, Game.game.board.rowHeight); // Names Header
      rect(Game.game.board.x + Game.game.board.nameWidth, Game.game.board.y, Game.game.board.oneWidth, Game.game.board.rowHeight); // Kills Header
      rect(Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth, Game.game.board.y, Game.game.board.twoWidth, Game.game.board.rowHeight); // Deaths Header
      rect(Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth, Game.game.board.y, Game.game.board.threeWidth, Game.game.board.rowHeight); // Ratios Header
      fill(Game.game.board.text.color.r, Game.game.board.text.color.g, Game.game.board.text.color.b); // Header Text
      noStroke();
      text('Player', Game.game.board.x + Game.game.board.text.marginLeft, Game.game.board.y + Game.game.board.text.marginTop);
      text('Kills', Game.game.board.x + Game.game.board.nameWidth + Game.game.board.text.marginLeft, Game.game.board.y + Game.game.board.text.marginTop);
      text('Deaths', Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.text.marginLeft, Game.game.board.y + Game.game.board.text.marginTop);
      text('K:D', Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth + Game.game.board.text.marginLeft, Game.game.board.y + Game.game.board.text.marginTop);
      Game.game.board.count = min(Game.game.board.show, Game.game.board.list.length);
   } else if (Game.game.info.mode == 'skm') {
      Game.game.board.x = width - (Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth + Game.game.board.threeWidth) - Game.game.board.marginRight;
      fill(Game.game.board.headColor.r, Game.game.board.headColor.g, Game.game.board.headColor.b); // Header
      stroke(Game.game.board.stroke.r, Game.game.board.stroke.g, Game.game.board.stroke.b);
      strokeWeight(Game.game.board.headWeight);
      rect(Game.game.board.x, Game.game.board.y, Game.game.board.nameWidth, Game.game.board.rowHeight); // Team Color Header
      rect(Game.game.board.x + Game.game.board.nameWidth, Game.game.board.y, Game.game.board.oneWidth, Game.game.board.rowHeight); // Team Kills Header
      rect(Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth, Game.game.board.y, Game.game.board.twoWidth, Game.game.board.rowHeight); // Team Deaths Header
      rect(Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth, Game.game.board.y, Game.game.board.threeWidth, Game.game.board.rowHeight); // Team Ratio Header
      fill(Game.game.board.text.color.r, Game.game.board.text.color.g, Game.game.board.text.color.b); // Header Text
      noStroke();
      text('Team', Game.game.board.x + Game.game.board.text.marginLeft, Game.game.board.y + Game.game.board.text.marginTop);
      text('Kills', Game.game.board.x + Game.game.board.nameWidth + Game.game.board.text.marginLeft, Game.game.board.y + Game.game.board.text.marginTop);
      text('Deaths', Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.text.marginLeft, Game.game.board.y + Game.game.board.text.marginTop);
      text('K:D', Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth + Game.game.board.text.marginLeft, Game.game.board.y + Game.game.board.text.marginTop);
      Game.game.board.count = Game.game.teams.length;
   } else if (Game.game.info.mode == 'srv') {
      Game.game.board.x = width - (Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth) - Game.game.board.marginRight;
      fill(Game.game.board.headColor.r, Game.game.board.headColor.g, Game.game.board.headColor.b); // Header
      stroke(game.board.stroke.r, Game.game.board.stroke.g, Game.game.board.stroke.b);
      strokeWeight(Game.game.board.headWeight);
      rect(Game.game.board.x, Game.game.board.y, Game.game.board.nameWidth, Game.game.board.rowHeight); // Names Header
      rect(Game.game.board.x + Game.game.board.nameWidth, Game.game.board.y, Game.game.board.oneWidth, Game.game.board.rowHeight); // Wins Header
      rect(Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth, Game.game.board.y, Game.game.board.twoWidth, Game.game.board.rowHeight); // Kills Header
      fill(Game.game.board.text.color.r, Game.game.board.text.color.g, Game.game.board.text.color.b); // Header Text
      noStroke();
      text('Player', Game.game.board.x + Game.game.board.text.marginLeft, Game.game.board.y + Game.game.board.text.marginTop);
      text('Wins', Game.game.board.x + Game.game.board.nameWidth + Game.game.board.text.marginLeft, Game.game.board.y + Game.game.board.text.marginTop);
      text('Kills', Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.text.marginLeft, Game.game.board.y + Game.game.board.text.marginTop);
      Game.game.board.count = min(Game.game.board.show, Game.game.board.list.length);
   } else if (Game.game.info.mode == 'ctf') {
      Game.game.board.x = width - (Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth) - Game.game.board.marginRight;
      fill(Game.game.board.headColor.r, Game.game.board.headColor.g, Game.game.board.headColor.b); // Header
      stroke(game.board.stroke.r, Game.game.board.stroke.g, Game.game.board.stroke.b);
      strokeWeight(Game.game.board.headWeight);
      rect(Game.game.board.x, Game.game.board.y, Game.game.board.nameWidth, Game.game.board.rowHeight); // Team Color Header
      rect(Game.game.board.x + Game.game.board.nameWidth, Game.game.board.y, Game.game.board.oneWidth, Game.game.board.rowHeight); // Wins Header
      rect(Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth, Game.game.board.y, Game.game.board.oneWidth, Game.game.board.rowHeight); // Captures Header
      fill(Game.game.board.text.color.r, Game.game.board.text.color.g, Game.game.board.text.color.b); // Header Text
      noStroke();
      text('Team', Game.game.board.x + Game.game.board.text.marginLeft, Game.game.board.y + Game.game.board.text.marginTop);
      text('Wins', Game.game.board.x + Game.game.board.nameWidth + Game.game.board.text.marginLeft, Game.game.board.y + Game.game.board.text.marginTop);
      text('Score', Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.text.marginLeft, Game.game.board.y + Game.game.board.text.marginTop);
      Game.game.board.count = Game.game.teams.length;
   } else if (Game.game.info.mode == 'inf') {
      Game.game.board.x = width - (Game.game.board.nameWidth + Game.game.board.oneWidth) - Game.game.board.marginRight;
      fill(Game.game.board.headColor.r, Game.game.board.headColor.g, Game.game.board.headColor.b); // Header
      stroke(game.board.stroke.r, Game.game.board.stroke.g, Game.game.board.stroke.b);
      strokeWeight(Game.game.board.headWeight);
      rect(Game.game.board.x, Game.game.board.y, Game.game.board.nameWidth, Game.game.board.rowHeight); // Names Header
      rect(Game.game.board.x + Game.game.board.nameWidth, Game.game.board.y, Game.game.board.oneWidth, Game.game.board.rowHeight); // Wins Header
      fill(Game.game.board.text.color.r, Game.game.board.text.color.g, Game.game.board.text.color.b); // Header Text
      noStroke();
      text('Player', Game.game.board.x + Game.game.board.text.marginLeft, Game.game.board.y + Game.game.board.text.marginTop);
      text('Wins', Game.game.board.x + Game.game.board.nameWidth + Game.game.board.text.marginLeft, Game.game.board.y + Game.game.board.text.marginTop);
      Game.game.board.count = min(Game.game.board.show, Game.game.board.list.length);
   } else if (Game.game.info.mode == 'kth') {
      Game.game.board.x = width - (Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth) - Game.game.board.marginRight;
      fill(Game.game.board.headColor.r, Game.game.board.headColor.g, Game.game.board.headColor.b); // Header
      stroke(game.board.stroke.r, Game.game.board.stroke.g, Game.game.board.stroke.b);
      strokeWeight(Game.game.board.headWeight);
      rect(Game.game.board.x, Game.game.board.y, Game.game.board.nameWidth, Game.game.board.rowHeight); // Names Header
      rect(Game.game.board.x + Game.game.board.nameWidth, Game.game.board.y, Game.game.board.oneWidth, Game.game.board.rowHeight); // Wins Header
      rect(Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth, Game.game.board.y, Game.game.board.oneWidth, Game.game.board.rowHeight); // Score Header
      fill(Game.game.board.text.color.r, Game.game.board.text.color.g, Game.game.board.text.color.b); // Header Text
      noStroke();
      text('Player', Game.game.board.x + Game.game.board.text.marginLeft, Game.game.board.y + Game.game.board.text.marginTop);
      text('Wins', Game.game.board.x + Game.game.board.nameWidth + Game.game.board.text.marginLeft, Game.game.board.y + Game.game.board.text.marginTop);
      text('Score', Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.text.marginLeft, Game.game.board.y + Game.game.board.text.marginTop);
      Game.game.board.count = min(Game.game.board.show, Game.game.board.list.length);
   }
   var a = 0;
   for (let i = 0; i < Game.game.board.count; i++) { // Body
      if (Game.game.info.mode != 'skm' && Game.game.info.mode != 'ctf') { // If not a team mode
         var spectator = false;
         for (let j = 0; j < Game.game.spectators.length; j++) {
            if (Game.game.board.list[i].player == Game.game.spectators[j]) {
               spectator = true;
               break;
            }
         }
         if (spectator == true) {
            if (i < Game.game.board.count) {
               if (Game.game.board.count < Game.game.info.count) {
                  Game.game.board.count++; // Extend leaderboard length to include the next player
                  i++; // Do not render leaderboard status if player is a spectator
               } else {
                  continue;
               }
            }
         }
      }
      // Cell Boxes
      if (Game.game.info.mode == 'ffa') {
         fill(Game.game.board.cellColor.r, Game.game.board.cellColor.g, Game.game.board.cellColor.b);
         stroke(game.board.stroke.r, Game.game.board.stroke.g, Game.game.board.stroke.b);
         strokeWeight(Game.game.board.cellWeight);
         rect(Game.game.board.x, Game.game.board.y + (a + 1) * Game.game.board.rowHeight, Game.game.board.nameWidth, Game.game.board.rowHeight); // Names Body
         fill(Game.game.board.text.color.r, Game.game.board.text.color.g, Game.game.board.text.color.b);
         noStroke();
         if (Game.game.board.list[i].player == Socket.socket.id) {
            textFont(Game.game.board.text.boldFont);
            textStyle(BOLD);
         } else {
            textFont(Game.game.board.text.font);
            textStyle(NORMAL);
         }
         text(Game.game.board.list[i].name, Game.game.board.x + Game.game.board.text.marginLeft, Game.game.board.y + (a + 1) * Game.game.board.rowHeight + Game.game.board.text.marginTop); // Screen name renders under kills box
         fill(Game.game.board.cellColor.r, Game.game.board.cellColor.g, Game.game.board.cellColor.b); // Body
         stroke(game.board.stroke.r, Game.game.board.stroke.g, Game.game.board.stroke.b);
         strokeWeight(Game.game.board.cellWeight);
         rect(Game.game.board.x + Game.game.board.nameWidth, Game.game.board.y + (a + 1) * Game.game.board.rowHeight, Game.game.board.oneWidth, Game.game.board.rowHeight); // Kills Body
         rect(Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth, Game.game.board.y + (a + 1) * Game.game.board.rowHeight, Game.game.board.twoWidth, Game.game.board.rowHeight); // Deaths Body
         rect(Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth, Game.game.board.y + (a + 1) * Game.game.board.rowHeight, Game.game.board.threeWidth, Game.game.board.rowHeight); // Ratios Body
         // Text
         fill(Game.game.board.text.color.r, Game.game.board.text.color.g, Game.game.board.text.color.b);
         noStroke();
         text(Game.game.board.list[i].kills, Game.game.board.x + Game.game.board.nameWidth + Game.game.board.text.marginLeft, Game.game.board.y + (a + 1) * Game.game.board.rowHeight + Game.game.board.text.marginTop);
         text(Game.game.board.list[i].deaths, Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.text.marginLeft, Game.game.board.y + (a + 1) * Game.game.board.rowHeight + Game.game.board.text.marginTop);
         Game.game.board.list[i].ratio = Game.game.board.list[i].kills / Game.game.board.list[i].deaths;
         if (Game.game.board.list[i].ratio == Infinity) { // n / 0, n != 0 (Divide by Zero)
            text('∞', Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth + Game.game.board.text.marginLeft, Game.game.board.y + (a + 1) * Game.game.board.rowHeight + Game.game.board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
         } else if (Game.game.board.list[i].kills == 0 && Game.game.board.list[i].deaths == 0) { // 0 / 0 (Indeterminate Form) (Ratio is NaN)
            text('0', Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth + Game.game.board.text.marginLeft, Game.game.board.y + (a + 1) * Game.game.board.rowHeight + Game.game.board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
         } else { // n / m, m != 0 (Rational Number)
            text(round(Game.game.board.list[i].ratio * 100) / 100, Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth + Game.game.board.text.marginLeft, Game.game.board.y + (a + 1) * Game.game.board.rowHeight + Game.game.board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
         }
      } else if (Game.game.info.mode == 'skm') {
         // fill(Game.game.world.backdrop.r - 20, Game.game.world.backdrop.g - 20, Game.game.world.backdrop.b - 20);
         // noStroke();
         // rect(Game.game.board.x + 4, Game.game.board.y + 3 + (a + 1) * Game.game.board.rowHeight, Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth + Game.game.board.threeWidth, Game.game.board.rowHeight);
         fill(Game.game.board.cellColor.r, Game.game.board.cellColor.g, Game.game.board.cellColor.b);
         stroke(game.board.stroke.r, Game.game.board.stroke.g, Game.game.board.stroke.b);
         strokeWeight(Game.game.board.cellWeight);
         rect(Game.game.board.x, Game.game.board.y + (a + 1) * Game.game.board.rowHeight, Game.game.board.nameWidth, Game.game.board.rowHeight); // Team Color Body
         fill(Game.game.board.text.color.r, Game.game.board.text.color.g, Game.game.board.text.color.b);
         noStroke();
         if (Game.game.teams[i].indexOf(org.player) != -1) { // If player is on given team
            textFont(Game.game.board.text.boldFont);
            textStyle(BOLD);
         } else {
            textFont(Game.game.board.text.font);
            textStyle(NORMAL);
         }
         text(teamColors[i][0].toUpperCase() + teamColors[i].slice(1), Game.game.board.x + Game.game.board.text.marginLeft, Game.game.board.y + (a + 1) * Game.game.board.rowHeight + Game.game.board.text.marginTop); // Screen name is above so it renders under kills box
         fill(Game.game.board.cellColor.r, Game.game.board.cellColor.g, Game.game.board.cellColor.b); // Body
         stroke(game.board.stroke.r, Game.game.board.stroke.g, Game.game.board.stroke.b);
         strokeWeight(Game.game.board.cellWeight);
         rect(Game.game.board.x + Game.game.board.nameWidth, Game.game.board.y + (a + 1) * Game.game.board.rowHeight, Game.game.board.oneWidth, Game.game.board.rowHeight); // Team Kills Body
         rect(Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth, Game.game.board.y + (a + 1) * Game.game.board.rowHeight, Game.game.board.twoWidth, Game.game.board.rowHeight); // Team Deaths Body
         rect(Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth, Game.game.board.y + (a + 1) * Game.game.board.rowHeight, Game.game.board.threeWidth, Game.game.board.rowHeight); // Team Ratios Body
         // Text
         fill(Game.game.board.text.color.r, Game.game.board.text.color.g, Game.game.board.text.color.b);
         noStroke();
         var teamKills = 0;
         var teamDeaths = 0;
         for (let j = 0; j < Game.game.teams[i].length; j++) {
            for (let k = 0; k < Game.game.board.list.length; k++) {
               if (Game.game.teams[i][j] == Game.game.board.list[k].player) {
                  teamKills += Game.game.board.list[k].kills;
                  teamDeaths += Game.game.board.list[k].deaths;
                  break;
               }
            }
         }
         var teamRatio = teamKills / teamDeaths;
         text(teamKills, Game.game.board.x + Game.game.board.nameWidth + Game.game.board.text.marginLeft, Game.game.board.y + (a + 1) * Game.game.board.rowHeight + Game.game.board.text.marginTop);
         text(teamDeaths, Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.text.marginLeft, Game.game.board.y + (a + 1) * Game.game.board.rowHeight + Game.game.board.text.marginTop);
         if (teamRatio == Infinity) { // n / 0, n != 0 (Divide by Zero)
            text('∞', Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth + Game.game.board.text.marginLeft, Game.game.board.y + (a + 1) * Game.game.board.rowHeight + Game.game.board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
         } else if (teamKills == 0 && teamDeaths == 0) { // 0 / 0 (Indeterminate Form) (Ratio is NaN)
            text('0', Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth + Game.game.board.text.marginLeft, Game.game.board.y + (a + 1) * Game.game.board.rowHeight + Game.game.board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
         } else { // n / m, m != 0 (Rational Number)
            text(round(teamRatio * 100) / 100, Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth + Game.game.board.text.marginLeft, Game.game.board.y + (a + 1) * Game.game.board.rowHeight + Game.game.board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
         }
      } else if (Game.game.info.mode == 'srv') {
         // fill(Game.game.world.backdrop.r - 20, Game.game.world.backdrop.g - 20, Game.game.world.backdrop.b - 20);
         // noStroke();
         // rect(Game.game.board.x + 4, Game.game.board.y + 3 + (a + 1) * Game.game.board.rowHeight, Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth, Game.game.board.rowHeight);
         fill(Game.game.board.cellColor.r, Game.game.board.cellColor.g, Game.game.board.cellColor.b);
         stroke(game.board.stroke.r, Game.game.board.stroke.g, Game.game.board.stroke.b);
         strokeWeight(Game.game.board.cellWeight);
         rect(Game.game.board.x, Game.game.board.y + (a + 1) * Game.game.board.rowHeight, Game.game.board.nameWidth, Game.game.board.rowHeight); // Names Body
         fill(Game.game.board.text.color.r, Game.game.board.text.color.g, Game.game.board.text.color.b);
         noStroke();
         if (Game.game.board.list[i].player == Socket.socket.id) {
            textFont(Game.game.board.text.boldFont);
            textStyle(BOLD);
         } else {
            textFont(Game.game.board.text.font);
            textStyle(NORMAL);
         }
         text(Game.game.board.list[i].name, Game.game.board.x + Game.game.board.text.marginLeft, Game.game.board.y + (a + 1) * Game.game.board.rowHeight + Game.game.board.text.marginTop); // Screen name renders under kills box
         fill(Game.game.board.cellColor.r, Game.game.board.cellColor.g, Game.game.board.cellColor.b); // Body
         stroke(game.board.stroke.r, Game.game.board.stroke.g, Game.game.board.stroke.b);
         strokeWeight(Game.game.board.cellWeight);
         rect(Game.game.board.x + Game.game.board.nameWidth, Game.game.board.y + (a + 1) * Game.game.board.rowHeight, Game.game.board.oneWidth, Game.game.board.rowHeight); // Kills Body
         rect(Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth, Game.game.board.y + (a + 1) * Game.game.board.rowHeight, Game.game.board.twoWidth, Game.game.board.rowHeight); // Deaths Body
         // Text
         fill(Game.game.board.text.color.r, Game.game.board.text.color.g, Game.game.board.text.color.b);
         noStroke();
         text(Game.game.board.list[i].wins, Game.game.board.x + Game.game.board.nameWidth + Game.game.board.text.marginLeft, Game.game.board.y + (a + 1) * Game.game.board.rowHeight + Game.game.board.text.marginTop);
         text(Game.game.board.list[i].kills, Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.text.marginLeft, Game.game.board.y + (a + 1) * Game.game.board.rowHeight + Game.game.board.text.marginTop);
      } else if (Game.game.info.mode == 'ctf') {
         // fill(Game.game.world.backdrop.r - 20, Game.game.world.backdrop.g - 20, Game.game.world.backdrop.b - 20);
         // noStroke();
         // rect(Game.game.board.x + 4, Game.game.board.y + 3 + (a + 1) * Game.game.board.rowHeight, Game.game.board.nameWidth + Game.game.board.oneWidth, Game.game.board.rowHeight);
         fill(Game.game.board.cellColor.r, Game.game.board.cellColor.g, Game.game.board.cellColor.b);
         stroke(game.board.stroke.r, Game.game.board.stroke.g, Game.game.board.stroke.b);
         strokeWeight(Game.game.board.cellWeight);
         rect(Game.game.board.x, Game.game.board.y + (a + 1) * Game.game.board.rowHeight, Game.game.board.nameWidth, Game.game.board.rowHeight); // Team Color Body
         fill(Game.game.board.text.color.r, Game.game.board.text.color.g, Game.game.board.text.color.b);
         noStroke();
         if (Game.game.teams[i].indexOf(org.player) != -1) { // If player is on given team
            textFont(Game.game.board.text.boldFont);
            textStyle(BOLD);
         } else {
            textFont(Game.game.board.text.font);
            textStyle(NORMAL);
         }
         text(teamColors[i][0].toUpperCase() + teamColors[i].slice(1), Game.game.board.x + Game.game.board.text.marginLeft, Game.game.board.y + (a + 1) * Game.game.board.rowHeight + Game.game.board.text.marginTop); // Screen name is above so it renders under kills box
         fill(Game.game.board.cellColor.r, Game.game.board.cellColor.g, Game.game.board.cellColor.b); // Body
         stroke(game.board.stroke.r, Game.game.board.stroke.g, Game.game.board.stroke.b);
         strokeWeight(Game.game.board.cellWeight);
         rect(Game.game.board.x + Game.game.board.nameWidth, Game.game.board.y + (a + 1) * Game.game.board.rowHeight, Game.game.board.oneWidth, Game.game.board.rowHeight); // Team Kills
         rect(Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth, Game.game.board.y + (a + 1) * Game.game.board.rowHeight, Game.game.board.twoWidth, Game.game.board.rowHeight); // Round Wins
         // Text
         var wins = 0;
         let done = false;
         for (let j = 0; j < Game.game.teams[i].length; j++) {
            for (let k = 0; k < Game.game.board.list.length; k++) {
               if (Game.game.teams[i][j] == Game.game.board.list[k].player) { // Find player in board list
                  wins = Game.game.board.list[k].wins; // Team wins saved to each player; Copy wins from one player to represent the team
                  done = true;
                  break;
               }
            }
            if (done == true) {
               break;
            }
         }
         var captures = 0;
         for (let j = 0; j < Game.game.teams[i].length; j++) {
            for (let k = 0; k < Game.game.board.list.length; k++) {
               if (Game.game.teams[i][j] == Game.game.board.list[k].player) {
                  captures += Game.game.board.list[k].score;
                  break;
               }
            }
         }
         fill(Game.game.board.text.color.r, Game.game.board.text.color.g, Game.game.board.text.color.b);
         noStroke();
         text(wins, Game.game.board.x + Game.game.board.nameWidth + Game.game.board.text.marginLeft, Game.game.board.y + (a + 1) * Game.game.board.rowHeight + Game.game.board.text.marginTop);
         text(captures, Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.text.marginLeft, Game.game.board.y + (a + 1) * Game.game.board.rowHeight + Game.game.board.text.marginTop);
      } else if (Game.game.info.mode == 'inf') {
         // fill(Game.game.world.backdrop.r - 20, Game.game.world.backdrop.g - 20, Game.game.world.backdrop.b - 20);
         // noStroke();
         // rect(Game.game.board.x + 4, Game.game.board.y + 3 + (a + 1) * Game.game.board.rowHeight, Game.game.board.nameWidth + Game.game.board.oneWidth, Game.game.board.rowHeight);
         fill(Game.game.board.cellColor.r, Game.game.board.cellColor.g, Game.game.board.cellColor.b);
         stroke(game.board.stroke.r, Game.game.board.stroke.g, Game.game.board.stroke.b);
         strokeWeight(Game.game.board.cellWeight);
         rect(Game.game.board.x, Game.game.board.y + (a + 1) * Game.game.board.rowHeight, Game.game.board.nameWidth, Game.game.board.rowHeight); // Names Body
         fill(Game.game.board.text.color.r, Game.game.board.text.color.g, Game.game.board.text.color.b);
         noStroke();
         if (Game.game.board.list[i].player == Socket.socket.id) {
            textFont(Game.game.board.text.boldFont);
            textStyle(BOLD);
         } else {
            textFont(Game.game.board.text.font);
            textStyle(NORMAL);
         }
         text(Game.game.board.list[i].name, Game.game.board.x + Game.game.board.text.marginLeft, Game.game.board.y + (a + 1) * Game.game.board.rowHeight + Game.game.board.text.marginTop); // Screen name renders under kills box
         fill(Game.game.board.cellColor.r, Game.game.board.cellColor.g, Game.game.board.cellColor.b); // Body
         stroke(game.board.stroke.r, Game.game.board.stroke.g, Game.game.board.stroke.b);
         strokeWeight(Game.game.board.cellWeight);
         rect(Game.game.board.x + Game.game.board.nameWidth, Game.game.board.y + (a + 1) * Game.game.board.rowHeight, Game.game.board.oneWidth, Game.game.board.rowHeight); // Kills Body
         // Text
         fill(Game.game.board.text.color.r, Game.game.board.text.color.g, Game.game.board.text.color.b);
         noStroke();
         text(Game.game.board.list[i].wins, Game.game.board.x + Game.game.board.nameWidth + Game.game.board.text.marginLeft, Game.game.board.y + (a + 1) * Game.game.board.rowHeight + Game.game.board.text.marginTop);
      } else if (Game.game.info.mode == 'kth') {
         // fill(Game.game.world.backdrop.r - 20, Game.game.world.backdrop.g - 20, Game.game.world.backdrop.b - 20);
         // noStroke();
         // rect(Game.game.board.x + 4, Game.game.board.y + 3 + (a + 1) * Game.game.board.rowHeight, Game.game.board.nameWidth + Game.game.board.oneWidth, Game.game.board.rowHeight);
         fill(Game.game.board.cellColor.r, Game.game.board.cellColor.g, Game.game.board.cellColor.b);
         stroke(game.board.stroke.r, Game.game.board.stroke.g, Game.game.board.stroke.b);
         strokeWeight(Game.game.board.cellWeight);
         rect(Game.game.board.x, Game.game.board.y + (a + 1) * Game.game.board.rowHeight, Game.game.board.nameWidth, Game.game.board.rowHeight); // Names Body
         fill(Game.game.board.text.color.r, Game.game.board.text.color.g, Game.game.board.text.color.b);
         noStroke();
         if (Game.game.board.list[i].player == Socket.socket.id) {
            textFont(Game.game.board.text.boldFont);
            textStyle(BOLD);
         } else {
            textFont(Game.game.board.text.font);
            textStyle(NORMAL);
         }
         text(Game.game.board.list[i].name, Game.game.board.x + Game.game.board.text.marginLeft, Game.game.board.y + (a + 1) * Game.game.board.rowHeight + Game.game.board.text.marginTop); // Screen name renders under kills box
         fill(Game.game.board.cellColor.r, Game.game.board.cellColor.g, Game.game.board.cellColor.b); // Body
         stroke(game.board.stroke.r, Game.game.board.stroke.g, Game.game.board.stroke.b);
         strokeWeight(Game.game.board.cellWeight);
         rect(Game.game.board.x + Game.game.board.nameWidth, Game.game.board.y + (a + 1) * Game.game.board.rowHeight, Game.game.board.oneWidth, Game.game.board.rowHeight); // Score
         rect(Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth, Game.game.board.y + (a + 1) * Game.game.board.rowHeight, Game.game.board.twoWidth, Game.game.board.rowHeight); // Wins
         // Text
         fill(Game.game.board.text.color.r, Game.game.board.text.color.g, Game.game.board.text.color.b);
         noStroke();
         text(Game.game.board.list[i].wins, Game.game.board.x + Game.game.board.nameWidth + Game.game.board.text.marginLeft, Game.game.board.y + (a + 1) * Game.game.board.rowHeight + Game.game.board.text.marginTop);
         text(Game.game.board.list[i].score, Game.game.board.x + Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.text.marginLeft, Game.game.board.y + (a + 1) * Game.game.board.rowHeight + Game.game.board.text.marginTop);
      }
      a++;
   }
   rectMode(CENTER); // Reset Mode
   translate(-org.off.x, -org.off.y);
}
