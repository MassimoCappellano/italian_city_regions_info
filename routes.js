'use strict';

const Assets = require('./handlers/assets');

const fc = require('./find_comune');

module.exports = [{
	method: 'GET',
	path: '/',
	handler: function (request, reply) {
		reply.view('homePage');
	}
}, {
	method: 'GET',
	path: '/comuni',
	handler: function (request, reply) {
		let query = '';

		if(request.query.q)
			query = request.query.q;

		const P = fc.findComuni(query);

		P.done(function(content) {
			return reply(content.map((item) => {
					let obj = {};
					obj.n = item.name;
					obj.c = item.code;
					obj.pc = item.provincia_code;

					return obj;
					}));
		}, function(error) {
   			return reply(error);
		});

	}
},
{
	method: 'GET',
	path: '/{params*}',
	config: { auth: false },
	handler: Assets.servePublicDirectory
}];
