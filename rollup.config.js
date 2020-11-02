import babel from 'rollup-plugin-babel';

export default {
  input: 'index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'umd',
    name: 'HtmlWebpackAssetsPathPlugin',
    globals: {
      'html-webpack-plugin': 'HtmlWebpackPlugin'
    },
  },
  external: ['html-webpack-plugin'],
  plugins: [
    babel({
      exclude: 'node_modules/**' // 只编译我们的源代码
    })
  ]
};