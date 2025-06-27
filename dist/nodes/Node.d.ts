import { CssNode } from 'css-tree';
import { Node as PostCssNode } from 'postcss';
export interface NodeOptions {
    node?: CssNode;
    value?: string;
    parent?: any;
}
export declare class Node extends PostCssNode {
    readonly value: string;
    constructor(options?: NodeOptions);
    toString(stringifier?: import("../stringify.js").Stringifier): string;
}
