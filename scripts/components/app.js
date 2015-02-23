var constants = require('../constants.js');
var ControlPanel = require('./control-panel.js');
var MapPanel = require('./map-panel.js');

var App = React.createClass({

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
      <div id="app">
        <ControlPanel presets={this.state.presets}
                      placeTypes={constants.PLACE_TYPES}
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

module.exports = App;
