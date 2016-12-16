'use strict';

const Joi = require('joi');

const Users = require('./handlers/users');
const Pages = require('./handlers/pages');
const Assets = require('./handlers/assets');

const schemaSignUp = {
	username: Joi.string().min(6).max(30).required(),
	password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).options({
		language: {
			string: {
				regex: {
					base: 'deve essere composta da lettere e/o numeri; di lunghezza almeno 6 e massimo 30 caratteri'
				}
			}
		}
	}),
	confirmPassword: Joi.any().valid(Joi.ref('password')).required().options({ 
		language: { any: { allowOnly: 'must match password' } } 
	}),
	email: Joi.string().email().required()
};

const schemaLogin = {
	username: Joi.string().min(6).max(30).required(),
	password: Joi.string().min(6).max(30).required()
};

module.exports = [{
	method: 'GET',
	path: '/',
	handler: Pages.homePage
}, {
	method: 'GET',
	path: '/signUp',
	handler: Pages.signUp
}, {
	method: 'POST',
	path: '/signUp',
	handler: Users.signUpInitial,
	config: {
		payload: {
			output: 'data'
		},
		validate: {
			payload: schemaSignUp,
			options: {
				abortEarly: false
			},
			failAction: function (request, reply, source, error) {

                const errors = {};
                const details = error.data.details;

                for (let i = 0; i < details.length; ++i) {
                    if (!errors.hasOwnProperty(details[i].path)) {
                        errors[details[i].path] = details[i].message;
                    }
                }

                reply.view('signUp', {
                    errors: errors,
                    values: request.payload,
                    menu_sign_up: true
                }).code(400);
            }
		}
	}
}, {
	method: 'GET',
	path: '/signUp/{uuid}',
	handler: Users.signUpVerification
}, {
	method: 'GET',
	path: '/login',
	config: {
		auth: { 
			mode: 'try', 
			strategy: 'base' 
		},
		plugins: { 'hapi-auth-cookie': { redirectTo: false } }, 
		handler: function (request, reply) {
			if(request.auth.isAuthenticated){
				return reply.redirect('/');
			}
			return Pages.login(request, reply);
		}
	}
}, {
	method: 'POST',
	path: '/login',
	handler: Users.login,
	config: {
		app: {
			type: 'simple_user'
		}, 
		payload: {
			output: 'data'
		},
		validate: {
			payload: schemaLogin,
			options: {
				abortEarly: false
			},
			failAction: function (request, reply, source, error) {

                const errors = {};
                const details = error.data.details;

                for (let i = 0; i < details.length; ++i) {
                    if (!errors.hasOwnProperty(details[i].path)) {
                        errors[details[i].path] = details[i].message;
                    }
                }

                reply.view('login', {
                    errors: errors,
                    values: request.payload,
                    menu_login: true
                }).code(400);
            }
		}
	}
}, {
	method: 'GET',
    path: '/logout',
    handler: function (request, reply) {
    	console.log('CALLING LOGOUT!!!');
    	request.cookieAuth.clear();
    	return reply.redirect('/');
    }
}, /* {
	method: 'GET',
	path: '/restricted',
	config: { auth: 'jwt' },
	handler: function (request, reply) {
		return reply('SHOULD BE IN A RESTRICTED ARED!!!');
	}
}, */ {
	method: 'GET',
	path: '/restricted',
	config: { 
		auth: { 
			mode: 'required', 
			strategy: 'base',
			scope: 'user' 
			}, 
		plugins: { 
		  	'hapi-auth-cookie': { redirectTo: '/login' } 
		  		}
		  },
	handler: function (request, reply) {
		return reply('SHOULD BE IN A RESTRICTED ARED2!!!');
	}
}, {
	method: 'GET',
	path: '/{params*}',
	config: { auth: false },
	handler: Assets.servePublicDirectory
}];
