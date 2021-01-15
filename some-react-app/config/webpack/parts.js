const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const path = require("path");
const conf = require("../gulp.conf");

exports.getStyleLoaderRule = (styleLoader) => ({
  module: {
    rules: [
      {
        test: /\.s?css$/i,
        use: [
          styleLoader || "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "clean-css-loader",
            options: {
              format: "beautify",
              inline: "none", // css-loader will take care of this.
            },
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require("dart-sass"),
            },
          },
        ],
        exclude: [conf.path.node_modules("@apex/components/globals/scss/_colors.scss")],
      },
      {
        test: /@apex(\/|\\)components(\/|\\)globals(\/|\\)scss(\/|\\)_colors.scss$/i,
        use: [
          styleLoader || "style-loader",
          {
            loader: "css-loader",
          },
          {
            loader: "clean-css-loader",
            options: {
              format: "beautify",
              inline: "none", // css-loader will take care of this.
            },
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require("dart-sass"),
            },
          },
        ],
      },
    ],
  },
});

exports.hardSourceWebpackPlugin = {
  plugins: [
    new HardSourceWebpackPlugin({
      // Either an absolute path or relative to webpack's options.context.
      cacheDirectory: path.resolve(__dirname, "../../.cache/hard-source/[confighash]"),
    }),
    new HardSourceWebpackPlugin.ExcludeModulePlugin([
      {
        test: /src[\\/]planning[\\/]application\.ts/,
      },
      {
        test: /src[\\/]planning[\\/]vanguard-all\.ts/,
      },
      {
        test: /test[\\/]container[\\/]test-main-container\.js/,
      },
      {
        test: /test[\\/]test-main\.js/,
      },
    ]),
  ],
};
