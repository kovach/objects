var _ = require('underscore');
var spawn = require('child_process').spawn;
var obj = require('loop-obj');

var spawnObj = function(command) {
  var output = new obj();
  var out = "";
  var sh = spawn(command);
  sh.stdout.on('data', function(data) {
    out += data;
    output.handle({tag: 'data', data: data});
  });

  var face = new obj();
  face.chain('send-keys', function(msg) {
    sh.stdin.write(msg.keys, 'utf8');
  });
  face
  output.hook(['data'], face);

  return face;
}

module.exports = spawnObj;
