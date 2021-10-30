const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AssetsPlugin = require("assets-webpack-plugin");
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  entry: {
    main: path.join(__dirname, "src/index.js"),
  },

  devtool: false,
  
  output: {
    path: path.join(__dirname, "dist"),
    filename: '[name].[chunkhash].bundle.js',
  },

  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    alias: {
      hugo: path.join(__dirname, 'node_modules', 'hugo'),
    },
  },

  module: {
    rules: [
      {
        test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader",
        options: {
            name: "/[hash].[ext]"
        }
      },

      {test: /\.json$/, loader: "json-loader"},

      {
        loader: "babel-loader",
        test: /\.js?$/,
        exclude: /node_modules/,
        options: {
            cacheDirectory: true
        },
      },

      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: ["style-loader", MiniCssExtractPlugin.loader,               
        {
          loader: "css-loader",
          options: {
            import: false,
            modules: true
          }
        },
        "postcss-loader", 
        {
          loader: "sass-loader",
          options: {
            implementation: require("sass"),
              sassOptions: {
                indentWidth: 4
              }
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      fetch: "imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch"
    }),

    new AssetsPlugin({
      filename: "webpack.json",
      path: path.join(process.cwd(), "site/data"),
      prettyPrint: true
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: "./src/fonts/", to: "fonts/" },
      ],
      options: {
        concurrency: 100,
      },
    }),
    new HtmlWebPackPlugin({
      template: './dist/index.html',
    }),
    new CompressionPlugin({
      test: /\.js(\?.*)?$/i,
    }),
  ],
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
    // Calculates sizes of gziped bundles.
    assetFilter: function (assetFilename) {
      return assetFilename.endsWith(".js.gz");
    },
  },
  optimization: {
    splitChunks: {
      minSize: 10000,
      maxSize: 512000,
    }
  }
};