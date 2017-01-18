'use strict';

const Promise = require('bluebird');

const mapOperations = require('./map_operations');

const checkContiguity = require('./geo/check_contiguity');

const findComune = require('./find_comune');

const db = require('./db_creator').getDb();

var ac = {};


function doCalculateRegionProximities(){

	mapOperations.getElencoRegioni().then( function(regions) {
		// console.log(regions);

		Promise.map(regions, function(region) {
			return findComune.getRegioneByCode(region.value.value);
		}).then( function ( arrRegionsInfo) {
			
			// console.log(arrRegionsInfo);

			for(let i = 0; i < arrRegionsInfo.length; i++) {
				
				const regPrinc = arrRegionsInfo[i];

				if(!regPrinc.place_id) {
					continue;
				}


				const boundsRegPrinc = regPrinc.geometry.bounds;

				console.log('boundsRegPrinc: ', boundsRegPrinc);

				const arrContiguityRegions = [];

				for(let j = 0; j < arrRegionsInfo.length; j++ ) {

					if(i == j) {
						continue;
					}

					const regCheck = arrRegionsInfo[j];

					if(!regCheck.place_id) {
						continue;
					}

					const boundsRegCheck = regCheck.geometry.bounds;

					let isContiguity = checkContiguity.checkContiguity( boundsRegPrinc, boundsRegCheck);

					if(isContiguity){
						arrContiguityRegions.push(regCheck);
					}

				}

				console.log('PRINCIPAL:', regPrinc);
				console.log('--->', arrContiguityRegions);
				console.log('***************************************');

			}

			console.log('ALL DONE!!!');
		});
	});

}

/*
	http://www.comuniecitta.it/regioni-italiane/tavola-dei-confini.html
*/

doCalculateRegionProximities();
