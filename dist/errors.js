export class ParseError extends Error {
    constructor(error) {
        super(error.message);
        this.name = 'ParseError';
        this.stack = error.stack;
    }
}
export class AstError extends Error {
    constructor() {
        super('Invalid or empty AST');
        this.name = 'AstError';
    }
}
//# sourceMappingURL=errors.js.map