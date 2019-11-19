class Radio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        };
        this.style = {};
        this.instance = props.instance;
        this.order = props.order; // Index of radio within radio group (for identification purposes)
    }

    // React Lifecycle Hooks
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.value !== prevState.value) {
            return { value: nextProps.value };
        }
        return null;
    }

    // componentWillReceiveProps(next) { // Deprecated by React
    //    this.setState({ value: next.value });
    // }

    render() {
        let style = {};
        if (this.state.value)
            style.backgroundColor = 'rgb(190, 190, 190)';
        else
            style.backgroundColor = 'rgb(255, 255, 255)';
        return (
            <div
                id={this.instance + ' input ' + this.order}
                className='menuradio'
                type='radio'
                style={style}
                onClick={this.props.onClick} // Defined in Radios.js
            ></div>
        );
    }
}
