var ac = {};
var fs = require('fs');
var level = require('level');
var db = level(__dirname + '/db');

// check if a key exists, else import word list:
db.get('name', function (err, value) {
/* istanbul ignore if */
  if (err) {
    ac.import((nW) => { console.log('%d ✓ words imported.', nW); });
    return console.log('Ooops!', err);
  }
});

// Import the list of words from words.txt into LevelDB
ac.import = function (callback) {

  var file = __dirname + '/data/comuni_italiani.json';

  jsonfile.readFile(file, function(err, obj) {
		  // console.dir(obj)
		  let wc = 1;

		  var batch = db.batch();
		  
		  console.time('all-elements');

		  for (let value of obj){
		  	// console.dir(value);
		  	wc++;

		  	if(value.model === 'comuni_italiani.regione'){
				
				let key = 'regioni:' + value.fields.name;
				let valueR = value.pk;
				
				console.log('reg: %s -> %s', key, valueR);
				
				batch.put(key, value);

				let keyInv = 'regioni:inv:' + value.pk;
				let valueInv = value.fields.name;
				
				console.log('reg inv: %s -> %s', keyInv, valueInv);

				batch.put(keyInv, valueInv);
				
				/*
					let regione = new model.Regione({ pk: value.pk, name: value.fields.name });
					regione.save(function (err, regione) {
					  if (err) return console.error(regione);
					});
				*/
		  		
		  	} else if (value.model === 'comuni_italiani.provincia') {
				
				let key = 'province:' + value.fields.name;
				let valueP = value.pk;

				batch.put(key, valueP);
				
				let keyInv = 'province:inv:' + value.pk;
				let name = value.fields.name;
				let code =  value.fields.codice_targa;
				let regione_id =  value.fields.regione;
				
				let obj = {
					name: name,
					code: code,
					regione_id: regione_id
				};
				
				console.log('prov: %s -> %s', keyInv, JSON.stringify(obj));
				
				batch.put(keyInv,  JSON.stringify(obj));

				/*
		  		let provincia = new model.Provincia({ pk: value.pk, name: value.fields.name, 
		  			code: value.fields.codice_targa, regione_id: value.fields.regione });
		  		
		  		provincia.save(function (err, provincia) {
				  if (err) return console.error(provincia);
				});
				*/
		  		
		  	} else if (value.model === 'comuni_italiani.comune') {
				
				let key = 'comuni:' + value.fields.name;
				let valueC = value.pk;
				
				console.log('comuni: %s -> %s', key, valueC);
				
				batch.put(key, valueC);

				let keyInv = 'comuni:inv:' + value.pk;
				let name = value.fields.name;
				let provincia_id = value.fields.provincia;
				let altitudine = value.fields.altitudine;
				let superficie = value.fields.superficie;
				let popolazione = value.fields.popolazione;
				
				let obj = {
					name: name,
					provincia_id: provincia_id,
					altitudine: altitudine,
					superficie: superficie,
					popolazione: popolazione
				};
				
				console.log('comuni inv: %s -> %s', keyInv, JSON.stringify(obj));
				
				batch.put(keyInv,  JSON.stringify(obj));

				/*
		  		let comune = new model.Comune({ pk: value.pk, name: value.fields.name, provincia_id: value.fields.provincia, 
		  			altitudine: value.fields.altitudine, superficie: value.fields.superficie, popolazione: value.fields.popolazione });
		  		
		  		comune.save(function (err, comune) {
				  if (err) return console.error(comune);
				});
				*/
		  		
		  	}
		  }  // end for

		  console.time('beforeWrite');
		  
		  batch.write();
		  
		  console.timeEnd('beforeWrite');
		  
		  console.timeEnd('all-elements');

		  callback(wc);
	});

};

ac.count = function (callback) {
  var count = 0;
  db.createReadStream()
    .on('data', function (data) {
      count++;
    })
    .on('end', function () {
      callback(null, count);
    });
};

ac.findWords = function (word, callback) {
  var words = [];
  var key = word.trim();
  db.createReadStream({ start: key, end: key + '\xff' })
    .on('data', function (data) {
      words.push(data);
    })
    .on('end', function () {
      callback(null, words);
    });
};

ac.incrementViewCount = function (word, callback) {
  db.get(word, function (err, value) {
    value = parseInt(value, 10) + 1;
    // console.log(word, value);
    db.put(word, value, function (err) {
    /* istanbul ignore if */
      if (err) {
        return console.log('Ooops!', err);
      }
      db.get(word, function (err, count) {
        callback(null, count);
      });
    });
  });
};


module.exports = ac;


