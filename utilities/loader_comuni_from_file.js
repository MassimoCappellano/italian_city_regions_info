'use strict';

/**
 * @file Manages loading from json file municipality info into DB.

 * @author Massimo Cappellano 
 */

var jsonfile = require('jsonfile');
var util = require('util');

var path = require('path');

var file = path.join(__dirname, '..', '/data/comuni_italiani.json');

const db = require('../lib/db_creator').getDb();

/**
	Load list of municipalities with associated province and region.
	@param {string} jsonFile - the json file with informations
*/

function doLoadDBMunicipalities(jsonFile) {

	jsonfile.readFile(jsonFile, function(err, obj) {
	  // console.dir(obj)
	  let wc = 1;
	  var batch = db.batch();
	  
	  console.time('100-elements');

	  for (let value of obj){
	  	// console.dir(value);
	  	
	  	if(value.model === 'comuni_italiani.regione'){
			
			let key = 'regioni:' + value.fields.name;
			let valueR = value.pk;
			
			let objReg = { value: valueR };

			console.log('reg: %s -> ', key, objReg);
			
			batch.put(key, objReg);

			let keyInv = 'inv:regioni:' + value.pk;
			let valueInv = value.fields.name;
			
			let objRegInv = { value: valueInv };

			console.log('reg inv: %s -> ', keyInv, objRegInv);

			batch.put(keyInv, objRegInv);
			
			/*
				let regione = new model.Regione({ pk: value.pk, name: value.fields.name });
				regione.save(function (err, regione) {
				  if (err) return console.error(regione);
				});
			*/
	  		
	  	} else if (value.model === 'comuni_italiani.provincia') {
			
			let key = 'province:' + value.fields.name;
			let valueP = value.pk;

			batch.put(key, { value: valueP });
			
			let keyInv = 'inv:province:' + value.pk;
			let name = value.fields.name;
			let code =  value.fields.codice_targa;
			let regione_id =  value.fields.regione;
			
			let obj = {
				name: name,
				code: code,
				regione_id: regione_id
			};
			
			console.log('prov: %s -> ', keyInv, obj);
			
			batch.put(keyInv,  obj);

			/*
	  		let provincia = new model.Provincia({ pk: value.pk, name: value.fields.name, 
	  			code: value.fields.codice_targa, regione_id: value.fields.regione });
	  		
	  		provincia.save(function (err, provincia) {
			  if (err) return console.error(provincia);
			});
			*/
	  		
	  	} else if (value.model === 'comuni_italiani.comune') {
			
			let key = 'comuni:' + value.fields.name;
			let valueC = value.pk;
			
			console.log('comuni: %s -> %s', key, valueC);
			
			batch.put(key, valueC);

			let keyInv = 'inv:comuni:' + value.pk;
			let name = value.fields.name;
			let provincia_id = value.fields.provincia;
			let altitudine = value.fields.altitudine;
			let superficie = value.fields.superficie;
			let popolazione = value.fields.popolazione;
			
			let codice_istat = value.fields.codice_istat;
			let codice_catastale = value.fields.codice_catastale;
			let is_capoluogo = value.fields.is_capoluogo;
			
			let obj = {
				name: name,
				codice_istat: codice_istat,
				codice_catastale: codice_catastale,
				is_capoluogo: is_capoluogo,
				provincia_id: provincia_id,
				altitudine: altitudine,
				superficie: superficie,
				popolazione: popolazione,
			};
			
			console.log('comuni inv: %s -> ', keyInv, obj);
			
			batch.put(keyInv,  obj);

			/*
	  		let comune = new model.Comune({ pk: value.pk, name: value.fields.name, provincia_id: value.fields.provincia, 
	  			altitudine: value.fields.altitudine, superficie: value.fields.superficie, popolazione: value.fields.popolazione });
	  		
	  		comune.save(function (err, comune) {
			  if (err) return console.error(comune);
			});
			*/
	  		
	  	}
	  }

	  console.time('beforeWrite');
	  
	  batch.write();
	  
	  console.timeEnd('beforeWrite');
	  
	  console.timeEnd('100-elements');

	});
}

// do operation
doLoadDBMunicipalities(file);


