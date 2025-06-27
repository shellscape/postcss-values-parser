import { Input, Node as PostCssNode } from 'postcss';
import { stringify } from '../stringify.js';
export class Node extends PostCssNode {
    constructor(options) {
        super({});
        this.value = '';
        if (!options)
            return;
        if (options.value) {
            this.value = options.value;
        }
        if (options.parent) {
            this.parent = options.parent;
        }
        if (options.node && options.node.loc) {
            const { end, source, start } = options.node.loc;
            this.source = { end, input: new Input(source), start };
        }
    }
    toString(stringifier = stringify) {
        return super.toString(stringifier || stringify);
    }
}
//# sourceMappingURL=Node.js.map