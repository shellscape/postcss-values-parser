import { Node } from './Node.js';
export class Punctuation extends Node {
    constructor(options) {
        super(options);
        this.type = 'punctuation';
        if (options && options.node) {
            const node = options.node;
            this.value = node.value;
        }
        else if (options && options.value) {
            this.value = options.value;
        }
    }
}
//# sourceMappingURL=Punctuation.js.map