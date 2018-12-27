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
                msg.payload.compact.modules = [];
                msg.payload.detailed = {};


                /** save all detailed information **/
                msg.payload.detailed = data;


                _(data).each(function(station) {
                    if (station.type === 'NAMain') {

                        console.log("\n\n\nNAMain: ", station);
                        console.log("\n\n\ndashboard_data: ", station.dashboard_data);


                        msg.payload.compact.reachable = station.reachable || "false";
                        msg.payload.compact.station_name = station.station_name;
                        msg.payload.compact.last_status_store = station.last_status_store;

                        if(typeof station.dashboard_data !== "undefined") {
                            msg.payload.compact.temperature = station.dashboard_data.Temperature || "N.N.";
                            msg.payload.compact.temperatureTrend = station.dashboard_data.temp_trend || "N.N.";
                            msg.payload.compact.co2 = station.dashboard_data.CO2 || "N.N.";
                            msg.payload.compact.humidity = station.dashboard_data.Humidity || "N.N.";
                            msg.payload.compact.noise = station.dashboard_data.Noise || "N.N.";
                            msg.payload.compact.pressure = station.dashboard_data.Pressure || "N.N.";
                            msg.payload.compact.pressureTrend = station.dashboard_data.pressure_trend || "N.N.";
                        }
                        else {
                            msg.payload.compact.temperature = "N.N.";
                            msg.payload.compact.temperatureTrend =  "N.N.";
                            msg.payload.compact.co2 =  "N.N.";
                            msg.payload.compact.humidity = "N.N.";
                            msg.payload.compact.noise =  "N.N.";
                            msg.payload.compact.pressure =  "N.N.";
                            msg.payload.compact.pressureTrend =  "N.N.";
                        }


                        _(station.modules).each(function(module) {
                            if (module.type === 'NAModule1') { //Outdoor Sensor

                                msg.payload.compact.outdoor.reachable = module.reachable || "false";
                                msg.payload.compact.outdoor.battery_percent = module.battery_percent || "N.N.";
                                msg.payload.compact.outdoor.rf_status = module.rf_status || "N.N.";

                                if(typeof module.dashboard_data !== "undefined") {
                                    msg.payload.compact.outdoor.temperature = module.dashboard_data.Temperature || "N.N.";
                                    msg.payload.compact.outdoor.humidity = module.dashboard_data.Humidity || "N.N.";
                                    msg.payload.compact.outdoor.temperatureTrend = station.dashboard_data.temp_trend || "N.N.";
                                }
                                else {
                                    msg.payload.compact.outdoor.temperature =  "N.N.";
                                    msg.payload.compact.outdoor.humidity =  "N.N.";
                                    msg.payload.compact.outdoor.temperatureTrend =  "N.N.";
                                }
                            }

                            if(module.type === 'NAModule3') { //Rain Sensor

                                msg.payload.compact.rain.reachable = module.reachable || "false";
                                msg.payload.compact.rain.battery_percent = module.battery_percent || "N.N.";
                                msg.payload.compact.rain.rf_status = module.rf_status || "N.N.";

                                if(typeof module.dashboard_data !== "undefined") {
                                    msg.payload.compact.rain.rain = module.dashboard_data.Rain || "N.N.";
                                    msg.payload.compact.rain.sum_rain_24 = module.dashboard_data.sum_rain_24 || "N.N.";
                                    msg.payload.compact.rain.sum_rain_1 = module.dashboard_data.sum_rain_1 || "N.N.";
                                }
                                else {
                                    msg.payload.compact.rain.rain =  "N.N.";
                                    msg.payload.compact.rain.sum_rain_24 =  "N.N.";
                                    msg.payload.compact.rain.sum_rain_1 =  "N.N.";
                                }
                            }

                            if(module.type === 'NAModule4') {

                                var tmpObj = {};

                                tmpObj.name = module.module_name|| "N.N.";
                                tmpObj.data_type = module.data_type || "N.N.";

                                tmpObj.battery_percent = module.battery_percent || "N.N.";
                                tmpObj.rf_status = module.rf_status || "N.N.";
                                tmpObj.reachable = module.reachable || "false";

                                if(typeof module.dashboard_data !== "undefined") {
                                    tmpObj.dashboard_data = module.dashboard_data || "N.N.";
                                    tmpObj.temperature = module.dashboard_data.Temperature  || "N.N.";
                                    tmpObj.Humidity = module.dashboard_data.Humidity  || "N.N.";
                                    tmpObj.CO2 = module.dashboard_data.CO2  || "N.N.";
                                    tmpObj.min_temp = module.dashboard_data.min_temp  || "N.N.";
                                    tmpObj.max_temp = module.dashboard_data.max_temp  || "N.N.";
                                    tmpObj.date_min_temp = module.dashboard_data.date_min_temp  || "N.N.";
                                    tmpObj.date_max_temp = module.dashboard_data.date_max_temp  || "N.N.";
                                }
                                else {
                                    tmpObj.dashboard_data =  "N.N.";
                                    tmpObj.temperature =  "N.N.";
                                    tmpObj.Humidity =  "N.N.";
                                    tmpObj.CO2 =  "N.N.";
                                    tmpObj.min_temp =  "N.N.";
                                    tmpObj.max_temp =  "N.N.";
                                    tmpObj.date_min_temp =  "N.N.";
                                    tmpObj.date_max_temp =  "N.N.";
                                }






                                msg.payload.compact.modules.push(tmpObj);
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

