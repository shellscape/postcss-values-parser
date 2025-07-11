import { parse as parseInternal } from './parser.js';
import { stringify } from './stringify.js';
export { ParseError, AstError } from './errors.js';
export { registerWalkers } from './walker.js';
export * from './nodes/index.js';
export const parse = (css, options) => {
    const root = parseInternal(css, options);
    const ogToString = root.toString;
    function toString(stringifier) {
        return ogToString.bind(root)(stringifier || stringify);
    }
    root.toString = toString.bind(root);
    return root;
};
export const nodeToString = (node) => {
    let result = '';
    stringify(node, (bit) => {
        result += bit;
    });
    return result;
};
export { stringify };
//# sourceMappingURL=index.js.map