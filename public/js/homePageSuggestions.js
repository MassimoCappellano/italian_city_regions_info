$( document ).ready(function() {

			var municipalities = new Bloodhound({
					datumTokenizer: Bloodhound.tokenizers.obj.whitespace('n'),
					queryTokenizer: Bloodhound.tokenizers.whitespace,
					// prefetch: '/comuni',
			  
			  remote: {
			    // url: 'https://cryptic-bastion-79191.herokuapp.com/comuni?q=%QUERY',
			    
			    url: 'http://customer.simplethings.it:4000/comuni?q=%QUERY',
			    wildcard: '%QUERY'
			  }
			 
			});

			$('#remote .typeahead').typeahead({  minLength: 3, 
												 highlight: true }, {
			  name: 'municipalities',
			  display: function(suggestion) {
			  	return ' ' + suggestion.n + ' (' + suggestion.pc + ')';
			  },
			  source: municipalities,
			  limit: 8000,
			  templates: {
		     	suggestion: Handlebars.compile('<div><strong>{{n}}</strong> ({{pc}})</div>')
  					}
			});

			$('.typeahead').bind('typeahead:select', function(ev, suggestion) {
				console.log('Selection: ', suggestion);
			});

			$('.typeahead').bind('typeahead:change', function(ev, suggestion) {
	  			console.log('CHANGE: ', ev, 'VALUE: ', suggestion);
			});

		});