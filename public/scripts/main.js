var DEFAULT_PRESETS = {
  rockridge: {
    latitude: 37.8446,
    longitude: -122.2512
  },
  pyrmont: {
    latitude: -33.8665433,
    longitude: 151.1956316
  },
  sanFrancisco: {
    latitude: 37.774546,
    longitude: -122.433523
  },
  stockholm: {
    latitude: 59.335423,
    longitude: 18.069600
  },
  manhattan: {
    latitude: 40.790651,
    longitude: -73.954983
  },
  wentworthville: {
    latitude: -33.807066,
    longitude: 150.972452
  }
};
  
var App = React.createClass({

  getInitialState: function() {
    return {
      presets: DEFAULT_PRESETS,
      initialLocation: DEFAULT_PRESETS.rockridge
    }
  },

  handleSearch: function(address) {
    this.addressSearchNotifier.listeners.forEach(function(listener) {
      listener(address);
    });
  },
  
  handleSelectPreset: function(preset) {
    this.locationJumpNotifier.listeners.forEach(function(listener) {
      listener(preset);
    });
  },

  addressSearchNotifier: {
    listeners: [],
    subscribe: function(listener) {
      // TODO(rwu): Return an unsubscribe function.
      this.listeners.push(listener);
    }
  },

  locationJumpNotifier: {
    listeners: [],
    subscribe: function(listener) {
      // TODO(rwu): Return an unsubscribe function.
      this.listeners.push(listener);
    }
  },

  render: function() {
    return (
      <div id="app">
        <ControlPanel presets={this.state.presets}
                      onSearch={this.handleSearch}
                      onSelectPreset={this.handleSelectPreset} />
        <MapPanel addressSearchNotifier={this.addressSearchNotifier}
                  locationJumpNotifier={this.locationJumpNotifier}
                  initialLocation={this.state.initialLocation} />
      </div>
    );
  }

});
    

var ControlPanel = React.createClass({

  handleSearch: function(event) {
    event.preventDefault();
    // TODO(rwu): Get address using virtual DOM.
    var address = this.refs.address.getDOMNode().value.trim();
    this.props.onSearch(address);
  },

  handleSelectChange: function(event) {
    var name = event.target.value;
    this.props.onSelectPreset(this.props.presets[name]);
    // TODO(rwu): Get address using virtual DOM.
    this.refs.address.getDOMNode().value = '';
    event.target.selectedIndex = 0;
  },

  render: function() {
    var presetsNodes = Object.keys(this.props.presets).map(function(name) {
      var preset = this.props.presets[name];
      return (
        <option value={name}>{name}</option>
      );
    }.bind(this));

    return (
      <div id="panel">
        <div id="panel-title">Charcoal Maps</div>
        <select onChange={this.handleSelectChange}>
          <option>Select preset...</option>
          {presetsNodes}
        </select>
        <div>or</div>
        <form onSubmit={this.handleSearch}>
          <input ref="address" id="address" type="textbox" placeholder="Enter location..."></input>
          <input type="submit" value="Search"></input>
        </form>
      </div>
    );
  }

});

var MapPanel = React.createClass({

  componentDidMount: function() {
    this.initializeMap();
    this.props.addressSearchNotifier.subscribe(this.handleAddressSearch);
    this.props.locationJumpNotifier.subscribe(this.handleLocationJump);
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

  handleLocationJump: function(location) {
    var latLng = new google.maps.LatLng(location.latitude, location.longitude);
    this.mapState.map.setCenter(latLng);
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
    var initialLatLng = new google.maps.LatLng(
        this.props.initialLocation.latitude,
        this.props.initialLocation.longitude);
    this.mapState.map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: initialLatLng,
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

