import { Node, NodeOptions } from './Node.js';
export declare class Word extends Node {
    readonly isColor: boolean;
    readonly isHex: boolean;
    readonly isUrl: boolean;
    readonly isVariable: boolean;
    type: string;
    constructor(options: NodeOptions);
}
