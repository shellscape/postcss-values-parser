'use strict';

const expect = require('chai').expect;
const Parser = require('../lib/parser');

describe('Node → toString', () => {

  let fixtures = [
    '#ffffff',
    '#fff #000 #ccc #ddd',
    '()',
    '(foo)',
    '(foo bar)',
    '1 2em 3px 4vw 5',
    'rgb(255px)',
    'url(foo/bar.jpg), url(`http://website.com/img.jpg)',
    'rgb(255) foo',
    'rgb(255, 255)',
    ' rgba( 34 , 45 , 54, .5 ) ',
    '( calc((foo ) ))word',
    'w1 w2 w6 \n f(4) ( ) () \t "s\'t" \'st\\"2\'',
    '/*comment*/',
    '/*comment*/ 1px /* another */',
    'bold italic 12px/3 \'Open Sans\', Arial, "Helvetica Neue", sans-serif',
    'background-image:linear-gradient(45deg,transparent 25%,hsla(0,0%,100%,.2) 25%,hsla(0,0%,100%,.2) 75%,transparent 75%,transparent 25%,hsla(0,0%,100%,.2) 75%,transparent 75%,transparent),linear-gradient(45deg,transparent 25%,hsla(0,0%,100%,.2))'
  ];

  fixtures.forEach((fixture) => {
    it('should parse ' + fixture.replace(/\n/g, '\\n').replace(/\t/g, '\\t'), () => {
      let ast = new Parser(fixture).parse(),
        result = ast.toString();

      expect(result).to.equal(fixture);
    });
  });

});
