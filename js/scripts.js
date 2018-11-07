//Business Logic stations
function Station (){
  this.name = "",
  this.address = "",
  this.id = 0,
  this.intersection = [0,0],
  this.bikeCount = 0,
  this.rackCount = 0,
  this.selected = false,
  this.favorite = false,
  this.updated = false
}

Station.prototype.setStationData = function(dataObject) {
  this.name = dataObject.name;
  this.address = dataObject.address;
  this.id = dataObject.station_id;
  this.intersection = [dataObject.lat, dataObject.lon];
}

Station.prototype.setBikeData = function(bikeData) {
  var dataBikeObject = JSON.parse(bikeData);
  this.bikeCount = dataBikeObject.num_bikes_available;
  this.rackCount = dataBikeObject.num_docks_available;
}

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

Map.prototype.addStation = function(station) {
  this.stations.push(station);
}

Map.prototype.addStations = function(mapDisplay) {
  var stationUrl = "http://biketownpdx.socialbicycles.com/opendata/station_information.json";
  var bikeUrl = "http://biketownpdx.socialbicycles.com/opendata/station_status.json";

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState === 4 && this.status === 200) {
      var stationsObject = JSON.parse(xhttp.responseText);
      if(stationsObject && stationsObject.data && stationsObject.data.stations) {
        for(var i = 0; i < stationsObject.data.stations.length; i++) {
          var station = new Station();
          station.setStationData(stationsObject.data.stations[i]);
          map.addStation(station);
        }
        mapDisplay.addStationMarkers(map.stations);
      }
    }
  };
  xhttp.open("GET", stationUrl, true);
  xhttp.send();
}

Map.prototype.getStations = function() {
  return this.stations;
}

Map.prototype.findStation = function(id){
  for (var i = 0; i < this.stations.length; i++){
    if (this.stations[i]) {
      if (this.stations[i].id === id){
        return this.stations[i];
      }
    }
  }
  return false;
}

function User(){
  this.name = name;
  this.favoriteStations = [];
}

User.prototype.deleteStation = function(id){
  for(var i = 0; i < this.favoriteStations.length; i++){
    if (this.favoriteStations[i]){
      if (this.favoriteStations[i].id === id){
        delete this.favoriteStations[i];
        return true;
      }
    }
  }
  return false;
}


// Test data
var station0BikeData = '{"station_id":"hub_1576","num_bikes_available":5,"num_bikes_disabled":0,"num_docks_available":11,"is_installed":1,"is_renting":1,"is_returning":1,"last_reported":1541445514}';
var station1BikeData = '{"station_id":"hub_1561","num_bikes_available":4,"num_bikes_disabled":0,"num_docks_available":13,"is_installed":1,"is_renting":1,"is_returning":1,"last_reported":1541445514}';
var station2BikeData = '{"station_id":"hub_1588","num_bikes_available":8,"num_bikes_disabled":0,"num_docks_available":10,"is_installed":1,"is_renting":1,"is_returning":1,"last_reported":1541445514}';
var station3BikeData = '{"station_id":"hub_1535","num_bikes_available":5,"num_bikes_disabled":0,"num_docks_available":11,"is_installed":1,"is_renting":1,"is_returning":1,"last_reported":1541445514}';
var station4BikeData = '{"station_id":"hub_1563","num_bikes_available":5,"num_bikes_disabled":0,"num_docks_available":9,"is_installed":1,"is_renting":1,"is_returning":1,"last_reported":1541445514}';


// User interface logic
function MapDisplay(){
  this.leafletMap = null;
  this.markers = [];
  this.selectedMarker = null;
  this.selectedIcon = null;
  this.favoriteIcon = null;
  this.updatedIcon = null;
  this.icon = null;
}

MapDisplay.prototype.initialize = function(divId, center, zoom) {
  this.leafletMap = L.map(divId).setView(center, zoom);
  L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {
    attribution: '&copy; <a id="home-link" target="_top" href="../">Map tiles</a> by <a target="_top" href="http://stamen.com">Stamen Design</a>, under <a target="_top" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
    maxZoom: 18,
  }).addTo(this.leafletMap);

  this.selectedIcon = this.makeIcon('./img/red.png', 64, 80, 32, 80);
  this.favoriteIcon = this.makeIcon('./img/blue.png', 64, 80, 32, 80);
  this.updatedIcon = this.makeIcon('./img/yellow.png', 50, 50, 25, 25);
  this.icon = this.makeIcon('./img/green.png', 50, 50, 25, 25);
}

MapDisplay.prototype.makeIcon = function(url, width, height, anchorX, anchorY) {
  var icon = L.icon({
    iconUrl: url,

    iconSize: [width, height],
    iconAnchor: [anchorX, anchorY],
    popupAnchor: [anchorX, -10]
  });
  return icon;
}

MapDisplay.prototype.addStationMarkers = function(stations) {
  for(var i = 0; i < stations.length; i++) {
    var markerIcon = this.icon;
    if(stations[i].selected) {
      markerIcon = this.selectedIcon;
    } else if(stations[i].favorite) {
      markerIcon = this.favoriteIcon;
    } else if(stations[i].updated) {
      markerIcon = this.updatedIcon;
    }

    var marker = L.marker(stations[i].intersection, {icon: markerIcon});
    marker.station_id = stations[i].id
    marker.addTo(this.leafletMap).on("click", stationClick);

    this.markers.push(marker);
  }
}

MapDisplay.prototype.findMarker = function(id){
  for (var i = 0; i < this.markers.length; i++){
    if (this.markers[i]) {
      if (this.markers[i].station_id === id){
        return this.markers[i];
      }
    }
  }
  return false;
}

MapDisplay.prototype.setMarkerIcon = function(marker, isSelected, isFavorite, isUpdated) {
  if(marker) {
    if(isSelected) {
      marker.setIcon(this.selectedIcon);
    } else if(isFavorite) {
      marker.setIcon(this.favoriteIcon);
    } else if(isUpdated) {
      marker.setIcon(this.updatedIcon);
    } else {
      marker.setIcon(this.icon);
    }
  }
}

MapDisplay.prototype.selectMarker = function(stationId) {
  this.setMarkerIcon(this.selectedMarker, false, false, false);

  this.selectedMarker = this.findMarker(stationId);
  this.setMarkerIcon(this.selectedMarker, true, false, false);
}

var map = new Map();
var user = new User();
var mapDisplay = new MapDisplay();

function listStations(allStations) {
  var htmlForStationList = "";
  allStations.forEach(function(station){
    htmlForStationList += "<li id =" + station.id + ">" + station.name + "</li>";
  });
  $("ul#indvStation").html(htmlForStationList);
}

function showStationDetails(stationId){
  var station = map.findStation(stationId);
  mapDisplay.selectMarker(stationId);

  if(station) {
    $("#station-id").html(station.id)
    $(".station-name").html(station.name)
    $(".station-address").html(station.address)
    $(".station-bike-count").html(station.bikeCount)
    $(".station-rack-count").html(station.rackCount)
    $(".station-details").show();
  }
}

function addToFavorites(detailsId){
  var currentStation = map.findStation(detailsId.text());
  user.favoriteStations.push(currentStation);
  $(".favorite-stations-list").show();
  $(".users-name").html(user.name + "'s " + " ");
  updateFavoriteStations();
}

function updateFavoriteStations() {

  $("#favorite-stations-list-name").empty();
  for(var i = 0; i < user.favoriteStations.length; i++){
    if(user.favoriteStations[i]) {
      $("#favorite-stations-list-name").append("<li>" + user.favoriteStations[i].name + "<input type= 'button' class='deleteButton' id='" + user.favoriteStations[i].id +"' value='Delete'>" +" </li>");
    }
  }
}

function makeIcon(url, width, height, anchorX, anchorY) {
  var icon = L.icon({
    iconUrl: url,

    iconSize: [width, height],
    iconAnchor: [anchorX, anchorY],
    popupAnchor: [anchorX, -10]
  });
  return icon;
}

function stationClick(event) {
  var id = event && event.target && event.target.station_id;
  if(id) {
    showStationDetails(id);
  }
}

$(function() {
  var portlandDowntown = [45.523360, -122.681237];
  map.setCenter(portlandDowntown);
  map.setZoom(15);

  mapDisplay.initialize("mapid", map.getCenter(), map.getZoom());
  map.addStations(mapDisplay);
  listStations(map.stations);

  $("form#input-name").submit(function(event){
    event.preventDefault();
    var nameInput = $("#name").val();
    user.name = nameInput;
  });

  var detailsId = $("#station-id");
  $("#favorite-button").click(function(){
    addToFavorites(detailsId);
    // add to favorite station ul
  });

  $("ul#indvStation").on("click", "li", function(){
    showStationDetails(this.id);
  });

  $("#favorite-stations-list-name").on("click", ".deleteButton", function (){
    console.log("delete ", this.id);
    user.deleteStation(this.id);
    updateFavoriteStations();
  });
});
