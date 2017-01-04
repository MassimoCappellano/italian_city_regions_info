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

			  if(result.status != 'OK') {
			  	let errorMsg = 'STATUS: \'' + result.status + '\' FOR REGION \'' + regionName + '\'';
			  	return reject(errorMsg);
			  }

			  for(let elem of result.results) {
			  	let objRes = {};

			  	/*
					place_id: 'ChIJf4M-GsNEgUcR1JMVKCIm8qY',
    				types: [ 'administrative_area_level_1', 'political' ] 
			  	*/

			  	let types = elem.types;
			  	// || types.includes('natural_feature')
			  	if( types.includes('administrative_area_level_1') || types.includes('natural_feature')){

			  		objRes.place_id = elem.place_id;
			  		objRes.geometry = elem.geometry;

			  		return resolve(objRes);
			  	}

			  }
			  
			  // if nothing found 
			  let errorMsg = 'NOT REGION FOUND FOR \'' + regionName + '\'';
			  return reject(errorMsg);

			});

	});

};


exports.getProvinceCoordinates = function (provinceName) {

	return new Promise( function( resolve, reject) {

			// geocode API
			var geocodeParamsProv = {
			  "address":    provinceName + ", IT",
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

			  if (err) {
			  	return reject(err);
			  }


			  if(result.status != 'OK') {
			  	let errorMsg = 'STATUS: \'' + result.status + '\' FOR PROVINCE \'' + provinceName + '\'';
			  	return reject(errorMsg);
			  }

			  for(let elem of result.results) {
			  	let objRes = {};

			  	/*
					place_id: 'ChIJf4M-GsNEgUcR1JMVKCIm8qY',
    				types: [ 'administrative_area_level_1', 'political' ] 
			  	*/

			  	let types = elem.types;

			  	if( types.includes('administrative_area_level_2')){

			  		objRes.place_id = elem.place_id;
			  		objRes.geometry = elem.geometry;

			  		return resolve(objRes);
			  	}

			  }
			  
			  // if nothing found 
			  let errorMsg = 'NOT PROVINCE FOUND FOR \'' + provinceName + '\'';
			  return reject(errorMsg);

			});

	});

};

exports.getMunicipalityCoordinates = function (municipalityName, provinceName) {

	return new Promise( function( resolve, reject) {

			// geocode API
			var geocodeParamsMunicipality = {
			  "address":    'città ' + municipalityName + ' ' + provinceName + ", IT",	
			  "components": "components=country:IT",
			  "language":   "it",
			  "region":     "it"
			};

			gmAPI.geocode(geocodeParamsMunicipality, function(err, result){

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


			  if(result.status != 'OK') {
			  	let errorMsg = 'STATUS: \'' + result.status + '\' FOR MUNICIPALITY \'' + municipalityName + '\' FOR PROVINCE \'' + provinceName + '\'';
			  	return reject(errorMsg);
			  }


        	  for(let elem of result.results) {

			  	let objRes = {};

			  	/*
					place_id: 'ChIJf4M-GsNEgUcR1JMVKCIm8qY',
    				types: [ 'administrative_area_level_1', 'political' ] 
			  	*/

			  	let types = elem.types;

			  	if( types.includes('locality')){

			  		objRes.place_id = elem.place_id;
			  		objRes.geometry = elem.geometry;

			  		return resolve(objRes);
			  	}

			  }
			  
			  // if nothing found 
			  let errorMsg = 'NOT MUNICIPALITY FOUND FOR \'' + municipalityName + '\' IN PROVINCE ' + provinceName + '\'';
			  return reject(errorMsg);

			});

	});

};



