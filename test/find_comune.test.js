'use strict';

const fc = require('../find_comune');

const test = require('tape');

function xtest(){}

// [{"k":"Samarate","v":"1472","pro":"PROV"},{"k":"Samassi","v":"7904","pro":"PROV"},{"k":"Samatzai","v":"7189","pro":"PROV"}]

test('Municipality that start with \'Sam\'', function(t){
	
	const PA = fc.findComuni('Sam');

	PA.done(function(content) {
		console.log('FOUND COMUNI STARTS: ', content);
	}, function(error) {
   		console.log('FOUND ERROR2: ', error);
	});

	t.end();
});


xtest('Municipality that start with \'Sam\' only name and code', function(t){
	const PA = fc.findComuni('Sam');
	
	/*
		{ name: 'Samugheo',
	    code: '7381',
	    provincia_id: 95,
	    provincia_name: 'Oristano',
	    provincia_code: 'OR',
	    regione_id: 20,
	    regione_name: 'Sardegna' }
	*/

	PA.done(function(content) {

		let mContent = content.map((item) => {
			let obj = {};
			obj.n = item.name;
			obj.c = item.code;
			obj.pc = item.provincia_code;

			return obj;
		});

		console.log(mContent);

	}, function(error) {
   		console.log('FOUND ERROR2: ', error);
	});

	t.end();
});



