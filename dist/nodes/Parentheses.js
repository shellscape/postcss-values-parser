import { Container } from './Container.js';
export class Parentheses extends Container {
    constructor(options) {
        super(options);
        this.type = 'parentheses';
        if (options.node) {
            this.value = '()';
        }
        else if (options.value) {
            this.value = options.value;
        }
    }
}
//# sourceMappingURL=Parentheses.js.map