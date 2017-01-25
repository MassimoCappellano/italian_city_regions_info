'use strict';

/**
 * @file Manages loading from json file municipality info into DB.

 * @author Massimo Cappellano 
 */

const jsonfile = require('jsonfile');
const util = require('util');

const path = require('path');
const moment = require('moment');

const winston = require('winston');

const PATH_FILE_INFO_ITALIAN_MUNICIPALITIES = './data/comuni_italiani.json';

const LOG_FILE = './logs/loader_comuni_from_file.log';

winston.configure({
    transports: [
      new (winston.transports.Console)( { level: 'info' }),
      new (require('winston-daily-rotate-file'))({ filename: LOG_FILE, level: 'debug' })
    ]
  });

const db = require('../lib/db_creator').getDb();

/**
	Load list of municipalities with associated province and region.
	@param {string} jsonFile - the json file with informations
*/

function doLoadDBMunicipalities(jsonFile) {

	const mNow = moment();

	winston.info('*** STARTING LOADING %s FILE MUNICIPALITIES into DB ***', jsonFile);

	jsonfile.readFile(jsonFile, function(err, obj) {
	  // console.dir(obj)
	  let wc = 1;
	  var batch = db.batch();
	  
	  for (let value of obj){
	  	// console.dir(value);
	  	
	  	if(value.model === 'comuni_italiani.regione'){
			
			let key = 'regioni:' + value.fields.name;
			let valueR = value.pk;
			
			let objReg = { value: valueR };

			winston.debug('reg: %s -> %j', key, objReg);
			
			batch.put(key, objReg);

			let keyInv = 'inv:regioni:' + value.pk;
			let valueInv = value.fields.name;
			
			let objRegInv = { name: valueInv };

			winston.debug('reg inv: %s -> %j', keyInv, objRegInv);

			batch.put(keyInv, objRegInv);
			
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
			
			winston.debug('prov: %s -> %j', keyInv, obj);
			
			batch.put(keyInv,  obj);

	  	} else if (value.model === 'comuni_italiani.comune') {
			
			let key = 'comuni:' + value.fields.name;
			let valueC = value.pk;
			
			winston.debug('comuni: %s -> %s', key, valueC);
			
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
			
			winston.debug('comuni inv: %s -> %j', keyInv, obj);
			
			batch.put(keyInv,  obj);

	  	}
	  }

	  batch.write();

	  const mThen = moment();
	  var durationInMillSec = moment.duration(mThen.diff(mNow)).milliseconds();

	  winston.info('**** FINISHED LOADING INTO DB IN %d ms ****', durationInMillSec);
	  

	});
}

// do operation
doLoadDBMunicipalities(PATH_FILE_INFO_ITALIAN_MUNICIPALITIES);


