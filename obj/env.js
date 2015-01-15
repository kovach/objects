var _ = require('underscore');
var env = function() {
  this.log = [];
}
env.prototype.add = function(value) {
  return this.log.push(value) - 1;
}
env.prototype.get = function(k) {
  return this.log[k];
}
env.prototype.each = function(fn) {
  var e = this;
  _.each(e.log, function(val, key) {
    fn(val, key);
  });
  return e;
}
env.prototype.poll = function(time) {
  var e = this;
  return _.drop(e.log, time + 1);
}
module.exports = env;
