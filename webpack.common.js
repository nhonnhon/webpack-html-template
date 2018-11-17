const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');

const fs = require("fs");

function generateHtmlPlugins(templateDir) {
    // Read all files or folder in template directory
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
    var arrHtml = [];
    templateFiles.forEach(function(element) {
        const parts = element.split(".");
        const name = parts[0];
        const extension = parts[1];
        //check html file to bundle
        if (extension == "html") {
            var singleHtml = new HtmlWebpackPlugin({
                filename: `${name}.html`,
                template: path.resolve(__dirname, `${templateDir}/${name}.html`)
            });
            arrHtml.push(singleHtml);
        }
    });
    return arrHtml;
}

const htmlPlugins = generateHtmlPlugins("./src");

module.exports = {
    entry: ["./src/assets/js/script.js", "./src/assets/scss/style.scss"],
    output: {
        filename: "assets/js/script.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: "babel-loader",
                        query: {
                            presets: ["env"]
                        }
                    }
                ]
            },
            {
                test: /\.s?css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader",
                            //ingnore change url of background css in library
                            options: {
                                url: false,
                                sourceMap: true
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                })
            },
            {
                test: /\.(jpg|png|svg)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        outputPath: "./assets/images/",
                        name: "[name].[ext]"
                    }
                }
            },
            {
                test: /\.(njk|nunjucks|html|tpl|tmpl)$/,
                use: [
                    {
                        loader: "nunjucks-isomorphic-loader",
                        query: {
                            root: [path.resolve(__dirname, "src")]
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        //delete folder dist before build
        new CleanWebpackPlugin(["dist"]),
        //extract css file
        new ExtractTextPlugin({
            filename: "assets/css/styles.css",
            allChunks: true
        }),
        //copy folder a folder to dist folder
        new CopyWebpackPlugin([
            //compy folder images
            {
                from: "./src/assets/images",
                to: "assets/images"
            },
            //copy folder icon of jquery ui
            {
                from: "./node_modules/jquery-ui/themes/base/images",
                to: "assets/css/images"
            }
        ]),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default'], 
        }),
    ].concat(htmlPlugins)
};
