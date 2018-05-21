class Browser extends React.Component {
   constructor(props) {
      super(props);
      this.styles = {
         soma: {
            position: 'fixed',
            left: '0px',
            top: '0px',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgb(255, 255, 255)',
         },
         browser: {
            overflow: 'auto',
            position: 'fixed',
            left: '0px',
            top: '0px',
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'Verdana',
            fontSize: '15px'
         },
         head: {
            opacity: '1'
         },
         title: {
            maxWidth: '500px',
         },
         mode: {

         },
         players: {

         },
         spectators: {

         },
         playercap: {

         },
         js: {
            fontSize: '22px'
         },
         body: {
            opacity: '.95'
         },
         footer: {
            cursor: 'pointer'
         },
         back: {
            display: 'inline',
            position: 'absolute',
            textAlign: 'left',
            left: '0px'
         },
         dispcons: {
            display: 'inline',
            position: 'absolute',
            right: '0px',
            textAlign: 'right'
         }
      };
      this.state = {
         games: this.props.games,
         mouseDown: false
      };
   }

   handleMouseDown() {
      this.setState({ mouseDown: true });
   }
   handleMouseUp() {
      this.setState({ mouseDown: false });
   }

   render() {
      let gamerows = [];
      for (let i = 0; i < this.state.games.length; i++) {
         if (games[i].players.length == 0 && games[i].spectators.length == 0 && games[i].info.count == 0) { // If host has not yet joined the game
            continue;
         }
         gamerows.push( <GameRow key={i} game={games[i]} forceUp={!this.state.mouseDown} /> );
      }
      return (
         <div id='soma' className='body' onMouseDown={ () => this.handleMouseDown() } onMouseUp={ () => this.handleMouseUp() }>
            <Shade />
            <div className='content'>
               <table id='browser' style={this.styles.browser}>
                  <thead>
                     <tr id='head' style={this.styles.head}>
                        <th id='title' style={this.styles.title} colSpan='1'>Title</th>
                        <th id='mode' style={this.styles.mode} colSpan='1'>Mode</th>
                        <th id='players' style={this.styles.players} colSpan='1'>Players</th>
                        <th id='spectators' style={this.styles.spectators} colSpan='1'>Spectators</th>
                        <th id='playercap' style={this.styles.playercap} colSpan='1'>Player Cap</th>
                        <th id='join-spectate' style={this.styles.js} colSpan='2'>Bacter</th>
                     </tr>
                  </thead>
                  <tbody id='browserBody' style={this.styles.body}>
                     {gamerows}
                  </tbody>
               </table>
            </div>
            <div className='footer'>
               <footer style={this.styles.footer} onClick={ () => title.return() }>
                  <p style={this.styles.back}>&larr; Back</p>
                  <p style={this.styles.dispcons}>{ 'Online Clients: ' + (connections ? connections : 0) }</p>
               </footer>
            </div>
         </div>
      );
   }
};

class GameRow extends React.Component {
   constructor(props) {
      super(props);
      this.styles = {
         row: {
            height: '20px',
            textAlign: 'center'
         },
         title: {
            width: '400px',
         },
         mode: {
            width: '250px'
         },
         players: {

         },
         spectators: {

         },
         playercap: {

         },
         join: {
            minWidth: '150px',
         },
         spectate: {
            minWidth: '150px',
         }
      }
   }

   render() {
      let game = this.props.game;
      return (
         <tr>
            <td style={this.styles.title}>{game.info.title}</td>
            <td style={this.styles.mode}>{modes[game.info.mode]}</td>
            <td style={this.styles.players}>{game.players.length}</td>
            <td style={this.styles.spectators}>{game.spectators.length}</td>
            <td style={this.styles.cap}>{game.info.cap}</td>
            <TableButton forceUp={this.props.forceUp} style={this.styles.join} onMouseUp={() => this.styles.join.backgroundColor = 'inherit'} onClick={null} inner='Join' />
            <TableButton forceUp={this.props.forceUp} style={this.styles.spectate} onMouseUp={() => this.styles.spectate.backgroundColor = 'inherit'} onClick={null} inner='Spectate' />
         </tr>
      );
   }
};

class TableButton extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         isDown: false,
         isOver: false
      };
   }

   handleMouseDown() {
      this.setState({ isDown: true });
   }
   handleMouseUp() {
      this.setState({ isDown: false });
   }
   handleMouseOver() {
      this.setState({ isOver: true });
   }
   handleMouseOut() {
      this.setState({ isOver: false });
   }

   render() {
      return(
         <td 
         className='TableButton' 
         className={(this.state.isDown && this.state.isOver) ? 'TableButtonDOWN' : null} 
         onMouseDown={ () => this.handleMouseDown() } 
         onMouseUp={ () => this.handleMouseUp() } 
         onMouseOver={ () => this.handleMouseOver() } 
         onMouseOut={ () => this.handleMouseOut() } 
         style={this.props.style}
         >{this.props.inner}</td>
      );
   }
};

function rb() {
   state = 'browser';
   cnvClear();
   ReactDOM.render(<Browser games={games} />, document.getElementById('cont'));
   // if (discrepancy == true) {
   //       let join = row.insertCell(-1);
   //       join.row = i;
   //       join.innerHTML = 'Join';
   //       join.style.minWidth = '150px';
   //       join.style.cursor = 'pointer';
   //       let baseColor = join.style.backgroundColor;
   //       join.addEventListener('mouseover', function() {
   //          if (window.mouseIsPressed == true && join.row == clicked.row && join.cellIndex == clicked.cell) {
   //             join.style.backgroundColor = 'rgb(180, 180, 180)';
   //          }
   //       });
   //       join.addEventListener('mousedown', function() {
   //          clicked.row = join.row;
   //          clicked.cell = join.cellIndex;
   //          join.style.backgroundColor = 'rgb(180, 180, 180)';
   //       });
   //       join.addEventListener('mouseup', function() { join.style.backgroundColor = baseColor; });
   //       join.addEventListener('mouseleave', function() { join.style.backgroundColor = baseColor; });
   //       join.addEventListener('click', function() {
   //          renderMenu('join', games[i]);
   //       });
   //       let spectate = row.insertCell(-1);
   //       spectate.row = i;
   //       spectate.innerHTML = 'Spectate';
   //       spectate.style.minWidth = '150px';
   //       spectate.style.textAlign = 'center';
   //       spectate.style.cursor = 'pointer';
   //       baseColor = spectate.style.backgroundColor;
   //       spectate.addEventListener('mouseover', function() {
   //          if (window.mouseIsPressed == true && spectate.row == clicked.row && spectate.cellIndex == clicked.cell) {
   //             spectate.style.backgroundColor = 'rgb(180, 180, 180)';
   //          }
   //       });
   //       spectate.addEventListener('mousedown', function() {
   //          clicked.row = spectate.row;
   //          clicked.cell = spectate.cellIndex;
   //          spectate.style.backgroundColor = 'rgb(180, 180, 180)';
   //       });
   //       spectate.addEventListener('mouseup', function() { spectate.style.backgroundColor = baseColor; });
   //       spectate.addEventListener('mouseleave', function() { spectate.style.backgroundColor = baseColor; });
   //       spectate.addEventListener('click', function() {
   //          renderMenu('spectate', games[i]);
   //       });
   //    }
   // }
}