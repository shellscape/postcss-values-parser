const createWalker = (type) => {
    return function (callback) {
        let index = 0;
        const walk = (node) => {
            if (node.type === type.toLowerCase()) {
                const result = callback(node, index++);
                if (result === false)
                    return false;
            }
            if (node.nodes && node.nodes.length > 0) {
                for (const child of node.nodes) {
                    const result = walk(child);
                    if (result === false)
                        return false;
                }
            }
        };
        return walk(this);
    };
};
export const registerWalkers = (Container) => {
    const walkerTypes = [
        'Funcs',
        'Words',
        'Numerics',
        'Operators',
        'Quoteds',
        'UnicodeRanges',
        'Comments',
        'Punctuations',
        'Parentheses'
    ];
    for (const walkerType of walkerTypes) {
        const methodName = `walk${walkerType}`;
        let nodeType = walkerType.toLowerCase().slice(0, -1);
        if (nodeType === 'quote') {
            nodeType = 'quoted';
        }
        else if (nodeType === 'parenthese') {
            nodeType = 'parentheses';
        }
        else if (nodeType === 'unicoderange') {
            nodeType = 'unicodeRange';
        }
        Container.prototype[methodName] = createWalker(nodeType);
    }
    Container.prototype.walkType = function (type, callback) {
        return createWalker(type).call(this, callback);
    };
};
//# sourceMappingURL=walker.js.map