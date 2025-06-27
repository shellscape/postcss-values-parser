import { Node, NodeOptions } from './Node.js';
export declare class Comment extends Node {
    readonly inline: boolean;
    readonly text: string;
    type: string;
    constructor(options: NodeOptions);
}
