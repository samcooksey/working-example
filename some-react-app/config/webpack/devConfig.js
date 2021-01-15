const CspParse = require("csp-parse");
const { merge } = require("webpack-merge");
const { getStyleLoaderRule, hardSourceWebpackPlugin } = require("./parts");

module.exports = (env) =>
  merge(
    {
      devServer: {
        compress: true,
        index: "",
        port: 3000,
        progress: true,
        publicPath: "/",
        proxy: [
          {
            context: ["**", "!/*.eot", "!/*.html", "!/*.svg", "!/*.ttf", "!/*.woff", "!/*.woff2", "!/cache"],
            target: "http://localhost:9080",

            onProxyRes: function (proxyRes, req, res) {
              const cspHeader = proxyRes.headers["content-security-policy"];

              if (cspHeader) {
                const newCsp = new CspParse(cspHeader);
                const url = "ws://" + req.headers.host;
                newCsp.add("connect-src", url);

                proxyRes.headers["content-security-policy"] = newCsp.toString();
              }
            },
          },
        ],
        writeToDisk: true,
      },
    },
    hardSourceWebpackPlugin,
    getStyleLoaderRule(),
  );
