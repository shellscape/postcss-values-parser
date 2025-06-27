import { Container as PostCssContainer } from 'postcss';
import { Node, NodeOptions } from './Node.js';
export declare class Container extends PostCssContainer {
    readonly value: string;
    constructor(options?: NodeOptions);
    add(node: Container | Node): this;
    toString(stringifier?: import("../stringify.js").Stringifier): string;
}
