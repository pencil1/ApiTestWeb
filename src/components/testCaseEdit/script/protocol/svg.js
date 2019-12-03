function exportSVG(minder) {

  var paper = minder.getPaper();
  var paperTransform = paper.shapeNode.getAttribute('transform');
  var svgXml;
  var $svg;

  var renderContainer = minder.getRenderContainer();
  var renderBox = renderContainer.getRenderBox();
  var transform = renderContainer.getTransform();
  var width = renderBox.width;
  var height = renderBox.height;
  var padding = 20;

  paper.shapeNode.setAttribute('transform', 'translate(0.5, 0.5)');
  svgXml = paper.container.innerHTML;
  console.log(svgXml);
  paper.shapeNode.setAttribute('transform', paperTransform);

  $svg = $(svgXml).filter('svg');
  $svg.attr({
    width: width + padding * 2 | 0,
    height: height + padding * 2 | 0,
    style: 'font-family: Arial, "Microsoft Yahei",  "Heiti SC"; background: ' + minder.getStyle('background')
  });
  $svg[0].setAttribute('viewBox', [renderBox.x - padding | 0,
    renderBox.y - padding | 0,
    width + padding * 2 | 0,
    height + padding * 2 | 0
  ].join(' '));

  svgXml = $('<div></div>').append($svg).html();
  svgXml = $('<div></div>').append($svg).html();
  svgXml = svgXml.replace(/&nbsp;/g, '&#xa0;');

  var blob = new Blob([svgXml], {
    type: 'image/svg+xml'
  });
  
  var DOMURL = window.URL || window.webkitURL || window;
  var svgUrl = DOMURL.createObjectURL(blob);

  var mind = editor.minder.exportJson();
  downloadSVG(svgUrl, mind.root.data.text);
}

function downloadSVG(fileURI, fileName) {
    try {
      const link = document.createElement('a');
      link.href = fileURI;
      link.download = `${fileName}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert(err);
    }
  }

export {
  exportSVG
}
