export interface ElementCallback {
    (item:HTMLElement):any;
}

export interface ResultSetCallback {
    (item:DomResultSet):any;
}

export interface DomResultSet {
    at: (index:number) => DomResultSet;
    hasClass: (name:string) => boolean;
    children: () => DomResultSet;
    get: (index:number) => HTMLElement;
    attr: (name:string) => any;
    html: () => string|string[];
    map: (fn:ElementCallback) => any;
    forEach: (fn:ResultSetCallback) => void;
    not: (selector:string) => DomResultSet;
    simulate: (type:string, event:any) => DomResultSet;
    getDOMNode: () => HTMLElement;
    style: (key?:string) => any;
    text: () => string|string[];
    find: (selector:string) => DomResultSet;
    size: () => number;
    exists: () => boolean;
    first: () => DomResultSet;
    last: () => DomResultSet;
    className: () => string;
}