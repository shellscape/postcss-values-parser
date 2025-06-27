import { Input, Container as PostCssContainer } from 'postcss';
import { stringify } from '../stringify.js';
export class Container extends PostCssContainer {
    constructor(options) {
        super({});
        this.value = '';
        if (!this.nodes)
            this.nodes = [];
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
    add(node) {
        return this.push(node);
    }
    toString(stringifier = stringify) {
        return super.toString(stringifier || stringify);
    }
}
//# sourceMappingURL=Container.js.map