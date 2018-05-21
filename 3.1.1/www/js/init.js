var cnv; // Initialize in global scope
var center = {}; // Initialize in global scope
function initialize(gamE, datA) {
   state = 'initialize';

   // Clear Body
   var page = document.body.parentNode;
   page.removeChild(document.body);
   body = document.createElement('body');
   page.appendChild(body);

   // Apply Canvas Styling
   body.style.overflow = 'hidden';
   body.style.margin = '0px';
   body.style.border = '0px';
   body.style.padding = '0px';

   // Initialize Game
   cnv = createCanvas(window.innerWidth, window.innerHeight);
   canvas = cnv.elt; // HTML Node is stored in p5 canvas' .elt property
   canvas.style.visibility = 'visible';
   body.appendChild(canvas);
   center = {
      x: width / 2,
      y: height / 2
   };

   game = gamE;
   if (datA.spectate != true) { // Field can be left undefined
      spawn({ color: datA.color, skin: datA.skin, team: datA.team });
   } else if (datA.spectate == true) {
      spectate({ color: datA.color, skin: datA.skin, team: datA.team });
   }
}