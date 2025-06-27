import { Input, Root as PostCssRoot } from 'postcss';
import { stringify } from '../stringify.js';
export class Root extends PostCssRoot {
    constructor(options) {
        super({});
        this.value = '';
        this.type = 'root';
        if (!this.nodes)
            this.nodes = [];
        if (!options)
            return;
        if (options.value) {
            this.value = options.value;
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
//# sourceMappingURL=Root.js.map