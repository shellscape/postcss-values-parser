const Input = require('postcss/lib/input');

const ValuesParser = require('./ValuesParser');
// const LessStringifier = require('./LessStringifier');

module.exports = {
  parse(less, options) {
    const input = new Input(less, options);
    const parser = new ValuesParser(input);

    parser.parse();

    return parser.root;
  }

  // stringify(node, builder) {
  //   const stringifier = new LessStringifier(builder);
  //   stringifier.stringify(node);
  // },
  //
  // nodeToString(node) {
  //   let result = '';
  //
  //   module.exports.stringify(node, (bit) => {
  //     result += bit;
  //   });
  //
  //   return result;
  // }
};
