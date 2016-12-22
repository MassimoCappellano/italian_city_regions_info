'use strict';

const env = require('env2')('.env');

const GoogleMapsAPI = require('googlemaps'); 

const Promise = require('blubirds');

console.log(process.env.GMAP_KEY);

var publicConfig = {
  key: process.env.GMAP_KEY,
  stagger_time:       1000, // for elevationPath
  encode_polylines:   false,
  secure:             true, // use https
};


var gmAPI = new GoogleMapsAPI(publicConfig);

// geocode API
var geocodeParams = {
  "address":    "Samarate VA, IT",
  "components": "components=country:IT",
  "language":   "it",
  "region":     "it"
};

gmAPI.geocode(geocodeParams, function(err, result){
  /*
	{ results:
   [ { address_components: [Object],
       formatted_address: '21017 Samarate VA, Italia',
       geometry: [Object],
       place_id: 'ChIJkVjwFxOKhkcRbfhmH_LQCJw',
       types: [Object] } ],
  status: 'OK' }

  */

  console.log('address_components:', result.results[0].address_components);
  console.log('formatted_address:', result.results[0].formatted_address);
  console.log('geometry:', result.results[0].geometry);

});

// geocode API
var geocodeParamsProv = {
  "address":    "VA, IT",
  "components": "components=country:IT",
  "language":   "it",
  "region":     "it"
};

gmAPI.geocode(geocodeParamsProv, function(err, result){
  /*
	{ results:
   [ { address_components: [Object],
       formatted_address: '21017 Samarate VA, Italia',
       geometry: [Object],
       place_id: 'ChIJkVjwFxOKhkcRbfhmH_LQCJw',
       types: [Object] } ],
  status: 'OK' }

  */

  console.log('address_components:', result.results[0].address_components);
  console.log('formatted_address:', result.results[0].formatted_address);
  console.log('geometry:', result.results[0].geometry);

});

// geocode API
var geocodeParamsReg = {
  "address":    "Lombardia, IT",
  "components": "components=country:IT",
  "language":   "it",
  "region":     "it"
};

gmAPI.geocode(geocodeParamsReg, function(err, result){
  /*
	{ results:
   [ { address_components: [Object],
       formatted_address: '21017 Samarate VA, Italia',
       geometry: [Object],
       place_id: 'ChIJkVjwFxOKhkcRbfhmH_LQCJw',
       types: [Object] } ],
  status: 'OK' }

  */

  console.log('address_components:', result.results[0].address_components);
  console.log('formatted_address:', result.results[0].formatted_address);
  console.log('geometry:', result.results[0].geometry);

});

// geocode API
var geocodeParamsReg2 = {
  "address":    "Trentino-Alto Adige/Südtirol, IT",
  "components": "components=country:IT",
  "language":   "it",
  "region":     "it"
};

gmAPI.geocode(geocodeParamsReg2, function(err, result){
  /*
	{ results:
   [ { address_components: [Object],
       formatted_address: '21017 Samarate VA, Italia',
       geometry: [Object],
       place_id: 'ChIJkVjwFxOKhkcRbfhmH_LQCJw',
       types: [Object] } ],
  status: 'OK' }

  */

  console.log(result.results);
  console.log('address_components:', result.results[0].address_components);
  console.log('formatted_address:', result.results[0].formatted_address);
  console.log('geometry:', result.results[0].geometry);

});






