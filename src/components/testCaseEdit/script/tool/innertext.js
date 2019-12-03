define(function (require, exports, module) {
  if ((!('innerText' in document.createElement('a'))) && ('getSelection' in window)) {
    HTMLElement.prototype.__defineGetter__('innerText', function () {
      var selection = window.getSelection(),
        ranges = [],
        str, i;

      for (i = 0; i < selection.rangeCount; i++) {
        ranges[i] = selection.getRangeAt(i);
      }

      selection.removeAllRanges();
      selection.selectAllChildren(this);
      str = selection.toString();
      selection.removeAllRanges();
      for (i = 0; i < ranges.length; i++) {
        selection.addRange(ranges[i]);
      }
      return str;
    });
    HTMLElement.prototype.__defineSetter__('innerText', function (text) {
      this.innerHTML = (text || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
    });
  }
});
