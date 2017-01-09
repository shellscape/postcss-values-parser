'use strict';

const expect = require('chai').expect;
const Parser = require('../lib/parser');

describe('Parser → Basic Tests', () => {

  let fixtures = [
    { value: '#ffffff', expected: 1 },
    { value: '#fff #000 #ccc #ddd', expected: 4 },
    { value: '()', expected: 2 },
    { value: '(foo)', expected: 3 },
    { value: '(foo bar)', expected: 4 },
    { value: 'rgb(255px)', expected: 1 },
    { value: 'url(foo/bar.jpg), url(`http://website.com/img.jpg)', expected: 3 },
    { value: 'rgb(255) foo', expected: 2 },
    { value: 'rgb(255, 255)', expected: 1 },
    { value: ' rgba( 34 , 45 , 54, .5 ) ', expected: 1 },
    { value: '( calc((foo ) ))word', expected: 4 },
    { value: 'w1 w2 w6 \n f(4) ( ) () \t "s\'t" \'st\\"2\'', expected: 10 },
    { value: '/*comment*/', expected: 1 },
    { value: '/*comment*/ 1px /* unclosed */', expected: 3 }
  ];

  fixtures.forEach((fixture) => {
    it('should parse ' + fixture.value.replace(/\n/g, '\\n').replace(/\t/g, '\\t'), () => {
      let ast = new Parser(fixture.value).parse();

      expect(ast.first.nodes.length).to.equal(fixture.expected);
    });
  });

});
