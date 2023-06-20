const _ = require('underscore');
const fetch = require('node-fetch');
const httpTransport = require('https');

const callRefreshToken = ({ clientId, clientSecret, refreshToken }) => {
  return new Promise((resolve, reject) => {

    const responseEncoding = 'utf8';
    const httpOptions = {
      hostname: 'api.netatmo.com',
      port: '443',
      path: '/oauth2/token',
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    };
    httpOptions.headers['User-Agent'] = 'node ' + process.version;

    const request = httpTransport.request(httpOptions, (res) => {
      let responseBufs = [];
      let responseStr = '';

      res.on('data', (chunk) => {
        if (Buffer.isBuffer(chunk)) {
          responseBufs.push(chunk);
        }
        else {
          responseStr = responseStr + chunk;
        }
      }).on('end', () => {
        responseStr = responseBufs.length > 0 ? Buffer.concat(responseBufs).toString(responseEncoding) : responseStr;
        if (res.statusCode === 200) {
          let json;
          try {
            json = JSON.parse(responseStr);
            resolve(json.access_token);
          } catch (e) {
            reject(e);
          }
        } else {
          reject('Unable to refresh the access token');
        }
      });
    })
      .setTimeout(0)
      .on('error', (error) => {
        callback(error);
      });
    request.write(`grant_type=refresh_token&refresh_token=${encodeURI(refreshToken)}&client_id=${clientId}&client_secret=${clientSecret}`);
    request.end();
  });
};

module.exports = function (RED) {
  function NetatmoDashboard(config) {

    RED.nodes.createNode(this, config);
    this.creds = RED.nodes.getNode(config.creds);
    var node = this;
    this.on('input', async function (msg, send, done) {
      // send/done compatibility for node-red < 1.0
      send = send || function () { node.send.apply(node, arguments) };
      done = done || function (error) { node.error.call(node, error, msg) };

      const clientSecret = this.creds.client_secret;
      const clientId = this.creds.client_id;
      const refreshToken = this.creds.refresh_token;
	  const device = this.creds.device;

      let data;
      try {
        // for some reason the same request with node-fetch is not working
        const refreshedToken = await callRefreshToken({ clientSecret, clientId, refreshToken });;
        let url = '';
		
		if ( device === 'weather_station')
		  url = "https://api.netatmo.com/api/getstationsdata";
		else if ( device === 'home_coach')
		  url = "https://api.netatmo.com/api/gethomecoachsdata";
		
        // Get Station data (GET https://api.netatmo.com/api/getstationsdata?get_favorites=false)
        const response = await fetch( url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${refreshedToken}`
          }
        });
        data = await response.json();
      } catch (e) {
        done(e);
        return;
      }

      msg.payload = {};
      msg.payload.compact = {};
      msg.payload.detailed = {};

      /** save all detailed information **/
      msg.payload.detailed = data;
	  
      if ('body' in data && 'devices' in data.body)  { 
		  _(data.body.devices).each(function (station) {
			if (station.type === 'NAMain') {
			  msg.payload.compact.reachable = station.reachable || "false";
			  msg.payload.compact.station_name = station.station_name;
			  msg.payload.compact.last_status_store = station.last_status_store;
			  msg.payload.compact.last_status_store_readable = new Date( station.last_status_store*1000).toLocaleString();

			  if (typeof station.dashboard_data !== "undefined") {
				msg.payload.compact.temperature = station.dashboard_data.Temperature !== "undefined" ? station.dashboard_data.Temperature : "N.N.";
				msg.payload.compact.temperatureTrend = station.dashboard_data.temp_trend !== "undefined" ? station.dashboard_data.temp_trend : "N.N.";
				msg.payload.compact.co2 = station.dashboard_data.CO2 !== "undefined" ? station.dashboard_data.CO2 : "N.N.";
				msg.payload.compact.humidity = station.dashboard_data.Humidity !== "undefined" ? station.dashboard_data.Humidity : "N.N.";
				msg.payload.compact.noise = station.dashboard_data.Noise !== "undefined" ? station.dashboard_data.Noise : "N.N.";
				msg.payload.compact.pressure = station.dashboard_data.Pressure !== "undefined" ? station.dashboard_data.Pressure : "N.N.";
				msg.payload.compact.pressureTrend = station.dashboard_data.pressure_trend !== "undefined" ? station.dashboard_data.pressure_trend : "N.N.";
			  }
			  else {
				msg.payload.compact.temperature = "N.N.";
				msg.payload.compact.temperatureTrend = "N.N.";
				msg.payload.compact.co2 = "N.N.";
				msg.payload.compact.humidity = "N.N.";
				msg.payload.compact.noise = "N.N.";
				msg.payload.compact.pressure = "N.N.";
				msg.payload.compact.pressureTrend = "N.N.";
			  }
			  msg.payload.compact.modules = [];
			  _(station.modules).each(function (module) {
				if (module.type === 'NAModule1') { //Outdoor Sensor
				  msg.payload.compact.outdoor = {};
				  msg.payload.compact.outdoor.reachable = module.reachable || "false";
				  msg.payload.compact.outdoor.battery_percent = module.battery_percent !== "undefined" ? module.battery_percent : "N.N.";
				  msg.payload.compact.outdoor.rf_status = module.rf_status !== "undefined" ? module.rf_status : "N.N.";

				  if (typeof module.dashboard_data !== "undefined") {
					msg.payload.compact.outdoor.temperature = module.dashboard_data.Temperature !== "undefined" ? module.dashboard_data.Temperature : "N.N.";
					msg.payload.compact.outdoor.humidity = module.dashboard_data.Humidity !== "undefined" ? module.dashboard_data.Humidity : "N.N.";
					msg.payload.compact.outdoor.temperatureTrend = station.dashboard_data.temp_trend !== "undefined" ? station.dashboard_data.temp_trend : "N.N.";
				  }
				  else {
					msg.payload.compact.outdoor.temperature = "N.N.";
					msg.payload.compact.outdoor.humidity = "N.N.";
					msg.payload.compact.outdoor.temperatureTrend = "N.N.";
				  }
				}

				if (module.type === 'NAModule3') { //Rain Sensor
				  msg.payload.compact.rain = {};
				  msg.payload.compact.rain.reachable = module.reachable || "false";
				  msg.payload.compact.rain.battery_percent = module.battery_percent !== "undefined" ? module.battery_percent : "N.N.";
				  msg.payload.compact.rain.rf_status = module.rf_status !== "undefined" ? module.rf_status : "N.N.";

				  if (typeof module.dashboard_data !== "undefined") {


					msg.payload.compact.rain.rain = module.dashboard_data.Rain !== "undefined" ? module.dashboard_data.Rain : "N.N.";
					msg.payload.compact.rain.sum_rain_24 = module.dashboard_data.sum_rain_24 !== "undefined" ? module.dashboard_data.sum_rain_24 : "N.N.";
					msg.payload.compact.rain.sum_rain_1 = module.dashboard_data.sum_rain_1 !== "undefined" ? module.dashboard_data.sum_rain_1 : "N.N.";
				  }
				  else {
					msg.payload.compact.rain.rain = "N.N.";
					msg.payload.compact.rain.sum_rain_24 = "N.N.";
					msg.payload.compact.rain.sum_rain_1 = "N.N.";
				  }
				}

				if (module.type === 'NAModule4') {

				  var tmpObj = {};

				  tmpObj.name = module.module_name || "N.N.";
				  tmpObj.data_type = module.data_type || "N.N.";

				  tmpObj.battery_percent = module.battery_percent !== "undefined" ? module.battery_percent : "N.N.";
				  tmpObj.rf_status = module.rf_status !== "undefined" ? module.rf_status : "N.N.";
				  tmpObj.reachable = module.reachable || "false";

				  if (typeof module.dashboard_data !== "undefined") {
					tmpObj.dashboard_data = module.dashboard_data || "N.N.";
					tmpObj.temperature = module.dashboard_data.Temperature !== "undefined" ? module.dashboard_data.Temperature : "N.N.";
					tmpObj.Humidity = module.dashboard_data.Humidity !== "undefined" ? module.dashboard_data.Humidity : "N.N.";
					tmpObj.CO2 = module.dashboard_data.CO2 !== "undefined" ? module.dashboard_data.CO2 : "N.N.";
					tmpObj.min_temp = module.dashboard_data.min_temp !== "undefined" ? module.dashboard_data.min_temp : "N.N.";
					tmpObj.max_temp = module.dashboard_data.max_temp !== "undefined" ? module.dashboard_data.max_temp : "N.N.";
					tmpObj.date_min_temp = module.dashboard_data.date_min_temp !== "undefined" ? module.dashboard_data.date_min_temp : "N.N.";
					tmpObj.date_max_temp = module.dashboard_data.date_max_temp !== "undefined" ? module.dashboard_data.date_max_temp : "N.N.";
				  }
				  else {
					tmpObj.dashboard_data = "N.N.";
					tmpObj.temperature = "N.N.";
					tmpObj.Humidity = "N.N.";
					tmpObj.CO2 = "N.N.";
					tmpObj.min_temp = "N.N.";
					tmpObj.max_temp = "N.N.";
					tmpObj.date_min_temp = "N.N.";
					tmpObj.date_max_temp = "N.N.";
				  }

				  msg.payload.compact.modules.push(tmpObj);
				}
			  });
			}
			else if (station.type === 'NHC') {
			  msg.payload.compact.reachable = station.reachable || "false";
			  msg.payload.compact.station_name = station.station_name;
			  msg.payload.compact.last_status_store = station.last_status_store;
			  msg.payload.compact.last_status_store_readable = new Date( station.last_status_store*1000).toLocaleString();
			  msg.payload.compact.co2_calibrating = station.co2_calibrating;

			  if (typeof station.dashboard_data !== "undefined") {
				msg.payload.compact.temperature = station.dashboard_data.Temperature !== "undefined" ? station.dashboard_data.Temperature : "N.N.";
				msg.payload.compact.co2 = station.dashboard_data.CO2 !== "undefined" ? station.dashboard_data.CO2 : "N.N.";
				msg.payload.compact.humidity = station.dashboard_data.Humidity !== "undefined" ? station.dashboard_data.Humidity : "N.N.";
				msg.payload.compact.noise = station.dashboard_data.Noise !== "undefined" ? station.dashboard_data.Noise : "N.N.";
				msg.payload.compact.pressure = station.dashboard_data.AbsolutePressure !== "undefined" ? station.dashboard_data.AbsolutePressure : "N.N.";
				msg.payload.compact.health_idx = station.dashboard_data.health_idx !== "undefined" ? station.dashboard_data.health_idx : "N.N.";
			  }
			  else {
				msg.payload.compact.temperature = "N.N.";
				msg.payload.compact.co2 = "N.N.";
				msg.payload.compact.humidity = "N.N.";
				msg.payload.compact.noise = "N.N.";
				msg.payload.compact.pressure = "N.N.";
				msg.payload.compact.health_idx = "N.N.";
			  }
			}
			
		  });
	  }
      send(msg);
      done();
    });
  }
  RED.nodes.registerType('netatmo-dashboard', NetatmoDashboard);

  function NetatmoConfigNode(n) {
    RED.nodes.createNode(this, n);
	this.device = n.device;
    this.client_id = n.client_id;
    this.client_secret = n.client_secret;
    this.refresh_token = n.refresh_token;
  }
  RED.nodes.registerType('netatmo-config-node', NetatmoConfigNode);

};
