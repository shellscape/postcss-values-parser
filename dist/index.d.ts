import { ParseOptions } from './parser.js';
import { stringify } from './stringify.js';
export { ParseError, AstError } from './errors.js';
export { registerWalkers } from './walker.js';
export { ParseOptions } from './parser.js';
export * from './nodes/index.js';
interface Builder {
    (part: string, node?: any, type?: 'start' | 'end'): void;
}
export interface Stringifier {
    (node: any, builder: Builder): void;
}
export declare const parse: (css: string, options?: ParseOptions) => import("./nodes/Root.js").Root;
export declare const nodeToString: (node: any) => string;
export { stringify };
