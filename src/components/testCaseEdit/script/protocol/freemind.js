  var priorities = [
    {jp: 1, mp: 'full-1'},
    {jp: 2, mp: 'full-2'},
    {jp: 3, mp: 'full-3'},
    {jp: 4, mp: 'full-4'},
    {jp: 5, mp: 'full-5'},
    {jp: 6, mp: 'full-6'},
    {jp: 7, mp: 'full-7'},
    {jp: 8, mp: 'full-8'}
  ];
  var mmVersion = '<map version="1.0.1">\n';
  var iconTextPrefix = '<icon BUILTIN="';
  var iconTextSuffix = '"/>\n';
  var nodeCreated = '<node CREATED="';
  var nodeId = '" ID="';
  var nodeText = '" TEXT="';
  var nodeSuffix = '">\n';
  var entityNode = '</node>\n';
  var entityMap = '</map>';

  function exportFreeMind(minder) {
    var minds = minder.exportJson();
    var mmContent = mmVersion + traverseJson(minds.root) + entityNode + entityMap;
    try {
      const link = document.createElement('a');
      const blob = new Blob(["\ufeff" + mmContent], {
        type: 'text/xml'
      });
      link.href = window.URL.createObjectURL(blob);
      link.download = `${minds.root.data.text}.mm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert(err);
    }
  }

  function traverseJson(node){
    var result = "";
    if (!node) {
        return;
    }
    result += concatNodes(node);
    if (node.children && node.children.length > 0) {
        for (var i = 0; i < node.children.length; i++) {
            result += traverseJson(node.children[i]);
            result += entityNode;
        }
    }
    return result;
  }

  function concatNodes(node) {
    var result = "";
    var datas = node.data;
    result += nodeCreated + datas.created + nodeId + datas.id + nodeText + datas.text + nodeSuffix;
    if (datas.priority) {
      var mapped = priorities.find(d => {
        return d.jp == datas.priority
      });
      if (mapped) {
        result += iconTextPrefix + mapped.mp + iconTextSuffix;
      }
    }
    return result;
  }

  export {
    exportFreeMind
  }
