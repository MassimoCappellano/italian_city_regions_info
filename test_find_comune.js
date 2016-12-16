'use strict';

const fc = require('./find_comune');

// [{"k":"Samarate","v":"1472","pro":"PROV"},{"k":"Samassi","v":"7904","pro":"PROV"},{"k":"Samatzai","v":"7189","pro":"PROV"}]

const P = fc.getComuneByCode(1472);

P.done(function(content) {
	console.log('FOUND CONTENT COMUNE: ', content);


}, function(error) {
   console.log('FOUND ERROR: ', error);
});

// {"name":"Samarate","provincia_id":12,"altitudine":221,"superficie":16.01,"popolazione":16168}

const PP = fc.getProvinciaByCode(12);

PP.done(function (content) {
	console.log('FOUND CONTENT PROVINCIA: ', content);
}, function (error) {
	console.log('FOUND ERROR: ', error);
});

const PR = fc.getRegioneByCode(3);

PR.done(function (content) {
	console.log('FOUND CONTENT REGIONE: ', content);
}, function (error) {
	console.log('FOUND ERROR: ', error);
});

// do composition by code comune

const PX = fc.getComuneInfoByCodComune(1472);

PX.done(
	function (content) {
		console.log('FOUND CONTENT COMUNE COMP: ', content);
	}, function (error) {
		console.log('FOUND ERROR: ', error);
	}
);

const PX2 = fc.getComuneInfoByCodComune('1472');

PX2.done(
	function (content) {
		console.log('FOUND CONTENT COMUNE COMP2: ', content);
	}, function (error) {
		console.log('FOUND ERROR2: ', error);
	}
);

// ************************************************************

function myAnalisi (err, words){

	console.log('FOUND2: ' + err + ' - ');
	console.log(words);

	let results = [];

	for(let i = 0; i < words.length; i++){
		let obj = words[i];

		let key = obj.key;
		let value = obj.value;

		key = key.replace('comuni:', '');
		results.push(key);
	}

	console.log('FINAL');
	console.log(results.join(','));
}

fc.findComuni('Sam', myAnalisi);


