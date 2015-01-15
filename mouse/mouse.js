var obj = require('loop-obj');

var mods = function(ev) {
  var keys = [];
  if (ev.altKey)
    keys.push('alt');
  if (ev.shiftKey)
    keys.push('shift');
  if (ev.metaKey)
    keys.push('meta');
  if (ev.ctrlKey)
    keys.push('ctrl');
  return keys;
}

var mouse = function(elem, preventDefault) {
  var face = new obj();

  var click = function(ev) {
    if (preventDefault) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    face.handle({tag: 'click', button: ev.button,
      x: ev.clientX, y: ev.clientY, modifiers: mods(ev),
    });
  }

  var move = function(ev) {
    console.log('move');
  }

  if (preventDefault) {
    elem.addEventListener('contextmenu', click, false);
  }
  elem.onclick = click;
  elem.onmousemove = move;
  return face;
}

module.exports = mouse;
