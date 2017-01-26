var netatmo = require('netatmo');
var _ = require('underscore');

module.exports = function (RED) {
  function NetatmoDashboard(config) {

    RED.nodes.createNode(this, config);
    this.creds = RED.nodes.getNode(config.creds);
    var node = this;
    this.on('input', function (msg) {

      var api = new netatmo({
        'client_id': this.creds.client_id,
        'client_secret': this.creds.client_secret,
        'username': this.creds.username,
        'password': this.creds.password
      });
      
      api.on("error", function(error) {
        node.error(error);
      });
      
      api.on("warning", function(error) {
        node.warn(error);
      });

      api.getStationsData(function(err, data) {
        msg.payload = {};
        _(data).each(function(station) {
          if (station.type == 'NAMain') {
            msg.payload.temperature = station.dashboard_data.Temperature;
            msg.payload.co2 = station.dashboard_data.CO2;
            msg.payload.humidity = station.dashboard_data.Humidity;
            msg.payload.noise = station.dashboard_data.Noise;
            msg.payload.pressure = station.dashboard_data.Pressure;
            msg.payload.pressureTrend = station.dashboard_data.pressure_trend;
            _(station.modules).each(function(module) {
              if (module.type === 'NAModule1') {
                msg.payload.externalTemperature = module.dashboard_data.Temperature;
                msg.payload.externalHumidity = module.dashboard_data.Humidity;
                msg.payload.externalTemperatureTrend = module.dashboard_data.temp_trend;
              }
            });
          }
        });
        node.send(msg);
      });

    });
  }
  RED.nodes.registerType('netatmo-dashboard', NetatmoDashboard);

  function NetatmoConfigNode(n) {
    RED.nodes.createNode(this, n);
    this.client_id = n.client_id;
    this.client_secret = n.client_secret;
    this.username = n.username;
    this.password = n.password;
  }
  RED.nodes.registerType('netatmo-config-node', NetatmoConfigNode);

};
