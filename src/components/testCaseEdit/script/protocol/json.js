function exportJson(minder) {
  var minds = minder.exportJson();
  try {
    const link = document.createElement('a');
    const blob = new Blob(["\ufeff" + JSON.stringify(minds)], {
      type: 'text/json'
    });
    link.href = window.URL.createObjectURL(blob);
    link.download = `${minds.root.data.text}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    alert(err);
  }
}

export {
  exportJson
}
