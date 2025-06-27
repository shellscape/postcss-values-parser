import { unquote } from 'quote-unquote';
import { Node } from './Node.js';
export class Quoted extends Node {
    constructor(options) {
        super(options);
        this.quote = '';
        this.contents = '';
        this.type = 'quoted';
        if (options && options.node && options.node.type === 'String') {
            const node = options.node;
            const contents = node.value;
            let fullValue = `"${contents}"`;
            let quote = '"';
            if (node.loc && node.loc.source && typeof node.loc.source === 'string') {
                const original = node.loc.source.substring(node.loc.start.offset, node.loc.end.offset);
                if (original) {
                    fullValue = original;
                    quote = original.charAt(0);
                }
            }
            this.value = fullValue;
            this.quote = quote;
            this.contents = contents;
        }
        else if (options && options.value) {
            const fullValue = options.value;
            const quote = fullValue.charAt(0);
            const contents = unquote(fullValue);
            this.value = fullValue;
            this.quote = quote;
            this.contents = contents;
        }
    }
}
//# sourceMappingURL=Quoted.js.map