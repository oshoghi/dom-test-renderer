import React from "react";
//import PropTypes from "propTypes";
import { scryRenderedComponentsWithType } from "react-dom/test-utils";
import { render, unmountComponentAtNode, findDOMNode } from "react-dom";
import { Wrapper } from "./Wrapper";
import { domResultSet, componentResultSet, queryAll } from "./resultSet";
import { DomResultSet } from "types";

declare var jest:any;

let _setTimeout = setTimeout;

/*
 * get references to the real timeout functions
 */
if ("mock" in _setTimeout) {
    jest.useRealTimers();
    _setTimeout = setTimeout;
    jest.useFakeTimers();
}

function findByDisplayName (wrapper, displayName) {
    let renderOutput = wrapper.render();

    if (!Array.isArray(renderOutput)) {
        renderOutput = [renderOutput];
    }

    return renderOutput.filter((c) => c.type.displayName === displayName);
}

function find (domContainer, wrapper, instance, selector=null) {
    let matches;

    if (selector === null) {
        matches = [findDOMNode(wrapper)];
    } else if (typeof(selector) === "string" && selector[0].match(/^[A-Z]/)) {
        return componentResultSet(findByDisplayName(wrapper, selector), instance);
    } else if (typeof(selector) !== "string") {
        return componentResultSet(scryRenderedComponentsWithType(wrapper, selector), instance);
    } else {
        matches = queryAll(domContainer, selector);
    }

    return domResultSet(matches.filter((c) => c !== domContainer));
}

export const fromDom = (node) => domResultSet([node]);

export const waitForMs = (ms) => new Promise((resolve) => _setTimeout(resolve, ms));
export const waitForStackToUnwind = () => waitForMs(0);

interface RootResult {
    update: () => void;
    context: () => any;
    instance: () => any;
    state: (name?:string) => any;
    props: () => any;
    setProps: (props:any) => void;
    unmount: () => void;
    find: (selector?:string) => DomResultSet;
    findInBody: (selector) => DomResultSet;
    getDOMNode: () => HTMLElement;
    text: () => string;
    html: () => string;
    children: () => DomResultSet;
    setState: (state:any) => void;
    simulate: (type:string, e:any) => void;
    hasClass: (name:string) => boolean;
    ref: (name?:string) => any
}

export const mount = function (element, { context={} }={}) {
    let wrapper, instance;
    const domContainer = document.createElement("div");

    const childContextTypes = {};

    //Object.keys(context).forEach((k) => childContextTypes[k] = PropTypes.any);

    const _Wrapper = class extends Wrapper {
        static childContextTypes = childContextTypes;

        getChildContext () {
            return context;
        }
    };

    render(<_Wrapper
        setWrapperRef={(r) => wrapper = r}
        setInstanceRef={(r) => instance = r}
        element={element} />, domContainer);

    const obj:RootResult = {
        update: () => {
            render(<_Wrapper
                // ref setters do not need to be set again since:
                // 1. wrapper is (or should be) the same copmonent instance
                // 2. element instance is replaced in each render but the ref setter is also called
                element={element} />, domContainer);
        },
        context: () => context,
        instance: () => instance,
        state: (name) => (name ? instance.state[name] : instance.state),
        props: () => wrapper.getProps(),
        setProps: (props) => wrapper.setProps(props),
        unmount: () => unmountComponentAtNode(domContainer),
        find: (selector) => find(domContainer, wrapper, instance, selector),
        findInBody: (selector) => find(document.body, wrapper, instance, selector),
        getDOMNode: () => obj.find()[0],
        text: () => obj.find().text() as string,
        html: () => obj.find().html() as string,
        children: () => domResultSet(obj.getDOMNode().children),
        setState: (state) => instance.setState(state),
        simulate: (type, e) => obj.find().simulate(type, e),
        hasClass: (name) => obj.find().hasClass(name),
        ref: (name) => name ? instance.refs[name] : instance.refs,
    };

    return obj;
};