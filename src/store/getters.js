export const count = state => {
  return state.count;
}

export const working = state => {
  return {
    saving: state.working.saving,
    draging: state.working.draging,
    editing: state.working.editing
  }
}

export const config = state => {
  return {
    ctrlPanelMin: state.config.ctrlPanelMin,
    ctrlPanelWidth: state.config.ctrlPanelWidth,
    dividerWidth: state.config.dividerWidth,
    defaultLang: state.config.defaultLang,
    zoom: state.config.zoom
  }
}

export const getMinder = state => {
  return state.minder
}

export const getEditor = state => {
  return state.editor
}
