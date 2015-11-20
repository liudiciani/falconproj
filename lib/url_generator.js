var Chance = require('chance');

var chance = new Chance();

var exports = module.exports = {};

exports.generateURL = function() {
  var s = chance.string({
  length: 5,
  pool: "abcdefghijklmnopqrstuvwxyz0123456789"
  });
  return s;
};