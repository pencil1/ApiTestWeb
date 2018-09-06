/**
 * BMap component extension
 */
require('echarts').registerCoordinateSystem(
  'amap', require('./AMapCoordSys')
);
require('./AMapModel');
require('./AMapView');

// Action
require('echarts').registerAction({
  type: 'amapRoam',
  event: 'amapRoam',
  update: 'updateLayout'
}, function (payload, ecModel) {
  ecModel.eachComponent('amap', function (aMapModel) {
    var amap = aMapModel.getAMap();
    var center = amap.getCenter();
    aMapModel.setCenterAndZoom([center.lng, center.lat], amap.getZoom());
  });
});

module.exports = {
  version: process.env.VERSION
};
