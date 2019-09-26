var Board = function(datA) {
   let data = datA;
   this.host = Socket.socket.id; // Cannot call game.info.host since game is not fully constructed yet; World() can only be called by host, so Socket.socket.id is ok
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
   if (data.mode == 'skm' || data.mode == 'ctf') { // If is a team game
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
      if (game.info.mode == 'ffa' || game.info.mode == 'skm') {
         N = b.kills - a.kills; // If a.kills is greater than b.kills, value will be negative, so will sort a before b
         if (N == 0) {
            N = a.deaths - b.deaths; // If b.deaths is greater than a.deaths, value will be positive, so will sort b before a
         }
      } else if (game.info.mode == 'srv') {
         N = b.kills - a.kills;
         if (N == 0) {
            N = b.wins - a.wins;
         }
      } else if (game.info.mode == 'ctf' || game.info.mode == 'kth') {
         N = b.score - a.score;
         if (N == 0) {
            N = b.wins - a.wins;
         }
      } else if (game.info.mode == 'inf') {
         N = b.wins - a.wins;
      }
      return N;
   });
   return lisT;
}

function renderLeaderboard() {
   translate(org.off.x, org.off.y); // Settings for entire board
   rectMode(CORNER);
   game.board.y = game.board.marginTop;
   noFill();
   stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
   strokeWeight(game.board.tableWeight);
   textSize(game.board.text.size);
   textFont(game.board.text.font);
   textStyle(BOLD);
   if (game.info.mode == 'ffa') {
      game.board.x = width - (game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.threeWidth) - game.board.marginRight;
      fill(game.board.headColor.r, game.board.headColor.g, game.board.headColor.b); // Header
      stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
      strokeWeight(game.board.headWeight);
      rect(game.board.x, game.board.y, game.board.nameWidth, game.board.rowHeight); // Names Header
      rect(game.board.x + game.board.nameWidth, game.board.y, game.board.oneWidth, game.board.rowHeight); // Kills Header
      rect(game.board.x + game.board.nameWidth + game.board.oneWidth, game.board.y, game.board.twoWidth, game.board.rowHeight); // Deaths Header
      rect(game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.y, game.board.threeWidth, game.board.rowHeight); // Ratios Header
      fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b); // Header Text
      noStroke();
      text('Player', game.board.x + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('Kills', game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('Deaths', game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('K:D', game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      game.board.count = min(game.board.show, game.board.list.length);
   } else if (game.info.mode == 'skm') {
      game.board.x = width - (game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.threeWidth) - game.board.marginRight;
      fill(game.board.headColor.r, game.board.headColor.g, game.board.headColor.b); // Header
      stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
      strokeWeight(game.board.headWeight);
      rect(game.board.x, game.board.y, game.board.nameWidth, game.board.rowHeight); // Team Color Header
      rect(game.board.x + game.board.nameWidth, game.board.y, game.board.oneWidth, game.board.rowHeight); // Team Kills Header
      rect(game.board.x + game.board.nameWidth + game.board.oneWidth, game.board.y, game.board.twoWidth, game.board.rowHeight); // Team Deaths Header
      rect(game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.y, game.board.threeWidth, game.board.rowHeight); // Team Ratio Header
      fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b); // Header Text
      noStroke();
      text('Team', game.board.x + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('Kills', game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('Deaths', game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('K:D', game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      game.board.count = game.teams.length;
   } else if (game.info.mode == 'srv') {
      game.board.x = width - (game.board.nameWidth + game.board.oneWidth + game.board.twoWidth) - game.board.marginRight;
      fill(game.board.headColor.r, game.board.headColor.g, game.board.headColor.b); // Header
      stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
      strokeWeight(game.board.headWeight);
      rect(game.board.x, game.board.y, game.board.nameWidth, game.board.rowHeight); // Names Header
      rect(game.board.x + game.board.nameWidth, game.board.y, game.board.oneWidth, game.board.rowHeight); // Wins Header
      rect(game.board.x + game.board.nameWidth + game.board.oneWidth, game.board.y, game.board.twoWidth, game.board.rowHeight); // Kills Header
      fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b); // Header Text
      noStroke();
      text('Player', game.board.x + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('Wins', game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('Kills', game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      game.board.count = min(game.board.show, game.board.list.length);
   } else if (game.info.mode == 'ctf') {
      game.board.x = width - (game.board.nameWidth + game.board.oneWidth + game.board.twoWidth) - game.board.marginRight;
      fill(game.board.headColor.r, game.board.headColor.g, game.board.headColor.b); // Header
      stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
      strokeWeight(game.board.headWeight);
      rect(game.board.x, game.board.y, game.board.nameWidth, game.board.rowHeight); // Team Color Header
      rect(game.board.x + game.board.nameWidth, game.board.y, game.board.oneWidth, game.board.rowHeight); // Wins Header
      rect(game.board.x + game.board.nameWidth + game.board.oneWidth, game.board.y, game.board.oneWidth, game.board.rowHeight); // Captures Header
      fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b); // Header Text
      noStroke();
      text('Team', game.board.x + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('Wins', game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('Score', game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      game.board.count = game.teams.length;
   } else if (game.info.mode == 'inf') {
      game.board.x = width - (game.board.nameWidth + game.board.oneWidth) - game.board.marginRight;
      fill(game.board.headColor.r, game.board.headColor.g, game.board.headColor.b); // Header
      stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
      strokeWeight(game.board.headWeight);
      rect(game.board.x, game.board.y, game.board.nameWidth, game.board.rowHeight); // Names Header
      rect(game.board.x + game.board.nameWidth, game.board.y, game.board.oneWidth, game.board.rowHeight); // Wins Header
      fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b); // Header Text
      noStroke();
      text('Player', game.board.x + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('Wins', game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      game.board.count = min(game.board.show, game.board.list.length);
   } else if (game.info.mode == 'kth') {
      game.board.x = width - (game.board.nameWidth + game.board.oneWidth + game.board.twoWidth) - game.board.marginRight;
      fill(game.board.headColor.r, game.board.headColor.g, game.board.headColor.b); // Header
      stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
      strokeWeight(game.board.headWeight);
      rect(game.board.x, game.board.y, game.board.nameWidth, game.board.rowHeight); // Names Header
      rect(game.board.x + game.board.nameWidth, game.board.y, game.board.oneWidth, game.board.rowHeight); // Wins Header
      rect(game.board.x + game.board.nameWidth + game.board.oneWidth, game.board.y, game.board.oneWidth, game.board.rowHeight); // Score Header
      fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b); // Header Text
      noStroke();
      text('Player', game.board.x + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('Wins', game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('Score', game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      game.board.count = min(game.board.show, game.board.list.length);
   }
   var a = 0;
   for (let i = 0; i < game.board.count; i++) { // Body
      if (game.info.mode != 'skm' && game.info.mode != 'ctf') { // If not a team mode
         var spectator = false;
         for (let j = 0; j < game.spectators.length; j++) {
            if (game.board.list[i].player == game.spectators[j]) {
               spectator = true;
               break;
            }
         }
         if (spectator == true) {
            if (i < game.board.count) {
               if (game.board.count < game.info.count) {
                  game.board.count++; // Extend leaderboard length to include the next player
                  i++; // Do not render leaderboard status if player is a spectator
               } else {
                  continue;
               }
            }
         }
      }
      // Cell Boxes
      if (game.info.mode == 'ffa') {
         fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b);
         stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
         strokeWeight(game.board.cellWeight);
         rect(game.board.x, game.board.y + (a + 1) * game.board.rowHeight, game.board.nameWidth, game.board.rowHeight); // Names Body
         fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
         noStroke();
         if (game.board.list[i].player == Socket.socket.id) {
            textFont(game.board.text.boldFont);
            textStyle(BOLD);
         } else {
            textFont(game.board.text.font);
            textStyle(NORMAL);
         }
         text(game.board.list[i].name, game.board.x + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // Screen name renders under kills box
         fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b); // Body
         stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
         strokeWeight(game.board.cellWeight);
         rect(game.board.x + game.board.nameWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.oneWidth, game.board.rowHeight); // Kills Body
         rect(game.board.x + game.board.nameWidth + game.board.oneWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.twoWidth, game.board.rowHeight); // Deaths Body
         rect(game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.threeWidth, game.board.rowHeight); // Ratios Body
         // Text
         fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
         noStroke();
         text(game.board.list[i].kills, game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop);
         text(game.board.list[i].deaths, game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop);
         game.board.list[i].ratio = game.board.list[i].kills / game.board.list[i].deaths;
         if (game.board.list[i].ratio == Infinity) { // n / 0, n != 0 (Divide by Zero)
            text('∞', game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
         } else if (game.board.list[i].kills == 0 && game.board.list[i].deaths == 0) { // 0 / 0 (Indeterminate Form) (Ratio is NaN)
            text('0', game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
         } else { // n / m, m != 0 (Rational Number)
            text(round(game.board.list[i].ratio * 100) / 100, game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
         }
      } else if (game.info.mode == 'skm') {
         // fill(game.world.backdrop.r - 20, game.world.backdrop.g - 20, game.world.backdrop.b - 20);
         // noStroke();
         // rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.threeWidth, game.board.rowHeight);
         fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b);
         stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
         strokeWeight(game.board.cellWeight);
         rect(game.board.x, game.board.y + (a + 1) * game.board.rowHeight, game.board.nameWidth, game.board.rowHeight); // Team Color Body
         fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
         noStroke();
         if (game.teams[i].indexOf(org.player) != -1) { // If player is on given team
            textFont(game.board.text.boldFont);
            textStyle(BOLD);
         } else {
            textFont(game.board.text.font);
            textStyle(NORMAL);
         }
         text(teamColors[i][0].toUpperCase() + teamColors[i].slice(1), game.board.x + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // Screen name is above so it renders under kills box
         fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b); // Body
         stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
         strokeWeight(game.board.cellWeight);
         rect(game.board.x + game.board.nameWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.oneWidth, game.board.rowHeight); // Team Kills Body
         rect(game.board.x + game.board.nameWidth + game.board.oneWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.twoWidth, game.board.rowHeight); // Team Deaths Body
         rect(game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.threeWidth, game.board.rowHeight); // Team Ratios Body
         // Text
         fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
         noStroke();
         var teamKills = 0;
         var teamDeaths = 0;
         for (let j = 0; j < game.teams[i].length; j++) {
            for (let k = 0; k < game.board.list.length; k++) {
               if (game.teams[i][j] == game.board.list[k].player) {
                  teamKills += game.board.list[k].kills;
                  teamDeaths += game.board.list[k].deaths;
                  break;
               }
            }
         }
         var teamRatio = teamKills / teamDeaths;
         text(teamKills, game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop);
         text(teamDeaths, game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop);
         if (teamRatio == Infinity) { // n / 0, n != 0 (Divide by Zero)
            text('∞', game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
         } else if (teamKills == 0 && teamDeaths == 0) { // 0 / 0 (Indeterminate Form) (Ratio is NaN)
            text('0', game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
         } else { // n / m, m != 0 (Rational Number)
            text(round(teamRatio * 100) / 100, game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
         }
      } else if (game.info.mode == 'srv') {
         // fill(game.world.backdrop.r - 20, game.world.backdrop.g - 20, game.world.backdrop.b - 20);
         // noStroke();
         // rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.rowHeight);
         fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b);
         stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
         strokeWeight(game.board.cellWeight);
         rect(game.board.x, game.board.y + (a + 1) * game.board.rowHeight, game.board.nameWidth, game.board.rowHeight); // Names Body
         fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
         noStroke();
         if (game.board.list[i].player == Socket.socket.id) {
            textFont(game.board.text.boldFont);
            textStyle(BOLD);
         } else {
            textFont(game.board.text.font);
            textStyle(NORMAL);
         }
         text(game.board.list[i].name, game.board.x + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // Screen name renders under kills box
         fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b); // Body
         stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
         strokeWeight(game.board.cellWeight);
         rect(game.board.x + game.board.nameWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.oneWidth, game.board.rowHeight); // Kills Body
         rect(game.board.x + game.board.nameWidth + game.board.oneWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.twoWidth, game.board.rowHeight); // Deaths Body
         // Text
         fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
         noStroke();
         text(game.board.list[i].wins, game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop);
         text(game.board.list[i].kills, game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop);
      } else if (game.info.mode == 'ctf') {
         // fill(game.world.backdrop.r - 20, game.world.backdrop.g - 20, game.world.backdrop.b - 20);
         // noStroke();
         // rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth, game.board.rowHeight);
         fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b);
         stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
         strokeWeight(game.board.cellWeight);
         rect(game.board.x, game.board.y + (a + 1) * game.board.rowHeight, game.board.nameWidth, game.board.rowHeight); // Team Color Body
         fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
         noStroke();
         if (game.teams[i].indexOf(org.player) != -1) { // If player is on given team
            textFont(game.board.text.boldFont);
            textStyle(BOLD);
         } else {
            textFont(game.board.text.font);
            textStyle(NORMAL);
         }
         text(teamColors[i][0].toUpperCase() + teamColors[i].slice(1), game.board.x + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // Screen name is above so it renders under kills box
         fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b); // Body
         stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
         strokeWeight(game.board.cellWeight);
         rect(game.board.x + game.board.nameWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.oneWidth, game.board.rowHeight); // Team Kills
         rect(game.board.x + game.board.nameWidth + game.board.oneWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.twoWidth, game.board.rowHeight); // Round Wins
         // Text
         var wins = 0;
         let done = false;
         for (let j = 0; j < game.teams[i].length; j++) {
            for (let k = 0; k < game.board.list.length; k++) {
               if (game.teams[i][j] == game.board.list[k].player) { // Find player in board list
                  wins = game.board.list[k].wins; // Team wins saved to each player; Copy wins from one player to represent the team
                  done = true;
                  break;
               }
            }
            if (done == true) {
               break;
            }
         }
         var captures = 0;
         for (let j = 0; j < game.teams[i].length; j++) {
            for (let k = 0; k < game.board.list.length; k++) {
               if (game.teams[i][j] == game.board.list[k].player) {
                  captures += game.board.list[k].score;
                  break;
               }
            }
         }
         fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
         noStroke();
         text(wins, game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop);
         text(captures, game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop);
      } else if (game.info.mode == 'inf') {
         // fill(game.world.backdrop.r - 20, game.world.backdrop.g - 20, game.world.backdrop.b - 20);
         // noStroke();
         // rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth, game.board.rowHeight);
         fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b);
         stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
         strokeWeight(game.board.cellWeight);
         rect(game.board.x, game.board.y + (a + 1) * game.board.rowHeight, game.board.nameWidth, game.board.rowHeight); // Names Body
         fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
         noStroke();
         if (game.board.list[i].player == Socket.socket.id) {
            textFont(game.board.text.boldFont);
            textStyle(BOLD);
         } else {
            textFont(game.board.text.font);
            textStyle(NORMAL);
         }
         text(game.board.list[i].name, game.board.x + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // Screen name renders under kills box
         fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b); // Body
         stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
         strokeWeight(game.board.cellWeight);
         rect(game.board.x + game.board.nameWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.oneWidth, game.board.rowHeight); // Kills Body
         // Text
         fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
         noStroke();
         text(game.board.list[i].wins, game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop);
      } else if (game.info.mode == 'kth') {
         // fill(game.world.backdrop.r - 20, game.world.backdrop.g - 20, game.world.backdrop.b - 20);
         // noStroke();
         // rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth, game.board.rowHeight);
         fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b);
         stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
         strokeWeight(game.board.cellWeight);
         rect(game.board.x, game.board.y + (a + 1) * game.board.rowHeight, game.board.nameWidth, game.board.rowHeight); // Names Body
         fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
         noStroke();
         if (game.board.list[i].player == Socket.socket.id) {
            textFont(game.board.text.boldFont);
            textStyle(BOLD);
         } else {
            textFont(game.board.text.font);
            textStyle(NORMAL);
         }
         text(game.board.list[i].name, game.board.x + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // Screen name renders under kills box
         fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b); // Body
         stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
         strokeWeight(game.board.cellWeight);
         rect(game.board.x + game.board.nameWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.oneWidth, game.board.rowHeight); // Score
         rect(game.board.x + game.board.nameWidth + game.board.oneWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.twoWidth, game.board.rowHeight); // Wins
         // Text
         fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
         noStroke();
         text(game.board.list[i].wins, game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop);
         text(game.board.list[i].score, game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop);
      }
      a++;
   }
   rectMode(CENTER); // Reset Mode
   translate(-org.off.x, -org.off.y);
}
