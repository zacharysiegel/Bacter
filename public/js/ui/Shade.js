class Shade extends React.Component { // White layer behind menus allows user to see background but unfocuses it
    render() {
        let style = {
            position: 'fixed',
            left: '0px',
            top: '0px',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgb(255, 255, 255)',
            opacity: '.5',
            zIndex: '-1'
        };
        return (
            <div id="shade" style={style}/>
        );
    }
}
