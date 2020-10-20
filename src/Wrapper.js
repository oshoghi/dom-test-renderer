import React from "react";

/*
 * Need a wrapper class to get a ref to the component and to inject props
 */
class Wrapper extends React.Component {
    state = {
        forcedProps: {
            ref: this.props.setInstanceRef,
        }
    };

    setProps (props) {
        this.setState({
            forcedProps: { ...this.state.forcedProps, ...props }
        });
    }

    getProps () {
        return { ...this.props.element.props, ...this.state.forcedProps };
    }

    componentDidMount () {
        this.props.setWrapperRef(this);
    }

    render () {
        const props = Object.assign({}, this.state.forcedProps);

        if (typeof(this.props.element.type) !== "string" && !this.props.element?.type?.prototype?.render) {
            delete props.ref;
        }

        return React.cloneElement(this.props.element, props);
    }
}

export { Wrapper };
