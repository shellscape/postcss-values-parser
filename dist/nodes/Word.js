import colorNames from 'color-name';
import isUrl from 'is-url-superb';
import { Node } from './Node.js';
const reHex = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const reVariable = /^--/;
export class Word extends Node {
    constructor(options) {
        super(options);
        this.isColor = false;
        this.isHex = false;
        this.isUrl = false;
        this.isVariable = false;
        this.type = 'word';
        let value = '';
        if (options &&
            options.node &&
            (options.node.type === 'Identifier' ||
                options.node.type === 'Hash' ||
                options.node.type === 'String')) {
            const node = options.node;
            if (node.type === 'Identifier') {
                value = node.name;
            }
            else if (node.type === 'Hash') {
                value = `#${node.value}`;
            }
            else if (node.type === 'String') {
                value = node.value;
            }
            else {
                value = node.value || node.name || '';
            }
        }
        else if (options && options.value) {
            value = options.value;
        }
        this.value = value;
        this.isHex = reHex.test(value);
        this.isVariable = reVariable.test(value);
        this.isUrl = !this.isVariable && isUrl(value);
        this.isColor = this.isHex || colorNames[value.toLowerCase()] !== undefined;
    }
}
//# sourceMappingURL=Word.js.map