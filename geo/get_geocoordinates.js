'use strict';

const env = require('env2')('.env');

const GoogleMapsAPI = require('googlemaps'); 

const Promise = require('bluebird');

console.log(process.env.GMAP_KEY);

var publicConfig = {
  key: process.env.GMAP_KEY,
  stagger_time:       1000, // for elevationPath
  encode_polylines:   false,
  secure:             true, // use https
};


var gmAPI = new GoogleMapsAPI(publicConfig);

exports.getRegionCoordinates = function (regionName) {

	return new Promise( function( resolve, reject) {

			// geocode API
			var geocodeParamsReg2 = {
			  "address":    regionName + ", IT",
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

			  if (err) {
			  	return reject(err);
			  }


			  console.log(result.results);
			  console.log('address_components:', result.results[0].address_components);
			  console.log('formatted_address:', result.results[0].formatted_address);
			  console.log('geometry:', result.results[0].geometry);

			  return resolve(result.results[0].geometry);

			});

	});

};



