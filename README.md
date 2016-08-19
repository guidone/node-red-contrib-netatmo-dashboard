# node-red-contrib-netatmo-dashboard
[Node-RED](http://nodered.org/docs/getting-started/installation) node to fetch all data (temperature, pressure, humidity, co2, noise, etc) from a NetAtmo device.

Returns a payload like

```
{
  "temperature": 27.5,
  "co2": 246,
  "humidity": 60,
  "noise": 38,
  "pressure": 1009.5,
  "pressureTrend": "stable",
  "externalTemperature": 30,
  "externalHumidity": 51,
  "externalTemperatureTrend": "stable"
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
