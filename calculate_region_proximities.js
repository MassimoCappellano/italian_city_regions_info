'use strict';

const Promise = require('bluebird');

const mapOperations = require('./map_operations');

const findComune = require('./find_comune');

const db = require('./db_creator').getDb();

var ac = {};


function doCalculateRegionProximities(){

	mapOperations.getElencoRegioni().then( function(regions) {
		console.log(regions);

		Promise.map(regions, function(region) {
			return findComune.getRegioneByCode(region.value.value);
		}).then( function ( arrRegionsInfo) {
			console.log(arrRegionsInfo);
			console.log('ALL DONE!!!');
		});
	});

}

doCalculateRegionProximities();
