import { Node } from './Node.js';
export class Numeric extends Node {
    constructor(options) {
        super(options);
        this.unit = '';
        this.type = 'numeric';
        if (options &&
            options.node &&
            (options.node.type === 'Dimension' ||
                options.node.type === 'Number' ||
                options.node.type === 'Percentage')) {
            const node = options.node;
            if (node.type === 'Dimension') {
                this.unit = node.unit;
                this.value = String(node.value);
            }
            else if (node.type === 'Number') {
                this.unit = '';
                this.value = String(node.value);
            }
            else if (node.type === 'Percentage') {
                this.unit = '%';
                this.value = String(node.value) + '%';
            }
        }
    }
}
//# sourceMappingURL=Numeric.js.map