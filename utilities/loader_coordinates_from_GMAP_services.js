'use strict';

/**
 * @file Manages loading geo coordinates from GMap services into DB.
 
 * @author Massimo Cappellano 
 */

const path = require('path');
const Promise = require('bluebird');
const level = require('level');
const winston = require('winston');

const LOG_FILE = './logs/loader_coordinates_from_GMAP_services.log';

winston.configure({
    transports: [
      new (winston.transports.Console)( { level: 'info', prettyPrint: true, colorize: true }),
      new (require('winston-daily-rotate-file'))({ filename: LOG_FILE, level: 'debug', prettyPrint: true, colorize: true })
    ]
  });

const mo = require('../lib/map_operations');

const getGeoCoordinates = require('../lib/geo/get_geocoordinates');
const findComune = require('../lib/find_comune');

const db = require('../lib/db_creator').getDb();

function dbPutPromise(db, key, value){
	return new Promise( function(resolve, reject) {

		    db.put(key, value, function (err) {

		    	if(err){
		    		return reject( {key: key, err: err} );
		    	}

		    	resolve({ key: key});
		    });
    		
		});
}

/**
	Load into DB geo coordinates of all regions.
	<br>
 	<br>
 	If <strong>region.place_id</strong> is non enpty, geo request is not done.
*/

function doLoadCoordRegions() {

	winston.info('*** STARTED LODING COORDS FOR REGIONS ***');

	mo.getElencoRegioni().then(

	       function (regions) {
				
				// const batch = db.batch();
				
				Promise.map(regions, function( region ) {
					let nameRegion = region.key;
					let keyRegion = region.value.value;

					return findComune.getRegioneByCode(keyRegion).then( function (regionInfo) {

						if( !regionInfo.place_id) {

							winston.debug('DOING REQUEST, RN: %s, KR: %d', nameRegion, keyRegion);

							return getGeoCoordinates.getRegionCoordinates(nameRegion).catch( function ignore(err) {
									winston.error(err);
							}).then( function (coord) {
								// for undefined
								if(coord) {
									coord.nameRegion = nameRegion;
									coord.keyRegion = keyRegion;

									winston.debug('coord: %j', coord);
								}
						
								return coord;
							});
						} else {
							// yet with coord on db
							winston.debug('** RN: %s, KR: %d, place_id: %s', nameRegion, keyRegion, regionInfo.place_id);
						}
					});
					
				}).then( function (coordinates) {

					return Promise.map(coordinates, function(regionCoord){

						if(regionCoord) {

							return findComune.getRegioneByCode(regionCoord.keyRegion).then(

										function (result) {

											let keyInv = 'inv:regioni:' + regionCoord.keyRegion;
		
											let objReg = result;
											// attach coord
											objReg.place_id = regionCoord.place_id;
											objReg.geometry = regionCoord.geometry;

											db.put(keyInv, objReg);
										},
										function (error) {
											winston.error('ERROR GETTING GET_REGIONE_BY_CODE: %s', error);
										}


						);

					   }
						
					}).then(function() {
						winston.info('*** ALL DONE LOAD COORD REGIONS ***');
					});


				});

			},
			function (error) {
				winston.error(error);
			}
		);


}

/**
 Load into DB geo coordinates of provinces selected by id region.
 <br>
 <br>
  If <strong>province.place_id</strong> is non enpty, geo request is not done.

 @function
 @param {number} codeRegion Codice pk of region

*/
function doLoadCoordProvinceByCodeRegion( codeRegion ) {

	winston.info('*** START LOAD CODES PROVINCES BY CODE REGION: %d ***', codeRegion);

	mo.getProvinceByCodeRegione(codeRegion).then(
			function (provinces) {
				
				// do filtering

				provinces = provinces.filter(function (province) {
						
						if(! province.place_id) {
							return province;
						}
						
					});

				winston.debug('provinces: %s', provinces);

				Promise.map(provinces, function( province ) {

					let codeProvince = province.code;
					let keyProvince = province.provincia_id;

					winston.debug('DOING REQUEST, codeProvince: %s, keyProvince: %d', codeProvince, keyProvince);

					return getGeoCoordinates.getProvinceCoordinates(codeProvince).catch( function ignore(err) {
						winston.error('++++ ERROR: %s', err);
					}).then( function (coord) {
						// for undefined
						if(coord) {
							coord.codeProvince = codeProvince;
							coord.keyProvince = keyProvince;
							winston.debug('COORD: %j', coord);
						}
						
						return coord;
					});
				}).then( function (coordinatesProvinces) {

					// console.log('coordinatesProvinces:', coordinatesProvinces);

					return Promise.map(coordinatesProvinces, function(provinceCoord){

						if(provinceCoord) {

							return findComune.getProvinciaByCode(provinceCoord.keyProvince).then(

										function (result) {

											let keyInv = 'inv:province:' + provinceCoord.keyProvince;
		
											let objProv = result;
											// attach coord
											objProv.place_id = provinceCoord.place_id;
											objProv.geometry = provinceCoord.geometry;
											
											winston.debug('PUTTING:>>> %d -----> %j', provinceCoord.keyProvince, objProv);

											db.put(keyInv, objProv);
										},
										function (error) {
											winston.error('ERROR GETTING GET_PROVINCE_BY_CODE: %s', error);
										}


						);

					   }
						
					}).then(function() {
						winston.info('*** ALL DONE LOAD COORD PROVINCES ***');
					});

				});

			},
			function (err) {
				winston.error(err);
			}

		);


}

/**
	Load into DB geo coordinates of municipalities selected by id region.
	<br>
 	<br>
 	If <strong>municipality.place_id</strong> is non enpty, geo request is not done.

	@param {number} codeRegion Codice pk of region
*/

function doLoadCoordComuniByCodeRegion(codeRegion){

	winston.info('*** START LOAD CODES MUNICIPALITIES BY CODE REGION: %d ***', codeRegion);

	mo.getProvinceByCodeRegione(codeRegion).then(
			function (provinces) {
				
				Promise.map(provinces, function( province ) {

					let codeProvince = province.code;
					let keyProvince = province.provincia_id;

					winston.debug('DOING REQUEST- RN: %s, KP: %d', codeProvince, keyProvince);

					return mo.getComuniByCodeProvincia(keyProvince).then( function (listMunicipalities) {
						
						return listMunicipalities.map( municipality => {
							municipality.codeProvince = codeProvince;
							return municipality;
						});
					});
				}).then( function (listMunicipalities) {

					var flatListMunicipalities = [].concat.apply([], listMunicipalities);

					// filter thar without coord

					var totalMunicipalities = flatListMunicipalities.length;

					listMunicipalities = flatListMunicipalities.filter(function (municipality) {
						
						if(! municipality.place_id) {
							return municipality;
						}
						
					});

					winston.debug('MUNICIPALITIES to load COORD: %d of %d', listMunicipalities.length, totalMunicipalities); 

					// do block of for example 50
					var blockListMunicipalities = [];

					const lengthBlock = 10;
					var currentIndex = 0;

					listMunicipalities.forEach(function ( elem ) {

						if(blockListMunicipalities[currentIndex] != undefined && 
								blockListMunicipalities[currentIndex].length == lengthBlock) {
							currentIndex ++;
						} 

						if(blockListMunicipalities[currentIndex] == undefined){
							blockListMunicipalities[currentIndex] = [];
						}

						blockListMunicipalities[currentIndex].push(elem);

					});

					return Promise.mapSeries(blockListMunicipalities , function(listMunicipalities) {

							winston.debug(listMunicipalities);

							return Promise.map(listMunicipalities, function(municipality){
								var comune_id = municipality.comune_id;

								winston.debug('--->>>>>> CALLING: %s, %s', municipality.name, municipality.codeProvince);

								return getGeoCoordinates.getMunicipalityCoordinates(municipality.name, municipality.codeProvince).catch( function ignore(err) {
					    					winston.error('++++ ERROR %s', err);	
							    		}).then( function ( coordMunicipality ){

									 		if(coordMunicipality){
									 			// enrich
									 			let objMun = municipality;
												// attach coord
												objMun.place_id = coordMunicipality.place_id;
												objMun.geometry = coordMunicipality.geometry;

									 			let keyInv = 'inv:comuni:' + comune_id;

									 			// now redundant information
									 			delete objMun.comune_id;
									 			delete objMun.codeProvince;

												winston.debug('PUTTING:>>> %d -----> %j', comune_id, objMun);

									   			return dbPutPromise(db, keyInv, objMun);

									 		}

									});

							});

					}).then(function (loaded) {
							winston.info('NOW  LOADED ON DB!!!');
                            winston.info('N° BLOCKS: %d', loaded.length);

							loaded.forEach( function(block) {
								winston.info(block);
							});

							winston.info('**********************************');

						}, function (errors) {
							winston.error('ERRORS: %s', errors);
						});

				});

			},
			function (err) {
				winston.error(err);
			}

		);
	
}






// 1, 3, 4

// Lombardia
// getProvinceCoordByCodeRegion(3);

// Piemonte
// getProvinceCoordByCodeRegion(1);

// Veneto
// getProvinceCoordByCodeRegion(5);

// Trentino
// getProvinceCoordByCodeRegion(4);

// lombardia - 3 FATTO
// Piemonte - 1 - FATTO

// Veneto - 5 - FATTO

// Lazio -12

// Sicilia - 19 - OK

// Trentino - 4 - OK

// Emilia Romagna - 8 

// Liguria - 7 

// Friuli - 6

// Toscana - 9

// Campania - 15

 // doLoadCoordComuniByCodeRegion(13);

 // Pugliav - 16

 // Umbria - 10

 // Valle d'Aosta - 2

 // Marche - 11

 // Calabria - 18

 // Sardegna - 20

 // Abruzzo - 13

// ** MOLISE 14
// ** BASILICATA 17

// doLoadCoordProvinceByCodeRegion(12);

// doLoadCoordProvinceByCodeRegion(3);

const arrReg = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20];

// doLoadCoordRegions();

// doLoadCoordProvinceByCodeRegion(3);

doLoadCoordComuniByCodeRegion(2)

// doLoadCoordComuniByCodeRegion(2);
/*

for (let i of arrReg){
	console.log('REGION:', i);

	doLoadCoordProvinceByCodeRegion(i);

}

doLoadCoordComuniByCodeRegion(3);

*/