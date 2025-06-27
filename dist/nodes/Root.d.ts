import { Root as PostCssRoot } from 'postcss';
import { Node, NodeOptions } from './Node.js';
export declare class Root extends PostCssRoot {
    readonly value = "";
    type: 'root';
    constructor(options?: NodeOptions);
    add(node: Node): this;
    toString(stringifier?: import("../stringify.js").Stringifier): string;
}
