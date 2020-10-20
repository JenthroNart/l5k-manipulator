const HtmlWebPackPlugin = require("html-webpack-plugin");
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
                resolve: {
                    extensions: ['.js', '.jsx'],
                }
            },
        ],
    },

    plugins: [
        new HtmlWebPackPlugin({
            template: "./public/index.html",
            filename: "./index.html"
        }),
        new InlineChunkHtmlPlugin(HtmlWebPackPlugin, [/\.(js|css)$/]),
    ]
}