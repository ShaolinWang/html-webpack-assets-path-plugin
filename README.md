# Html Webpack Assets Path Plugin
_Alert js or css path in the html file.Works with newer [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) versions_

[![npm version](https://badge.fury.io/js/html-webpack-assets-path-plugin.svg)](https://badge.fury.io/js/html-webpack-assets-path-plugin) [![Build Status](https://travis-ci.org/ShaolinWang/html-webpack-assets-path-plugin.svg?branch=main)](https://travis-ci.org/ShaolinWang/html-webpack-assets-path-plugin) [![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)


## Configuration

1. Install via `npm i -D html-webpack-assets-path-plugin`
2. Add to your webpack config AFTER HtmlWebpackPlugin
```javascript
    var HtmlWebpackAssetsPathPlugin = require('html-webpack-assets-path-plugin');
    ...
    plugins: [
        new HtmlWebpackPlugin({
            filename: join(OUTPUT_DIR, './dist/index.html'),
            // ..
        }),
        new HtmlWebpackAssetsPathPlugin({
            // specify css path
            cssPath: './dist'
            // specify js path
            jsPath: './dist'
        })
    ]
```

## Testing
Testing is done via ts-node and mocha. Test files can be found in `/test`. Just run `npm test` after installing to see the tests run.
