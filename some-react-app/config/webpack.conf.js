const { isObject, omit } = require("lodash");
const { merge, mergeWithCustomize, unique } = require("webpack-merge");
const commonConfig = require("./webpack/commonConfig");
const testConfig = require("./webpack/testConfig");
const developmentConfig = require("./webpack/devConfig");
const productionConfig = require("./webpack/prodConfig");

// env is configured from the `--env.NODE_ENV` param on the cli.
// This allows us to parameterize the webpack config inline instead of mutating it for dev mode.
// We expect an object like this:
//
// {
//   NODE_ENV: "production",
// }
//
module.exports = (env) => {
  if (env !== undefined && !isObject(env)) {
    throw new Error("Webpack conf requires an env object to configure it. Use the `--env.` flag. Received: " + env);
  }
  console.log("Building in production mode:", env.NODE_ENV === "production", env);
  const mode = env.NODE_ENV;
  env = omit(env, "NODE_ENV");
  switch (mode) {
    case "development":
      return merge(commonConfig(env), developmentConfig(env), { mode });
    case "test":
      return merge(omit(commonConfig(env), "entry", "output", "optimization"), testConfig(env));
    case "production":
      return mergeWithCustomize({
        customizeArray: unique(
          "plugins",
          ["HtmlWebpackPlugin"],
          (plugin) => plugin.constructor && plugin.constructor.name,
        ),
      })(commonConfig(env), productionConfig(env), { mode });
    default:
      throw new Error("No matching configuration was found!");
  }
};
