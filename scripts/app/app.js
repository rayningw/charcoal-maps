var ControlPanel = require("../control-panel/control-panel.js");
var MapPanel = require("../map-panel/map-panel.js");

var Notifier = require("../model/notifier.js").Notifier;
var constants = require("../constants.js");

var Slideout = require("charm/react/slideout/slideout.js");

var React = require("react"),
  T = React.PropTypes;

var App = React.createClass({

  propTypes: {
    isTouchScreen: T.func.isRequired
  },

  getInitialState: function() {
    return {
      presets: constants.DEFAULT_PRESETS,
      initialLocation: constants.DEFAULT_PRESETS.rockridge,
      placeType: constants.PLACE_TYPES.restaurant
    };
  },

  onSearchNotifier: new Notifier(),
  onSelectPresetNotifier: new Notifier(),
  onToggleSlideoutNotifier: new Notifier(),

  handleSearch: function(address) {
    this.onSearchNotifier.notify(address);
  },

  handleSelectPreset: function(preset) {
    this.onSelectPresetNotifier.notify(preset);
  },

  handleToggleSlideout: function() {
    this.onToggleSlideoutNotifier.notify();
  },

  handleSelectPlaceType: function(placeType) {
    this.setState({placeType: placeType});
  },

  render: function() {
    var menu = (
      <ControlPanel presets={this.state.presets}
                    placeTypes={constants.PLACE_TYPES}
                    selectedPlaceType={this.state.placeType}
                    onSearch={this.handleSearch}
                    onSelectPreset={this.handleSelectPreset}
                    onSelectPlaceType={this.handleSelectPlaceType} />
    );

    var content = (
      <div>
        <button id="toggle-slide-btn" className="map-control" onClick={this.handleToggleSlideout}>☰</button>
        <MapPanel addressSearchNotifier={this.onSearchNotifier}
                  locationJumpNotifier={this.onSelectPresetNotifier}
                  initialLocation={this.state.initialLocation}
                  placeType={this.state.placeType} />
      </div>
    );

    return (
      <div id="app">
        <Slideout isTouchScreen={this.props.isTouchScreen}
            content={content}
            menu={menu}
            subscribeToToggle={this.onToggleSlideoutNotifier.subscribe.bind(this.onToggleSlideoutNotifier)} />
      </div>
    );
  }

});

module.exports = App;
