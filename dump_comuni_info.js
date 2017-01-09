'use strict';

var jsonfile = require('jsonfile');
var util = require('util');

var path = require('path');

var file = path.join(__dirname, '/data/comuni_italiani.json');

const Promise = require('bluebird');

const db = require('./db_creator').getDb();

const fs = require('fs');

var wstream = fs.createWriteStream('./output/comuni_italiani_with_coords.json');

function dbGetPromise(value, key) {
	 return new Promise( function( resolve, reject) {
	 	db.get(key, function (err, obj) {

			if(err){
				return reject(err);
			}

			if(obj.place_id) {
				value.place_id = obj.place_id;
				value.geometry = obj.geometry;
			}
			
			// console.log(keyInv, '-->', value);

			return resolve(value);
		});
	 }).then( function (value) {
	 		// console.log(value);
			return value;
		}, function (err) {
			return err;
		});

}




jsonfile.readFile(file, function(err, obj) {

  let arrPromises = [];
  // console.dir(obj)
  let wc = 1;
   
  console.time('100-elements');

  for (let value of obj){
  	// console.dir(value);
  	
  	if(value.model === 'comuni_italiani.regione'){
		
		let keyInv = 'inv:regioni:' + value.pk;

		/*
		db.get(keyInv, function (err, region) {

			if(err)
				throw  err;

			if(region.place_id) {
				value.place_id = region.place_id;
				value.geometry = region.geometry;
			}
			
			console.log(keyInv, '-->', value);

		});

		*/

		let p = dbGetPromise(value, keyInv);
		arrPromises.push(p);
		
		/*
			let regione = new model.Regione({ pk: value.pk, name: value.fields.name });
			regione.save(function (err, regione) {
			  if (err) return console.error(regione);
			});
		*/
  		
  	} else if (value.model === 'comuni_italiani.provincia') {
		
		let keyInv = 'inv:province:' + value.pk;
		
		/*

		db.get(keyInv, function (err, province) {
			
			if(err)
				throw  err;

			if (province.place_id) {
				value.place_id = province.place_id;
				value.geometry = province.geometry;
			}
			
			console.log(keyInv, '-->', value);


		});

		*/

		let p = dbGetPromise(value, keyInv);
		arrPromises.push(p);

		/*
  		let provincia = new model.Provincia({ pk: value.pk, name: value.fields.name, 
  			code: value.fields.codice_targa, regione_id: value.fields.regione });
  		
  		provincia.save(function (err, provincia) {
		  if (err) return console.error(provincia);
		});
		*/
  		
  	} else if (value.model === 'comuni_italiani.comune') {
		
		let keyInv = 'inv:comuni:' + value.pk;
		
		/*

		db.get(keyInv,  function (err, comune) {
			
			if(err)
				throw  err;

			if (comune.place_id) {
				value.place_id = comune.place_id;
				value.geometry = comune.geometry;
			}
			
			console.log(keyInv, '-->', value);


		});

		*/

		let p = dbGetPromise(value, keyInv);
		arrPromises.push(p);

		/*
  		let comune = new model.Comune({ pk: value.pk, name: value.fields.name, provincia_id: value.fields.provincia, 
  			altitudine: value.fields.altitudine, superficie: value.fields.superficie, popolazione: value.fields.popolazione });
  		
  		comune.save(function (err, comune) {
		  if (err) return console.error(comune);
		});
		*/
  		
  	}
  }

  console.log('************** WORKING PROMISES **********************');

  // console.log('*****', arrPromises);
  
  var objTot = [];

  Promise.mapSeries(arrPromises, function (item) {
	// console.log('---------------> ', item);
	objTot.push(item);
  }).then(function(){
  	console.log('WRITE STREAM!!!');
  	wstream.write(JSON.stringify(objTot, null, ' '));
  });


  console.time('beforeWrite');
  
});



/*

Promise.mapSeries(arrPromises, function (item) {
	console.log('---------------> ', item);
});

*/



