var games = [];
var defaultCanvas;
var state;

function setup() {
   state = 'setup';
   connectSocket(); {
      rectMode(CENTER);
      ellipseMode(RADIUS);
      angleMode(DEGREES);
      textAlign(LEFT);
   }
   var socketInterval = setInterval(() => {
      ability = new Ability({ player: socket.id });
      if (socket.id != undefined) {
         clearInterval(socketInterval);
      }
   }, 50);
   renderTitle();
}

function windowResized() {
   var button;
   if (state == 'title' || state == 'browser' || state == 'tutorial') {
      cnv = createCanvas(window.innerWidth, window.innerHeight); // Replace canvas with new canvas of new dimensions
      center.x = width / 2;
      center.y = height / 2;
      getSrc().resize(0, 0, window.innerWidth, window.innerHeight);
   } else if (state == 'game' || state == 'spectate') {
      cnv = createCanvas(window.innerWidth, window.innerHeight); // Replace canvas with new canvas of new dimensions
      center.x = width / 2;
      center.y = height / 2;
      org.off.x = org.pos.x - center.x; // Reposition org (camera) correctly
      org.off.y = org.pos.y - center.y;
   } else if (state.indexOf('Menu') != -1) {
      cnv = createCanvas(window.innerWidth, window.innerHeight); // Replace canvas with new canvas of new dimensions
      center.x = width / 2;
      center.y = height / 2;
      if (state == 'respawnMenu' || state.indexOf('pause') != -1) {
         org.off.x = org.pos.x - center.x; // Reposition org (camera) correctly
         org.off.y = org.pos.y - center.y;
      }
      if (getSrc().src == 'title' || getSrc().src == 'tutorial') {
         cnv = createCanvas(window.innerWidth, window.innerHeight); // Replace canvas with new canvas of new dimensions
         center.x = width / 2;
         center.y = height / 2;
         getSrc().resize(0, 0, window.innerWidth, window.innerHeight);
      }
      let shade = document.getElementById('shade');
      shade.style.width = '100%';
      shade.style.height = '100%';
      button = document.getElementById(state.slice(0, state.indexOf('Menu')) + 'Button'); // Button ids must follow this style
      button.style.left = ((window.innerWidth - parseFloat(button.style.width)) / 2) + 'px';
   }
}