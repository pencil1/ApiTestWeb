export const actions = {
  changeCount: ({
    commit
  }) => commit('changeCount'),

  increment: ({
    commit
  }) => commit('increment'),

  decrement: ({
    commit
  }) => commit('decrement'),

  incrementIfOdd({
    commit,
    state
  }) {
    if ((state.count + 1) % 2 === 0) {
      commit('increment')
    }
  },

  incrementAsync({
    commit
  }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('increment')
        resolve()
      }, 1000)
    })
  },

  setConfig: ({
    commit
  }) => commit('setConfig'),

  registerEvent: ({
    commit
  }) => commit('registerEvent', callback),

  executeCallback({
    commit,
    state
  }) {
    state.callbackQueue.forEach(function (ele) {
      ele.apply(this, arguments);
    })
  },

  isQuotaExceeded(e) {
    var quotaExceeded = false;
    if (e) {
      if (e.code) {
        switch (e.code) {
          case 22:
            quotaExceeded = true;
            break;
          case 1014:
            // Firefox
            if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
              quotaExceeded = true;
            }
            break;
        }
      } else if (e.number === -2147024882) {
        // Internet Explorer 8
        quotaExceeded = true;
      }
    }
    return quotaExceeded;
    index
  },

  getMemory({
    commit,
    state
  }, key) {
    var value = window.localStorage.getItem(key);
    var result = null || JSON.parse(value)
    console.log('action:' + result);
    return result;
  },

  setMemory({
    commit,
    state
  }, data) {
    try {
      window.localStorage.setItem(data.key, JSON.stringify(data.value));
      return true;
    } catch (e) {
      if (this.isQuotaExceeded(e)) {
        return false;
      }
    }
  },

  removeMemory(key) {
    var value = window.localStorage.getItem(key);
    window.localStorage.removeItem(key);
    return value;
  },

  clearMemory() {
    window.localStorage.clear();
  }
}
