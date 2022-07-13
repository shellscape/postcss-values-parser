class BaseError extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export class AstError extends BaseError {
  constructor() {
    super('ERR_PARSE_AST', `The result AST contained no children, parsing has failed`);
  }
}

export class ParseError extends BaseError {
  constructor(error: any) {
    super('ERR_PARSE', `An error occurred while parsing the css value:\n${error.toString()}`);
  }
}
