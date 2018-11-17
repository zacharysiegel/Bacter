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
            renderTitle();
            break;
         case 'join':
            if (game.info.host == socket.id) { // If player is host (If player is joining directly after creating the game)
               socket.emit('Game Ended', game);
               renderTitle();
            } else {
               renderBrowser();
            }
            break;
         case 'spectate':
            renderBrowser();
            break;
         case 'pauseSpectate': // Do not use submit() so changes are not saved when using back button
         case 'respawn':
            state = 'spectate';
            ReactDOM.render(<CanvasCont />, $('cont'));
            break;
         case 'pauseGame': {
            let skip = false;
            for (let i = 0; i < game.players.length; i++) {
               if (game.players[i] === socket.id) { // If still is a player
                  state = 'game';
                  skip = true;
                  break;
               }
            }
            if (!skip) {
               for (let i = 0; i < game.spectators.length; i++) {
                  if (game.spectators[i] === socket.id) {
                     state = 'spectate'; // Must include spectate possibility in pause game; even though a spectator could never open pause game menu, he could be killed while in menu
                     break;
                  }
               }
            }
            ReactDOM.render(<CanvasCont />, $('cont'));
            break;
         }
         case 'pauseTutorial':
            state = 'tutorial';
            ReactDOM.render(<CanvasCont />, $('cont'));
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
