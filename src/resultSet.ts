import { simulateEvent } from "./simulate";
import { findDOMNode } from "react-dom";
import { DomResultSet } from "types";

const atleastOne = (arr) => arr.length > 0
const flattenIfOne = (arr) => arr.length === 1 ? arr[0] : arr;
const getText = (nodes) => Array.from(nodes).map((n:HTMLElement) => n.textContent);
const getAttr = (nodes, name) => Array.from(nodes).map((n:HTMLElement) => name ? n.getAttribute(name) : n.attributes);
const getHTML = (nodes) => nodes.map((n) => !n ? n
    : n.outerHTML
        .replace(/data-reactroot="" ?/, "")
        .replace("<span >", "<span>")
        .replace("<div >", "<div>"));

/*
 * Same as querySelectorAll but includes the node itself too
 */
function queryAll (node, selector, includeSelf=true) {
    const matches = Array.from(node.querySelectorAll(selector));

    if (includeSelf && node.matches(selector) && matches.reduce((acc, n) => acc && n !== node, true)) {
        matches.push(node);
    }

    return matches;
}

function domResultSet (matches):DomResultSet {
    if (matches) {
        Object.defineProperties(matches, {
            at: {
                value: (index) => domResultSet([matches[index]])
            },
            hasClass: {
                value: (name) => matches.reduce((acc, n) => acc && n.classList.contains(name), !!matches.length)
            },
            children: {
                value: () => domResultSet(matches.reduce((acc, n) => acc.concat(Array.from(n.childNodes)), []))
            },
            get: {
                value: (index) => matches[index]
            },
            attr: {
                value: (name) => flattenIfOne(getAttr(matches, name))
            },
            html: {
                value: () => flattenIfOne(getHTML(matches))
            },
            map: {
                value: (fn) => Array.from(matches).map(fn)
            },
            forEach: {
                value: (fn) => {
                    for (let i = 0; i < matches.length; i++ ) {
                        fn(domResultSet([matches[i]]), i, matches);
                    }
                }
            },
            not: {
                value: (selector) => domResultSet(matches.filter((n) => !n.matches(selector)))
            },
            simulate: {
                value: (type, e) => simulateEvent(matches, type, e)
            },
            getDOMNode: {
                value: () => matches[0],
            },
            style: {
                value: (name) => flattenIfOne(matches.map((n) => name ? n.style[name] : n.style))
            },
            text: {
                value: () => flattenIfOne(getText(matches))
            },
            find: {
                value: (selector) => domResultSet(matches.reduce((acc, n) => acc.concat(queryAll(n, selector)), []))
            },
            first: {
                value: () => domResultSet([matches[0]])
            },
            last: {
                value: () => domResultSet([matches[matches.length - 1]])
            },
            className: {
                value: () => matches.attr("class")
            },
            size: {
                value: () => matches.length
            },
            exists: {
                value: () => matches.length > 0
            }
        });
    }

    return matches;
}

function componentResultSet (matches, instance) {
    if (matches) {
        Object.defineProperties(matches, {
            at: {
                value: (index) => componentResultSet([matches[index]], instance)
            },
            hasClass: {
                value: (name) => matches.getDOMNode().classList.contains(name)
            },
            instance: {
                value: () => matches[0],
            },
            get: {
                value: (index) => matches[index]
            },
            simulate: {
                value: (type, e) => simulateEvent(matches.getDOMNodes(), type, e)
            },
            getDOMNode: {
                value: () => flattenIfOne(matches.getDOMNodes())
            },
            getDOMNodes: {
                value: () => matches.map((component) => findDOMNode(component))
            },
            html: {
                value: () => flattenIfOne(getHTML(matches.getDOMNodes()))
            },
            text: {
                value: () => flattenIfOne(getText(matches.getDOMNodes()))
            },
            props: {
                value: () => matches[0].props
            },
            state: {
                value: () => matches[0].state
            },
            find: {
                value: (selector) => domResultSet(matches.getDOMNodes().reduce((acc, n) => acc.concat(queryAll(n, selector)), []))
            }
        });
    }

    return matches;
}

export { domResultSet, componentResultSet, queryAll };
