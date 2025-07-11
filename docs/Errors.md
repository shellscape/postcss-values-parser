# Errors

This module provides custom error classes for handling parsing failures and AST-related errors.

## ParseError

The `ParseError` class is thrown when the parser encounters invalid CSS syntax or fails to parse the input string.

### Properties

#### `name`

Type: `String`<br>
Value: `'ParseError'`

#### `message`

Type: `String`<br>

The error message describing what went wrong during parsing.

#### `stack`

Type: `String`<br>

The error stack trace from the underlying parsing error.

### Example Usage

```js
const { parse } = require('postcss-values-parser');

try {
  const root = parse('invalid css syntax @#$%');
} catch (error) {
  if (error instanceof ParseError) {
    console.log(error.name); // 'ParseError'
    console.log(error.message); // Description of the parsing error
  }
}
```

## AstError

The `AstError` class is thrown when the AST (Abstract Syntax Tree) is invalid or empty after parsing.

### Properties

#### `name`

Type: `String`<br>
Value: `'AstError'`

#### `message`

Type: `String`<br>
Value: `'Invalid or empty AST'`

### Example Usage

```js
const { parse } = require('postcss-values-parser');

try {
  const root = parse('');
} catch (error) {
  if (error instanceof AstError) {
    console.log(error.name); // 'AstError'
    console.log(error.message); // 'Invalid or empty AST'
  }
}
```

## Error Handling Best Practices

When using postcss-values-parser, it's recommended to handle both error types:

```js
const { parse, ParseError, AstError } = require('postcss-values-parser');

function safeParseValue(css) {
  try {
    return parse(css);
  } catch (error) {
    if (error instanceof ParseError) {
      console.error('Failed to parse CSS value:', error.message);
      // Handle parsing syntax errors
    } else if (error instanceof AstError) {
      console.error('Invalid AST generated:', error.message);
      // Handle empty or invalid AST
    } else {
      console.error('Unexpected error:', error);
      // Handle other unexpected errors
    }
    return null;
  }
}
```

## Notes

- Both error classes extend the standard JavaScript `Error` class
- `ParseError` wraps errors from the underlying CSS parser
- `AstError` indicates issues with the generated AST structure
- Error messages provide context about what went wrong during parsing
- Stack traces are preserved for debugging purposes