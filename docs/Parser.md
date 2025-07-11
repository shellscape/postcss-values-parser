# Parser

The parser is the core component that converts CSS value strings into Abstract Syntax Trees (ASTs). It handles the lexical analysis and parsing of CSS values, creating appropriate node types for different value components.

## parse(css, options)

The main parsing function that converts a CSS value string into an AST with a Root node.

### Parameters

#### `css`

Type: `String`<br>
_Required_

The CSS value string to parse. This can be any valid CSS value such as:
- `'10px solid red'`
- `'calc(100% - 20px)'`
- `'rgba(255, 0, 0, 0.5)'`
- `'url("image.jpg") center/cover'`

#### `options`

Type: `ParseOptions`<br>
_Optional_

Configuration options for the parser. See [ParseOptions](#parseoptions) below for details.

### Returns

Type: `Root`<br>

A Root node containing the parsed AST. The Root node has walker methods registered and provides access to all child nodes.

### Example Usage

```js
const { parse } = require('postcss-values-parser');

// Basic parsing
const root = parse('10px solid red');
console.log(root.nodes.length); // 3

// Parsing with options
const root2 = parse('calc(100px + var(--size))', {
  variables: { prefixes: ['--', '$'] }
});
```

## ParseOptions

The options object that configures parser behavior.

### Properties

#### `ignoreUnknownWords`

Type: `Boolean`<br>
Default: `false`

If `true`, allows unknown parts of the value to be parsed and added to the AST as Word nodes. If `false`, unknown values may cause parsing to fail or be handled with fallback behavior.

```js
const root = parse('custom-property-value', {
  ignoreUnknownWords: true
});
```

#### `interpolation`

Type: `Boolean | InterpolationOptions`<br>
Default: `false`

Enables parsing of interpolated values for preprocessor languages like SCSS, LESS, etc. When set to `true`, uses default interpolation settings. When set to an object, uses the specified interpolation configuration.

```js
// Enable basic interpolation
const root = parse('#{$variable}', {
  interpolation: true
});

// Custom interpolation prefix
const root2 = parse('@{variable}', {
  interpolation: { prefix: '@' }
});
```

#### `variables`

Type: `VariablesOptions`<br>
Default: `{ prefixes: ['--'] }`

Configures how variables are identified in the CSS value. By default, recognizes CSS custom properties (variables starting with `--`).

```js
// Support SCSS and LESS variables
const root = parse('$primary-color', {
  variables: { prefixes: ['--', '$', '@'] }
});
```

## Type Interfaces

### InterpolationOptions

```typescript
interface InterpolationOptions {
  prefix: string;
}
```

Defines the prefix character used for interpolation syntax.

### VariablesOptions

```typescript
interface VariablesOptions {
  prefixes: string[];
}
```

Defines the prefix characters that identify variables in CSS values.

## Parser Implementation Details

The parser uses the `css-tree` library for lexical analysis and AST generation, then transforms the generic CSS tree into postcss-values-parser specific node types.

### Node Type Mapping

The parser maps CSS-tree node types to postcss-values-parser node types:

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

#### URL Nodes

When the parser encounters a `Url` node from css-tree, it creates a `Word` node instead of a separate URL node type. This provides consistency with how URLs are handled in CSS values.

```js
const root = parse('url("image.jpg")');
const funcNode = root.nodes[0]; // Func node for url()
// The URL content is parsed as child nodes within the function
```

#### Fallback Behavior

Unknown or unrecognized node types are parsed as `Word` nodes to ensure the parser doesn't fail on unexpected input.

#### Source Mapping

The parser preserves source mapping information from the original CSS string, including:
- Line and column positions
- Start and end offsets
- Original source text

```js
const root = parse('calc(100px + 20%)', { positions: true });
// Each node maintains source position information
```

## Error Handling

The parser throws specific error types for different failure scenarios:

### ParseError

Thrown when the underlying css-tree parser encounters invalid syntax:

```js
const { parse, ParseError } = require('postcss-values-parser');

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
const { parse, AstError } = require('postcss-values-parser');

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
  node?: CssNode;    // Original css-tree node
  value?: string;    // String value
  parent?: any;      // Parent node
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
console.log(root.nodes.map(n => n.type)); // ['numeric', 'word', 'word']
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
const root = parse('calc(100% - 20px) url("bg.jpg") center/cover');
root.walkFuncs(func => {
  console.log(`Function: ${func.name}`);
});
```

### Variable Parsing

```js
const root = parse('var(--primary-color)', {
  variables: { prefixes: ['--'] }
});
const func = root.nodes[0];
console.log(func.isVar); // true
```

## Notes

- The parser is built on top of css-tree for robust CSS parsing
- All CSS value types are supported including functions, calculations, and variables
- Source mapping information is preserved for debugging and tooling
- The parser is designed to be fault-tolerant and handle edge cases gracefully
- Performance is optimized for typical CSS value parsing use cases