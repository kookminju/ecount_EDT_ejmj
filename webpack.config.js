const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "none",
    devtool: "source-map",
    entry: {
        main: "./src/client/index.ts",
        report: "./src/client/report/report.ts"
    },
    output: {
        filename: "[name].[contenthash].bundle.js",
        path: path.join(__dirname, "dist"),
        clean: true, 
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/, // 정규식
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            }
        ]
    },
    plugins: [ 
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/html/index.html",
            chunks: ["main"],
        }),
        new HtmlWebpackPlugin({
            filename: "report.html",
            template: "./src/html/report.html",
            chunks: ["report"],
        }),
    ],
    resolve: {
        extensions: [".ts", ".js", ".tsx"],
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[/\\]node_modules[/\\]/,
                    name: "venders",
                    chunks: "all",
                }
            }
        }
    }
}