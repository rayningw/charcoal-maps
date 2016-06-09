var React = require("react"),
  T = React.PropTypes;

function Notifier() {
  this.listeners = [];
}

Notifier.prototype.subscribe = function(listener) {
  this.listeners.push(listener);
};

Notifier.prototype.notify = function(data) {
  this.listeners.forEach(listener => listener(data));
};

var shape = T.shape({
  subscribe: T.func.isRequired
});

module.exports = {
  Notifier: Notifier,
  shape: shape
};
