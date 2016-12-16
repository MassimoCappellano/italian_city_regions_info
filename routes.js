'use strict';

const Assets = require('./handlers/assets');

const fc = require('./find_comune');

function myAnalisiReply(reply) {
	return function (err, words) {

	let results = [];

	let numResults = words.length;

	if(numResults === 0){
		return reply(results);
	}

	for(let i = 0; i < words.length; i++){
		let obj = words[i];

		let key = obj.key;
		let codComune = obj.value;

		key = key.replace('comuni:', '');

		const PX = fc.getComuneInfoByCodComune(codComune);

		PX.done(
			function (content) {
				results.push({
					k: key, 
					v: codComune, 
					pro: content.provincia_code }); 
                
				if(results.length === numResults){
					// return response
					return reply(results);
				}

			}, function (error) {
				console.log('FOUND ERROR: ', error);
				--numResults;
			}
		);
		
	}

	// console.log(results);

    
	};

}

module.exports = [{
	method: 'GET',
	path: '/',
	handler: function (request, reply) {
		reply.view('homePage');
	}
}, {
	method: 'GET',
	path: '/comuniAll',
	handler: function (request, reply) {
		let q = '';

		if(request.query.q)
			q = request.query.q;

		return fc.findComuni(q, myAnalisiReply(reply));

	}
},
{
	method: 'GET',
	path: '/comuni',
	handler: function (request, reply) {

		return reply([{
			    "id": "1",
			    "value": "West Side Story"
			  },
			  {
			    "id": "2",
			    "value": "Lawrence of Arabia"
			   }]);
	}
}, {
	method: 'GET',
	path: '/{params*}',
	config: { auth: false },
	handler: Assets.servePublicDirectory
}];
