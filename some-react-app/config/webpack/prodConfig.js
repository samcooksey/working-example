const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const UnminifiedWebpackPlugin = require("unminified-webpack-plugin");
const { merge } = require("webpack-merge");
const { getStyleLoaderRule } = require("./parts");

module.exports = (env) =>
  merge(
    {
      devtool: "source-map",
      plugins: [
        new HtmlWebpackPlugin({
          inject: "head",
          template: "./public/index.html",
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          },
        }),
        new MiniCssExtractPlugin({
          filename: "[name].min.css",
        }),
        new UnminifiedWebpackPlugin(),
      ],
      output: {
        filename: "[name].min.js",
      },
      optimization: {
        minimizer: [
          new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: true,
            uglifyOptions: {
              // To prevent discarding or mangling of function names
              // for testcafe react selectors.
              keep_fnames: process.env.UGLIFY_JS_KEEP_FN_NAMES === "true",
              output: {
                ascii_only: true,
              },
            },
          }),
          new OptimizeCSSAssetsPlugin({}),
        ],
      },
    },
    getStyleLoaderRule({
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: "../../../",
      },
    }),
  );
