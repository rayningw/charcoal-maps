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
