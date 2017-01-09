'use strict';

const path = require('path');
const mo = require('./map_operations');

const getGeoCoordinates = require('./geo/get_geocoordinates');

const findComune = require('./find_comune');

const Promise = require('bluebird');

const level = require('level');

const db = require('./db_creator').getDb();

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

function doLoadCoordRegions() {

	mo.getElencoRegioni().then(

	       function (results) {
				
				// const batch = db.batch();

				Promise.map(results, function( region ) {
					let nameRegion = region.key;
					let keyRegion = region.value.value;

					console.log('DOING REQUEST, RN:', nameRegion, 'KR:', keyRegion);

					return getGeoCoordinates.getRegionCoordinates(nameRegion).catch( function ignore(err) {
						console.log(err);
					}).then( function (coord) {
						// for undefined
						if(coord) {
							coord.nameRegion = nameRegion;
							coord.keyRegion = keyRegion;
						}
						
						return coord;
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
											console.log('ERROR GETTING GET_REGIONE_BY_CODE:', error);
										}


						);

					   }
						
					}).then(function() {
						console.log('ALL DONE LOAD COORD REGIONS!!!');
					});


				});

			},
			function (error) {
				console.log(error);
			}
		);


}

function getProvinceCoordByCodeRegion( codeRegion ) {

	mo.getProvinceByCodeRegione(codeRegion).then(
			function (provinces) {
				console.log(provinces);

				Promise.map(provinces, function( province ) {

					let codeProvince = province.code;
					let keyProvince = province.provincia_id;

					console.log('DOING REQUEST, RN:', codeProvince, 'KR:', keyProvince);

					return getGeoCoordinates.getProvinceCoordinates(codeProvince).catch( function ignore(err) {
						console.log(err);
					}).then( function (coord) {
						// for undefined
						if(coord) {
							coord.codeProvince = codeProvince;
							coord.keyProvince = keyProvince;
						}
						
						return coord;
					});
				}).then( function (coordinatesProvinces) {

					console.log(coordinatesProvinces);

					return Promise.map(coordinatesProvinces, function(provinceCoord){

						if(provinceCoord) {

							return findComune.getProvinciaByCode(provinceCoord.keyProvince).then(

										function (result) {

											let keyInv = 'inv:province:' + provinceCoord.keyProvince;
		
											let objProv = result;
											// attach coord
											objProv.place_id = provinceCoord.place_id;
											objProv.geometry = provinceCoord.geometry;
											
											console.log('PUTTING:>>>', keyInv, '----->', objProv);

											db.put(keyInv, objProv);
										},
										function (error) {
											console.log('ERROR GETTING GET_PROVINCE_BY_CODE:', error);
										}


						);

					   }
						
					}).then(function() {
						console.log('ALL DONE LOAD COORD PROVINCES!!!');
					});

				});

			},
			function (err) {
				console.log(err);
			}

		);


}

function getComuniCoordByCodeRegione(codeRegion){

	mo.getProvinceByCodeRegione(codeRegion).then(
			function (provinces) {
				
				Promise.map(provinces, function( province ) {

					let codeProvince = province.code;
					let keyProvince = province.provincia_id;

					console.log('DOING REQUEST, RN:', codeProvince, 'KR:', keyProvince);

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

					console.log('MUNICIPALITIES to load COORD:', listMunicipalities.length, 'OF', totalMunicipalities); 


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

							console.log(listMunicipalities);

							return Promise.map(listMunicipalities, function(municipality){
								var comune_id = municipality.comune_id;

								console.log('--->>>>>> CALLING ', municipality.name, municipality.codeProvince);

								return getGeoCoordinates.getMunicipalityCoordinates(municipality.name, municipality.codeProvince).catch( function ignore(err) {
					    					console.log('++++ ERROR', err);	
							    		}).then( function ( coordMunicipality ){

									 		if(coordMunicipality){
									 			// enrich
									 			let objMun = municipality;
												// attach coord
												objMun.place_id = coordMunicipality.place_id;
												objMun.geometry = coordMunicipality.geometry;

									 			let keyInv = 'inv:comuni:' + objMun.comune_id;

												console.log('PUTTING:>>>', keyInv, '----->', objMun);

									   			return dbPutPromise(db, keyInv, objMun);

									 		}

									});

							});

					}).then(function (loaded) {
							console.log('NOW  LOADED ON DB!!!');
                            console.log('N° BLOCKS: ', loaded.length);

							loaded.forEach( function(block) {
								console.log(block);
							});

							console.log('**********************************');

						}, function (errors) {
							console.log('ERRORS:', errors);
						});

				});

			},
			function (err) {
				console.log(err);
			}

		);
	
}





// doLoadCoordRegions();

// 1, 3, 4

// Lombardia
// getProvinceCoordByCodeRegion(3);

// Piemonte
// getProvinceCoordByCodeRegion(1);

// Veneto
// getProvinceCoordByCodeRegion(5);

// Trentino
// getProvinceCoordByCodeRegion(4);

// ac.getProvinceByCodeRegione


// ac.getProvinceByCodeRegione

// lombardia - 3 FATTO
// Piemonte - 1 - ULTTIMARE CASI SOSPESI

// Veneto - 5 - FATTO

// Lazio -12

// Sicilia - 19 - ULTIMARE

 getComuniCoordByCodeRegione(19);
