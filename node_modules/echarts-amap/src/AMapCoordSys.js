var echarts = require('echarts');

function AMapCoordSys(amap, api) {
  this._amap = amap;
  this.dimensions = ['lng', 'lat'];
  this._mapOffset = [0, 0];

  this._api = api;
}

AMapCoordSys.prototype.dimensions = ['lng', 'lat'];

AMapCoordSys.prototype.setZoom = function (zoom) {
  this._zoom = zoom;
};

AMapCoordSys.prototype.setCenter = function (center) {
  this._center = this._amap.lnglatToPixel(center);//, 10)
};

AMapCoordSys.prototype.setMapOffset = function (mapOffset) {
  this._mapOffset = mapOffset;
};

AMapCoordSys.prototype.getAMap = function () {
  return this._amap;
};

AMapCoordSys.prototype.dataToPoint = function (data) {
  var point = new AMap.LngLat(data[0], data[1]);
  var px = this._amap.lngLatToContainer(point);//, this._zoom);
  var mapOffset = this._mapOffset;
  return [px.x - mapOffset[0], px.y - mapOffset[1]];
};

AMapCoordSys.prototype.pointToData = function (pt) {
  var mapOffset = this._mapOffset;
  var pt = this._amap.containerToLngLat({
    x: pt[0] + mapOffset[0],
    y: pt[1] + mapOffset[1]
  });
  return [pt.lng, pt.lat];
};

AMapCoordSys.prototype.getViewRect = function () {
  var api = this._api;
  return new echarts.graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight());
};

AMapCoordSys.prototype.getRoamTransform = function () {
  return echarts.matrix.create();
};

var Overlay;

// For deciding which dimensions to use when creating list data
AMapCoordSys.dimensions = AMapCoordSys.prototype.dimensions;

AMapCoordSys.create = function (ecModel, api) {
  var amapCoordSys;
  var root = api.getDom();

  // TODO Dispose
  ecModel.eachComponent('amap', function (amapModel) {
    var viewportRoot = api.getZr().painter.getViewportRoot();
    if (typeof AMap === 'undefined') {
      throw new Error('AMap api is not loaded');
    }

    if (amapCoordSys) {
      throw new Error('Only one amap component can exist');
    }
    if (!amapModel.__amap) {
      // Not support IE8
      var amapRoot = root.querySelector('.ec-extension-amap');
      if (amapRoot) {
          // Reset viewport left and top, which will be changed
          // in moving handler in AMapView
          viewportRoot.style.left = '0px';
          viewportRoot.style.top = '0px';
          root.removeChild(amapRoot);
      }
      amapRoot = document.createElement('div');
      amapRoot.style.cssText = 'width:100%;height:100%';
      // Not support IE8
      amapRoot.classList.add('ec-extension-amap');
      root.appendChild(amapRoot);

      var options = amapModel.get() || {};
      options = amapModel.__options = echarts.util.clone(options);
      var amap = amapModel.__amap = new AMap.Map(amapRoot, options);

      var layer = amapModel.__layer = new AMap.CustomLayer(viewportRoot);
      layer.setMap(amap);
    }
    var amap = amapModel.getAMap();
    var layer = amapModel.getLayer();
    layer.hide();

    var zoom = amap.getZoom();
    var center = amap.getCenter();

    amapCoordSys = new AMapCoordSys(amap, api);
    amapCoordSys.setMapOffset(amapModel.__mapOffset || [0, 0]);
    amapCoordSys.setZoom(zoom);
    amapCoordSys.setCenter([center.lng, center.lat]);

    amapModel.coordinateSystem = amapCoordSys;
    layer.show();
  });

  ecModel.eachSeries(function (seriesModel) {
    if (seriesModel.get('coordinateSystem') === 'amap') {
      seriesModel.coordinateSystem = amapCoordSys;
    }
  });
};

module.exports = AMapCoordSys;
