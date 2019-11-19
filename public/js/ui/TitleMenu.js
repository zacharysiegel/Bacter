class TitleMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick(btn) {
        switch (btn) {
            case 'host':
                Menu.renderMenu('create');
                break;
            case 'join':
                Browser.renderBrowser();
                break;
            case 'tutorial':
                tutorial = new Tutorial();
                tutorial.render();
                break;
        }
    }

    render() {
        let x = center.x;
        let y = center.y;
        let mWidth = 170; // Menu Width
        let mHeight = 150;
        let bWidth = mWidth * 2 / 3; // Button Width
        let bHeight = 25;
        let style = {
            menu: {
                left: (x - mWidth / 2) + 'px',
                top: (y - mHeight / 2) + 'px'
            },
            host: {
                left: (x - bWidth / 2) + 'px',
                top: (y - mHeight / 2 + 29) + 'px'
            },
            join: {
                left: (x - bWidth / 2) + 'px',
                top: (y - mHeight / 2 + 29 + bHeight * 3 / 2) + 'px'
            },
            tutorial: {
                left: (x - bWidth / 2) + 'px',
                top: (y - mHeight / 2 + 29 + bHeight * 3 / 2 * 2) + 'px'
            }
        };
        return (
            <div id='Title Menu' style={style.menu}>
                <div id='Title Host Button' className='Title Menu Button' onClick={() => this.handleClick('host')} style={style.host}>Host</div>
                <div id='Title Join Button' className='Title Menu Button' onClick={() => this.handleClick('join')} style={style.join}>Join</div>
                <div id='Title Tutorial Button' className='Title Menu Button' onClick={() => this.handleClick('tutorial')} style={style.tutorial}>Tutorial</div>
            </div>
        ); // handleClick does not need to be bound if arrow function is used; without using arrow function, 'host'/'join'/'tutorial' properties could not be sent
    }
}
