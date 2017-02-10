'use strict';

const expect = require('chai').expect;
const tokenize = require('../lib/tokenize');
const TokenizeError = require('../lib/errors/TokenizeError');

describe('Tokenize', () => {

  const passes = [
    { value: '5 + 5', expectedLength: 5 },
    { value: '#ffffff', expectedLength: 1 },
    { value: '-16px', expectedLength: 1 },
    { value: '-16px -1px -1px -16px', expectedLength: 7 },
    { value: '-webkit-transform cubic-bezier(0,.9,.05,1)', expectedLength: 12 },
    { value: '#ffffff', expectedLength: 1 },
    { value: '#fff #000 #ccc #ddd', expectedLength: 7 },
    { value: '( calc(( ) ))word', expectedLength: 11 },
    { value: ' rgba( 34 , 45 , 54, .5 ) ', expectedLength: 19 },
    { value: 'w1 w2 w6 \n f(4) ( ) () \t "s\'t" \'st\\"2\'', expectedLength: 21 },
    { value: '#ffffff', expectedLength: 1 },
    { value: 'Bond\\ 007', expectedLength: 4 },
    { value: ' \\"word\\\'"\\ \\\t ', expectedLength: 7 },
    { value: 'bar(baz(black, 10%), 10%)', expectedLength: 13 },
    { value: 'bar(baz(black, 10%), 10%)', expectedLength: 13 }
  ];

  passes.forEach((fixture) => {
    it('should tokenize ' + fixture.value.replace(/\n/g, '\\n').replace(/\t/g, '\\t'), () => {
      const tokens = tokenize(fixture.value);

      expect(tokens.length).to.equal(fixture.expectedLength);
    });
  });

  const failures = [
    '5 +5',
    '5 -5px',
    '- 16px',
    '16px- 16px'
  ];

  failures.forEach((fixture) => {
    it('should throw a TokenizeError error ' + fixture, () => {
      const fn = () => tokenize(fixture);
      expect(fn).to.throw(TokenizeError);
    });
  });

});
