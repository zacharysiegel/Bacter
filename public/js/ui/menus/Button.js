class Button extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            down: false, // Is mouse down?
            backgroundColor: 'rgb(240, 240, 240)' // Initialize backgroundColor style in state so it can be edited and re-rendered with React
        };
        this.style = {};
        this.menuType = props.menuType;
        this.instance = props.instance;
        // this.index = menus[this.menuType].options.indexOf(Z.capitalize(this.instance)); // Not currently in use

        this.handleClick = this.handleClick.bind(this); // Bind this. reference value to class functions
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
    }

    // Event Handlers
    handleClick() {
        switch (this.instance) {
            case 'leave game':
                Control.leave();
                break;
            case 'leave tutorial':
                org.clearIntervals();
                tutorial.clear(); // Clear tutorial intervals
                org = undefined; // Clear org variable
                Title.render();
                title = Title.create();
                break;
        }
    }

    handleMouseOver() {
        let page = document.body.parentNode;
        if (!mouseDown || !this.state.down) { // If the mouse was lifted not over the button, state should not be down, but won't be detected as such by the button, hence mouseDown defined elsewhere
            this.setState({
                down: false,
                backgroundColor: 'rgb(220, 220, 220)'
            });
        } else {
            if (this.state.down) {
                this.setState({ backgroundColor: 'rgb(200, 200, 200)' });
                mouseDown = true;
            }
        }
    }

    handleMouseOut() {
        this.setState({ backgroundColor: 'rgb(240, 240, 240)' });
    }

    handleMouseUp() {
        this.setState({ backgroundColor: 'rgb(220, 220, 220)' });
        this.setState({ down: false });
    }

    handleMouseDown() {
        this.setState({ backgroundColor: 'rgb(200, 200, 200)' });
        this.setState({ down: true });
    }

    // React Lifecycle Hooks
    componentDidMount() {
        let page = document.body.parentNode;
        if (!mouseDown) this.setState({ down: false });
    }

    render() {
        let style = {};
        for (let i in this.style) {
            style[i] = this.style[i];
        }
        style.backgroundColor = this.state.backgroundColor;

        return (
            <button
                id={this.instance + ' input'}
                className='menubutton'
                type='button'
                style={style}
                onMouseOver={this.handleMouseOver}
                onMouseOut={this.handleMouseOut}
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                onClick={this.handleClick}
            ></button>
        );
    }
}
