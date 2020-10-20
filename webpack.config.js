const webpack = require("webpack");
const path = require("path");
//const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry: path.resolve(__dirname, "src/index"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js",
        library: "dom-test-renderer",
        libraryTarget: "umd",
        umdNamedDefine: true
    },
    externals: [
        "react",
        "react-dom",
    ],
    plugins: [
        //new BundleAnalyzerPlugin(),
    ],
    target: "node",
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    resolve: {
        modules: ["node_modules", "src", "src/css"],
        extensions: [".ts", ".tsx", ".js", ".scss", ".css"],
    },
    module: {
        rules: [
            {
                test: /\.ts|\.tsx$/,
                exclude: /node_modules/,
                use: "ts-loader"
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader"
                    },
                    {
                        loader: "source-map-loader",
                    }
                ]
            },
        ]
    }
};
