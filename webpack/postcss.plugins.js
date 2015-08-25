export default [
  require('postcss-nested'),
  require('cssnext')({ browsers: 'last 2 versions' }),
  require('postcss-pseudoelements')(),
  require('postcss-opacity'),
  require('postcss-color-rgba-fallback')(),
  require('postcss-each'),
  require('postcss-for'),
  require('postcss-pseudo-class-enter'),
  require('postcss-quantity-queries'),
  require('postcss-at2x'),
  require('postcss-sprites')
];
