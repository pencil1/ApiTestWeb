export function getStore (name) {
  try {
    return JSON.parse(window.localStorage.getItem(name))
  } catch (e) {}
}

export function setStore (name, data) {
  try {
    window.localStorage.setItem(name, JSON.stringify(data))
  } catch (e) {}
}
