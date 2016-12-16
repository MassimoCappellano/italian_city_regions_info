'use strict';

const Promise = require("bluebird");

const level = require('level');
const path 	= require('path');

const db = level(path.join(__dirname,'/db'));

var ac = {};

function callback (err) {

	console.log('CALLBACK: ' + err);
}

ac.getComuneByCode = function (code) {
    return new Promise(function(resolve, reject) { //Or Q.defer() in Q
	      db.get('inv:comuni:' + code, function (err, value) {
		  if (err) {
		    if (err.notFound) {
		      // handle a 'NotFoundError' here
		      console.log('not found by code %d!!!', code);
		      resolve({});
		    } else {
		    	// I/O or other error, pass it up the callback chain
		    	reject(err);	
		    }
		    
		  } else {
	  		resolve(JSON.parse(value));
		  }
		
		});
  	});
}

ac.getProvinciaByCode = function (code) {
	return new Promise(function(resolve, reject) {
		db.get('inv:province:' + code, function (err, value) {
			if(err){
				reject(err);
			} else {
				resolve(JSON.parse(value));
			}
		});
	});
};

ac.getRegioneByCode = function (code) {
	return new Promise(function(resolve, reject) {
		db.get('inv:regioni:' + code, function (err, value) {
			if(err){
				reject(err);
			} else {
				resolve(value);
			}
		});
	});
};

/*
	composition of getComuneByCode + getProvinciaByCode + getRegioneByCode --> comune info + 
	provincia info + regione info
*/

ac.getComuneInfoByCodComune = function (code) {
	return new Promise(function(resolve, reject) {
		
    	const result = {};

		const P = ac.getComuneByCode(code);

		P.done(function(content) {
			result.name = content.name;
			result.provincia_id = content.provincia_id;

			const PP = ac.getProvinciaByCode(result.provincia_id);

			PP.done(
				function(content){
					result.provincia_name = content.name;
					result.provincia_code = content.code;
					result.regione_id = content.regione_id;

					const PR = ac.getRegioneByCode(content.regione_id);

					PR.done(function(content){
						result.regione_name = content;
						resolve(result);
					}, function(error) {
						reject(error);
					});

				}, function(error){
					reject(error);
				});

		}, function(error) {
	   		reject(error);
		});

	});
};

ac.findComuni = function (word, callback) {
  var words = [];
  var key = 'comuni:' + word.trim();
  db.createReadStream({ start: key, end: key + '\xff' })
    .on('data', function (data) {
      words.push(data);
    })
    .on('end', function () {
      callback(null, words);
    });
};

module.exports = ac;







