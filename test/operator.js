'use strict';

const expect = require('chai').expect;
const Parser = require('../lib/parser');
const ParserError = require('../lib/errors/ParserError');

describe('Parser → Operator', () => {

  let fixtures = [
    {
      test: '5/5',
      expected: { value: '5', unit: '', length: 3 }
    },
    {
      test: '5+ 5',
      expected: { throw: true }
    },
    {
      test: 'calc(5+ 5)',
      expected: { throw: true }
    },
    {
      test: '5 +5',
      expected: { value: '+5', unit: '', length: 2 }
    },
    {
      test: 'calc(5 +5)',
      expected: { throw: true }
    },
    {
      test: '5px+5px',
      expected: { value: '+5', unit: 'px', length: 2 }
    },
    {
      test: 'calc(5+5)',
      expected: { throw: true }
    },
    {
      test: 'calc(5-5)',
      expected: { throw: true }
    },
    {
      test: 'calc(5*5)',
      expected: { throw: true }
    },
    {
      test: 'calc(5/5)',
      expected: { throw: true }
    },
    {
      test: 'calc(5%5)',
      expected: { throw: true }
    },
    {
      test: '5 + 5',
      expected: { throw: true }
    },
    {
      test: 'calc(5 + 5)',
      expected: { value: ')', length: 5 }
    },
    {
      test: 'calc(5 - 5)',
      expected: { value: ')', length: 5 }
    },
    {
      test: 'calc(5 * 5)',
      expected: { value: ')', length: 5 }
    },
    {
      test: 'calc(5 / 5)',
      expected: { value: ')', length: 5 }
    },
    {
      test: 'calc(5 % 5)',
      expected: { throw: true }
    },
  ];

  fixtures.forEach((fixture) => {
    it('should ' + (fixture.expected.throw ? 'not ' : '')  + 'parse ' + fixture.test, () => {
      let node,
        ast;

      function parse () {
        ast = new Parser(fixture.test).parse();
        node = ast.first.last;
      }

      if (fixture.expected.throw) {
        expect(parse).to.throw(ParserError);
      }
      else {
        parse();

        let targetNode = ast.first;

        // support testing calc
        if (targetNode.first.nodes && targetNode.first.nodes.length) {
          targetNode = targetNode.first;
          node = targetNode.last;
        }

        expect(targetNode.nodes.length).to.equal(fixture.expected.length);

        if (fixture.expected.fail) {
          expect(node.value).to.equal(fixture.test);
        }
        else {
          expect(node.value).to.equal(fixture.expected.value);
          expect(node.unit).to.equal(fixture.expected.unit);
        }
      }
    });
  });

});

describe('Parser → Operator : Loose', () => {

  let fixtures = [
    {
      test: '5+ 5',
      expected: { value: '5', unit: '', length: 3 }
    },
    {
      test: '5- 5',
      expected: { value: '5', unit: '', length: 3 }
    },
    {
      test: '5* 5',
      expected: { value: '5', unit: '', length: 3 }
    },
    {
      test: '5/ 5',
      expected: { value: '5', unit: '', length: 3 }
    },
    {
      test: '5% 5',
      expected: { value: '5', unit: '', length: 3 }
    },
    {
      test: '5 + 5',
      expected: { value: '5', unit: '', length: 3 }
    },
    {
      test: '5 - 5',
      expected: { value: '5', unit: '', length: 3 }
    },
    {
      test: '5 * 5',
      expected: { value: '5', unit: '', length: 3 }
    },
    {
      test: '5 / 5',
      expected: { value: '5', unit: '', length: 3 }
    },
    {
      test: '5 % 5',
      expected: { value: '5', unit: '', length: 3 }
    },
    {
      test: '1+ 5 + +5',
      expected: { value: '+5', unit: '', length: 5 }
    },
    {
      test: '5+5',
      expected: { value: '5', unit: '', length: 3 }
    },
    {
      test: '5-5',
      expected: { value: '5', unit: '', length: 3 }
    },
    {
      test: '5*5',
      expected: { value: '5', unit: '', length: 3 }
    },
    {
      test: '5/5',
      expected: { value: '5', unit: '', length: 3 }
    },
    {
      test: '5%5',
      expected: { value: '5', unit: '', length: 3 }
    },
    {
      test: '5+-+-+-+5',
      expected: { value: '+5', unit: '', length: 8 }
    },
    {
      test: '5e+5',
      expected: { value: '5e+5', unit: '', length: 1 }
    }
  ];

  fixtures.forEach((fixture) => {
    it('should ' + (fixture.expected.throw ? 'not ' : '')  + 'parse ' + fixture.test, () => {
      let ast = new Parser(fixture.test, { loose: true }).parse(),
        node = ast.first.last;

      expect(ast.first.nodes.length).to.equal(fixture.expected.length);
      expect(node.value).to.equal(fixture.expected.value);
      expect(node.unit).to.equal(fixture.expected.unit);
    });
  });

});
