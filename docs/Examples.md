# Examples

This document provides comprehensive examples of using postcss-values-parser to parse, manipulate, and stringify CSS values.

## Basic Usage

### Simple Value Parsing

```js
const { parse } = require('postcss-values-parser');

// Parse a simple value
const root = parse('10px solid red');
console.log(root.nodes.length); // 3

// Access individual nodes
const [size, style, color] = root.nodes;
console.log(size.type);    // 'numeric'
console.log(size.value);   // '10'
console.log(size.unit);    // 'px'
console.log(style.type);   // 'word'
console.log(style.value);  // 'solid'
console.log(color.type);   // 'word'
console.log(color.value);  // 'red'
console.log(color.isColor); // true
```

### Function Parsing

```js
const { parse } = require('postcss-values-parser');

// Parse a function value
const root = parse('rgba(255, 0, 0, 0.5)');
const func = root.nodes[0];

console.log(func.type);     // 'func'
console.log(func.name);     // 'rgba'
console.log(func.isColor);  // true
console.log(func.nodes.length); // Number of parameters

// Access function parameters
func.nodes.forEach((param, index) => {
  console.log(`Parameter ${index}: ${param.type} = ${param.value}`);
});
```

### Complex Value Parsing

```js
const { parse } = require('postcss-values-parser');

// Parse a complex background value
const root = parse('url("image.jpg") center/cover no-repeat');

root.nodes.forEach((node, index) => {
  console.log(`Node ${index}: ${node.type} = ${node.value}`);
});

// Parse calc() with nested expressions
const calcRoot = parse('calc(100% - 20px + 5em)');
const calcFunc = calcRoot.nodes[0];

console.log(calcFunc.name); // 'calc'
calcFunc.walkNumerics((numeric) => {
  console.log(`${numeric.value}${numeric.unit}`);
});
```

## Walking the AST

### Finding Specific Node Types

```js
const { parse } = require('postcss-values-parser');

const root = parse('calc(100px + 20%) url("bg.jpg") #fff');

// Find all numeric values
const numerics = [];
root.walkNumerics((node) => {
  numerics.push(node);
});
console.log(numerics.length); // 2

// Find all functions
root.walkFuncs((func) => {
  console.log(`Function: ${func.name}`);
  if (func.isColor) {
    console.log('  This is a color function');
  }
});

// Find all words
root.walkWords((word) => {
  console.log(`Word: ${word.value}`);
  if (word.isColor) {
    console.log('  This is a color word');
  }
  if (word.isHex) {
    console.log('  This is a hex color');
  }
});
```

### Conditional Walking

```js
const { parse } = require('postcss-values-parser');

const root = parse('10px 20px 30px 40px');

// Stop walking after finding 2 numeric values
let count = 0;
root.walkNumerics((node) => {
  console.log(`Numeric ${count}: ${node.value}${node.unit}`);
  count++;
  
  if (count >= 2) {
    return false; // Stop walking
  }
});
```

### Walking by Type

```js
const { parse } = require('postcss-values-parser');

const root = parse('rgba(255, 0, 0, 0.5) solid 2px');

// Walk specific types programmatically
const typeToWalk = 'numeric';
root.walkType(typeToWalk, (node, index) => {
  console.log(`${typeToWalk} ${index}: ${node.value}${node.unit}`);
});

// Walk multiple types
['word', 'numeric', 'func'].forEach(type => {
  root.walkType(type, (node) => {
    console.log(`${type.toUpperCase()}: ${node.value || node.name}`);
  });
});
```

## Manipulating Values

### Modifying Existing Nodes

```js
const { parse } = require('postcss-values-parser');

const root = parse('10px solid red');

// Change a numeric value
root.walkNumerics((node) => {
  if (node.unit === 'px') {
    // Note: value is readonly, this is for illustration
    // In practice, you'd replace the node or create a new one
    console.log(`Converting ${node.value}px to rem`);
  }
});

// Find and modify words
root.walkWords((word) => {
  if (word.value === 'solid') {
    console.log('Found solid border style');
    // Replace with dashed
    // word.value = 'dashed'; // This won't work as value is readonly
  }
});
```

### Adding New Nodes

```js
const { parse, Word, Numeric } = require('postcss-values-parser');

const root = parse('10px solid');

// Add a new color word
const colorWord = new Word({ value: 'red' });
root.add(colorWord);

console.log(root.toString()); // '10px solid red'

// Add a numeric value
const root2 = parse('solid red');
const sizeNumeric = new Numeric({ value: '2px' });
root2.nodes.unshift(sizeNumeric); // Add at beginning

console.log(root2.toString()); // '2px solid red'
```

### Working with Functions

```js
const { parse, Func, Word, Numeric } = require('postcss-values-parser');

// Parse an existing function
const root = parse('rgb(255, 0, 0)');
const rgbFunc = root.nodes[0];

console.log(rgbFunc.name); // 'rgb'
console.log(rgbFunc.isColor); // true

// Create a new function
const calcFunc = new Func({ value: 'calc' });
// Note: In practice, you'd need to set up the function properly
// with name and parameters
```

## Custom Stringification

### Basic Custom Stringifier

```js
const { parse } = require('postcss-values-parser');

const root = parse('10px solid red');

// Uppercase all words
const uppercaseStringifier = (node, builder) => {
  if (node.type === 'word') {
    builder(node.value.toUpperCase());
  } else if (node.type === 'numeric') {
    builder(node.value + node.unit);
  } else if (node.nodes) {
    node.nodes.forEach(child => {
      uppercaseStringifier(child, builder);
    });
  } else {
    builder(node.value || '');
  }
};

console.log(root.toString(uppercaseStringifier)); // '10pxSOLIDRED'
```

### Advanced Custom Stringifier

```js
const { parse } = require('postcss-values-parser');

const root = parse('calc(100px + 20%)');

// Add spacing around operators
const spacedStringifier = (node, builder) => {
  if (node.type === 'operator') {
    builder(` ${node.value} `);
  } else if (node.type === 'func') {
    builder(node.name);
    builder('(');
    node.nodes.forEach((child, index) => {
      if (index > 0) builder(' ');
      spacedStringifier(child, builder);
    });
    builder(')');
  } else if (node.nodes) {
    node.nodes.forEach(child => {
      spacedStringifier(child, builder);
    });
  } else {
    builder(node.value || '');
  }
};

console.log(root.toString(spacedStringifier)); // 'calc(100px + 20%)'
```

## Working with Colors

### Identifying Colors

```js
const { parse } = require('postcss-values-parser');

const root = parse('#ff0000 rgb(0, 255, 0) blue transparent');

root.walkWords((word) => {
  if (word.isColor) {
    console.log(`Color word: ${word.value}`);
    if (word.isHex) {
      console.log('  This is a hex color');
    }
  }
});

root.walkFuncs((func) => {
  if (func.isColor) {
    console.log(`Color function: ${func.name}`);
  }
});
```

### Color Manipulation

```js
const { parse } = require('postcss-values-parser');

const root = parse('rgba(255, 0, 0, 0.5)');

root.walkFuncs((func) => {
  if (func.name === 'rgba') {
    console.log('Found RGBA function');
    
    // Access color components
    func.walkNumerics((numeric, index) => {
      console.log(`Component ${index}: ${numeric.value}`);
    });
  }
});
```

## Working with Variables

### CSS Custom Properties

```js
const { parse } = require('postcss-values-parser');

const root = parse('var(--primary-color)');
const varFunc = root.nodes[0];

console.log(varFunc.name);  // 'var'
console.log(varFunc.isVar); // true

// Find variable references
root.walkWords((word) => {
  if (word.isVariable) {
    console.log(`Variable: ${word.value}`);
  }
});
```

### SCSS/LESS Variables

```js
const { parse } = require('postcss-values-parser');

// Parse SCSS variables
const root = parse('$primary-color', {
  variables: { prefixes: ['--', '$'] }
});

root.walkWords((word) => {
  if (word.isVariable) {
    console.log(`SCSS Variable: ${word.value}`);
  }
});
```

## Error Handling

### Handling Parse Errors

```js
const { parse, ParseError, AstError } = require('postcss-values-parser');

function safeParse(css) {
  try {
    return parse(css);
  } catch (error) {
    if (error instanceof ParseError) {
      console.error('Parse error:', error.message);
      return null;
    } else if (error instanceof AstError) {
      console.error('AST error:', error.message);
      return null;
    } else {
      console.error('Unexpected error:', error);
      throw error;
    }
  }
}

// Test with invalid CSS
const result = safeParse('invalid css @#$%');
if (result) {
  console.log('Parsed successfully');
} else {
  console.log('Parsing failed');
}
```

### Defensive Programming

```js
const { parse } = require('postcss-values-parser');

function processValue(css) {
  let root;
  
  try {
    root = parse(css);
  } catch (error) {
    console.warn(`Failed to parse "${css}":`, error.message);
    return css; // Return original value
  }
  
  // Process the parsed value
  root.walkNumerics((numeric) => {
    console.log(`Found numeric: ${numeric.value}${numeric.unit}`);
  });
  
  return root.toString();
}

// Test with various inputs
const testValues = [
  '10px solid red',
  'calc(100% - 20px)',
  'invalid syntax',
  ''
];

testValues.forEach(value => {
  const result = processValue(value);
  console.log(`"${value}" -> "${result}"`);
});
```

## Performance Optimization

### Caching Parsed Results

```js
const { parse } = require('postcss-values-parser');

class ValueParser {
  constructor() {
    this.cache = new Map();
  }
  
  parse(css) {
    if (this.cache.has(css)) {
      return this.cache.get(css);
    }
    
    const root = parse(css);
    this.cache.set(css, root);
    return root;
  }
  
  clearCache() {
    this.cache.clear();
  }
}

const parser = new ValueParser();

// These will be cached
const root1 = parser.parse('10px solid red');
const root2 = parser.parse('10px solid red'); // Retrieved from cache
```

### Batch Processing

```js
const { parse } = require('postcss-values-parser');

function processValues(values) {
  const results = [];
  
  for (const value of values) {
    try {
      const root = parse(value);
      const numerics = [];
      
      root.walkNumerics((numeric) => {
        numerics.push(`${numeric.value}${numeric.unit}`);
      });
      
      results.push({
        original: value,
        numerics: numerics,
        parsed: root.toString()
      });
    } catch (error) {
      results.push({
        original: value,
        error: error.message
      });
    }
  }
  
  return results;
}

const values = [
  '10px solid red',
  'calc(100% - 20px)',
  'rgba(255, 0, 0, 0.5)',
  'url("image.jpg") center/cover'
];

const results = processValues(values);
console.log(results);
```

## Integration Examples

### PostCSS Plugin

```js
const { parse } = require('postcss-values-parser');

const myPlugin = () => {
  return {
    postcssPlugin: 'my-plugin',
    Declaration(decl) {
      // Parse the declaration value
      const root = parse(decl.value);
      
      // Find and modify numeric values
      let modified = false;
      root.walkNumerics((numeric) => {
        if (numeric.unit === 'px') {
          // Convert px to rem (example)
          // In practice, you'd create new nodes
          modified = true;
        }
      });
      
      if (modified) {
        decl.value = root.toString();
      }
    }
  };
};

myPlugin.postcssPlugin = 'my-plugin';
module.exports = myPlugin;
```

### Build Tool Integration

```js
const { parse } = require('postcss-values-parser');

function analyzeCSS(css) {
  const stats = {
    totalValues: 0,
    functions: new Set(),
    units: new Set(),
    colors: new Set()
  };
  
  // Parse each value (in practice, you'd extract values from CSS)
  const values = extractValuesFromCSS(css);
  
  values.forEach(value => {
    try {
      const root = parse(value);
      stats.totalValues++;
      
      root.walkFuncs((func) => {
        stats.functions.add(func.name);
      });
      
      root.walkNumerics((numeric) => {
        if (numeric.unit) {
          stats.units.add(numeric.unit);
        }
      });
      
      root.walkWords((word) => {
        if (word.isColor) {
          stats.colors.add(word.value);
        }
      });
    } catch (error) {
      console.warn(`Failed to parse value: ${value}`);
    }
  });
  
  return {
    totalValues: stats.totalValues,
    functions: Array.from(stats.functions),
    units: Array.from(stats.units),
    colors: Array.from(stats.colors)
  };
}

function extractValuesFromCSS(css) {
  // Simplified extraction - in practice, use a proper CSS parser
  return ['10px solid red', 'calc(100% - 20px)', 'rgba(255, 0, 0, 0.5)'];
}
```

## Testing

### Unit Tests

```js
const { parse } = require('postcss-values-parser');
const assert = require('assert');

describe('Value Parser', () => {
  it('should parse simple values', () => {
    const root = parse('10px solid red');
    assert.strictEqual(root.nodes.length, 3);
    assert.strictEqual(root.nodes[0].type, 'numeric');
    assert.strictEqual(root.nodes[1].type, 'word');
    assert.strictEqual(root.nodes[2].type, 'word');
  });
  
  it('should parse functions', () => {
    const root = parse('calc(100% - 20px)');
    assert.strictEqual(root.nodes.length, 1);
    assert.strictEqual(root.nodes[0].type, 'func');
    assert.strictEqual(root.nodes[0].name, 'calc');
  });
  
  it('should handle errors gracefully', () => {
    assert.throws(() => {
      parse('');
    }, /Invalid or empty AST/);
  });
});
```

## Notes

- Always handle parsing errors gracefully in production code
- Use walker methods for efficient AST traversal
- Consider caching parsed results for frequently used values
- Custom stringifiers allow for powerful value transformations
- The parser preserves source mapping information for debugging
- All examples can be adapted for use in various build tools and frameworks