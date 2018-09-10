var netatmo = require('netatmo');
var _ = require('underscore');

module.exports = function (RED) {
    function NetatmoDashboard(config) {

        RED.nodes.createNode(this, config);
        this.creds = RED.nodes.getNode(config.creds);
        var node = this;
        this.on('input', function (msg) {

            var api = new netatmo({
                client_id: this.creds.client_id,
                client_secret: this.creds.client_secret,
                username: this.creds.username,
                password: this.creds.password,
                scope: 'access_camera read_station read_thermostat write_thermostat read_camera read_homecoach read_presence'
            });

            api.on("error", function(error) {
                node.error(error);
            });

            api.on("warning", function(error) {
                node.warn(error);
            });

            api.getStationsData(function(err, data) {
                msg.payload = {};
                msg.payload.compact = {};
                msg.payload.compact.outdoor = {};
                msg.payload.compact.rain = {};
                msg.payload.detailed = {};


                /** save all detailed information **/
                msg.payload.detailed = data;


                /** Saving compact information **/
                _(data).each(function(station) {
                    if (station.type === 'NAMain') {
                        msg.payload.compact.temperature = station.dashboard_data.Temperature;
                        msg.payload.compact.co2 = station.dashboard_data.CO2;
                        msg.payload.compact.humidity = station.dashboard_data.Humidity;
                        msg.payload.compact.noise = station.dashboard_data.Noise;
                        msg.payload.compact.pressure = station.dashboard_data.Pressure;
                        msg.payload.compact.pressureTrend = station.dashboard_data.pressure_trend;
                        msg.payload.compact.station_name = station.station_name;
                        msg.payload.compact.last_status_store = station.last_status_store;


                        _(station.modules).each(function(module) {
                            if (module.type === 'NAModule1') {
                                msg.payload.compact.outdoor.temperature = module.dashboard_data.Temperature;
                                msg.payload.compact.outdoor.humidity = module.dashboard_data.Humidity;
                                msg.payload.compact.outdoor.temperatureTrend = module.dashboard_data.temp_trend;
                                msg.payload.compact.outdoor.battery_percent = module.battery_percent;
                                msg.payload.compact.outdoor.rf_status = module.rf_status;
                            }

                            if(module.type === 'NAModule3') {
                                msg.payload.compact.rain.rain = module.dashboard_data.Rain;
                                msg.payload.compact.rain.sum_rain_24 = module.dashboard_data.sum_rain_24;
                                msg.payload.compact.rain.sum_rain_1 = module.dashboard_data.sum_rain_1;
                                msg.payload.compact.rain.battery_percent = module.battery_percent;
                                msg.payload.compact.rain.rf_status = module.rf_status;
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

