define(function (require, exports, module) {
  var key = require('../tool/key');
  var hotbox = require('./hotbox');

  function ReceiverRuntime() {
    var fsm = this.fsm;
    var minder = this.minder;
    var me = this;

    // 接收事件的 div
    var element = document.createElement('div');
    element.contentEditable = true;
    element.setAttribute("tabindex", -1);
    element.classList.add('receiver');
    element.onkeydown = element.onkeypress = element.onkeyup = dispatchKeyEvent;
    this.container.appendChild(element);

    // receiver 对象
    var receiver = {
      element: element,
      selectAll: function () {
        // 保证有被选中的
        if (!element.innerHTML) element.innerHTML = '&nbsp;';
        var range = document.createRange();
        var selection = window.getSelection();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
        element.focus();
      },
      enable: function () {
        element.setAttribute("contenteditable", true);
      },
      disable: function () {
        element.setAttribute("contenteditable", false);
      },
      fixFFCaretDisappeared: function () {
        element.removeAttribute("contenteditable");
        element.setAttribute("contenteditable", "true");
        element.blur();
        element.focus();
      },
      onblur: function (handler) {
        element.onblur = handler;
      }
    };
    receiver.selectAll();
    minder.on('beforemousedown', receiver.selectAll);
    minder.on('receiverfocus', receiver.selectAll);
    minder.on('readonly', function () {
      // 屏蔽minder的事件接受，删除receiver和hotbox
      minder.disable();
      editor.receiver.element.parentElement.removeChild(editor.receiver.element);
      editor.hotbox.$container.removeChild(editor.hotbox.$element);
    });

    // 侦听器，接收到的事件会派发给所有侦听器
    var listeners = [];

    // 侦听指定状态下的事件，如果不传 state，侦听所有状态
    receiver.listen = function (state, listener) {
      if (arguments.length == 1) {
        listener = state;
        state = '*';
      }
      listener.notifyState = state;
      listeners.push(listener);
    };

    function dispatchKeyEvent(e) {
      e.is = function (keyExpression) {
        var subs = keyExpression.split('|');
        for (var i = 0; i < subs.length; i++) {
          if (key.is(this, subs[i])) return true;
        }
        return false;
      };
      var listener, jumpState;
      for (var i = 0; i < listeners.length; i++) {

        listener = listeners[i];
        // 忽略不在侦听状态的侦听器
        if (listener.notifyState != '*' && listener.notifyState != fsm.state()) {
          continue;
        }

        if (listener.call(null, e)) {
          return;
        }
      }
    }

    this.receiver = receiver;
  }

  return module.exports = ReceiverRuntime;
});
