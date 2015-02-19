var PLACE_TYPES = [
  'accounting',
  'airport',
  'amusement_park',
  'aquarium',
  'art_gallery',
  'atm',
  'bakery',
  'bank',
  'bar',
  'beauty_salon',
  'bicycle_store',
  'book_store',
  'bowling_alley',
  'bus_station',
  'cafe',
  'campground',
  'car_dealer',
  'car_rental',
  'car_repair',
  'car_wash',
  'casino',
  'cemetery',
  'church',
  'city_hall',
  'clothing_store',
  'convenience_store',
  'courthouse',
  'dentist',
  'department_store',
  'doctor',
  'electrician',
  'electronics_store',
  'embassy',
  'establishment',
  'finance',
  'fire_station',
  'florist',
  'food',
  'funeral_home',
  'furniture_store',
  'gas_station',
  'general_contractor',
  'grocery_or_supermarket',
  'gym',
  'hair_care',
  'hardware_store',
  'health',
  'hindu_temple',
  'home_goods_store',
  'hospital',
  'insurance_agency',
  'jewelry_store',
  'laundry',
  'lawyer',
  'library',
  'liquor_store',
  'local_government_office',
  'locksmith',
  'lodging',
  'meal_delivery',
  'meal_takeaway',
  'mosque',
  'movie_rental',
  'movie_theater',
  'moving_company',
  'museum',
  'night_club',
  'painter',
  'park',
  'parking',
  'pet_store',
  'pharmacy',
  'physiotherapist',
  'place_of_worship',
  'plumber',
  'police',
  'post_office',
  'real_estate_agency',
  'restaurant',
  'roofing_contractor',
  'rv_park',
  'school',
  'shoe_store',
  'shopping_mall',
  'spa',
  'stadium',
  'storage',
  'store',
  'subway_station',
  'synagogue',
  'taxi_stand',
  'train_station',
  'travel_agency',
  'university',
  'veterinary_care',
  'zoo',
];

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
      initialLocation: DEFAULT_PRESETS.rockridge,
      placeType: 'restaurant'
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

  handleSelectPlaceType: function(placeType) {
    this.setState({placeType: placeType});
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
                      placeTypes={PLACE_TYPES}
                      selectedPlaceType={this.state.placeType}
                      onSearch={this.handleSearch}
                      onSelectPreset={this.handleSelectPreset}
                      onSelectPlaceType={this.handleSelectPlaceType} />
        <MapPanel addressSearchNotifier={this.addressSearchNotifier}
                  locationJumpNotifier={this.locationJumpNotifier}
                  initialLocation={this.state.initialLocation}
                  placeType={this.state.placeType} />
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

  handlePlaceTypeChange: function(event) {
    var name = event.target.value;
    this.props.onSelectPlaceType(name);
  },

  render: function() {
    var presetsNodes = Object.keys(this.props.presets).map(function(name) {
      var preset = this.props.presets[name];
      return (
        <option key={name} value={name}>{name}</option>
      );
    }.bind(this));

    var placeTypesNodes = this.props.placeTypes.map(function(name) {
      return (
        <option key={name} value={name}>{name}</option>
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
        <select onChange={this.handlePlaceTypeChange} value={this.props.selectedPlaceType}>
          {placeTypesNodes}
        </select>
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

  componentDidUpdate: function(prevProps, prevState) {
    this.radarSearchCurrentBounds();
  },

  render: function() {
    // NOTE: Somehow React knows not to touch the child elements created by Google Maps JS
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

    google.maps.event.addListener(this.mapState.map, 'bounds_changed', this.radarSearchCurrentBounds);
  },

  radarSearchCurrentBounds: function() {
    var request = {
      bounds: this.mapState.map.getBounds(),
      types: [this.props.placeType]
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

