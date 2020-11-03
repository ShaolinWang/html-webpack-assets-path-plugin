import HtmlWebpackPlugin from 'html-webpack-plugin';

const PLUGIN_NAME = 'HtmlWebpackAssetsPathPlugin';

export default class HtmlWebpackAssetsPathPlugin {

  constructor(
    _config = { cssAssetsPath: "", jsAssetsPath: "" }
  ) {
    this._config = _config;
  }

  apply(compiler) {
    if (compiler.hooks) {
      // webpack 4 support
      compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
        if (compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing) {
          compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
            PLUGIN_NAME,
            (data, cb) => {
              const webpackPublicPath = data.assets.publicPath;
              data.assets.js = this.changePath(data.assets.js, webpackPublicPath, this._config.jsAssetsPath);
              data.assets.css = this.changePath(data.assets.css, webpackPublicPath, this._config.cssAssetsPath);
              return cb(null, data);
            }
          )
        } else if (HtmlWebpackPlugin && HtmlWebpackPlugin.getHooks) {
          // HtmlWebPackPlugin 4.x
          const hooks = HtmlWebpackPlugin.getHooks(compilation);
          hooks.beforeAssetTagGeneration.tapAsync(
            PLUGIN_NAME,
            (data, cb) => {
              const webpackPublicPath = data.assets.publicPath;
              data.assets.js = this.changePath(data.assets.js, webpackPublicPath, this._config.jsAssetsPath);
              data.assets.css = this.changePath(data.assets.css, webpackPublicPath, this._config.cssAssetsPath);
              return cb(null, data);
            }
          )
        } else {
          throw new Error('Cannot find appropriate compilation hook');
        }
      });
    } else {
      // webpack 3 supports
      // Hook into the html-webpack-plugin processing
      compiler.plugin('compilation', (compilation) => {
        compilation.plugin('html-webpack-plugin-before-html-generation', (data, cb) => {
          const webpackPublicPath = data.assets.publicPath;
            data.assets.js = this.changePath(data.assets.js, webpackPublicPath, this._config.jsAssetsPath);
            data.assets.css = this.changePath(data.assets.css, webpackPublicPath, this._config.cssAssetsPath);
            return cb(null, data);
        });
      });
    }
  }

  changePath(assetsPathList = [], publicPath = "", newPath = "") {
    if (!newPath) {
      return assetsPathList;
    }
    const newPathType = this.getType(newPath);
    if (newPathType !== 'String') {
      throw new Error(`the path should be String, but got ${newPathType} instead`);
    }
    const lastChar = newPath.charAt(newPath.length - 1);
    if (lastChar !== '/') {
      newPath = `${newPath}/`;
    }
    const pathList = [...assetsPathList].map((assetPath) => {
      if (publicPath) {
        return assetPath.replace(publicPath, newPath);;
      } else {
        return `${newPath}${assetPath}`;
      };
    });
    return pathList;
  }

  getType(v) {
    return Object.prototype.toString.call(v).slice(8, -1);
  }
}