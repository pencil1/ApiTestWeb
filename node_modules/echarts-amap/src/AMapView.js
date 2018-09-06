/*
 * this function bollowed from:
 * https://github.com/Leaflet/Leaflet/blob/master/src/core/Util.js
 */
function throttle(fn, time, context) {
	var lock, args, wrapperFn, later;

	later = function () {
		// reset lock and call if queued
		lock = false;
		if (args) {
			wrapperFn.apply(context, args);
			args = false;
		}
	};

	wrapperFn = function () {
		if (lock) {
			// called too soon, queue to call later
			args = arguments;

		} else {
			// call and lock until later
			fn.apply(context, arguments);
			setTimeout(later, time);
			lock = true;
		}
	};

	return wrapperFn;
}

var echarts = require('echarts');

module.exports = require('echarts').extendComponentView({
  type: 'amap',

  render: function (aMapModel, ecModel, api) {
    var rendering = true;

    var amap = aMapModel.getAMap();
    var viewportRoot = api.getZr().painter.getViewportRoot();
    var coordSys = aMapModel.coordinateSystem;
    var moveHandler = function (e) {
      if (rendering) {
          return;
      }
      var offsetEl = viewportRoot.parentNode.parentNode.parentNode;
      var mapOffset = [
          -parseInt(offsetEl.style.left, 10) || 0,
          -parseInt(offsetEl.style.top, 10) || 0
      ];
      viewportRoot.style.left = mapOffset[0] + 'px';
      viewportRoot.style.top = mapOffset[1] + 'px';

      coordSys.setMapOffset(mapOffset);
      aMapModel.__mapOffset = mapOffset;

      api.dispatchAction({
          type: 'amapRoam'
      });
    };

    function zoomEndHandler() {
      if (rendering) {
          return;
      }
      api.dispatchAction({
          type: 'amapRoam'
      });
    }

    function resizeHandler(e) {
      echarts.getInstanceByDom(api.getDom()).resize();
      moveHandler.call(this, e)
    }

    var throttledResizeHandler = throttle(resizeHandler, 300, amap);

    amap.off('movestart', this._oldMoveHandler);
    amap.off('zoomend', this._oldZoomEndHandler);
    amap.off('moveend', this._oldZoomEndHandler);
    amap.off('complete', this._oldZoomEndHandler);
    aMapModel.get('resizeEnable') && amap.off('resize', this._oldResizeHandler);

    amap.on('movestart', moveHandler);
    amap.on('zoomend', zoomEndHandler);
    amap.on('moveend', zoomEndHandler);
    amap.on('complete', zoomEndHandler);
    aMapModel.get('resizeEnable') && amap.on('resize', throttledResizeHandler);

    this._oldMoveHandler = moveHandler;
    this._oldZoomEndHandler = zoomEndHandler;
    this._oldResizeHandler = throttledResizeHandler;

    // var roam = aMapModel.get('roam');
    // if (roam && roam !== 'scale') {
    //     amap.enableDragging();
    // }
    // else {
    //     amap.disableDragging();
    // }
    // if (roam && roam !== 'move') {
    //     amap.enableScrollWheelZoom();
    //     amap.enableDoubleClickZoom();
    //     amap.enablePinchToZoom();
    // }
    // else {
    //     amap.disableScrollWheelZoom();
    //     amap.disableDoubleClickZoom();
    //     amap.disablePinchToZoom();
    // }

    rendering = false;
  }
});
