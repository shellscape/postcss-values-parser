# Parser

The parser converts CSS value strings into an Abstract Syntax Tree (AST). It uses [css-tree](https://github.com/csstree/csstree) under the hood, then maps css-tree nodes to this package’s node classes.

## parse(css, options?)

Converts a CSS value string into an AST with a `Root` node. The optional `options` argument is accepted for forward‑compatibility in v7 but is currently ignored.

### Parameters

#### `css`

Type: `string` (required)

Any valid CSS value string, such as:

- `10px solid red`
- `calc(100% - 20px)`
- `rgba(255, 0, 0, 0.5)`
- `url("image.jpg") center/cover`

### Returns

`Root` — the root of the parsed AST.

### Example

```js
import { parse } from 'postcss-values-parser';

const root = parse('10px solid red');
console.log(root.nodes.length); // 3
```

### Notes on options

The `parse(css, options?)` signature accepts an optional second argument for forward‑compatibility, but the current implementation does not use any options. Passing options has no effect in v7.

## Implementation details

The parser uses css-tree for tokenization and parsing, then maps css-tree node types to postcss-values-parser node types:

### Node Type Mapping

Node type mapping:

- `Function` → `Func`
- `Dimension` → `Numeric`
- `Number` → `Numeric`
- `Percentage` → `Numeric`
- `Operator` → `Operator`
- `UnicodeRange` → `UnicodeRange`
- `String` → `Quoted`
- `Hash` → `Word`
- `Identifier` → `Word`
- `Parentheses` → `Parentheses`
- `Url` → `Word` (special handling)

### Special Handling

#### URL nodes

When css-tree produces a `Url` node, it is represented as a `Word` node whose `value` is the URL string. For these nodes:

- `isUrl` is `true`
- `isParseableUrl` reflects whether the URL string is parseable (via `is-url-superb`)

Both `url(https://google.com)` and `url('https://google.com')` normalize to the same `Word` value (`https://google.com`) because css-tree emits the same `Url` node shape for quoted and unquoted forms.

#### Fallback Behavior

Unknown or unrecognized node types are parsed as `Word` nodes to ensure the parser doesn't fail on unexpected input.

#### Source mapping

The parser preserves source locations from the original CSS string, including:

- Line and column positions
- Start and end offsets
- Original source text

```js
import { parse } from 'postcss-values-parser';

const root = parse('calc(100px + 20%)');
// Each node maintains source position information
```

## Error Handling

The parser throws specific error types for different failure scenarios:

### ParseError

Thrown when the underlying css-tree parser encounters invalid syntax:

```js
import { parse, ParseError } from 'postcss-values-parser';

try {
  const root = parse('invalid @#$% syntax');
} catch (error) {
  if (error instanceof ParseError) {
    console.log('Parser failed:', error.message);
  }
}
```

### AstError

Thrown when the parsed AST is invalid or empty:

```js
import { AstError, parse } from 'postcss-values-parser';

try {
  const root = parse('');
} catch (error) {
  if (error instanceof AstError) {
    console.log('Empty or invalid AST');
  }
}
```

## Advanced Usage

### Custom Node Creation

The parser creates nodes using the NodeOptions interface:

```typescript
interface NodeOptions {
  node?: CssNode; // Original css-tree node
  value?: string; // String value
  parent?: any; // Parent node
}

interface WordOptions extends NodeOptions {
  fromUrlFunc?: boolean; // Internal marker for Word nodes mapped from css-tree Url
}
```

### Recursive Parsing

The parser recursively processes nested structures:

```js
const root = parse('calc(100px + min(50%, 200px))');
// Creates nested Func nodes with proper parent-child relationships
```

### Container Handling

Container nodes (Root, Func, Parentheses) automatically have their children parsed and added:

```js
const root = parse('calc(100px + 20%)');
const calcFunc = root.nodes[0];
console.log(calcFunc.nodes.length); // Contains parsed parameters
```

## Performance Considerations

- The parser processes the entire CSS value string in a single pass
- Source mapping information is preserved without significant performance impact
- Large or deeply nested values are handled efficiently
- Memory usage scales linearly with input size

## Browser and Environment Support

The parser works in all environments where css-tree is supported:

- Node.js (all supported versions)
- Modern browsers (ES2015+)
- Webpack/Rollup bundled applications
- TypeScript projects

## Examples

### Basic Value Parsing

```js
const root = parse('10px solid red');
console.log(root.nodes.map((n) => n.type)); // ['numeric', 'word', 'word']
```

### Function Parsing

```js
const root = parse('rgba(255, 0, 0, 0.5)');
const func = root.nodes[0];
console.log(func.name); // 'rgba'
console.log(func.isColor); // true
```

### Complex Value Parsing

```js
import { Container } from 'postcss';
import { parse, registerWalkers } from 'postcss-values-parser';

// Walker helpers are not auto-registered in v7
registerWalkers(Container);

const root = parse('calc(100% - 20px) url("bg.jpg") center/cover');
root.walkFuncs((func) => {
  console.log(`Function: ${func.name}`);
});
```

### Variable Parsing

```js
const root = parse('var(--primary-color)');
const func = root.nodes[0];
console.log(func.isVar); // true
```

## Notes

- The parser is built on top of css-tree for robust CSS parsing
- All CSS value types are supported including functions, calculations, and variables
- Source mapping information is preserved for debugging and tooling
- The parser is designed to be fault-tolerant and handle edge cases gracefully
- Performance is optimized for typical CSS value parsing use cases
