var _ = require('underscore');
var env = require('./env');

// TODO cause: digest, from: digest?
// global ids?
// msg, obj digests

// fn may be undefined
var obj = function(name) {
  this.handlers = {};
  this.loops = {};
  this.log = new env();
  this.name = name;
}

var copy = function(msg) {
  var output = {};
  _.each(msg, function(val, key) {
    output[key] = val
  });
  return output;
}

// TODO provenance
obj.prototype.save = function(msg) {
  this.log.add(msg);
}

obj.prototype.handle = function(input) {
  var o = this;
  o.save(input);

  var output;
  var h = o.handlers[input.tag];
  var l = o.loops[input.tag];

  if (h) {
    h.forEach(function(obj) {
      obj.handle(input);
    });
  }

  if (l) {
    var newMsg = l(input);
    if (newMsg) {
      // loop back
      o.handle(newMsg);
    }
  }
}

obj.prototype.loop = function(tag, fn) {
  var o = this;
  o.loops[tag] = fn;
}

obj.prototype.add = function(tag, obj) {
  var o = this;
  if (o.handlers[tag] === undefined) {
    o.handlers[tag] = [];
  }
  o.handlers[tag].push(obj);
}

// Bind next to multiple tags, replay all relevant messages to catch up
obj.prototype.hook = function(tags, next) {
  var o = this;
  _.each(tags, function(tag) {
    o.add(tag, next);
  });

  var ms = o.pollAll();
  _.each(ms, function(msg) {
    next.handle(msg);
  });
}


// Adds a tag-dependent with fn as its loop
obj.prototype.chain = function(tag, fn) {
  var o = this;
  var next = new obj();

  next.loop(tag, fn);
  o.add(tag, next);

  return next;
}

// Return all msgs after time
obj.prototype.poll = function(time) {
  var o = this;
  return o.log.poll(time);
}
obj.prototype.pollAll = function() {
  return this.log.poll(-1);
}

// TODO obj variable?
var replace = function(loc, obj) {
}

module.exports = obj;
