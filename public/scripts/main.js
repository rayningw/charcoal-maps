(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./scripts/main.js":[function(require,module,exports){
var constants = require('./constants.js');
var App = require('./components/app.js');

React.render(
  React.createElement(App, null),
  document.getElementById('content')
);



},{"./components/app.js":"/Users/rayningw/local/src/personal/charcoal/scripts/components/app.js","./constants.js":"/Users/rayningw/local/src/personal/charcoal/scripts/constants.js"}],"/Users/rayningw/local/src/personal/charcoal/scripts/components/app.js":[function(require,module,exports){
var constants = require('../constants.js');
var ControlPanel = require('./control-panel.js');
var MapPanel = require('./map-panel.js');

var App = React.createClass({displayName: "App",

  getInitialState: function() {
    return {
      presets: constants.DEFAULT_PRESETS,
      initialLocation: constants.DEFAULT_PRESETS.rockridge,
      placeType: constants.PLACE_TYPES.restaurant
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
      React.createElement("div", {id: "app"}, 
        React.createElement(ControlPanel, {presets: this.state.presets, 
                      placeTypes: constants.PLACE_TYPES, 
                      selectedPlaceType: this.state.placeType, 
                      onSearch: this.handleSearch, 
                      onSelectPreset: this.handleSelectPreset, 
                      onSelectPlaceType: this.handleSelectPlaceType}), 
        React.createElement(MapPanel, {addressSearchNotifier: this.addressSearchNotifier, 
                  locationJumpNotifier: this.locationJumpNotifier, 
                  initialLocation: this.state.initialLocation, 
                  placeType: this.state.placeType})
      )
    );
  }

});

module.exports = App;


},{"../constants.js":"/Users/rayningw/local/src/personal/charcoal/scripts/constants.js","./control-panel.js":"/Users/rayningw/local/src/personal/charcoal/scripts/components/control-panel.js","./map-panel.js":"/Users/rayningw/local/src/personal/charcoal/scripts/components/map-panel.js"}],"/Users/rayningw/local/src/personal/charcoal/scripts/components/control-panel.js":[function(require,module,exports){
var ControlPanel = React.createClass({displayName: "ControlPanel",

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
    this.props.onSelectPlaceType(this.props.placeTypes[name]);
  },

  render: function() {
    var presetsNodes = Object.keys(this.props.presets).map(function(name) {
      var preset = this.props.presets[name];
      return (
        React.createElement("option", {key: name, value: name}, preset.label)
      );
    }.bind(this));

    var selectedPlaceTypeName;

    var placeTypesNodes = Object.keys(this.props.placeTypes).map(function(name) {
      var placeType = this.props.placeTypes[name];
      if (placeType.label === this.props.selectedPlaceType.label) {
        selectedPlaceTypeName = name;
      }
      return (
        React.createElement("option", {key: name, value: name}, placeType.label)
      );
    }.bind(this));

    return (
      React.createElement("div", {id: "panel"}, 
        React.createElement("div", {id: "panel-title"}, "Charcoal Maps"), 
        React.createElement("select", {onChange: this.handleSelectChange}, 
          React.createElement("option", null, "Select preset..."), 
          presetsNodes
        ), 
        React.createElement("div", null, "or"), 
        React.createElement("form", {onSubmit: this.handleSearch}, 
          React.createElement("input", {ref: "address", id: "address", type: "textbox", placeholder: "Enter location..."}), 
          React.createElement("input", {type: "submit", value: "Search"})
        ), 
        React.createElement("select", {onChange: this.handlePlaceTypeChange, value: selectedPlaceTypeName}, 
          placeTypesNodes
        )
      )
    );
  }

});

module.exports = ControlPanel;


},{}],"/Users/rayningw/local/src/personal/charcoal/scripts/components/map-panel.js":[function(require,module,exports){
var constants = require('../constants.js');

var MapPanel = React.createClass({displayName: "MapPanel",

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
      React.createElement("div", {id: "map-canvas"})
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
      zoom: 15,
      styles: constants.MAP_STYLES
    });

    this.mapState.heatmap = new google.maps.visualization.HeatmapLayer({
      radius: constants.HEATMAP_RADIUS,
      gradient: constants.HEATMAP_GRADIENT
    });
    this.mapState.heatmap.setMap(this.mapState.map);

    this.mapState.geocoder = new google.maps.Geocoder();

    this.mapState.placesService = new google.maps.places.PlacesService(this.mapState.map);

    google.maps.event.addListener(this.mapState.map, 'bounds_changed', this.radarSearchCurrentBounds);
  },

  radarSearchCurrentBounds: function() {
    var request = {
      bounds: this.mapState.map.getBounds(),
      types: [this.props.placeType.gMapsPlaceType]
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

module.exports = MapPanel;


},{"../constants.js":"/Users/rayningw/local/src/personal/charcoal/scripts/constants.js"}],"/Users/rayningw/local/src/personal/charcoal/scripts/constants.js":[function(require,module,exports){
// https://snazzymaps.com/style/15/subtle-grayscale
var MAP_STYLES = [
    {
        "featureType": "landscape",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 65
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 51
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 30
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 40
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": -25
            },
            {
                "saturation": -100
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#ffff00"
            },
            {
                "lightness": -25
            },
            {
                "saturation": -97
            }
        ]
    }
];

// TODO(rwu): Make the gradient outer edge blend with the overall map colour.
var HEATMAP_GRADIENT = [
  'rgba(255, 255, 255, 0)',
  '#935e66',
  '#9f4a49',
  '#dc4733',
  '#fe6204',
  '#fc6e00',
  '#fd9800',
  '#ffd40e',
  '#fdfea4',
  '#fefef5',
];

var HEATMAP_RADIUS = 30;
  
var PLACE_TYPES = {
  accounting: {
    label: 'Accounting',
    gMapsPlaceType: 'accounting'
  },
  airport: {
    label: 'Airport',
    gMapsPlaceType: 'airport'
  },
  amusementPark: {
    label: 'Amusement park',
    gMapsPlaceType: 'amusement_park'
  },
  aquarium: {
    label: 'Aquarium',
    gMapsPlaceType: 'aquarium'
  },
  artGallery: {
    label: 'Art gallery',
    gMapsPlaceType: 'art_gallery'
  },
  atm: {
    label: 'Atm',
    gMapsPlaceType: 'atm'
  },
  bakery: {
    label: 'Bakery',
    gMapsPlaceType: 'bakery'
  },
  bank: {
    label: 'Bank',
    gMapsPlaceType: 'bank'
  },
  bar: {
    label: 'Bar',
    gMapsPlaceType: 'bar'
  },
  beautySalon: {
    label: 'Beauty salon',
    gMapsPlaceType: 'beauty_salon'
  },
  bicycleStore: {
    label: 'Bicycle store',
    gMapsPlaceType: 'bicycle_store'
  },
  bookStore: {
    label: 'Book store',
    gMapsPlaceType: 'book_store'
  },
  bowlingAlley: {
    label: 'Bowling alley',
    gMapsPlaceType: 'bowling_alley'
  },
  busStation: {
    label: 'Bus station',
    gMapsPlaceType: 'bus_station'
  },
  cafe: {
    label: 'Cafe',
    gMapsPlaceType: 'cafe'
  },
  campground: {
    label: 'Campground',
    gMapsPlaceType: 'campground'
  },
  carDealer: {
    label: 'Car dealer',
    gMapsPlaceType: 'car_dealer'
  },
  carRental: {
    label: 'Car rental',
    gMapsPlaceType: 'car_rental'
  },
  carRepair: {
    label: 'Car repair',
    gMapsPlaceType: 'car_repair'
  },
  carWash: {
    label: 'Car wash',
    gMapsPlaceType: 'car_wash'
  },
  casino: {
    label: 'Casino',
    gMapsPlaceType: 'casino'
  },
  cemetery: {
    label: 'Cemetery',
    gMapsPlaceType: 'cemetery'
  },
  church: {
    label: 'Church',
    gMapsPlaceType: 'church'
  },
  cityHall: {
    label: 'City hall',
    gMapsPlaceType: 'city_hall'
  },
  clothingStore: {
    label: 'Clothing store',
    gMapsPlaceType: 'clothing_store'
  },
  convenienceStore: {
    label: 'Convenience store',
    gMapsPlaceType: 'convenience_store'
  },
  courthouse: {
    label: 'Courthouse',
    gMapsPlaceType: 'courthouse'
  },
  dentist: {
    label: 'Dentist',
    gMapsPlaceType: 'dentist'
  },
  departmentStore: {
    label: 'Department store',
    gMapsPlaceType: 'department_store'
  },
  doctor: {
    label: 'Doctor',
    gMapsPlaceType: 'doctor'
  },
  electrician: {
    label: 'Electrician',
    gMapsPlaceType: 'electrician'
  },
  electronicsStore: {
    label: 'Electronics store',
    gMapsPlaceType: 'electronics_store'
  },
  embassy: {
    label: 'Embassy',
    gMapsPlaceType: 'embassy'
  },
  establishment: {
    label: 'Establishment',
    gMapsPlaceType: 'establishment'
  },
  finance: {
    label: 'Finance',
    gMapsPlaceType: 'finance'
  },
  fireStation: {
    label: 'Fire station',
    gMapsPlaceType: 'fire_station'
  },
  florist: {
    label: 'Florist',
    gMapsPlaceType: 'florist'
  },
  food: {
    label: 'Food',
    gMapsPlaceType: 'food'
  },
  funeralHome: {
    label: 'Funeral home',
    gMapsPlaceType: 'funeral_home'
  },
  furnitureStore: {
    label: 'Furniture store',
    gMapsPlaceType: 'furniture_store'
  },
  gasStation: {
    label: 'Gas station',
    gMapsPlaceType: 'gas_station'
  },
  generalContractor: {
    label: 'General contractor',
    gMapsPlaceType: 'general_contractor'
  },
  groceryOrSupermarket: {
    label: 'Grocery or supermarket',
    gMapsPlaceType: 'grocery_or_supermarket'
  },
  gym: {
    label: 'Gym',
    gMapsPlaceType: 'gym'
  },
  hairCare: {
    label: 'Hair care',
    gMapsPlaceType: 'hair_care'
  },
  hardwareStore: {
    label: 'Hardware store',
    gMapsPlaceType: 'hardware_store'
  },
  health: {
    label: 'Health',
    gMapsPlaceType: 'health'
  },
  hinduTemple: {
    label: 'Hindu temple',
    gMapsPlaceType: 'hindu_temple'
  },
  homeGoodsStore: {
    label: 'Home goods store',
    gMapsPlaceType: 'home_goods_store'
  },
  hospital: {
    label: 'Hospital',
    gMapsPlaceType: 'hospital'
  },
  insuranceAgency: {
    label: 'Insurance agency',
    gMapsPlaceType: 'insurance_agency'
  },
  jewelryStore: {
    label: 'Jewelry store',
    gMapsPlaceType: 'jewelry_store'
  },
  laundry: {
    label: 'Laundry',
    gMapsPlaceType: 'laundry'
  },
  lawyer: {
    label: 'Lawyer',
    gMapsPlaceType: 'lawyer'
  },
  library: {
    label: 'Library',
    gMapsPlaceType: 'library'
  },
  liquorStore: {
    label: 'Liquor store',
    gMapsPlaceType: 'liquor_store'
  },
  localGovernmentOffice: {
    label: 'Local government office',
    gMapsPlaceType: 'local_government_office'
  },
  locksmith: {
    label: 'Locksmith',
    gMapsPlaceType: 'locksmith'
  },
  lodging: {
    label: 'Lodging',
    gMapsPlaceType: 'lodging'
  },
  mealDelivery: {
    label: 'Meal delivery',
    gMapsPlaceType: 'meal_delivery'
  },
  mealTakeaway: {
    label: 'Meal takeaway',
    gMapsPlaceType: 'meal_takeaway'
  },
  mosque: {
    label: 'Mosque',
    gMapsPlaceType: 'mosque'
  },
  movieRental: {
    label: 'Movie rental',
    gMapsPlaceType: 'movie_rental'
  },
  movieTheater: {
    label: 'Movie theater',
    gMapsPlaceType: 'movie_theater'
  },
  movingCompany: {
    label: 'Moving company',
    gMapsPlaceType: 'moving_company'
  },
  museum: {
    label: 'Museum',
    gMapsPlaceType: 'museum'
  },
  nightClub: {
    label: 'Night club',
    gMapsPlaceType: 'night_club'
  },
  painter: {
    label: 'Painter',
    gMapsPlaceType: 'painter'
  },
  park: {
    label: 'Park',
    gMapsPlaceType: 'park'
  },
  parking: {
    label: 'Parking',
    gMapsPlaceType: 'parking'
  },
  petStore: {
    label: 'Pet store',
    gMapsPlaceType: 'pet_store'
  },
  pharmacy: {
    label: 'Pharmacy',
    gMapsPlaceType: 'pharmacy'
  },
  physiotherapist: {
    label: 'Physiotherapist',
    gMapsPlaceType: 'physiotherapist'
  },
  placeOfWorship: {
    label: 'Place of worship',
    gMapsPlaceType: 'place_of_worship'
  },
  plumber: {
    label: 'Plumber',
    gMapsPlaceType: 'plumber'
  },
  police: {
    label: 'Police',
    gMapsPlaceType: 'police'
  },
  postOffice: {
    label: 'Post office',
    gMapsPlaceType: 'post_office'
  },
  realEstateAgency: {
    label: 'Real estate agency',
    gMapsPlaceType: 'real_estate_agency'
  },
  restaurant: {
    label: 'Restaurant',
    gMapsPlaceType: 'restaurant'
  },
  roofingContractor: {
    label: 'Roofing contractor',
    gMapsPlaceType: 'roofing_contractor'
  },
  rvPark: {
    label: 'Rv park',
    gMapsPlaceType: 'rv_park'
  },
  school: {
    label: 'School',
    gMapsPlaceType: 'school'
  },
  shoeStore: {
    label: 'Shoe store',
    gMapsPlaceType: 'shoe_store'
  },
  shoppingMall: {
    label: 'Shopping mall',
    gMapsPlaceType: 'shopping_mall'
  },
  spa: {
    label: 'Spa',
    gMapsPlaceType: 'spa'
  },
  stadium: {
    label: 'Stadium',
    gMapsPlaceType: 'stadium'
  },
  storage: {
    label: 'Storage',
    gMapsPlaceType: 'storage'
  },
  store: {
    label: 'Store',
    gMapsPlaceType: 'store'
  },
  subwayStation: {
    label: 'Subway station',
    gMapsPlaceType: 'subway_station'
  },
  synagogue: {
    label: 'Synagogue',
    gMapsPlaceType: 'synagogue'
  },
  taxiStand: {
    label: 'Taxi stand',
    gMapsPlaceType: 'taxi_stand'
  },
  trainStation: {
    label: 'Train station',
    gMapsPlaceType: 'train_station'
  },
  travelAgency: {
    label: 'Travel agency',
    gMapsPlaceType: 'travel_agency'
  },
  university: {
    label: 'University',
    gMapsPlaceType: 'university'
  },
  veterinaryCare: {
    label: 'Veterinary care',
    gMapsPlaceType: 'veterinary_care'
  },
  zoo: {
    label: 'Zoo',
    gMapsPlaceType: 'zoo'
  }
};

var DEFAULT_PRESETS = {
  rockridge: {
    label: 'Rockridge',
    latitude: 37.8446,
    longitude: -122.2512
  },
  pyrmont: {
    label: 'Pyrmont',
    latitude: -33.8665433,
    longitude: 151.1956316
  },
  sanFrancisco: {
    label: 'San Francisco',
    latitude: 37.774546,
    longitude: -122.433523
  },
  stockholm: {
    label: 'Stockholm',
    latitude: 59.335423,
    longitude: 18.069600
  },
  manhattan: {
    label: 'Manhattan',
    latitude: 40.790651,
    longitude: -73.954983
  },
  wentworthville: {
    label: 'Wentworthville',
    latitude: -33.807066,
    longitude: 150.972452
  },
  charlesVillage: {
    label: 'Charles Village',
    latitude: 39.320059,
    longitude: -76.616324
  }
};

exports.MAP_STYLES = MAP_STYLES;
exports.HEATMAP_GRADIENT = HEATMAP_GRADIENT;
exports.HEATMAP_RADIUS = HEATMAP_RADIUS;
exports.PLACE_TYPES = PLACE_TYPES;
exports.DEFAULT_PRESETS = DEFAULT_PRESETS;


},{}]},{},["./scripts/main.js"]);
