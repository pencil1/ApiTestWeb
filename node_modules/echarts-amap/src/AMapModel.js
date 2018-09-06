function v2Equal(a, b) {
  return a && b && a[0] === b[0] && a[1] === b[1];
}

module.exports = require('echarts').extendComponentModel({
  type: 'amap',

  getAMap: function () {
    // __amap is injected when creating AMapCoordSys
    return this.__amap;
  },

  getLayer: function() {
    // __layer is injected when creating AMapCoordSys
    return this.__layer;
  },

  getMapOptions: function() {
    return this.__options;
  },

  setCenterAndZoom: function (center, zoom) {
    this.option.center = center;
    this.option.zoom = zoom;
  },

  centerOrZoomChanged: function (center, zoom) {
    var option = this.option;
    return !(v2Equal(center, option.center) && zoom === option.zoom);
  },

  defaultOption: {
    center: [116.397475,39.908695],
    zoom: 4,
  }
});
