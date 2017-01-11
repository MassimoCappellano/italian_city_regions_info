'use strict';

/*
	http://www.comuniecitta.it/regioni-italiane/tavola-dei-confini.html

*/

const mappings_edge_regions = [
	{
		name: 'Abruzzo',
		edges: ['Lazio', 'Marche', 'Molise']
	},
	{
		name: 'Basilicata',
		edges: ['Calabria', 'Campania', 'Puglia']
	},
	{
		name: 'Calabria',
		edges: ['Basilicata']
	},
	{
		name: 'Campania',
		edges: ['Basilicata', 'Lazio', 'Molise', 'Puglia']
	},
	{
		name: 'Emilia Romagna',
		edges: ['Liguria', 'Lombardia', 'Marche', 'Piemonte', 'Toscana', 'Veneto']
	},
	{
		name: 'Friuli-Venezia Giulia',
		edges: ['Veneto']
	},
	{
		name: 'Lazio',
		edges: ['Abruzzo', 'Campania', 'Marche', 'Molise', 'Toscana', 'Umbria']
	},
	{
		name: 'Liguria',
		edges: ['Emilia Romagna', 'Piemonte', 'Toscana']
	},
	{
		name: 'Lombardia',
		edges: ['Emilia Romagna', 'Piemonte', 'Trentino-Alto Adige/S\u00fcdtirol', 'Veneto']
	},
	{
		name: 'Marche',
		edges: ['Abruzzo', 'Emilia', 'Lazio', 'Toscana', 'Umbria']
	},
	{
		name: 'Molise',
		edges: ['Abruzzo', 'Campania', 'Lazio', 'Puglia']
	},
	{
		name: 'Piemonte',
		edges: ['Emilia Romagna', 'Liguria', 'Lombardia', 'Valle d'Aosta/Vall\u00e9e d'Aoste']
	},
	{
		name: 'Puglia',
		edges: ['Basilicata', 'Campania', 'Molise']
	},
	{
		name: 'Sardegna',
		edges: []
	},
	{
		name: 'Sicilia',
		edges: []
	},
	{
		name: 'Toscana',
		edges: ['Emilia Romagna', 'Lazio', 'Liguria', 'Marche', 'Umbria']
	},
	{
		name: 'Trentino-Alto Adige/S\u00fcdtirol',
		edges: ['Lombardia', 'Veneto']
	},
	{
		name: 'Umbria',
		edges: ['Lazio', 'Marche', 'Toscana']
	},
	{
		name: 'Valle d'Aosta/Vall\u00e9e d'Aoste',
		edges: ['Piemonte']
	},
	{
		name: 'Veneto',
		edges: ['Emilia Romagna', 'Lombardia', 'Trentino-Alto Adige/S\u00fcdtirolTrentino', 'Friuli-Venezia Giulia']
	}
];

module.exports = mappings_edge_regions;