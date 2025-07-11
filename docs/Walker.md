# Walker

The walker functionality provides methods to traverse the AST and find nodes of specific types. Walker methods are automatically registered on Container and Root nodes, allowing you to search for and iterate over nodes throughout the entire AST.

## Registration

Walker methods are registered using the `registerWalkers` function:

```js
const { registerWalkers, Container } = require('postcss-values-parser');

// Register all walker methods on the Container prototype
registerWalkers(Container);
```

## Available Walker Methods

The following walker methods are automatically registered and available on all Container and Root nodes:

### `walkFuncs(callback)`

Walks through all function nodes in the AST.

#### Parameters

#### `callback`

Type: `Function`<br>
_Required_

A function that receives each function node and its index.

```js
root.walkFuncs((node, index) => {
  console.log(`Function ${index}: ${node.name}`);
});
```

### `walkWords(callback)`

Walks through all word nodes in the AST.

#### Parameters

#### `callback`

Type: `Function`<br>
_Required_

A function that receives each word node and its index.

```js
root.walkWords((node, index) => {
  console.log(`Word ${index}: ${node.value}`);
});
```

### `walkNumerics(callback)`

Walks through all numeric nodes in the AST.

#### Parameters

#### `callback`

Type: `Function`<br>
_Required_

A function that receives each numeric node and its index.

```js
root.walkNumerics((node, index) => {
  console.log(`Numeric ${index}: ${node.value}${node.unit}`);
});
```

### `walkOperators(callback)`

Walks through all operator nodes in the AST.

#### Parameters

#### `callback`

Type: `Function`<br>
_Required_

A function that receives each operator node and its index.

```js
root.walkOperators((node, index) => {
  console.log(`Operator ${index}: ${node.value}`);
});
```

### `walkQuoteds(callback)`

Walks through all quoted string nodes in the AST.

#### Parameters

#### `callback`

Type: `Function`<br>
_Required_

A function that receives each quoted node and its index.

```js
root.walkQuoteds((node, index) => {
  console.log(`Quoted ${index}: ${node.value}`);
});
```

### `walkUnicodeRanges(callback)`

Walks through all unicode range nodes in the AST.

#### Parameters

#### `callback`

Type: `Function`<br>
_Required_

A function that receives each unicode range node and its index.

```js
root.walkUnicodeRanges((node, index) => {
  console.log(`Unicode Range ${index}: ${node.name}`);
});
```

### `walkComments(callback)`

Walks through all comment nodes in the AST.

#### Parameters

#### `callback`

Type: `Function`<br>
_Required_

A function that receives each comment node and its index.

```js
root.walkComments((node, index) => {
  console.log(`Comment ${index}: ${node.text}`);
});
```

### `walkPunctuations(callback)`

Walks through all punctuation nodes in the AST.

#### Parameters

#### `callback`

Type: `Function`<br>
_Required_

A function that receives each punctuation node and its index.

```js
root.walkPunctuations((node, index) => {
  console.log(`Punctuation ${index}: ${node.value}`);
});
```

### `walkType(type, callback)`

Walks through all nodes of a specific type in the AST. This is a general-purpose walker that can target any node type, making it useful for custom node types or when you need to walk multiple types programmatically.

#### Parameters

#### `type`

Type: `String`<br>
_Required_

The type of nodes to walk through. This should match the `type` property of the nodes you want to visit. Valid types include:
- `'word'` - Word nodes
- `'numeric'` - Numeric nodes
- `'func'` - Function nodes
- `'quoted'` - Quoted string nodes
- `'operator'` - Operator nodes
- `'punctuation'` - Punctuation nodes
- `'comment'` - Comment nodes
- `'unicodeRange'` - Unicode range nodes
- `'parentheses'` - Parentheses nodes
- Any custom node type

#### `callback`

Type: `Function`<br>
_Required_

A function that receives each node of the specified type and its index.

```js
// Walk through word nodes
root.walkType('word', (node, index) => {
  console.log(`Word ${index}: ${node.value}`);
});

// Walk through function nodes
root.walkType('func', (node, index) => {
  console.log(`Function ${index}: ${node.name}`);
});

// Programmatic usage
const nodeType = 'numeric';
root.walkType(nodeType, (node, index) => {
  console.log(`${nodeType} ${index}: ${node.value}${node.unit}`);
});
```

## Callback Function

All walker methods accept a callback function with the following signature:

```js
function callback(node, index) {
  // node: The current node being visited
  // index: The index of this node type (0-based)
  
  // Return false to stop walking
  if (someCondition) {
    return false;
  }
  
  // Continue walking by returning nothing or true
}
```

## Example Usage

```js
const { parse } = require('postcss-values-parser');

const root = parse('calc(100px + 20%) url("image.jpg") #fff');

// Find all numeric values
let numerics = [];
root.walkNumerics((node) => {
  numerics.push(node);
});

console.log(numerics); // Array of numeric nodes

// Find all functions
root.walkFuncs((node) => {
  console.log(`Found function: ${node.name}`);
  
  // Walk through function parameters
  node.walkWords((word) => {
    console.log(`  Parameter: ${word.value}`);
  });
});

// Stop walking early
root.walkWords((node, index) => {
  console.log(`Word ${index}: ${node.value}`);
  
  // Stop after finding 3 words
  if (index >= 2) {
    return false;
  }
});
```

## Notes

- Walker methods traverse the entire AST recursively, visiting nested nodes
- The index parameter in callbacks represents the count of nodes of that specific type encountered
- Returning `false` from a callback stops the walking process
- Walker methods are available on all Container and Root nodes
- Walking is depth-first, visiting parent nodes before their children
- Walker methods respect the AST structure and only visit nodes of the specified type
- The `walkType` method is particularly useful for programmatic traversal where the node type is determined at runtime
- All walker methods are registered automatically when the module is loaded via `registerWalkers()`