  var LINE_ENDING = '\r';
  var LINE_ENDING_SPLITER = /\r\n|\r|\n/;
  var TAB_CHAR = '\t';

  function exportTextTree(minder) {
    var minds = minder.exportJson();
    try {
      const link = document.createElement('a');
      const blob = new Blob(["\ufeff" + encode(minds.root, 0)], {
        type: 'text/plain'
      });
      link.href = window.URL.createObjectURL(blob);
      link.download = `${minds.root.data.text}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert(err);
    }
  }

  function repeat(s, n) {
    var result = '';
    while (n--) result += s;
    return result;
  }

  function encode(json, level) {
    var local = '';
    level = level || 0;
    local += repeat(TAB_CHAR, level);
    local += json.data.text + LINE_ENDING;
    if (json.children) {
      json.children.forEach(function (child) {
        local += encode(child, level + 1);
      });
    }
    return local;
  }

  function isEmpty(line) {
    return !/\S/.test(line);
  }

  function getLevel(line) {
    var level = 0;
    while (line.charAt(level) === TAB_CHAR) level++;
    return level;
  }

  function getNode(line) {
    return {
      data: {
        text: line.replace(new RegExp('^' + TAB_CHAR + '*'), '')
      }
    };
  }

  /**
   * 文本解码
   *
   * @param {string} local 文本内容
   * @param {=boolean} root 自动根节点
   * @return {Object} 返回解析后节点
   */
  function decode(local, root) {
    var json,
      offset,
      parentMap = {},
      lines = local.split(LINE_ENDING_SPLITER),
      line, level, node;

    function addChild(parent, child) {
      var children = parent.children || (parent.children = []);
      children.push(child);
    }
    if (root) {
      parentMap[0] = json = getNode('root');
      offset = 1;
    } else {
      offset = 0;
    }

    for (var i = 0; i < lines.length; i++) {
      line = lines[i];
      if (isEmpty(line)) continue;

      level = getLevel(line) + offset;
      node = getNode(line);

      if (level === 0) {
        if (json) {
          throw new Error('Invalid local format');
        }
        json = node;
      } else {
        if (!parentMap[level - 1]) {
          throw new Error('Invalid local format');
        }
        addChild(parentMap[level - 1], node);
      }
      parentMap[level] = node;
    }
    return json;
  }

  export {
    exportTextTree
  }
