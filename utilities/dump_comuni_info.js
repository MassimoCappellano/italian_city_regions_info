'use strict';

/**
 * @file Dump db content into json file.

 * @author Massimo Cappellano 
 */

const jsonfile = require('jsonfile');
const path = require('path');
const Promise = require('bluebird');
const fs = require('fs-extra');
const moment = require('moment');
const winston = require('winston');

const PATH_FILE_INPUT_COMUNI_ITALIANI = './data/comuni_italiani.json';
const PATH_FILE_OUTPUTT_COMUNI_ITALIANI_WITH_COORDS = './output/comuni_italiani_with_coords.json';

const LOG_FILE =  './logs/dumpu_comuni_info.log';

winston.configure({
    transports: [
      new (winston.transports.Console)( { level: 'info' }),
      new (require('winston-daily-rotate-file'))({ filename: LOG_FILE, level: 'debug' })
    ]
  });

const db = require('../lib/db_creator').getDb();

function checkExistenceOrCreateDir(dirname) {

	return new Promise( function( resolve, reject) {
		fs.ensureDir(dirname, function (err) {
  			if(err) {
  				return reject (err);
  			}

  			return resolve();
		});
	});
}

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
	Dump into a file coord info. The coord info are that loaded previously into DB.
	<br>
	<br>
	@param {string} fileInputPath - the json file with informations in input
	@param {string} fileOutputPath - the json file with informations in output, enriched with coords
*/

function doDumpDbIntoFile(fileInputPath, fileOutputPath){

	winston.debug('INPUT FILE: %s, OUTPUT_FILE: %s', fileInputPath, fileOutputPath);
	
	const dirOutputPath = path.dirname(fileOutputPath);

	// check the existance or create dirOutputPath

	checkExistenceOrCreateDir(dirOutputPath).then( function() {

		const mNow = moment();

		var wstream = fs.createWriteStream(fileOutputPath);

		jsonfile.readFile(fileInputPath, function(err, obj) {

		  let arrPromises = [];
		  // console.dir(obj)
		  let wc = 1;
		   
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

		  winston.info('************** DONE LOADING FROM DB **********************');

		  // console.log('*****', arrPromises);
		  
		  var objTot = [];

		  Promise.mapSeries(arrPromises, function (item) {
			// console.log('---------------> ', item);
			objTot.push(item);
		  }).then(function(){

		  	winston.info('WRITING TO FILE: %s', fileOutputPath);
		  	wstream.write(JSON.stringify(objTot, null, ' '));
		  	wstream.close();

		  	const mThen = moment();
			var durationInMillSec = moment.duration(mThen.diff(mNow)).milliseconds();

		  	winston.info('************** DONE SAVING - FINISHED PROCESSING IN %d ms **********************', durationInMillSec);
		  });


		  		  
		});
	}, function (err) {
		winston.error(err);
	});
}

doDumpDbIntoFile(PATH_FILE_INPUT_COMUNI_ITALIANI, PATH_FILE_OUTPUTT_COMUNI_ITALIANI_WITH_COORDS);





