module.exports = function (source) {
  this.cacheable();

  return source.replace('jQueryInstance = window["jQuery"]', 'jQueryInstance = require("jquery")');
};
