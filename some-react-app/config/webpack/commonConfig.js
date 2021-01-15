const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const IgnoreAssetsPlugin = require("ignore-assets-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const conf = require("../gulp.conf");

const excludeFilters = ["*.bat", "*.js", "*.js.map", "*.json", "*.less", "*.md", "*.php", "*.psd", "*.styl", "*.txt"];

module.exports = (env) => ({
  devtool: "cheap-module-eval-source-map",
  entry: {
    // OK So this is kinda weird, but to support the same location for styles, we need to have both of these entry
    //   points be equally deeply nested e.g. x/y/z and a/b/c, not x/y/z and a/c
    // This is due to the mini-css-extract-plugin and it's URL resolution (publicPath).
    // Once these are the same entry point, this will not matter.
    // Container and styles
    "cache/container/libs/framework": "./src/index.tsx",
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        enforce: "pre",
        use: [
          {
            loader: "raw-loader",
          },
          {
            loader: "htmllint-async-loader",
            options: {
              config: ".htmllintrc",
              failOnProblem: true,
            },
          },
        ],
        exclude: [/node_modules/],
      },
      {
        test: /\.js$/i,
        enforce: "pre",
        exclude: /node_modules/,
        use: [
          {
            loader: "eslint-loader",
            options: {
              emitError: true,
              emitWarning: true,
              failOnError: true,
              failOnWarning: true,
            },
          },
        ],
      },
      {
        test: /\.js$/i,
        use: "dojo-webpack-loader",
        include: [
          conf.path.node_modules("dgrid"),
          conf.path.node_modules("dijit"),
          conf.path.node_modules("dojo"),
          conf.path.node_modules("dojo-dstore"),
        ],
      },
      {
        test: /knockout-latest\.debug\.js$/i,
        use: "ko-loader",
      },
      {
        test: /\.(png|jpg|gif|eot|woff|woff2|ttf|svg)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.tsx?$/i,
        use: [
          {
            loader: "thread-loader",
            options: {
              // there should be 1 cpu for the fork-ts-checker-webpack-plugin
              workers: require("os").cpus().length - 1,
            },
          },
          {
            loader: "ts-loader",
            options: {
              happyPackMode: true, // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: "head",
      template: "public/index.html",
    }),
    new webpack.NormalModuleReplacementPlugin(/\/_base\/typematic$/, conf.path.node_modules("dijit/typematic.js")),
    new webpack.NormalModuleReplacementPlugin(/\/_base\/sniff$/, conf.path.node_modules("dojo/uacss.js")),
    new webpack.ProvidePlugin({
      $: "jquery",
      _: "lodash",
      Highcharts: "highcharts",
      jQuery: "jquery",
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        dojoWebpackLoader: {
          dojoCorePath: conf.path.node_modules("dojo"),
          dojoDijitPath: conf.path.node_modules("dijit"),
          staticHasFeatures: {
            "config-deferredInstrumentation": 0,
            "config-dojo-loader-catches": 0,
            "config-tlmSiblingOfDojo": 0,
            "dojo-amd-factory-scan": 0,
            "dojo-combo-api": 0,
            "dojo-config-api": 0,
            "dojo-config-require": 0,
            "dojo-debug-messages": 0,
            "dojo-dom-ready-api": 1,
            "dojo-firebug": 0,
            "dojo-guarantee-console": 1,
            "dojo-has-api": 1,
            "dojo-inject-api": 1,
            "dojo-loader": 0,
            "dojo-log-api": 0,
            "dojo-modulePaths": 0,
            "dojo-moduleUrl": 0,
            "dojo-publish-privates": 0,
            "dojo-requirejs-api": 0,
            "dojo-sniff": 1,
            "dojo-sync-loader": 0,
            "dojo-test-sniff": 0,
            "dojo-timeout-api": 0,
            "dojo-trace-api": 0,
            "dojo-undef-api": 0,
            "dojo-v1x-i18n-Api": 1,
            dom: 1,
            "extend-dojo": 1,
            "host-browser": 1,
            touch: 1,
          },
        },
      },
    }),
    // see https://github.com/webpack-contrib/mini-css-extract-plugin/issues/151#issuecomment-402336362
    new IgnoreAssetsPlugin({
      ignore: ["styles/container/framework.js", "styles/container/framework.js.map"],
    }),
    // Let's ensure that the macOS file system doesn't ignore case sensitivity!
    new CaseSensitivePathsPlugin(),
    new webpack.ProgressPlugin(),
    // Enable if you want to look at the bundle size.
    // new BundleAnalyzerPlugin(),
  ],
  resolve: {
    alias: {
      "cldr/event": "cldrjs/dist/cldr/event.js",
      "cldr/supplemental": "cldrjs/dist/cldr/supplemental.js",
      cldr: "cldrjs/dist/cldr.js",
      "cldr-dates": "cldr-dates-modern/main",
      "cldr-numbers": "cldr-numbers-modern/main",
      dstore: "dojo-dstore",
      durandal: "durandal/js",
      "foundation.reveal": conf.path.src("/foundation-amd/main.ts"),
      "globalize/currency": "globalize/dist/globalize/currency.js",
      "globalize/date": "globalize/dist/globalize/date.js",
      "globalize/number": "globalize/dist/globalize/number.js",
      "globalize/plural": "globalize/dist/globalize/plural.js",
      handlebars: "handlebars/dist/handlebars.js",
      i18next: "i18next/i18next.js",
      "jquery-color": "jquery-color/jquery.color.js",
      "jquery-cookie": "jquery.cookie",
      "jquery-i18next": "jquery-i18next/jquery-i18next.js",
      plugins: "durandal/js/plugins",
      "pnotify.buttons": "pnotify/dist/pnotify.buttons",
    },
    extensions: [".tsx", ".ts", ".js"],
    modules: [path.resolve(__dirname, "../../."), "node_modules"],
  },
  // Sometimes dojo loads things like 'text!someModule'. Cut that out dojo! Use the raw-loader.
  resolveLoader: {
    alias: {
      text: "raw-loader",
      "ko-loader": __dirname + "/ko-loader",
    },
    moduleExtensions: ["-loader"],
  },
  output: {
    filename: "[name].js",
    path: (env.outputPath && path.resolve(env.outputPath)) || conf.path.dist(),
    publicPath: "/",
    library: "someReactApp",
    libraryTarget: "umd",
  },
  optimization: {
    minimizer: [],
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          minChunks: 10,
          priority: -10,
        },
      },
    },
  },

  watchOptions: {
    ignored: /node_modules/,
  },
  profile: true,
});
