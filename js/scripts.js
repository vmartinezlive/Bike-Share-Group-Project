// Business logic
function Map (){
  this.stations = [],
  this.center = [0, 0],
  this.zoomLevel = 0
}

Map.prototype.setCenter = function(latLong) {
  this.center = latLong;
}

Map.prototype.setZoom = function(level) {
  this.zoomLevel = level;
}

Map.prototype.zoomIn = function() {
  this.zoomLevel++;
  if(this.zoomLevel > 19) {
    this.zoomLevel = 19;
  }
}

Map.prototype.zoomOut = function() {
  this.zoomLevel--;
  if(this.zoomLevel < 0) {
    this.zoomLevel = 0;
  }
}


// User interface logic
var map = new Map();

$(function() {
  map.setCenter([45.523360, -122.681237]);
  map.setZoom(11);
})
