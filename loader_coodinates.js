'use strict';

const path = require('path');
const mo = require('./map_operations');

const getGeoCoordinates = require('./geo/get_geocoordinates');

const findComune = require('./find_comune');

var level = require('level');

const db = require('./db_creator').getDb();


mo.getElencoRegioni().then(

	       function (results) {
				
				// const batch = db.batch();
				const numRegions = results.length;
				let totalUpdatedCoord = 0;

				for (let result of results) {

					let nameRegion = result.key;
					let keyRegion = result.value.value;
					
					getGeoCoordinates.getRegionCoordinates(nameRegion).then(

							function (result) {

								const coord = result;

								findComune.getRegioneByCode(keyRegion).then(

										function (result) {

											let keyInv = 'inv:regioni:' + keyRegion;
		
											let objReg = result;
											// attach coord
											objReg.place_id = coord.place_id;
											objReg.geometry = coord.geometry;

											db.put(keyInv, objReg, function (err) {

												if (err){
													console.log('ERROR SAVING COORD:', objReg, 'ON KEY:', keyInv, 'REGION NAME: ', nameRegion);
													totalUpdatedCoord ++; 
												} else {
													totalUpdatedCoord ++;
													console.log('DONE SAING COORD:', objReg, 'ON KEY:', keyInv, 'REGION NAME: ', nameRegion);

													if ( totalUpdatedCoord == numRegions){
														console.log('DOING WRIE OPERATIONS');
														// batch.write();
													}
												}
											});
										},
										function (error) {
											console.log('ERROR GETTING GET_REGIONE_BY_CODE:', error);
										}


									);

							},
							function (error) {

								console.log('ERROR GETTING REGION COORDINATES, REGION:', nameRegion, 'ERROR: ',  error);
							}
						);
	
				}
				
			},
			function (error) {
				console.log(error);
			}
		);