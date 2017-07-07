var webpack = require('webpack');
var path = require('path');
const glob = require('glob-all');
var htmlWebPack = require('html-webpack-plugin');
var extractTextWebpack = require('extract-text-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const PurifyCSSPlugin = require('purifycss-webpack');

var vendor_lib = ['jquery'];
module.exports = {
    entry: {
        bundle: './src/index.js',
        vendor: vendor_lib
            // style: './src/css/styles.css', // files to be pass through webpack text plugin and will automatically add up in index.html
            // bootstrap: './src/css/bootstrap.css' //


    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'js/[name].[chunkhash].js', // generate file name with hash value [name will replace by entryes key value {bundle and vendor}]
        // publicPath: '/dist/'
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: [/(node_modules|bower_components)/, './src/css/styles.css'],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ["es2015", { "loose": true, "modules": false }] // for tree shaking or dead code elimination
                        ]

                    }
                }
            }, {
                test: /\.scss$/, // sass-loader >>> handle scss file [ file loader >>> will simply copy the files without changing original name { will  add hash value too}]
                use: [{ loader: 'file-loader', options: { name: "[name].css", outputPath: '/css/' } }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: function() {
                            return [
                                require('autoprefixer')
                            ]
                        }
                    }
                }, 'sass-loader']
            },

            {
                test: /\.html$/,
                use: ['html-loader']
            },

            {
                test: /\.css$/, // handle css 
                use: extractTextWebpack.extract({
                    loader: [{ loader: 'css-loader', options: { importLoaders: 1 } }, {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function() {
                                return [
                                    require('autoprefixer')
                                ]
                            }
                        }
                    }]
                })
            },

            {
                test: /\.(jpe?g|png|svg)$/,
                use: [{
                        loader: 'url-loader', // save as file or convert to data url based on limit condition
                        options: {
                            limit: 40000, // convert to base 64 url if less than 40KB,
                            outputPath: '/images/'

                        }
                    }, 'image-webpack-loader'] // compress image
            },

            {
                test: /\.html$/, // html loader>>> handle html files... extract-loader>>> separete html file from js(file imported in index.js)..... file-loader >>> then copy the extracted html with its name
                use: [{ loader: 'file-loader', options: { name: "[name].[ext]" } }, 'extract-loader', 'html-loader'],
                exclude: path.join(__dirname, 'src/index.html') // don't copy the index.html since we have copied it already using html-loader
            }, {

                // the url-loader uses DataUrls. 
                // the file-loader emits files. 
                test: /\.(woff|woff2|ttf|eot|svg)$/,
                use: [{
                    loader: 'url-loader', // save as file or convert to data url based on limit condition
                    options: {
                        limit: 10000,
                        outputPath: '/fonts/'

                    }
                }]
            }
        ]
    },
    plugins: [
        new extractTextWebpack('css/main.css'), // save css files under css dir with original name[will add hash value too] { name is comming from entry properties[for .css files only]}
        new htmlWebPack({
            template: './src/index.html'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor_lib', 'manifest']
        }),
        new webpack.ProvidePlugin({ // enabling jquery
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery'
        }),
        new PurifyCSSPlugin({ // remove unused css from bootstrap and other stylesheets
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, 'src/*.html')),
        })
        // new BundleAnalyzerPlugin()


    ]


}
