var map;
var heatmap;
var infowindow;
var geocoder;

function initialize() {
  var pyrmont = new google.maps.LatLng(-33.8665433, 151.1956316);
  var sanFrancisco = new google.maps.LatLng(37.774546, -122.433523);
  var rockridge = new google.maps.LatLng(37.8446, -122.2512);
  var stockholm = new google.maps.LatLng(59.335423, 18.069600);
  var manhattan = new google.maps.LatLng(40.790651, -73.954983);
  var wentworthville = new google.maps.LatLng(-33.807066, 150.972452);

  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: rockridge,
    zoom: 15
  });

  heatmap = new google.maps.visualization.HeatmapLayer({
    radius: 20
  });
  heatmap.setMap(map);

  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);

  geocoder = new google.maps.Geocoder();

  google.maps.event.addListener(map, 'bounds_changed', function() {
    var request = {
      bounds: map.getBounds(),
      types: ['restaurant']
    };
    service.radarSearch(request, callback);
  });
}

function callback(results, status) {
  var points = [];
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      points.push(place.geometry.location);
    }
  }
  heatmap.setData(points);
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

function codeAddress() {
  var address = document.getElementById('address').value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
