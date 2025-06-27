import { Node, NodeOptions } from './Node.js';
export declare class Quoted extends Node {
    readonly quote: string;
    readonly contents: string;
    type: string;
    constructor(options: NodeOptions);
}
