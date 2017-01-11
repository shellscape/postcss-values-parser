'use strict';

const expect = require('chai').expect;
const tokenize = require('../lib/tokenize');

describe('Tokenize', () => {

  let fixtures = [
    { value: '#ffffff', expectedLength: 1 },
    { value: '#fff #000 #ccc #ddd', expectedLength: 7 },
    { value: '( calc(( ) ))word', expectedLength: 11 },
    { value: ' rgba( 34 , 45 , 54, .5 ) ', expectedLength: 19 },
    { value: 'w1 w2 w6 \n f(4) ( ) () \t "s\'t" \'st\\"2\'', expectedLength: 21 },
    { value: '#ffffff', expectedLength: 1 },
    { value: 'Bond\\ 007', expectedLength: 4 },
    { value: ' \\"word\\\'"\\ \\\t ', expectedLength: 7 },
    { value: 'bar(baz(black, 10%), 10%)', expectedLength: 13 }
  ];

  fixtures.forEach((fixture) => {
    it('should tokenize ' + fixture.value.replace(/\n/g, '\\n').replace(/\t/g, '\\t'), () => {
      let tokens = tokenize(fixture.value);

      expect(tokens.length).to.equal(fixture.expectedLength);
    });
  });
});
