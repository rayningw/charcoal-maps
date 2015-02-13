var pyrmont = new google.maps.LatLng(-33.8665433, 151.1956316);
var sanFrancisco = new google.maps.LatLng(37.774546, -122.433523);
var rockridge = new google.maps.LatLng(37.8446, -122.2512);
var stockholm = new google.maps.LatLng(59.335423, 18.069600);
var manhattan = new google.maps.LatLng(40.790651, -73.954983);
var wentworthville = new google.maps.LatLng(-33.807066, 150.972452);

var App = React.createClass({

  handleSearch: function(address) {
    this.addressSearchNotifier.listeners.forEach(function(listener) {
      listener(address);
    });
  },

  addressSearchNotifier: {
    listeners: [],
    subscribe: function(listener) {
      // TODO(rwu): Return an unsubscribe function.
      this.listeners.push(listener);
    }
  },

  render: function() {
    return (
      <div id="app">
        <ControlPanel onSearch={this.handleSearch} />
        <MapPanel addressSearchNotifier={this.addressSearchNotifier} />
      </div>
    );
  }

});
    

var ControlPanel = React.createClass({

  handleSearch: function(event) {
    // TODO(rwu): Get address using virtual DOM.
    var address = this.refs.address.getDOMNode().value.trim();
    this.props.onSearch(address);
  },

  render: function() {
    return (
      <div id="panel">
        <input ref="address" id="address" type="textbox"></input>
        <input type="button" value="Search" onClick={this.handleSearch}></input>
      </div>
    );
  }

});

var MapPanel = React.createClass({

  componentDidMount: function() {
    this.initializeMap();
    this.props.addressSearchNotifier.subscribe(this.handleAddressSearch);
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    // Let Google Maps JS handle the map.
    return false;
  },

  render: function() {
    return (
      <div id="map-canvas"></div>
    );
  },

  mapState: {
    map: undefined,
    heatmap: undefined,
    geocoder: undefined,
    placesService: undefined
  },

  handleAddressSearch: function(address) {
    this.mapState.geocoder.geocode({'address': address}, this.handleGeocodeCallback);
  },

  handleGeocodeCallback: function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      this.mapState.map.setCenter(results[0].geometry.location);
    }
    else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  },

  initializeMap: function() {
    this.mapState.map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: rockridge,
      zoom: 15
    });

    this.mapState.heatmap = new google.maps.visualization.HeatmapLayer({
      radius: 30
    });
    this.mapState.heatmap.setMap(this.mapState.map);

    this.mapState.geocoder = new google.maps.Geocoder();

    this.mapState.placesService = new google.maps.places.PlacesService(this.mapState.map);

    google.maps.event.addListener(this.mapState.map, 'bounds_changed', this.handleBoundsChangedCallback);
  },

  handleBoundsChangedCallback: function() {
    var request = {
      bounds: this.mapState.map.getBounds(),
      types: ['restaurant']
    };
    this.mapState.placesService.radarSearch(request, this.handleRadarSearchCallback);
  },

  handleRadarSearchCallback: function(results, status) {
    var points = [];
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        points.push(place.geometry.location);
      }
    }
    this.mapState.heatmap.setData(points);
  }

});

React.render(
  <App />,
  document.getElementById('content')
);

