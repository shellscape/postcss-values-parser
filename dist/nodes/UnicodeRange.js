import { Node } from './Node.js';
export class UnicodeRange extends Node {
    constructor(options) {
        super(options);
        this.name = '';
        this.type = 'unicodeRange';
        if (options && options.node && options.node.type === 'UnicodeRange') {
            const node = options.node;
            this.value = node.value;
            this.name = node.value;
        }
        else if (options && options.value) {
            this.value = options.value;
            this.name = options.value;
        }
    }
}
//# sourceMappingURL=UnicodeRange.js.map