const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env');
let env = {};
if (fs.existsSync(envPath)) {
  const dotenv = require('dotenv');
  env = dotenv.config({ path: envPath }).parsed;
}

module.exports = {
  entry: './public/src/index.js',
  output: {
    path: path.resolve(__dirname, 'public/dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new Dotenv({
      systemvars: true,
    }),
    new webpack.DefinePlugin({
      'process.env.VALORANT_API_KEY': JSON.stringify(env.VALORANT_API_KEY || process.env.VALORANT_API_KEY)
    })
  ],
  resolve: {
    extensions: ['.js']
  }
};