//Business Logic stations
function Station (){
  this.name = "",
  this.address = "",
  this.id = 0,
  this.intersection = [0,0],
  this.bikeCount = 0,
  this.rackCount = 0
}

Station.prototype.setId = function(id) {
  this.id = id;
}
// STATION_STATUS_GBFS: "'http://biketownpdx.socialbicycles.com/opendata/station_status.json'",
// STATION_INFORMATION_GBFS: "'http://biketownpdx.socialbicycles.com/opendata/station_information.json'",

/*
{"station_id":"hub_1576","name":"SW 3rd at Morrison","region_id":"region_241","lon":-122.67558217048645,"lat":45.51803881572945,"address":"718-732 Southwest 3rd Avenue, Portland","rental_methods":

{"station_id":"hub_1576","num_bikes_available":5,"num_bikes_disabled":0,"num_docks_available":11,"is_installed":1,"is_renting":1,"is_returning":1,"last_reported":1541445514},


{"station_id":"hub_1561","name":"NW Johnson at Jamison Square","region_id":"region_241","lon":-122.68201947212219,"lat":45.52863659670261,"address":"718 Northwest 11th Avenue, Portland","rental_methods":

{"station_id":"hub_1561","num_bikes_available":4,"num_bikes_disabled":0,"num_docks_available":13,"is_installed":1,"is_renting":1,"is_returning":1,"last_reported":1541445514},


{"station_id":"hub_1588","name":"NW Couch at 11th","region_id":"region_241","lon":-122.68181294202805,"lat":45.523741513819246,"address":"1037 Northwest Couch Street, Portland","rental_methods":

{"station_id":"hub_1588","num_bikes_available":8,"num_bikes_disabled":0,"num_docks_available":10,"is_installed":1,"is_renting":1,"is_returning":1,"last_reported":1541445514},


{"station_id":"hub_1535","name":"SW Park at Portland Art Museum","region_id":"region_241","lon":-122.68331229686736,"lat":45.515923530681164,"address":"1315 Southwest Park Avenue, Portland","rental_methods":

{"station_id":"hub_1535","num_bikes_available":5,"num_bikes_disabled":0,"num_docks_available":11,"is_installed":1,"is_renting":1,"is_returning":1,"last_reported":1541445514},


{"station_id":"hub_1563","name":"NW 23rd at Overton","region_id":"region_241","lon":-122.69863039255142,"lat":45.53211645029155,"address":"1310 Northwest 23rd Avenue, Portland","rental_methods":

{"station_id":"hub_1563","num_bikes_available":5,"num_bikes_disabled":0,"num_docks_available":9,"is_installed":1,"is_renting":1,"is_returning":1,"last_reported":1541445514},

*/

// Business logic Map
function Map (){
  this.stations = [],
  this.center = [0, 0],
  this.zoomLevel = 0
}

Map.prototype.setCenter = function(latLong) {
  this.center = latLong;
}

Map.prototype.getCenter = function() {
  return this.center;
}

Map.prototype.setZoom = function(level) {
  this.zoomLevel = level;
}

Map.prototype.getZoom = function() {
  return this.zoomLevel;
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

Map.prototype.getStations = function() {
  return this.stations;
}

// User interface logic
var map = new Map();

function setMapLocation(localMap) {
  var mymap = L.map('mapid').setView(localMap.getCenter(), localMap.getZoom());

  L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {
    attribution: '&copy; <a id="home-link" target="_top" href="../">Map tiles</a> by <a target="_top" href="http://stamen.com">Stamen Design</a>, under <a target="_top" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
    maxZoom: 18,
  }).addTo(mymap);
}

$(function() {
  var portlandDowntown = [45.523360, -122.681237];
  map.setCenter(portlandDowntown);
  map.setZoom(15);
  setMapLocation(map);
})
