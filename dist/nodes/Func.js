import { Container } from './Container.js';
const reColorFunctions = /^(hsla?|hwb|(ok)?lab|(ok)?lch|rgba?)$/i;
const reVar = /^var$/i;
export class Func extends Container {
    constructor(options) {
        super(options);
        this.isColor = false;
        this.isVar = false;
        this.name = '<unknown>';
        this.params = '';
        this.type = 'func';
        if (options && options.node && options.node.type === 'Function') {
            this.name = options.node.name;
            this.isColor = reColorFunctions.test(this.name);
            this.isVar = reVar.test(this.name);
            this.params = '';
        }
    }
}
//# sourceMappingURL=Func.js.map