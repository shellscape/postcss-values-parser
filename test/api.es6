import chai from 'chai';
import Parser from '../lib/parser';

let expect = chai.expect;

describe('Parser → API', () => {

  it('should walk', () => {
    let source = '5px solid blue';
    let ast = new Parser(source).parse();
    let expected = ['number', 'word', 'word'];

    ast.first.walk((node, index) => {
      expect(node.type).to.equal(expected[index]);
    });
  });

  it('should walk a type string', () => {
    let source = '5px solid blue';
    let ast = new Parser(source).parse();
    let expected = ['solid', 'blue'];
    let index = 0;

    ast.first.walkType('word', (node) => {
      expect(node.value).to.equal(expected[index]);
      index ++;
    });
  });

  it('should walk a type constructor', () => {
    let source = '/*1*/ 5px /* 2 */';
    let ast = new Parser(source).parse();
    let expected = ['1', '2'];
    let index = 0;

    expect(ast.first.walkComments).to.exist;

    ast.first.walkComments((node) => {
      expect(node.value).to.equal(expected[index]);
      index ++;
    });
  });
});
