module.exports = {
  extensions: ['ts'],
  files: ['!**/fixtures/**', '!**/helpers/**', '!**/rewiremock.js'],
  require: ['ts-node/register', './test/rewiremock.js']
};
