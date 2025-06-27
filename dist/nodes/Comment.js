import { Node } from './Node.js';
export class Comment extends Node {
    constructor(options) {
        super(options);
        this.inline = false;
        this.text = '';
        this.type = 'comment';
        if (options && options.node) {
            const node = options.node;
            const value = node.value || '';
            this.value = value;
            this.text = value.replace(/^\/\*|\*\/$/g, '').trim();
            this.inline = value.startsWith('//');
        }
        else if (options && options.value) {
            const value = options.value;
            this.value = value;
            this.text = value.replace(/^\/\*|\*\/$/g, '').trim();
            this.inline = value.startsWith('//');
        }
    }
}
//# sourceMappingURL=Comment.js.map