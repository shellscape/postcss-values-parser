import { Container } from './Container.js';
import { NodeOptions } from './Node.js';
export declare class Func extends Container {
    readonly isColor: boolean;
    readonly isVar: boolean;
    readonly name: string;
    readonly params: string;
    type: string;
    constructor(options: NodeOptions);
}
