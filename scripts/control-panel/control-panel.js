var React = require("react"),
  T = React.PropTypes;

var ControlPanel = React.createClass({

  propTypes: {
    onSearch: T.func.isRequired,
    onSelectPreset: T.func.isRequired,
    onSelectPlaceType: T.func.isRequired,
    presets: T.object.isRequired,
    placeTypes: T.object.isRequired,
    selectedPlaceType: T.object.isRequired
  },

  handleSearch: function(event) {
    event.preventDefault();
    var address = this.refs.address.value.trim();
    this.props.onSearch(address);
  },

  handleSelectChange: function(event) {
    var name = event.target.value;
    this.props.onSelectPreset(this.props.presets[name]);
    this.refs.address.value = "";
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
        <option key={name} value={name}>{preset.label}</option>
      );
    }.bind(this));

    var selectedPlaceTypeName;

    var placeTypesNodes = Object.keys(this.props.placeTypes).map(function(name) {
      var placeType = this.props.placeTypes[name];
      if (placeType.label === this.props.selectedPlaceType.label) {
        selectedPlaceTypeName = name;
      }
      return (
        <option key={name} value={name}>{placeType.label}</option>
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
        <select onChange={this.handlePlaceTypeChange} value={selectedPlaceTypeName}>
          {placeTypesNodes}
        </select>
      </div>
    );
  }

});

module.exports = ControlPanel;
