'use strict';

/**
 * @file Dump db content into json file.

 * @author Massimo Cappellano 
 */

const jsonfile = require('jsonfile');
const util = require('util');
const path = require('path');
const Promise = require('bluebird');
const fs = require('fs');

const fileInput = path.join(__dirname, '..','./data/comuni_italiani.json');

const db = require('../lib/db_creator').getDb();

function checkDirectorySync(directory) {  
  try {
    fs.statSync(directory);
  } catch(e) {
    fs.mkdirSync(directory);
  }
}

checkDirectorySync("../output");  

var fileOutput = path.join(__dirname, '..', './output/comuni_italiani_with_coords.json');

var wstream = fs.createWriteStream(fileOutput);

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

/**
	Dump into a file coord info.
	<br>
	<br>
	<strong>TO IMPROVE:</strong> input and output into code! 
*/

function doDumpDbIntoFile(){
	jsonfile.readFile(fileInput, function(err, obj) {

	  let arrPromises = [];
	  // console.dir(obj)
	  let wc = 1;
	   
	  console.time('100-elements');

	  for (let value of obj){
	  	// console.dir(value);
	  	
	  	if(value.model === 'comuni_italiani.regione'){
			
			let keyInv = 'inv:regioni:' + value.pk;

			let p = dbGetPromise(value, keyInv);
			arrPromises.push(p);

	  		
	  	} else if (value.model === 'comuni_italiani.provincia') {
			
			let keyInv = 'inv:province:' + value.pk;
			
			let p = dbGetPromise(value, keyInv);
			arrPromises.push(p);

	  		
	  	} else if (value.model === 'comuni_italiani.comune') {
			
			let keyInv = 'inv:comuni:' + value.pk;
			
			let p = dbGetPromise(value, keyInv);
			arrPromises.push(p);

	  		
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
}

doDumpDbIntoFile();





