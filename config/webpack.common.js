var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');
var CopyWebpackPlugin = require('copy-webpack-plugin');

// function isExternal(module) {
//     var userRequest = module.userRequest;
//
//     console.log( 'isExternal: ', userRequest);
//
//     if (typeof userRequest !== 'string') {
//         return false;
//     }
//
//     return userRequest.indexOf('bower_components') >= 0 ||
//         userRequest.indexOf('node_modules') >= 0 ||
//         userRequest.indexOf('libraries') >= 0;
// }
//
// var bpmn = [
//     './src/bpmn.ts',
//     'bpmn-js',
//     'diagram-js',
//     'diagram-js/lib/features/global-connect/GlobalConnect.js',
//     'diagram-js-direct-editing',
// ];

module.exports = {
    entry: {
        'polyfills': './src/polyfills.ts',
        'vendor': './src/vendor.ts',
        // 'bpmn': bpmn,
        'bpmn': './src/bpmn.ts',
        'app': './src/main.ts'
    },

    resolve: {
        extensions: ['.ts', '.js']
    },

    module: {
        rules: [
            // {
            //     test: /\.js$/,
            //     loaders: ['awesome-typescript-loader', 'angular2-template-loader']
            // },
            {
                test: /\.ts$/,
                use: ['awesome-typescript-loader', 'angular2-template-loader']
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?\d+)?$/,
                loader: 'file-loader?' + JSON.stringify ({name: 'graphics/[name].[ext]'})
            },
            {
                test: /\.bpmn$/,
                loader: 'file-loader?' + JSON.stringify({name: 'diagrams/[name].[ext]'})
            },
            
            {
                test: /\.less/,
                loader: "postcss-less-loader"
            },
            {
                test: /\.css$/,
                exclude: helpers.root('src', 'app'),
                use: ['to-string-loader'].concat(ExtractTextPlugin.extract({fallback : "style-loader",
                                                                            use: "css-loader?sourceMap"}))
            },
            {
                test: /\.css$/,
                exclude: helpers.root('public'),
                include: helpers.root('src', 'app'),
                // https://github.com/webpack/style-loader/issues/123:
                // use: [ExtractTextPlugin.extract({fallback: "style-loader", use:["css-loader", "to-string-loader", "css-loader", "less-loader"]})]
                use: ['to-string-loader'].concat(ExtractTextPlugin.extract({fallback: "style-loader", use:["css-loader"]}))
                // use: ["style-loader","css-loader"]
                
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: ['to-string-loader'].concat(ExtractTextPlugin.extract({fallback: "style-loader", use:["css-loader","sass-loader"]}))
                // https://github.com/webpack-contrib/extract-text-webpack-plugin
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader'
            }
            // ,{ test: /\.js$/,
            //     loader: "webpack-strip?strip[]=debug" 
            // }
        ]
    },

    plugins: [
        new webpack.NamedModulesPlugin(),
        new ExtractTextPlugin('[name].css'), 
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'app',
        //     minChunks: function(module, count) {
        //         return isExternal(module);
        //     }
        // }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'bpmn',
        // }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor',
        // }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'polyfills',
        // }),
        //
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'bpmn',
        //     minChunks: function(module) {
        //         return isExternal(module);
        //     }
        // }),
        //
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'bpmn', 'vendor', 'polyfills'],
            // minChunks: function(module) {
            //     return isExternal(module);
            // }
        }),

        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery'
        }),
        new CopyWebpackPlugin([
            { from: 'src/assets', to: 'assets' }
        ])
    ]
};