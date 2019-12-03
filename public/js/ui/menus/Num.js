class Num extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value, // Actuall value of the input field
            focused: false, // If the user is focused on the field
            backgroundColor: 'rgb(255, 255, 255)',
            display: 'table-row', // Indicates whether 'display: none' property will be set on the container table row
            placeholder: null,
            min: null,
            max: null
        };
        this.style = {};
        this.menuType = props.menuType; // Type of menu rendered inside
        this.instance = props.instance; // Name of input
        // this.index = menus[this.menuType].options.indexOf(Z.capitalize(this.instance)); // Not currently in use
        this.placeholder = null;

        this.applyInstance();

        this.applyInstance = this.applyInstance.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    applyInstance() {
        switch (this.instance) {
            case 'world width':
                this.placeholder = config.game.defaults.world_width;
                this.min = config.game.world_width_min;
                this.max = config.game.world_width_max;
                break;
            case 'world height':
                this.placeholder = config.game.defaults.world_height;
                this.min = config.game.world_height_min;
                this.max = config.game.world_height_max;
                break;
            case 'player minimum':
                this.placeholder = config.game.defaults.player_min;
                this.min = config.game.player_minimum_min;
                break;
            case 'player cap':
                this.placeholder = config.game.defaults.player_cap;
                this.min = config.game.player_cap_min;
                break;
            case 'leaderboard length':
                this.placeholder = config.game.defaults.board_length;
                this.min = config.game.board_length_min;
                this.max = config.game.board_length_max;
                break;
            case 'team count':
                this.placeholder = config.game.defaults.team_count;
                this.min = config.game.team_count_min;
                this.max = config.colors.teams.length;
                break;
        }
    }

    // Event Handlers
    handleFocus(e) {
        if (e.type === 'focus') { // If focus in
            this.setState({ focused: true, backgroundColor: 'rgb(230, 230, 230)' }); // Darken
        } else if (e.type === 'blur') { // If focus out
            this.setState({ focused: false, backgroundColor: 'rgb(255, 255, 255)' }); // Lighten
        }
    }

    handleChange(e) {
        let val = e.target.value; // Create local, editable value
        if (e.target.value % 1 !== 0) // If value is not an integer
            val = floor(val); // Set value to greatest integer
        this.props.update(this.instance, val); // Update local value and rest of menu if applicable
    }

    handleKeyDown(e) {
        if (e.keyCode === 13) // If ENTER key is down
            this.props.submit(this.menuType);
    }

    // React Lifecycle Methods
    componentDidMount(prevProps) {
        this.applyInstance();
    }

    /**
     * Called right before rendering
     * @param nextProps
     * @param prevState
     * @returns {null|{value: *}} update to this.state
     */
    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.value !== nextProps.value) {
            return { // New State
                value: nextProps.value, // nextProps.value may not have changed
            };
        }
        return null; // Do not edit component state
    }

    // componentWillReceiveProps(next) { // Deprecated by React
    //    this.setState({ value: next.value });
    // }

    render() {
        let style = {};
        for (let i in this.style) {
            // noinspection JSUnfilteredForInLoop (for of loop doesn't work, don't know why)
            style[i] = this.style[i];
        }
        style.backgroundColor = this.state.backgroundColor;

        return (
            <input
                id={this.instance + ' input'}
                className='menuinput'
                type='number'
                value={this.state.value}
                placeholder={this.placeholder}
                min={this.min}
                max={this.max}
                autoComplete='off'
                style={style}
                onFocus={this.handleFocus}
                onBlur={this.handleFocus}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
            ></input>
        );
    }
}
