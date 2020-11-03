import {join} from 'path';
import {readFileSync} from 'fs';
import chai from 'chai';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin  from 'mini-css-extract-plugin';
import rimraf from 'rimraf';
import HtmlWebpackAssetsPathPlugin from '../src/index.mjs';

const __dirname = process.cwd();
const OUTPUT_DIR = join(__dirname, './test/test_dist');

const HtmlWebpackPluginOptions = {
    publicPath: '',
    filename: 'index.html',
    hash: false,
    inject: 'body',
    minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,

    },
    showErrors: true,
    template: join(__dirname, './test/data/index.html'),
};

const webpackDevOptions = {
    mode: 'development',
    entry: {
        app: join(__dirname, './test/data/entry.js'),
        polyfill: join(__dirname, './test/data/polyfill.js'),
        styles: join(__dirname, './test/data/styles.css')
    },
    output: {
        path: OUTPUT_DIR,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader
                },{
                    loader: 'css-loader'   
                }]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ]
};

const webpackProdOptions = {
    ...webpackDevOptions,
    output: {
        filename: '[name].[contenthash].min.js',
        path: OUTPUT_DIR,
        pathinfo: true,
    },
    mode: 'production',
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].min.css'
        })
    ]
};

function getOutput() {
    const htmlFile = join(OUTPUT_DIR, './index.html');
    const htmlContents = readFileSync(htmlFile).toString('utf8');
    chai.expect(!!htmlContents).to.be.true;
    return htmlContents;
}

describe('HtmlWebpackAssetsPathPlugin Development Mode', () => {

    afterEach((done) => {
        rimraf(OUTPUT_DIR, done);
    });

    it('should do nothing when no cssPath nor jsPath is specified', (done) => {
        webpack({ ...webpackDevOptions,
            plugins: [
                ...webpackDevOptions.plugins,
                new HtmlWebpackPlugin({
                    ...HtmlWebpackPluginOptions,
                }),
                new HtmlWebpackAssetsPathPlugin(),
            ]
        }, (err) => {
            chai.expect(!!err).to.be.false;
            const html = getOutput();
            chai.expect(/script\s+.*?src\s*=\s*"(\/)?polyfill\.js"/i.test(html), 'polyfill bundle path is right').to.be.true;
            chai.expect(/script\s+.*?src\s*=\s*"(\/)?app\.js"/i.test(html), 'app bundle path is right').to.be.true;
            chai.expect(/script\s+.*?src\s*=\s*"(\/)?styles\.js"/i.test(html), 'styles js bundle path is right').to.be.true;
            chai.expect(/link\s+.*?href\s*=\s*"(\/)?styles\.css"/i.test(html), 'styles css bundle path is right').to.be.true;
            done();
        });
    });

    it('should do nothing when no cssPath nor jsPath is specified but publicPath specified', (done) => {
        webpack({ ...webpackDevOptions,
            output: {
                ...webpackDevOptions.output,
                // for html-webpack-plugin 3
                publicPath: './dist',
            },
            plugins: [
                ...webpackDevOptions.plugins,
                new HtmlWebpackPlugin({
                    ...HtmlWebpackPluginOptions,
                    publicPath: './dist',
                }),
                new HtmlWebpackAssetsPathPlugin(),
            ]
        }, (err) => {
            chai.expect(!!err).to.be.false;
            const html = getOutput();
            console.log(html);
            chai.expect(/script\s+.*?src\s*=\s*"\.\/dist\/polyfill\.js"/i.test(html), 'polyfill bundle path is right').to.be.true;
            chai.expect(/script\s+.*?src\s*=\s*"\.\/dist\/app\.js"/i.test(html), 'app bundle path is right').to.be.true;
            chai.expect(/script\s+.*?src\s*=\s*"\.\/dist\/styles\.js"/i.test(html), 'styles js bundle path is right').to.be.true;
            chai.expect(/link\s+.*?href\s*=\s*"\.\/dist\/styles\.css"/i.test(html), 'styles css bundle path is right').to.be.true;
            done();
        });
    });

    it('should use cssPath and jsPath for relative tag when cssPath or jsPath is specified', (done) => {
        webpack({ ...webpackDevOptions,
            plugins: [
                ...webpackDevOptions.plugins,
                new HtmlWebpackPlugin({
                    ...HtmlWebpackPluginOptions,
                }),
                new HtmlWebpackAssetsPathPlugin({
                    cssAssetsPath: './css',
                    jsAssetsPath: './js',
                }),
            ]
        }, (err) => {
            chai.expect(!!err).to.be.false;
            const html = getOutput();
            chai.expect(/script\s+.*?src\s*=\s*"\.\/js\/polyfill\.js"/i.test(html), 'polyfill bundle path is right').to.be.true;
            chai.expect(/script\s+.*?src\s*=\s*"\.\/js\/app\.js"/i.test(html), 'app bundle path is right').to.be.true;
            chai.expect(/script\s+.*?src\s*=\s*"\.\/js\/styles\.js"/i.test(html), 'styles js bundle path is right').to.be.true;
            chai.expect(/link\s+.*?href\s*=\s*"\.\/css\/styles\.css"/i.test(html), 'styles css bundle path is right').to.be.true;
            done();
        });
    });

    it('should replace cssPath and jsPath for relative tag when cssPath,jsPath,publicPath is specified', (done) => {
        webpack({ ...webpackDevOptions,
            output: {
                ...webpackDevOptions.output,
                publicPath: './dist',
            },
            plugins: [
                ...webpackDevOptions.plugins,
                new HtmlWebpackPlugin({
                    ...HtmlWebpackPluginOptions,
                    publicPath: './dist',
                }),
                new HtmlWebpackAssetsPathPlugin({
                    cssAssetsPath: './css',
                    jsAssetsPath: './js',
                }),
            ]
        }, (err) => {
            chai.expect(!!err).to.be.false;
            const html = getOutput();
            chai.expect(/script\s+.*?src\s*=\s*"\.\/js\/polyfill\.js"/i.test(html), 'polyfill bundle path is right').to.be.true;
            chai.expect(/script\s+.*?src\s*=\s*"\.\/js\/app\.js"/i.test(html), 'app bundle path is right').to.be.true;
            chai.expect(/script\s+.*?src\s*=\s*"\.\/js\/styles\.js"/i.test(html), 'styles js bundle path is right').to.be.true;
            chai.expect(/link\s+.*?href\s*=\s*"\.\/css\/styles\.css"/i.test(html), 'styles css bundle path is right').to.be.true;
            done();
        });
    });

});

describe('HtmlWebpackAssetsPathPlugin Production Mode', function () {
    // set timeout to 5s because webpack is slow
    this.timeout(5000);

    afterEach((done) => {
        rimraf(OUTPUT_DIR, done);
    });

    it('should do nothing when no cssPath and jsPath are specified', (done) => {
        webpack({ ...webpackProdOptions,
            plugins: [
                ...webpackProdOptions.plugins,
                new HtmlWebpackPlugin({
                    ...HtmlWebpackPluginOptions,
                }),
                new HtmlWebpackAssetsPathPlugin(),
            ]
        }, (err) => {
            chai.expect(!!err).to.be.false;
            const html = getOutput();
            chai.expect(/script\s+.*?src\s*=\s*"(\/)?polyfill.+\.min\.js"/i.test(html), 'polyfill bundle path is right').to.be.true;
            chai.expect(/script\s+.*?src\s*=\s*"(\/)?app.+\.min\.js"/i.test(html), 'app bundle path is right').to.be.true;
            chai.expect(/script\s+.*?src\s*=\s*"(\/)?styles.+\.min\.js"/i.test(html), 'styles js bundle path is right').to.be.true;
            chai.expect(/link\s+.*?href\s*=\s*"(\/)?styles.+\.min\.css"/i.test(html), 'styles css bundle path is right').to.be.true;
            done();
        });
    });

    it('should do nothing when no cssPath nor jsPath is specified but publicPath specified', (done) => {
        webpack({ ...webpackProdOptions,
            output: {
                ...webpackProdOptions.output,
                publicPath: './dist',
            },
            plugins: [
                ...webpackProdOptions.plugins,
                new HtmlWebpackPlugin({
                    ...HtmlWebpackPluginOptions,
                    publicPath: './dist',
                }),
                new HtmlWebpackAssetsPathPlugin(),
            ]
        }, (err) => {
            chai.expect(!!err).to.be.false;
            const html = getOutput();
            chai.expect(/script\s+.*?src\s*=\s*"\.\/dist\/polyfill.+\.min\.js"/i.test(html), 'polyfill bundle path is right').to.be.true;
            chai.expect(/script\s+.*?src\s*=\s*"\.\/dist\/app.+\.min\.js"/i.test(html), 'app bundle path is right').to.be.true;
            chai.expect(/script\s+.*?src\s*=\s*"\.\/dist\/styles.+\.min\.js"/i.test(html), 'styles js bundle path is right').to.be.true;
            chai.expect(/link\s+.*?href\s*=\s*"\.\/dist\/styles.+\.min\.css"/i.test(html), 'styles css bundle path is right').to.be.true;
            done();
        });
    });

    it('should use cssPath and jsPath for relative tag when cssPath or jsPath is specified', (done) => {
        webpack({ ...webpackProdOptions,
            plugins: [
                ...webpackProdOptions.plugins,
                new HtmlWebpackPlugin({
                    ...HtmlWebpackPluginOptions,
                }),
                new HtmlWebpackAssetsPathPlugin({
                    cssAssetsPath: './css',
                    jsAssetsPath: './js',
                }),
            ]
        }, (err) => {
            chai.expect(!!err).to.be.false;
            const html = getOutput();
            chai.expect(/script\s+.*?src\s*=\s*"\.\/js\/polyfill.+\.min\.js"/i.test(html), 'polyfill bundle path is right').to.be.true;
            chai.expect(/script\s+.*?src\s*=\s*"\.\/js\/app.+\.min\.js"/i.test(html), 'app bundle path is right').to.be.true;
            chai.expect(/script\s+.*?src\s*=\s*"\.\/js\/styles.+\.min\.js"/i.test(html), 'styles js bundle path is right').to.be.true;
            chai.expect(/link\s+.*?href\s*=\s*"\.\/css\/styles.+\.min\.css"/i.test(html), 'styles css bundle path is right').to.be.true;
            done();
        });
    });

    it('should replace cssPath and jsPath for relative tag when cssPath,jsPath,publicPath is specified', (done) => {
        webpack({ ...webpackProdOptions,
            output: {
                ...webpackProdOptions.output,
                publicPath: './dist',
            },
            plugins: [
                ...webpackProdOptions.plugins,
                new HtmlWebpackPlugin({
                    ...HtmlWebpackPluginOptions,
                    publicPath: './dist',
                }),
                new HtmlWebpackAssetsPathPlugin({
                    cssAssetsPath: './css',
                    jsAssetsPath: './js',
                }),
            ]
        }, (err) => {
            chai.expect(!!err).to.be.false;
            const html = getOutput();
            chai.expect(/script\s+.*?src\s*=\s*"\.\/js\/polyfill.+\.min\.js"/i.test(html), 'polyfill bundle path is right').to.be.true;
            chai.expect(/script\s+.*?src\s*=\s*"\.\/js\/app.+\.min\.js"/i.test(html), 'app bundle path is right').to.be.true;
            chai.expect(/script\s+.*?src\s*=\s*"\.\/js\/styles.+\.min\.js"/i.test(html), 'styles js bundle path is right').to.be.true;
            chai.expect(/link\s+.*?href\s*=\s*"\.\/css\/styles.+\.min\.css"/i.test(html), 'styles css bundle path is right').to.be.true;
            done();
        });
    });

});
