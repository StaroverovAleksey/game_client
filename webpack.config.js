const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    bundle: ['@babel/polyfill', './index.jsx'],
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    port: 4300,
    open: true,
  },
  /* resolve: {
        extensions: ['.js', '.json', '.css'],
        alias: {
            '@models': path.resolve(__dirname, 'src/models')
        }
    }, */
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, './static') }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        use:
            [
              {
                loader: 'file-loader',
                options:
                    {
                      outputPath: 'assets/door/'
                    }
              }
            ]
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  devtool: isDev ? 'source-map' : false,
};
