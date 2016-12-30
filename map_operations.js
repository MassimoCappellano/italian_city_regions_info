'use strict';

const Promise = require("bluebird");

const db = require('./db_creator').getDb();

var ac = {};

ac.getElencoRegioni = function (resolve, reject) {

	return new Promise( function (resolve, reject){
	  let codesRegions = [];
	  let key = 'regioni:';

	  db.createReadStream({ start: key, end: key + '\xff' })
	    .on('data', function (data) {
	      codesRegions.push(data);
	    })
	    .on('end', function () {
	      resolve(codesRegions);
	    });
	}).then( function (results) {

		return results.map( (item) => {
			item.key = item.key.replace('regioni:', '');
			return item;
		});
	});
};

/*
	return arr objs:	{
			name: name,
			provincia_id: key provincia,
			code: code,
			regione_id: key regione
		}
*/

ac.getProvinceByCodeRegione = function (codRegione) {

	return new Promise( function (resolve, reject){
	  let arrProv = [];
	  let key = 'inv:province:';

	  db.createReadStream({ start: key, end: key + '\xff' })
	    .on('data', function (data) {
	       arrProv.push(data);
	    })
	    .on('end', function () {
	      resolve(arrProv);
	    });
	}).then( function (results) {
		return results.map( (item) => {
			let objProv = item.value;
			objProv.provincia_id = item.key.replace('inv:province:', '');
			return objProv;
		});
	}).then( function (arrObjProv) {
		return arrObjProv.filter( (objProv) => {
			if(objProv.regione_id == codRegione)
				return true;

			return false;
		});
	});
};

/*
	return arr objs: {
		name: name,
		comune_id, key comune,
		provincia_id: provincia_id,
		altitudine: altitudine,
		superficie: superficie,
		popolazione: popolazione
	}

*/

ac.getComuniByCodeProvincia = function (codProvincia) {

	return new Promise( function (resolve, reject){
	  let arrMunicipality = [];
	  let key = 'inv:comuni:';

	  db.createReadStream({ start: key, end: key + '\xff' })
	    .on('data', function (data) {
	      arrMunicipality.push(data);
	    })
	    .on('end', function () {
	      resolve(arrMunicipality);
	    });
	}).then( function (results) {
		return results.map( (item) => {
			let objMun = item.value;
			objMun.comune_id = item.key.replace('inv:comuni:', '');
			return objMun;
		});
	}).then( function (arrObjMun) {
		return arrObjMun.filter( (objMun) => {
			if(objMun.provincia_id == codProvincia)
				return true;

			return false;
		});
	});
}




module.exports = ac;