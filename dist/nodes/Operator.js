import { Node } from './Node.js';
export class Operator extends Node {
    constructor(options) {
        super(options);
        this.type = 'operator';
        if (options && options.node && options.node.type === 'Operator') {
            const node = options.node;
            this.value = node.value;
        }
        else if (options && options.value) {
            this.value = options.value;
        }
    }
}
//# sourceMappingURL=Operator.js.map