define(function (require, exports, module) {
  function MimeType() {
    var SPLITOR = '\uFEFF';
    var MIMETYPE = {
      'application/km': '\uFFFF'
    };
    var SIGN = {
      '\uFEFF': 'SPLITOR',
      '\uFFFF': 'application/km'
    };

    function process(mimetype, text) {
      if (!this.isPureText(text)) {
        var _mimetype = this.whichMimeType(text);
        if (!_mimetype) {
          throw new Error('unknow mimetype!');
        };
        text = this.getPureText(text);
      };
      if (mimetype === false) {
        return text;
      };
      return mimetype + SPLITOR + text;
    }

    this.registMimeTypeProtocol = function (type, sign) {
      if (sign && SIGN[sign]) {
        throw new Error('sing has registed!');
      }
      if (type && !!MIMETYPE[type]) {
        throw new Error('mimetype has registed!');
      };
      SIGN[sign] = type;
      MIMETYPE[type] = sign;
    }

    this.getMimeTypeProtocol = function (type, text) {
      var mimetype = MIMETYPE[type] || false;

      if (text === undefined) {
        return process.bind(this, mimetype);
      };

      return process(mimetype, text);
    }

    this.getSpitor = function () {
      return SPLITOR;
    }

    this.getMimeType = function (sign) {
      if (sign !== undefined) {
        return SIGN[sign] || null;
      };
      return MIMETYPE;
    }
  }

  MimeType.prototype.isPureText = function (text) {
    return !(~text.indexOf(this.getSpitor()));
  }

  MimeType.prototype.getPureText = function (text) {
    if (this.isPureText(text)) {
      return text;
    };
    return text.split(this.getSpitor())[1];
  }

  MimeType.prototype.whichMimeType = function (text) {
    if (this.isPureText(text)) {
      return null;
    };
    return this.getMimeType(text.split(this.getSpitor())[0]);
  }

  function MimeTypeRuntime() {
    if (this.minder.supportClipboardEvent && !kity.Browser.gecko) {
      this.MimeType = new MimeType();
    };
  }

  return module.exports = MimeTypeRuntime;
});
