import { List, parse as parseAst } from 'css-tree';
import { AstError, ParseError } from './errors.js';
import * as Nodes from './nodes/index.js';
const assign = (parent, nodes) => {
    for (const node of nodes) {
        let newNode;
        switch (node.type) {
            case 'Function':
                newNode = new Nodes.Func({ node });
                break;
            case 'Url':
                newNode = new Nodes.Word({
                    node: {
                        ...node,
                        type: 'Identifier',
                        name: node.value || ''
                    }
                });
                newNode.value = node.value || '';
                break;
            case 'Dimension':
            case 'Number':
            case 'Percentage':
                newNode = new Nodes.Numeric({ node });
                break;
            case 'Operator':
                newNode = new Nodes.Operator({ node });
                break;
            case 'UnicodeRange':
                newNode = new Nodes.UnicodeRange({ node });
                break;
            case 'String':
                newNode = new Nodes.Quoted({ node });
                break;
            case 'Hash':
            case 'Identifier':
                newNode = new Nodes.Word({ node });
                break;
            case 'Parentheses':
                newNode = new Nodes.Parentheses({ node });
                break;
            default:
                newNode = new Nodes.Word({ node });
                break;
        }
        const maybeParent = node;
        if (maybeParent.children &&
            (newNode instanceof Nodes.Container ||
                newNode instanceof Nodes.Func ||
                newNode instanceof Nodes.Parentheses)) {
            let children;
            if (maybeParent.children instanceof List) {
                children = maybeParent.children.toArray();
            }
            else {
                children = maybeParent.children;
            }
            assign(newNode, children);
        }
        parent.add(newNode);
    }
};
export const parse = (css, _opts) => {
    let ast;
    const root = new Nodes.Root({
        node: {
            type: 'Value',
            loc: {
                source: css,
                start: { line: 1, column: 1 },
                end: { line: 1, column: css.length + 1 }
            }
        }
    });
    try {
        ast = parseAst(css, {
            context: 'value',
            positions: true
        });
    }
    catch (error) {
        throw new ParseError(error);
    }
    if (!(ast === null || ast === void 0 ? void 0 : ast.children)) {
        throw new AstError();
    }
    const nodes = ast.children.toArray();
    if (!nodes.length) {
        throw new AstError();
    }
    const assignWithSource = (parent, nodes, originalCss) => {
        for (const node of nodes) {
            let newNode;
            const nodeOptions = {
                node: {
                    ...node,
                    loc: node.loc
                        ? {
                            ...node.loc,
                            source: originalCss
                        }
                        : undefined
                }
            };
            switch (node.type) {
                case 'Function':
                    newNode = new Nodes.Func(nodeOptions);
                    break;
                case 'Url':
                    newNode = new Nodes.Word({
                        node: {
                            ...nodeOptions.node,
                            type: 'Identifier',
                            name: node.value || ''
                        }
                    });
                    newNode.value = node.value || '';
                    break;
                case 'Dimension':
                case 'Number':
                case 'Percentage':
                    newNode = new Nodes.Numeric(nodeOptions);
                    break;
                case 'Operator':
                    newNode = new Nodes.Operator(nodeOptions);
                    break;
                case 'UnicodeRange':
                    newNode = new Nodes.UnicodeRange(nodeOptions);
                    break;
                case 'String':
                    newNode = new Nodes.Quoted(nodeOptions);
                    break;
                case 'Hash':
                case 'Identifier':
                    newNode = new Nodes.Word(nodeOptions);
                    break;
                case 'Parentheses':
                    newNode = new Nodes.Parentheses(nodeOptions);
                    break;
                default:
                    newNode = new Nodes.Word(nodeOptions);
                    break;
            }
            const maybeParent = node;
            if (maybeParent.children &&
                (newNode instanceof Nodes.Container ||
                    newNode instanceof Nodes.Func ||
                    newNode instanceof Nodes.Parentheses)) {
                let children;
                if (maybeParent.children instanceof List) {
                    children = maybeParent.children.toArray();
                }
                else {
                    children = maybeParent.children;
                }
                assignWithSource(newNode, children, originalCss);
            }
            parent.add(newNode);
        }
    };
    assignWithSource(root, nodes, css);
    return root;
};
//# sourceMappingURL=parser.js.map