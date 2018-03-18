var netatmo = require('netatmo');
var _ = require('underscore');
var request = require('request');
var prettyjson = require('prettyjson');

module.exports = function (RED) {
  function NetatmoCamera(config) {

    RED.nodes.createNode(this, config);
    this.creds = RED.nodes.getNode(config.creds);
    var node = this;
    this.on('input', function (msg) {

      var api = new netatmo({
        'client_id': this.creds.client_id,
        'client_secret': this.creds.client_secret,
        'username': this.creds.username,
        'password': this.creds.password,
        scope: 'access_camera read_station read_thermostat write_thermostat read_camera read_homecoach read_presence',
      });

      api.on('error', function(error) {
        node.error(error);
      });

      api.on('warning', function(error) {
        node.warn(error);
      });

      api.getHomeData({size: 2}, function(err, data) {
        if (err != null) {
          node.error('Error on .getHomeData()');
          return;
        }
        var home = data != null && !_.isEmpty(data.homes) ? data.homes[0] : null;
        var camera = home != null && !_.isEmpty(home.cameras) ? home.cameras[0] : null;

        if (camera != null) {
          var url = camera.vpn_url + '/live/snapshot_720.jpg';
          request({
            url: url,
            method: 'GET',
            encoding: null
          }, function (err, response, body) {
            if (err != null) {
              node.error('Error fetching url ' + url);
            } else {
              msg.payload = body;
              node.send(msg);
            }
          });
        }
      });
    });
  }
  RED.nodes.registerType('netatmo-camera', NetatmoCamera);
};
