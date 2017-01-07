'use strict';

const path = require('path');
const mo = require('./map_operations');

const getGeoCoordinates = require('./geo/get_geocoordinates');

const findComune = require('./find_comune');

const Promise = require('bluebird');

const level = require('level');

const db = require('./db_creator').getDb();

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

					return Promise.map(listMunicipalities, function(municipality) {

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

							 			return objMun;
							 		}

							});
							

					}).then(function(arrMunicipalitiesWithCoord) {
						console.log('ALL DONE LOAD COORD MUNICIPALITIES!!!');

						Promise.map(arrMunicipalitiesWithCoord, function (coordMunicipality) {

							console.log('****', coordMunicipality);

							if(coordMunicipality) {
								let keyInv = 'inv:comuni:' + coordMunicipality.comune_id;

								console.log('PUTTING:>>>', keyInv, '----->', coordMunicipality);

							    db.put(keyInv, coordMunicipality);

							}

							
						}).then(function(){
							console.log('NOW  LOADED ON DB!!!');
						});

						
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

 getComuniCoordByCodeRegione(1);
