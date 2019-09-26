var connections;

class Browser extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         games: props.games
      };
   }
   
   static renderBrowser() {
      state = 'browser';
      ReactDOM.render(<Browser games={games} />, Z.eid('cont'));
   }

   // React Lifecycle Hooks
   static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.games !== prevState.games) {
         return { games: nextProps.games };
      }
      return null;
   }
   // componentWillReceiveProps(next) { // Deprecated by React
   //    if (next.games) this.setState({ games: next.games });
   // }
   
   render() {
      let gamerows = [];
      for (let i = 0; i < this.state.games.length; i++) {
         if (this.state.games[i].players.length == 0 && this.state.games[i].spectators.length == 0 && this.state.games[i].info.count == 0) { // If host has not yet joined the game
            continue;
         }
         gamerows.push( <GameRow key={i} game={this.state.games[i]} row={i} forceUp={!mouseDown} /> );
      }

      return (
         <div id='browsercont'>
            <Shade />
            <CanvasCont />
            <div id='content'>
               <table id='browser'>
                  <thead>
                     <tr id='head'>
                        <th id='title' colSpan='1'>Title</th>
                        <th id='mode' colSpan='1'>Mode</th>
                        <th id='players' colSpan='1'>Players</th>
                        <th id='spectators' colSpan='1'>Spectators</th>
                        <th id='playercap' colSpan='1'>Player Cap</th>
                        <th id='join-spectate' colSpan='2'>Bacter</th>
                     </tr>
                  </thead>
                  <tbody id='browserBody'>
                     {gamerows}
                  </tbody>
               </table>
            </div>
            <div className='backfooter'>
               <footer onClick={ renderTitle }>
                  <p id='back'>&larr; Back</p>
                  <p id='displayconnections'>{ 'Online Clients: ' + (connections ? connections : 0) }</p>
               </footer>
            </div>
         </div>
      );
   }
}

class GameRow extends React.Component {
   constructor(props) {
      super(props);
      this.row = props.row;
   }

   render() {
      let game = this.props.game;
      return (
         <tr>
            <td className='title'>{game.info.title}</td>
            <td className='mode'>{modes[game.info.mode]}</td>
            <td className='players'>{game.players.length}</td>
            <td className='spectators'>{game.spectators.length}</td>
            <td className='playercap'>{game.info.cap}</td>
            <TableButton forceUp={this.props.forceUp} row={this.row} inner='Join' />
            <TableButton forceUp={this.props.forceUp} row={this.row} inner='Spectate' />
         </tr>
      );
   }
}

class TableButton extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         down: false,
         backgroundColor: 'rgb(255, 255, 255)'
      };
      this.row = props.row;

      this.handleMouseDown = this.handleMouseDown.bind(this); // Preserve this reference value in handler functions
      this.handleMouseUp = this.handleMouseUp.bind(this);
      this.handleMouseOver = this.handleMouseOver.bind(this);
      this.handleMouseOut = this.handleMouseOut.bind(this);
      this.handleClick = this.handleClick.bind(this);
   }

   handleMouseDown(e) {
      this.setState({ down: true, backgroundColor: 'rgb(210, 210, 210)' });
   }
   handleMouseUp(e) {
      this.setState({ down: false, backgroundColor: 'rgb(230, 230, 230)' });
   }
   handleMouseOver(e) {
      this.setState({ backgroundColor: this.state.down ? 'rgb(210, 210, 210)' : 'rgb(230, 230, 230)' });
   }
   handleMouseOut(e) {
      this.setState({ backgroundColor: 'rgb(255, 255, 255)' });
   }
   handleClick(e) {
      switch (this.props.inner) {
         case 'Join':
            Menu.renderMenu('join', games[this.row]);
            break;
         case 'Spectate':
            Menu.renderMenu('spectate', games[this.row]);
            break;
      }
   }

   render() {
      return (
         <td 
            className='TableButton' 
            onMouseDown={this.handleMouseDown} 
            onMouseUp={this.handleMouseUp} 
            onMouseOver={this.handleMouseOver} 
            onMouseOut={this.handleMouseOut} 
            onClick={this.handleClick} 
            style={{ backgroundColor: this.state.backgroundColor }}
         >{this.props.inner}</td>
      );
   }
}
