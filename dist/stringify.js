const stringifyNode = (node, builder, parentNode, index) => {
    const needsSpaceAfter = (prevNode, currentNode) => {
        if (!prevNode)
            return false;
        if (prevNode.type === 'operator' || currentNode.type === 'operator')
            return false;
        if (prevNode.type === 'punctuation' || currentNode.type === 'punctuation')
            return false;
        return true;
    };
    if (parentNode && parentNode.nodes && index !== undefined && index > 0) {
        const prevNode = parentNode.nodes[index - 1];
        if (needsSpaceAfter(prevNode, node)) {
            builder(' ');
        }
    }
    switch (node.type) {
        case 'root':
            if (node.nodes) {
                for (let i = 0; i < node.nodes.length; i++) {
                    stringifyNode(node.nodes[i], builder, node, i);
                }
            }
            break;
        case 'func':
            builder(node.name, node, 'start');
            builder('(', node);
            if (node.nodes) {
                for (let i = 0; i < node.nodes.length; i++) {
                    stringifyNode(node.nodes[i], builder, node, i);
                }
            }
            builder(')', node, 'end');
            break;
        case 'parentheses':
            builder('(', node, 'start');
            if (node.nodes) {
                for (let i = 0; i < node.nodes.length; i++) {
                    stringifyNode(node.nodes[i], builder, node, i);
                }
            }
            builder(')', node, 'end');
            break;
        case 'word':
        case 'numeric':
        case 'operator':
        case 'quoted':
        case 'unicodeRange':
        case 'punctuation':
            builder(node.value || '', node);
            break;
        case 'comment':
            if (node.inline) {
                builder(`//${node.text}`, node);
            }
            else {
                builder(`/*${node.text}*/`, node);
            }
            break;
        default:
            if (node.value) {
                builder(node.value, node);
            }
            break;
    }
};
export const stringify = (node, builder) => {
    stringifyNode(node, builder);
};
//# sourceMappingURL=stringify.js.map