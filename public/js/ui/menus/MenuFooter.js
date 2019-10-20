class MenuFooter extends React.Component {
   constructor(props) {
      super(props);
      this.state = {};
      this.style = {
         zIndex: '1',
         position: 'absolute',
         opacity: '.95'
      };
      this.menuType = props.menuType;

      this.handleClick = this.handleClick.bind(this);
   }

   handleClick() { // Click is handled on footer rather than back text so click applies to entire footer
      switch (this.menuType) {
         case 'create':
            Title.render();
            break;
         case 'join':
            if (Game.game.info.host == connection.socket.id) { // If player is host (If player is joining directly after creating the game)
               connection.socket.binary(false).emit('game ended', Game.game);
               Title.render();
            } else {
               Browser.renderBrowser();
            }
            break;
         case 'spectate':
            Browser.renderBrowser();
            break;
         case 'pauseSpectate': // Do not use submit() so changes are not saved when using back button
         case 'respawn':
            Game.state = 'spectate';
            ReactDOM.render(<CanvasCont />, Z.eid('cont'));
            break;
         case 'pauseGame': {
            let skip = false;
            for (let i = 0; i < Game.game.players.length; i++) {
               if (Game.game.players[i] === connection.socket.id) { // If still is a player
                  Game.state = 'game';
                  skip = true;
                  break;
               }
            }
            if (!skip) {
               for (let i = 0; i < Game.game.spectators.length; i++) {
                  if (Game.game.spectators[i] === connection.socket.id) {
                     Game.state = 'spectate'; // Must include spectate possibility in pause game; even though a spectator could never open pause game menu, he could be killed while in menu
                     break;
                  }
               }
            }
            ReactDOM.render(<CanvasCont />, Z.eid('cont'));
            break;
         }
         case 'pauseTutorial':
            Game.state = 'tutorial';
            ReactDOM.render(<CanvasCont />, Z.eid('cont'));
            break;
      }
   }

   render() {
      let style = {};
      for (let i in this.style) {
         style[i] = this.style[i];
      }

      return (
         <div id='footerDiv' style={style} onClick={this.handleClick}>
            <footer id='footer' className='menufooter'>
               <p className='menufootertext'>&larr; Back</p>
            </footer>
         </div>
      );
   }
}
