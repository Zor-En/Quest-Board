const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
    entry: './client/index.js',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'build.js'
    },
    module: {
        rules: [
          {
            test: /.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react']
              }
            },
          },
          {
            test: /.(css|scss)$/,
            exclude: /node_modules/,
            use: [{
              loader:'style-loader'
            }, 
            {
              loader:'css-loader'
            },],
          }
        ],
      },
      plugins: [
        new HTMLWebpackPlugin({
            template: './client/index.html'
        }),
        new CopyPlugin({
          patterns: [
            { from: "server", to: "server" }
          ]
        })
    ],
      devServer: {
        static: {
          publicPath :'/build',
          directory:  path.resolve(__dirname, 'build'),
        },
        open: true,
        proxy: {
          '/': 'http://localhost:3000' // Change this to the URL of your deployed server
        },
      },
}