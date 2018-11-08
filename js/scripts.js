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

Station.prototype.setBikeData = function(dataBikeObject) {
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
  var that = this;

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState === 4 && this.status === 200) {
      var stationsObject = JSON.parse(xhttp.responseText);
      console.log("addStations");
      if(stationsObject && stationsObject.data && stationsObject.data.stations) {
        for(var i = 0; i < stationsObject.data.stations.length; i++) {
          var station = new Station();
          station.setStationData(stationsObject.data.stations[i]);
          that.addStation(station);
        }
        mapDisplay.addStationMarkers(that.stations);
      }
    }
  };
  xhttp.open("GET", stationUrl, true);
  xhttp.send();
}

Map.prototype.getStations = function() {
  return this.stations;
}

Map.prototype.addBikes = function(isFirstTime) {
  var bikeUrl = "http://biketownpdx.socialbicycles.com/opendata/station_status.json";
  var thatMap = this;

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState === 4 && this.status === 200) {
      var bikesObject = JSON.parse(xhttp.responseText);
      console.log("addBikes ", bikesObject.last_updated, isFirstTime);
      if(bikesObject && bikesObject.data && bikesObject.data.stations && thatMap.stations) {
        for(var i = 0; i < bikesObject.data.stations.length; i++) {
          var station = null;
          if(thatMap.stations[i] && (bikesObject.data.stations[i].station_id === thatMap.stations[i].id)) {
            station = thatMap.stations[i];
          } else{
            station = thatMap.findStation(bikesObject.data.stations[i].station_id);
          }
          if(station) {
            var oldBikeCount = station.bikeCount;
            station.setBikeData(bikesObject.data.stations[i]);
            if(!isFirstTime) {
              if(station.bikeCount !== oldBikeCount) {
                station.updated = true;
                console.log(station.name + " oldCount=" + oldBikeCount + " newCount=" + station.bikeCount);
              } else {
                station.updated = false;
              }
            }
          }
        }
      }
    }
  }
  xhttp.open("GET", bikeUrl, true);
  xhttp.send();
};

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

User.prototype.deleteStation = function(id) {
  for(var i = 0; i < this.favoriteStations.length; i++) {
    if (this.favoriteStations[i]){
      if (this.favoriteStations[i].id === id) {
        var station = map.findStation(id);
        station.favorite = false;
        delete this.favoriteStations[i];
        return true;
      }
    }
  }
  return false;
}

// User interface logic
function MapDisplay(){
  this.leafletMap = null;
  this.markers = [];
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

MapDisplay.prototype.setMarkerIcons = function(stations) {
  console.log("setMarkerIcons");
  for (var i = 0; i < stations.length; i++) {
    if(stations[i].selected) {
      var matchedMarker = this.findMarker(stations[i].id);
      matchedMarker.setIcon(this.selectedIcon);
    } else if (stations[i].favorite) {
      var matchedMarker = this.findMarker(stations[i].id);
      matchedMarker.setIcon(this.favoriteIcon);
    } else if (stations[i].updated) {
      var matchedMarker = this.findMarker(stations[i].id);
      matchedMarker.setIcon(this.updatedIcon);
    } else {
      var matchedMarker = this.findMarker(stations[i].id);
      matchedMarker.setIcon(this.icon);
    }
  }
}

var map = new Map();
var user = new User();
var mapDisplay = new MapDisplay();

function listAllStations(allStations) {
  var htmlForStationList = "";
  allStations.forEach(function(station){
    htmlForStationList += "<li id =" + station.id + ">" + station.name + "</li>";
  });
  $("ul#all-stations").html(htmlForStationList);
}

function showStationDetails(stationId){
  for(var i = 0; i < map.stations.length; i++){
    map.stations[i].selected = false;
  }
  var station = map.findStation(stationId);
  station.selected = true;
  mapDisplay.setMarkerIcons(map.stations);
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
  currentStation.favorite = true;

  var isAlreadyPresent = false;
  for(var i = 0; i < user.favoriteStations.length; i++) {
    if(currentStation === user.favoriteStations[i]) {
      isAlreadyPresent = true;
    }
  }
  if(!isAlreadyPresent) {
    user.favoriteStations.push(currentStation);
    $("#favorite-stations-box").show();
    if(user.name) {
      $(".users-name").html(user.name + "'s " + " ");
    }
    updateFavoriteStations();
    mapDisplay.setMarkerIcons(map.stations);
  }
}

function updateFavoriteStations() {
  $("#favorite-stations-list").empty();
  for(var i = 0; i < user.favoriteStations.length; i++){
    if(user.favoriteStations[i]) {
      $("#favorite-stations-list").append("<li>" + user.favoriteStations[i].name + "<input type= 'button' class='deleteButton' id='" + user.favoriteStations[i].id +"' value='X'>" +" </li>");
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
  setTimeout(function() {
    map.addBikes(true);
  }, 3000);
  setTimeout(function() {
    listAllStations(map.stations);
  }, 6000);

  setInterval(function() {
    map.addBikes(false);
    setTimeout(function() {
      mapDisplay.setMarkerIcons(map.stations);
    }, 5000);
  }, 60000);

  $("form#input-name").submit(function(event){
    event.preventDefault();
    var nameInput = $("#name").val();
    user.name = nameInput;
  });

  var detailsId = $("#station-id");
  $("#favorite-button").click(function(){
    addToFavorites(detailsId);
  });

  $("ul#all-stations").on("click", "li", function(){
    showStationDetails(this.id);
  });

  $("#favorite-stations-list").on("click", ".deleteButton", function (){
    console.log("delete ", this.id);
    user.deleteStation(this.id);
    updateFavoriteStations();
    mapDisplay.setMarkerIcons(map.stations);
  });
});
