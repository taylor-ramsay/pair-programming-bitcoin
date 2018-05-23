var MapboxClient = require('mapbox');

var client = new MapboxClient('pk.eyJ1IjoiaGVucmlxbGltYSIsImEiOiI2NGVhNTllNTNjOWVmZGVlMDhiOGYzMWQ4MmE4NGY2OSJ9.TfjCYyxPQ_gNcd1JEL7C2w');

client.geocodeForward('Việt Nam')
  .then(function(res) {
    // res is the http response, including: status, headers and entity properties
    var data = res.entity; // data is the geocoding result as parsed JSON
    console.log(data.features[0].geometry)
  })
  .catch(function(err) {
    // handle errors
  });