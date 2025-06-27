import * as Nodes from './nodes/index.js';
export interface ParseOptions {
    ignoreUnknownWords?: boolean;
    interpolation?: boolean | InterpolationOptions;
    variables?: VariablesOptions;
}
export interface InterpolationOptions {
    prefix: string;
}
export interface VariablesOptions {
    prefixes: string[];
}
export declare const parse: (css: string, _opts?: ParseOptions) => Nodes.Root;
