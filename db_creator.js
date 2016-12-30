'use strict';

const level = require('level');
const path 	= require('path');

console.log('LOADING DB_CREATOR..............');

const db = level(path.join(__dirname, '/db'), {
				valueEncoding : 'json' 
			});


const ac = {}

ac.getDb = function() {
	return db;
};

module.exports = ac;
