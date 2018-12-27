# node-red-contrib-netatmo-dashboard
[Node-RED](http://nodered.org/docs/getting-started/installation) node to fetch all data (temperature, pressure, humidity, co2, noise, etc) from a NetAtmo device.

Returns a payload which is split up into to parts: 

* a compact object which contains the most relevant information
* a detailed object which contains the complete return from the netatmo api

__Attention: The reachable status of the complete station seems not to changefor at least a 
couple of hours. While the reachable status of devices change after approximately 1h, 
the station itselve will shown as reachable even if this is not the case__

An Example:

```
{
    "compact":
        {
            "outdoor":
                {
                    "reachable": true,
                    "temperature":15.1,
                    "humidity":86,
                    "temperatureTrend":"down",
                    "battery_percent":15,
                    "rf_status":47
                },
             "rain":
                {
                    "reachable": true,
                    "rain":0,
                    "sum_rain_24":0.4,
                    "sum_rain_1":0.101,
                    "battery_percent":45,
                    "rf_status":40
                },
                modules: 
                   [ { 
                        name: 'wohnzimmer',
                        data_type: [ 'Temperature', 'CO2', 'Humidity' ],
                        "battery_percent": 14,
                        "rf_status": 80,
                        "reachable": true,
                        "dashboard_data": 
                        { 
                            "time_utc": 1545901333,
                            "Temperature": 23.1,
                            "CO2": 1555,
                            "Humidity": 50,
                            "min_temp": 22.7,
                            "max_temp": 23.6,
                            "date_min_temp": 1545866372,
                            "date_max_temp": 1545896155,
                            "temp_trend": 'stable' 
                        },
                        "temperature": 23.1,
                        "Humidity": 50,
                        "CO2": 1555,
                        "min_temp": 22.7,
                        "max_temp": 23.6,
                        "date_min_temp": 1545866372,
                        "date_max_temp": 1545896155 },
                    { 
                        "name": 'Kinderzimmer',
                        "data_type": [ 'Temperature', 'CO2', 'Humidity' ],
                        "battery_percent": 45,
                        "rf_status": 70,
                        "reachable": true,
                        "dashboard_data": 
                        {   
                            "time_utc": 1545901314,
                            "Temperature": 23.2,
                            "CO2": 1258,
                            "Humidity": 48,
                            "min_temp": 23,
                            "max_temp": 23.6,
                            "date_min_temp": 1545888753,
                            "date_max_temp": 1545865225,
                            "temp_trend": 'stable' 
                        },
                        "temperature": 23.2,
                        "Humidity": 48,
                        "CO2": 1258,
                        "min_temp": 23,
                        "max_temp": 23.6,
                        "date_min_temp": 1545888753,
                        "date_max_temp": 1545865225 
                    },
                     {  
                        "name": 'Schlafzimmer',
                        "data_type": [ 'Temperature', 'CO2', 'Humidity'],
                        battery_percent: 80,
                        "rf_status": 68,
                        "reachable": true,
                        "dashboard_data": 
                        { 
                            "time_utc": 1545901314,
                            "Temperature": 22.7,
                            "CO2": 1497,
                            "Humidity": 56,
                            "min_temp": 22.5,
                            "max_temp": 22.8,
                            "date_min_temp": 1545865225,
                            "date_max_temp": 1545885422,
                            "temp_trend": 'stable' 
                        },
                        "temperature": 22.7,
                        "Humidity": 56,
                        "CO2: 1497",
                        "min_temp": 22.5,
                        "max_temp": 22.8,
                        "date_min_temp": 1545865225,
                        "date_max_temp": 1545885422 
                    },
            "temperature":28.9,
            "co2":704,
            "humidity":43,
            "noise":43,
            "pressure":1021.3,
            "pressureTrend":"down",
            "station_name":"Netatmo#Main",
            "last_status_store":1536857210,
            "reachable": true,
        },
    "detailed":
        [
            {
                "_id":"70:ee:50:02:be:56",
                "cipher_id":"{your_cypher}",
                "date_setup":1397226153,
                "last_setup":1397226153,
                "type":"NAMain",
                "last_status_store":1536857210,
                "module_name":"Office",
                "firmware":132,
                "last_upgrade":1440050083,
                "wifi_status":26,
                "co2_calibrating":false,
                "station_name":"Netatmo#Main",
                "data_type":["Temperature","CO2","Humidity","Noise","Pressure"],
                "place":{"altitude":36,"city":"Berlin","country":"DE","timezone":"Europe/Berlin","location":[{lat},{long}]},
                "dashboard_data":
                    {
                        "time_utc":1536857196,
                        "Temperature":28.9,
                        "CO2":704,
                        "Humidity":43,
                        "Noise":43,
                        "Pressure":1021.3,
                        "AbsolutePressure":1017,
                        "min_temp":27.2,
                        "max_temp":31.9,
                        "date_min_temp":1536821144,
                        "date_max_temp":1536813686,
                        "temp_trend":"up",
                        "pressure_trend":"down"
                    },
                    "modules":
                        [
                            {
                                "_id":"03:00:00:00:db:38",
                                "type":"NAModule4",
                                "module_name":"wohnzimmer",
                                "data_type":["Temperature","CO2","Humidity"],
                                "last_setup":1397227514,
                                "dashboard_data":
                                    {
                                        "time_utc":1536856881,
                                        "Temperature":26,
                                        "CO2":680,
                                        "Humidity":44,
                                        "min_temp":25.4,
                                        "max_temp":26.8,
                                        "date_min_temp":1536828835,
                                        "date_max_temp":1536791560,
                                        "temp_trend":"stable"
                                    },
                                    "firmware":44,
                                    "last_message":1536857208,
                                    "last_seen":1536856881,
                                    "rf_status":89,
                                    "battery_vp":5196,
                                    "battery_percent":55
                                },
                            {
                                "_id":"02:00:00:02:cb:2e",
                                "type":"NAModule1",
                                "module_name":"Outdoor",
                                "data_type":["Temperature","Humidity"],
                                "last_setup":1397226241,
                                "dashboard_data":
                                    {
                                        "time_utc":1536857170,
                                        "Temperature":15.1,
                                        "Humidity":86,
                                        "min_temp":13.4,
                                        "max_temp":17.6,
                                        "date_min_temp":1536818729,
                                        "date_max_temp":1536846917,
                                        "temp_trend":"down"
                                    },
                                    "firmware":44,
                                    "last_message":1536857208,
                                    "last_seen":1536857170,
                                    "rf_status":47,
                                    "battery_vp":3968,
                                    "battery_percent":15
                                },
                            {
                                "_id":"03:00:00:01:0a:a4",
                                "type":"NAModule4",
                                "module_name":"Kinderzimmer",
                                "data_type":["Temperature","CO2","Humidity"],
                                "last_setup":1399312524,
                                "dashboard_data":
                                    {
                                        "time_utc":1536857157,
                                        "Temperature":26.4,
                                        "CO2":721,
                                        "Humidity":42,
                                        "min_temp":25.4,
                                        "max_temp":27.6,
                                        "date_min_temp":1536829474,
                                        "date_max_temp":1536789645,
                                        "temp_trend":"stable"
                                    },
                                    "firmware":44,
                                    "last_message":1536857208,
                                    "last_seen":1536857208,
                                    "rf_status":60,
                                    "battery_vp":5313,
                                    "battery_percent":62
                            }
                        ]
            }
        ]
    }
```

See [Netatmo Connect](https://dev.netatmo.com/) to get an API key.

## The MIT License
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
