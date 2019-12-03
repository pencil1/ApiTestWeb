define(function (require, exports, module) {

  function HistoryRuntime() {
    var minder = this.minder;
    var hotbox = this.hotbox;

    var MAX_HISTORY = 100;

    var lastSnap;
    var patchLock;
    var undoDiffs;
    var redoDiffs;

    function reset() {
      undoDiffs = [];
      redoDiffs = [];
      lastSnap = minder.exportJson();
    }

    var _objectKeys = (function () {
      if (Object.keys)
        return Object.keys;

      return function (o) {
        var keys = [];
        for (var i in o) {
          if (o.hasOwnProperty(i)) {
            keys.push(i);
          }
        }
        return keys;
      };
    })();

    function escapePathComponent(str) {
      if (str.indexOf('/') === -1 && str.indexOf('~') === -1)
        return str;
      return str.replace(/~/g, '~0').replace(/\//g, '~1');
    }

    function deepClone(obj) {
      if (typeof obj === "object") {
        return JSON.parse(JSON.stringify(obj));
      } else {
        return obj;
      }
    }

    function _generate(mirror, obj, patches, path) {
      var newKeys = _objectKeys(obj);
      var oldKeys = _objectKeys(mirror);
      var changed = false;
      var deleted = false;

      for (var t = oldKeys.length - 1; t >= 0; t--) {
        var key = oldKeys[t];
        var oldVal = mirror[key];
        if (obj.hasOwnProperty(key)) {
          var newVal = obj[key];
          if (typeof oldVal == "object" && oldVal != null && typeof newVal == "object" && newVal != null) {
            _generate(oldVal, newVal, patches, path + "/" + escapePathComponent(key));
          } else {
            if (oldVal != newVal) {
              changed = true;
              patches.push({
                op: "replace",
                path: path + "/" + escapePathComponent(key),
                value: deepClone(newVal)
              });
            }
          }
        } else {
          patches.push({
            op: "remove",
            path: path + "/" + escapePathComponent(key)
          });
          deleted = true; // property has been deleted
        }
      }

      if (!deleted && newKeys.length == oldKeys.length) {
        return;
      }

      for (var t = 0; t < newKeys.length; t++) {
        var key = newKeys[t];
        if (!mirror.hasOwnProperty(key)) {
          patches.push({
            op: "add",
            path: path + "/" + escapePathComponent(key),
            value: deepClone(obj[key])
          });
        }
      }
    }

    function jsonDiff(tree1, tree2) {
      var patches = [];
      _generate(tree1, tree2, patches, '');
      return patches;
    }

    function makeUndoDiff() {
      var headSnap = minder.exportJson();
      var diff = jsonDiff(headSnap, lastSnap);
      if (diff.length) {
        undoDiffs.push(diff);
        while (undoDiffs.length > MAX_HISTORY) {
          undoDiffs.shift();
        }
        lastSnap = headSnap;
        return true;
      }
    }

    function makeRedoDiff() {
      var revertSnap = minder.exportJson();
      redoDiffs.push(jsonDiff(revertSnap, lastSnap));
      lastSnap = revertSnap;
    }

    function undo() {
      patchLock = true;
      var undoDiff = undoDiffs.pop();
      if (undoDiff) {
        minder.applyPatches(undoDiff);
        makeRedoDiff();
      }
      patchLock = false;
    }

    function redo() {
      patchLock = true;
      var redoDiff = redoDiffs.pop();
      if (redoDiff) {
        minder.applyPatches(redoDiff);
        makeUndoDiff();
      }
      patchLock = false;
    }

    function changed() {
      if (patchLock)
        return;
      if (makeUndoDiff())
        redoDiffs = [];
    }

    function hasUndo() {
      return !!undoDiffs.length;
    }

    function hasRedo() {
      return !!redoDiffs.length;
    }

    function updateSelection(e) {
      if (!patchLock)
        return;
      var patch = e.patch;
      switch (patch.express) {
        case 'node.add':
          minder.select(patch.node.getChild(patch.index), true);
          break;
        case 'node.remove':
        case 'data.replace':
        case 'data.remove':
        case 'data.add':
          minder.select(patch.node, true);
          break;
      }
    }

    this.history = {
      reset: reset,
      undo: undo,
      redo: redo,
      hasUndo: hasUndo,
      hasRedo: hasRedo
    };
    reset();
    minder.on('contentchange', changed);
    minder.on('import', reset);
    minder.on('patch', updateSelection);

    var main = hotbox.state('main');
    main.button({
      position: 'bottom',
      label: '撤销',
      key: 'Ctrl + Z',
      enable: hasUndo,
      action: undo,
      next: 'idle'
    });
    main.button({
      position: 'bottom',
      label: '重做',
      key: 'Ctrl + Y',
      enable: hasRedo,
      action: redo,
      next: 'idle'
    });
  }

  // window.diff = jsonDiff;

  return module.exports = HistoryRuntime;
});
