const child = require("child_process");
const { identity, forEach, pull } = require("lodash");
const PluginError = require("plugin-error");
const { Writable } = require("stream");

const childProcesses = [];

process.on("SIGINT", killAll);

function killAll() {
  forEach(childProcesses, function(childProcess) {
    childProcess.kill("SIGKILL");
  });
}

function register(childProcess) {
  childProcesses.push(childProcess);
  childProcess.on("close", function() {
    pull(childProcesses, childProcess);
  });

  return childProcess;
}

module.exports = {
  killAll: killAll,
  register: register,

  fork: function(modulePath, args, options = {}) {
    return new Promise(function(resolve) {
      let err = "";
      let out = "";

      const childProcess = register(
        child.fork(modulePath, args, {
          silent: true,
          ...options,
        }),
      );
      const errStream = new Writable({
        write: function(chunk, encoding, next) {
          err += chunk.toString();
          next();
        },
      });
      const outStream = new Writable({
        write: function(chunk, encoding, next) {
          out += chunk.toString();
          next();
        },
      });

      childProcess.stderr.pipe(errStream);
      childProcess.stdout.pipe(outStream);
      childProcess.on("close", function(code, signal) {
        // NOTE: Because of how we've structured the Gulp tasks to allow for fail-fast or fail-last,
        //       we cannot reject the promise here due to deprecation of unhandled promise rejections in Node.
        //
        // See also: https://nodejs.org/dist/latest-v8.x/docs/api/deprecations.html#deprecations_dep0018_unhandled_promise_rejections
        resolve({
          code: code,
          signal: signal,
          stderr: err,
          stdout: out,
        });
      });
    });
  },

  onProcessClose: function(name, formatMessage) {
    if (formatMessage === void 0) {
      formatMessage = identity;
    }

    return function({ code, signal, stdout }) {
      if (code || signal) {
        killAll();

        return Promise.reject(new PluginError(name, `\n${formatMessage(stdout || signal)}`, { showProperties: false }));
      }
    };
  },
};
