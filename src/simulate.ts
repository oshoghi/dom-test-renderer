import { Simulate } from "react-dom/test-utils";

function mustBeOne (arr) {
    if (arr.length !== 1) {
        throw "expect exactly 1 target, but found " + arr.length;
    }
}

function caseEventType (type) {
    const eventMap = {
        keydown: "keyDown",
        keyup: "keyUp",
        mousedown: "mouseDown",
        mouseup: "mouseUp",
        mouseenter: "mouseEnter",
        mouseleave: "mouseLeave",
        dragover: "dragOver",
        dragenter: "dragEnter",
        dragstart: "dragStart",
        dragend: "dragEnd",
        contextmenu: "contextMenu",
    };

    return (type in eventMap ? eventMap[type] : type);
}

/*
 * people might call simulate event without the right casing (we do it all over the place).
 */
function simulateEvent (nodes, type, args) {
    mustBeOne(nodes);

    Simulate[caseEventType(type.toLowerCase())](nodes[0], args);

    return nodes;
}

export { mustBeOne, simulateEvent };
