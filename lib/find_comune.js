'use strict';

const Promise = require("bluebird");

const db = require('./db_creator').getDb();

const getComuneByCode = function (code) {
    return new Promise(function(resolve, reject) { //Or Q.defer() in Q
	      db.get('inv:comuni:' + code, function (err, value) {
		  if (err) {
		    if (err.notFound) {
		      // handle a 'NotFoundError' here
		      console.log('not found by code %d!!!', code);
		      resolve({});
		    } else {
		    	// I/O or other error, pass it up the callback chain
		    	reject(err);	
		    }
		    
		  } else {
	  		resolve(value);
		  }
		
		});
  	});
}

const getProvinciaByCode = function (code) {
	return new Promise(function(resolve, reject) {
		db.get('inv:province:' + code, function (err, value) {
			if(err){
				reject(err);
			} else {
				resolve(value);
			}
		});
	});
};

const getRegioneByCode = function (code) {
	return new Promise(function(resolve, reject) {
		db.get('inv:regioni:' + code, function (err, value) {
			if(err){
				reject(err);
			} else {
				resolve(value);
			}
		});
	});
};

const getComuneInfoByCodComune = function (code) {

	return new Promise(function(resolve, reject) {
		
    	const result = {};

		const P = getComuneByCode(code).then( function (content) {

			if(content.name){
				result.name = content.name;
				result.code = code;
				result.provincia_id = content.provincia_id;
			
				return getProvinciaByCode(result.provincia_id);
			} 
				
			
			// resolve(result.provincia_id);
		}).then( function (content) {

			if(result.name){
				result.provincia_name = content.name;
				result.provincia_code = content.code;
				result.regione_id = content.regione_id;

				return getRegioneByCode(result.regione_id);
			}
			// resolve(result);
		}, function(err){
			console.log('CATCHED ERR HERE: ' + err);
		}).then( function(content) {
						if(result.name){
							result.regione_name = content.value;
							resolve(result);
						} else {
							reject('NOT FOUND CODE ' + code);
						}
						
					}, function(err) {
						console.log(err);
					});


	});
};

const findComuni = function (word, resolve, reject) {

	word = word.trim();

	if(word.length > 0){
		word = word.charAt(0).toUpperCase() + word.slice(1)
	}
    
    return new Promise( function (resolve, reject){
	  let codesMunicipality = [];
	  let key = 'comuni:' + word;

	  db.createReadStream({ start: key, end: key + '\xff' })
	    .on('data', function (data) {
	      codesMunicipality.push(data);
	    })
	    .on('end', function () {
	      resolve(codesMunicipality);
	    });
	}).then(function (codesMunicipality) {
		
		var arrP = [];
		for (let i = 0; i < codesMunicipality.length; i++){
			let keyMunicipality = codesMunicipality[i].value;
			arrP.push(getComuneInfoByCodComune(keyMunicipality));
		}

		return Promise.all(arrP);
	});

};

/**
 @typedef ComuneInfo
 @type {Object}
 @property {string} name The name of municipality.
 @property {number} code The pk of municipality.
 @property {number} provincia_id The pk province.
 @property {string} provincia_name The name of province
 @property {string} provincia_code The code of province (2 letters)
 @property {number} regione_id The pk of region
 @property {string} regione_name The name of region
 */

 /**
  @typedef Geometry
  @type {Object}

  @example  <caption>Example of Geomerty JSON object</caption>
        {
            "bounds" : {
               "northeast" : {
                  "lat" : 45.6430867,
                  "lng" : 8.8042525
               },
               "southwest" : {
                  "lat" : 45.6027756,
                  "lng" : 8.7624716
               }
            },
            "location" : {
               "lat" : 45.6260364,
               "lng" : 8.787032399999999
            },
            "location_type" : "APPROXIMATE",
            "viewport" : {
               "northeast" : {
                  "lat" : 45.6430867,
                  "lng" : 8.8042525
               },
               "southwest" : {
                  "lat" : 45.6027756,
                  "lng" : 8.7624716
               }
            }
         }
 */

 /*
 
 "geometry" : {
            "bounds" : {
               "northeast" : {
                  "lat" : 45.6430867,
                  "lng" : 8.8042525
               },
               "southwest" : {
                  "lat" : 45.6027756,
                  "lng" : 8.7624716
               }
            },
            "location" : {
               "lat" : 45.6260364,
               "lng" : 8.787032399999999
            },
            "location_type" : "APPROXIMATE",
            "viewport" : {
               "northeast" : {
                  "lat" : 45.6430867,
                  "lng" : 8.8042525
               },
               "southwest" : {
                  "lat" : 45.6027756,
                  "lng" : 8.7624716
               }
            }
         }
 */        


 /**
  @typedef Municipality
  @type {Object}
  @property {string} name Name of municipality
  @property {number} codice_istat Codice ISTAT
  @property {string} codice_catastale Codice catastale
  @property {boolean} is_capoluogo If is masterplace 
  @property {number} provincia_id Pk of province
  @property {number} altitudine Meters of altitude over sea
  @property {number} superficie Area in km2
  @property {number} popolazione Population
  @property {string} place_id Gmap result place_id
  @property {Geometry} geometry Gmap result geometry object
 */

/**
 @typedef Province
 @type {Object}
 @property {string} name Name of the province
 @property {string} code Code of province (2 letters)
 @property {number} regione_id Pk of region
 @property {string} place_id Gmap result place_id
 @property {Geometry} geometry Gmap result geometry object
*/

 /**
  @typedef Region
  @type {Object}
  @property {string} value Name of region
  @property {string} place_id Gmap result place_id
  @property {Geometry} geometry Gmap result geometry object
 */


/** 
 * Module for searching on regions, provinces and municipalities info. 
 * @module find_comune 
 *
 * 
 */

module.exports = {

	/** Return municipality object  by code municipality.
	*
	* @function
	* @param {int} code - pk in municipalities 
	* @returns {Municipality} municipality 
	*/

	getComuneByCode: getComuneByCode,

	/** Return province object  by code province.
	*
	* @function
	* @param {int} code - pk in provinces 
	* @returns {Province} province
	*/

	getProvinciaByCode: getProvinciaByCode,

	/** Return region object  by code region.
	*
	* @function
	* @param {int} code - pk in regions
	* @returns {Region} region
	*/

	getRegioneByCode: getRegioneByCode,

	/**
 	*	composition of getComuneByCode + getProvinciaByCode + getRegioneByCode --> comune info + 
 	*	provincia info + regione info
 	*
 	*   @function
 	*   @param {int} code - pk in municipalities
 	*   @returns {ComuneInfo} comuneInfo - info about municipality 
 	*/

	getComuneInfoByCodComune: getComuneInfoByCodComune,

	/** Return one or more municipality objects  by start name of municipality.
	*
	* @function
	* @param {string} name - start name of municipality
    * @returns {Array<ComuneInfo>} arrComuneInfo - list of municipalities	
	*/

	findComuni: findComuni

};







