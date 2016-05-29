var constants = require('../constants.js');

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
      zoom: constants.BASE_ZOOM,
      styles: constants.MAP_STYLES,
      // Re-position controls normally on the bottom to the top as they are cut
      // off by the map panel overflow. See note on css.
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
      },
      streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
      }
    });

    this.mapState.heatmap = new google.maps.visualization.HeatmapLayer({
      radius: constants.BASE_RADIUS,
      gradient: constants.HEATMAP_GRADIENT
    });
    this.mapState.heatmap.setMap(this.mapState.map);

    this.mapState.geocoder = new google.maps.Geocoder();

    this.mapState.placesService = new google.maps.places.PlacesService(this.mapState.map);

    google.maps.event.addListener(this.mapState.map, 'bounds_changed', this.radarSearchCurrentBounds);
    google.maps.event.addListener(this.mapState.map, 'zoom_changed', this.setRadius);
  },

  setRadius: function() {
    var rawRatio = constants.GMAPS_ZOOM_SCALES[constants.BASE_ZOOM]
                   / constants.GMAPS_ZOOM_SCALES[this.mapState.map.getZoom()];
    var ratio = (rawRatio - 1) * (1 / constants.RADIUS_STICKINESS) + 1;
    var radius = Math.round(constants.BASE_RADIUS * ratio);
    console.log('Setting radius: ' + radius + ' based on ratio: ' + ratio);
    this.mapState.heatmap.setOptions({
      radius: radius
    });
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
