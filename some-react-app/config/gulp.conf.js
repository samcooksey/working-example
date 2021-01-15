"use strict";

const path = require("path");

exports.path = (function (paths) {
  const _path = {};

  for (const pathName in paths) {
    if (Object.prototype.hasOwnProperty.call(paths, pathName)) {
      _path[pathName] = function (arg) {
        const pathValue = (paths[pathName] || "").split("/");
        const funcArgs = (arg || "").split("/");
        const resolveArgs = [process.cwd()].concat(pathValue).concat(funcArgs);

        return path.resolve.apply(this, resolveArgs);
      };
    }
  }

  return _path;
})(
  (exports.paths = {
    coverage: "coverage",
    dev: "../apps/host/service/build/install/vanguard/web",
    dist: "build/dist",
    jest: "jest",
    m17n: "../apps/modules/m17n/src/main/resources/com/apptio/i18n/m17n",
    node_modules: "node_modules",
    src: "src",
    tasks: "gulp_tasks",
    test: "test",
    testcafe: "testcafe",
  }),
);
