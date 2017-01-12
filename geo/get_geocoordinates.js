'use strict';

/**
 * Module for doing geo search from Google Map services.

 * @module geo/get_geocoordinates
 */

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

/**
 * Get coordinate for the region.
 *
 * @function
 * @param {string} regionName - name of the region 
 */

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
			  let errorMsg = 'NOT COORD FOUND FOR REGION \'' + regionName + '\'';
			  return reject(errorMsg);

			});

	});

};

/**
 * Get coordinate for the province.
 * @function 
 * @param {string} codeProvince - code of the province
 */

exports.getProvinceCoordinates = function (codeProvince) {

	return new Promise( function( resolve, reject) {

			// geocode API
			var geocodeParamsProv = {
			  "address":    codeProvince + ", IT",
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
			  	let errorMsg = 'STATUS: \'' + result.status + '\' FOR PROVINCE \'' + codeProvince + '\'';
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
			  let errorMsg = 'NOT COORD FOUND FOR PROVINCE \'' + codeProvince + '\'';
			  return reject(errorMsg);

			});

	});

};

/**
 * Get coordinates for municipality
 * @function
 * @param {string} municipalityName - name of the municipality
 * @param {string} codeProvince - code of province
 */

exports.getMunicipalityCoordinates = function (municipalityName, codeProvince) {

	return new Promise( function( resolve, reject) {

			// geocode API
			var geocodeParamsMunicipality = {
			  "address":    'città ' + municipalityName + ' ' + codeProvince + ", IT",	
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

			  // console.log(result);

			  if(result.status != 'OK') {
			  	let errorMsg = 'STATUS: \'' + result.status + '\' FOR MUNICIPALITY \'' + municipalityName + '\' FOR PROVINCE \'' + codeProvince + '\'';
			  	return reject(errorMsg);
			  }


        	  for(let elem of result.results) {

        	  	// console.log(elem);

			  	let objRes = {};

			  	/*
					place_id: 'ChIJf4M-GsNEgUcR1JMVKCIm8qY',
    				types: [ 'administrative_area_level_1', 'political' ] 
			  	*/

			  	let types = elem.types;

			  	if( types.includes('locality') || types.includes('administrative_area_level_3') || types.includes('city_hall')){

			  		objRes.place_id = elem.place_id;
			  		objRes.geometry = elem.geometry;

			  		return resolve(objRes);
			  	}

			  }
			  
			  // if nothing found 
			  let errorMsg = 'NOT COORD FOUND FOR MUNICIPALITY \'' + municipalityName + '\' IN PROVINCE ' + codeProvince + '\'';
			  return reject(errorMsg);

			});

	});

};



