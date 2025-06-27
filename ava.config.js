export default {
  files: ['!**/fixtures/**', '!**/helpers/**', '!**/rewiremock.js'],
  require: ['./test/rewiremock.cjs'],
  typescript: {
    rewritePaths: {
      'src/': 'dist/'
    },
    compile: false
  }
};
