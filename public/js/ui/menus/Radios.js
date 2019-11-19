class Radios extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value, // Value is represented as index of radio which is selected (only one is selected at once) (null if none are selected)
            selections: Array(props.count).fill(false) // Boolean array to show selection state of radios
        };
        this.count = props.count;
        this.menuType = props.menuType;
        this.instance = props.instance;
        this.set = []; // set must be initialized to an array
        // this.index = menus[this.menuType].options.indexOf(Z.capitalize(this.instance)); // Not currently in use

        this.applyInstance = this.applyInstance.bind(this);
    }

    applyInstance() { // This funtion is run inside the componentDidMount React lifecycle hook
        switch (this.instance) {
            case 'skin':
                this.set = config.game.skins.slice(); // Set is an array of text to be displayed next to the radio inputs
                if (this.menuType === 'respawn' || this.menuType === 'pauseGame') { // Placed outside for loop so the above will occur by defualt and this will overwrite if applicable
                    for (let i = 0; i < config.game.skins.length; i++) {
                        if (org && org.skin === config.game.skins[i]) {
                            let selections = this.state.selections.slice(); // Create copy of state selections array
                            selections.fill(false); // Set entire array to false
                            selections[i] = true; // Set current skin to value true
                            this.setState({ value: org.skin, selections: selections }); // Should trigger a second render (second render occurs before page is loaded)
                            this.props.update(this.instance, org.skin); // update(instance, value); org.skin corresponds to new value
                            break;
                        }
                    }
                }
                break;
            case '1st ability':
                this.set = config.game.firsts.slice(); // Defined in config.js
                if (this.menuType === 'respawn') {
                    let index;
                    let selections = this.state.selections.slice(); // Create copy of state selections array
                    selections.fill(false);
                    if (ability.extend.activated)
                        index = 0; // Set index value of selected radio in radios
                    else if (ability.compress.activated)
                        index = 1; // Set index value of selected radio in radios
                    selections[index] = true;
                    this.setState({ value: this.set[index], selections: selections });
                    this.props.update(this.instance, this.set[index]); // update(instance, value); this.set[index] corresponds to new value
                }
                break;
            case '2nd ability':
                this.set = config.game.seconds; // Defined in config.js
                if (this.menuType === 'respawn') {
                    let index;
                    let selections = this.state.selections.slice(); // Create copy of state selections array
                    selections.fill(false);
                    if (ability.immortality.activated)
                        index = 0; // Set index value of selected radio in radios
                    else if (ability.freeze.activated)
                        index = 1; // Set index value of selected radio in radios
                    selections[index] = true;
                    this.setState({ value: this.set[index], selections: selections });
                    this.props.update(this.instance, this.set[index]); // update(instance, value); this.set[index] corresponds to new value
                }
                break;
            case '3rd ability':
                this.set = config.game.thirds; // Defined in config.js
                if (this.menuType === 'respawn') {
                    let index;
                    let selections = this.state.selections.slice(); // Create copy of state selections array
                    selections.fill(false);
                    if (ability.neutralize.activated)
                        index = 0; // Set index value of selected radio in radios
                    else if (ability.toxin.activated)
                        index = 1; // Set index value of selected radio in radios
                    selections[index] = true;
                    this.setState({ value: this.set[index], selections: selections });
                    this.props.update(this.instance, this.set[index]); // update(instance, value); this.set[index] corresponds to new value
                }
                break;
            case '4th ability': {
                this.set = config.game.fourths; // Defined in config.js
                let selections = this.state.selections.slice(); // Create copy of state's selections array
                selections[0] = true; // There is only one fourth ability, and it is always activated
                this.setState({ value: 0, selections: selections });
                this.props.update(this.instance, 0); // update(instance, value); 0 corresponds to new value
                break;
            }
            case 'auto assign':
                this.set = ['']; // Do not display any text adjacent to name label radio
                if (this.menuType === 'respawn') {
                    if (ability.auto) {
                        this.setState({ value: 'auto assign', selections: [ true ] });
                        this.props.update(this.instance, 'auto assign'); // update(instance, value); 'auto assign' corresponds to new value
                    } else {
                        this.setState({ value: '', selections: [ false ] });
                        this.props.update(this.instance, ''); // update(instance, value); '' corresponds to new value
                    }
                }

                break;
            case 'name labels':
                this.set = ['']; // Do not display any text adjacent to name label radio
                if (config.settings.labels) {// If name labels setting is on
                    this.setState({ value: this.instance, selections: [ true ] }); // Set value of Radios to instance value ('name labels') and select the radio
                    this.props.update(this.instance, this.instance); // update(instance, value); this.instance corresponds to new value
                } else {
                    this.setState({ value: '', selections: [ false ] }); // Set value of Radios to '' (no value) and deselect the radio
                    this.props.update(this.instance, ''); // update(instance, value); '' corresponds to new value
                }
                break;
            case 'messages':
                this.set = ['']; // Do not display any text adjacent to name label radio
                if (config.settings.messages) {// If messages setting is on
                    this.setState({ value: this.instance, selections: [ true ] }); // Set value of Radios to instance value ('messages') and select the radio
                    this.props.update(this.instance, this.instance); // update(instance, value); this.instance corresponds to new value
                } else {
                    this.setState({ value: '', selections: [ false ] }); // Set value of Radios to '' (no value) and deselect the radio
                    this.props.update(this.instance, ''); // update(instance, value); '' corresponds to new value
                }
                break;
        }
    }

    // Event Handlers
    handleClick(index) {
        if (this.instance === '4th ability') return; // The user is not allowed to de-select the Spore ability

        let selections = this.state.selections.slice(); // Copy state selections array into selections
        let newValue = !selections[index]; // Flip selected radio value
        selections.fill(false); // Set all selections to false
        selections[index] = newValue; // Apply new value to selections array
        let val;
        if (this.set.length === 1 && this.set[0] === '') // If there is no text labeling radio, and there is only one radio in a set, set value to instance
            val = selections[index] ? this.instance : ''; // If radio is selected, set value to instance; If deselected, value is empty string
        else
            val = selections[index] ? this.set[index] : ''; // If radio is selected, set value to radio label; If deselected, value is empty string
        this.props.update(this.instance, val); // Update state value
        this.setState({ selections: selections }); // Update selections
    }

    // React Lifecycle Hooks
    componentDidMount() { // Does not run when component is merely changed
        this.applyInstance();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.value !== prevState.value) {
            return { value: nextProps.value };
        }
        return null;
    }

    render() {
        let radios = [];
        for (let i = 0; i < this.count; i++) {
            radios.push(<Radio key={i} instance={this.instance} order={i} value={this.state.selections[i]} onClick={() => this.handleClick(i)} />); // Uses arrow function syntax so 'i' can be passed rather than event parameter
        }
        let elts = radios.map((radio, index) => ( // Add spacers under radio buttons; Last spacer is twice as high
            <div key={index} onKeyDown={this.handleKeyDown}>
                {radio}
                <p className='menuradiotext'>{this.set[index] ? (this.set[index][0].toUpperCase() + this.set[index].slice(1)) : null}</p>
                <div style={ { display: 'block', height: ((index === radios.length - 1) ? '6px' : '3px') } }></div>
            </div>
        )); // If this.set[index] is empty, do not render text (inner HTML of <p> is null)

        return (
            <div id={this.instance + ' input'} value={this.state.value}>
                {elts}
            </div>
        );
    }
}
