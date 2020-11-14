'use strict'
// Template version: 1.2.4
// see http://vuejs-templates.github.io/webpack for documentation

//node.js 路径变量
const path = require('path')
module.exports = {
    dev: {
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '/api/': {
                target: 'http://sd.coffee.api.shidian.com/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/res/': {
                target: 'http://sd.res.shidian.com/',
                changeOrigin: true,
                pathRewrite: {
                    '^/res': ''
                }
            }
        },

        // Various Dev Server settings
        host: '127.0.0.1',
        port: 90,
        autoOpenBrowser: false,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

        //使用Eslint装载机吗?
        // true你的代码将在捆绑期间被链接,linting错误和警告将在控制台中显示。
        useEslint: true,
        // If true, eslint错误和警告也将显示在错误覆盖中。
        // in the browser.
        showEslintErrorsInOverlay: false,
		/**
		 * Source Maps
		 */
        // https://webpack.js.org/configuration/devtool/#development
        devtool: 'eval-source-map',

        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,

        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false,
    },
    build: {
        // Template for index.html
        index: path.resolve(__dirname, '../dist/index.html'),
        // 编译输出的静态资源路径 Path
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '../',
        // 是否开启 cssSourceMap
        productionSourceMap: true,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: '#source-map',

        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    }
}